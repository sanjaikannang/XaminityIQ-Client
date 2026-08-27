import { useEffect, useRef, useState } from "react";
import { formatDateTime } from "../../../../utils/date";
import type { RecordingChunkData } from "../../../../types/exams-types";

interface MergedSegmentPlayerProps {
    chunks: RecordingChunkData[];
}

// The recorder (useExamRecorder.ts) never stops/restarts MediaRecorder between
// chunks — it's one continuous `recorder.start(30000)` session whose
// `ondataavailable` just fires every 30s. That means chunk 0 carries the WebM
// init segment (EBML header + tracks) plus the first cluster, and every chunk
// after it is a further cluster of that SAME encode — genuinely appendable to
// one MediaSource SourceBuffer for real gapless playback, not just sequential
// playback of independent files. No server-side re-encoding needed.
const MIME_CANDIDATES = ['video/webm;codecs=vp8,opus', 'video/webm;codecs="vp8,opus"', 'video/webm'];

function pickSupportedMimeType(): string | null {
    if (typeof window === 'undefined' || !('MediaSource' in window)) return null;
    return MIME_CANDIDATES.find((type) => MediaSource.isTypeSupported(type)) || null;
}

function appendBufferAsync(sourceBuffer: SourceBuffer, data: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
        const onUpdateEnd = () => {
            sourceBuffer.removeEventListener('updateend', onUpdateEnd);
            sourceBuffer.removeEventListener('error', onError);
            resolve();
        };
        const onError = () => {
            sourceBuffer.removeEventListener('updateend', onUpdateEnd);
            sourceBuffer.removeEventListener('error', onError);
            reject(new Error('SourceBuffer append failed'));
        };
        sourceBuffer.addEventListener('updateend', onUpdateEnd);
        sourceBuffer.addEventListener('error', onError);
        sourceBuffer.appendBuffer(data);
    });
}

const MergedSegmentPlayer = ({ chunks }: MergedSegmentPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isBuffering, setIsBuffering] = useState(true);
    const [mseFailed, setMseFailed] = useState(false);
    const [fallbackIndex, setFallbackIndex] = useState(0);

    const sortedChunks = [...chunks].sort((a, b) => a.sequence - b.sequence);
    const mimeType = pickSupportedMimeType();
    const useGapless = !!mimeType && !mseFailed;

    // Gapless path: stream every chunk into one MediaSource SourceBuffer
    useEffect(() => {
        if (!useGapless || sortedChunks.length === 0) return;
        const video = videoRef.current;
        if (!video || !mimeType) return;

        let cancelled = false;
        setIsBuffering(true);
        const mediaSource = new MediaSource();
        const objectUrl = URL.createObjectURL(mediaSource);
        video.src = objectUrl;

        const onSourceOpen = async () => {
            try {
                const sourceBuffer = mediaSource.addSourceBuffer(mimeType);
                for (const chunk of sortedChunks) {
                    if (cancelled) return;
                    const buf = await fetch(chunk.cloudinaryUrl).then((r) => r.arrayBuffer());
                    if (cancelled) return;
                    await appendBufferAsync(sourceBuffer, buf);
                }
                if (!cancelled && mediaSource.readyState === 'open') {
                    mediaSource.endOfStream();
                }
                if (!cancelled) setIsBuffering(false);
            } catch {
                if (!cancelled) {
                    // Any decode/append failure — fall back to the sequential player
                    // rather than showing a broken player.
                    setMseFailed(true);
                }
            }
        };

        mediaSource.addEventListener('sourceopen', onSourceOpen);
        return () => {
            cancelled = true;
            mediaSource.removeEventListener('sourceopen', onSourceOpen);
            URL.revokeObjectURL(objectUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [useGapless, chunks]);

    // Fallback path: the original sequential-reload player, for browsers
    // without MSE/WebM support (e.g. Safari) or if gapless append ever fails
    useEffect(() => {
        if (useGapless) return;
        setFallbackIndex(0);
    }, [useGapless, chunks]);

    useEffect(() => {
        if (useGapless) return;
        const video = videoRef.current;
        if (!video) return;
        video.load();
        if (fallbackIndex > 0) {
            video.play().catch(() => { });
        }
    }, [useGapless, fallbackIndex]);

    if (chunks.length === 0) return null;

    const handleFallbackEnded = () => {
        setFallbackIndex((i) => Math.min(i + 1, sortedChunks.length - 1));
    };

    return (
        <div>
            <video
                key={useGapless ? 'gapless' : 'fallback'}
                ref={videoRef}
                controls
                onEnded={useGapless ? undefined : handleFallbackEnded}
                className="w-full max-h-96 rounded-md bg-black"
                src={useGapless ? undefined : sortedChunks[fallbackIndex].cloudinaryUrl}
            />
            {useGapless ? (
                isBuffering && (
                    <p className="text-xs text-textTertiary mt-2">Buffering full recording ({sortedChunks.length} segments)...</p>
                )
            ) : sortedChunks.length > 1 && (
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-textTertiary">
                        Playing segment {fallbackIndex + 1} of {sortedChunks.length} — advances automatically
                    </p>
                    <div className="flex items-center gap-1.5">
                        {sortedChunks.map((chunk, i) => (
                            <button
                                key={chunk.sequence}
                                type="button"
                                onClick={() => setFallbackIndex(i)}
                                title={`Segment ${i + 1} · uploaded ${formatDateTime(chunk.uploadedAt)}`}
                                aria-label={`Jump to segment ${i + 1}`}
                                aria-current={i === fallbackIndex}
                                className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${i === fallbackIndex ? 'bg-primary' : 'bg-borderDark hover:bg-textTertiary'}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MergedSegmentPlayer;
