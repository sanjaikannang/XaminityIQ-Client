import { useEffect, useRef, useState } from "react";
import { formatDateTime } from "../../../../utils/date";
import type { RecordingChunkData } from "../../../../types/exams-types";

interface MergedSegmentPlayerProps {
    chunks: RecordingChunkData[];
}

// Recorded chunks are independent ~30s webm files (no server-side stitching —
// see the disclaimer in RecordingViewerModal), so "one merged video" is done
// client-side: a single <video> element that auto-advances to the next chunk
// on "ended", giving continuous playback across the whole recording.
const MergedSegmentPlayer = ({ chunks }: MergedSegmentPlayerProps) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [index, setIndex] = useState(0);

    useEffect(() => {
        setIndex(0);
    }, [chunks]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;
        video.load();
        if (index > 0) {
            video.play().catch(() => { });
        }
    }, [index]);

    if (chunks.length === 0) return null;

    const handleEnded = () => {
        setIndex((i) => Math.min(i + 1, chunks.length - 1));
    };

    return (
        <div>
            <video
                ref={videoRef}
                controls
                onEnded={handleEnded}
                className="w-full max-h-96 rounded-md bg-black"
                src={chunks[index].cloudinaryUrl}
            />
            {chunks.length > 1 && (
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-textTertiary">
                        Playing segment {index + 1} of {chunks.length} — advances automatically
                    </p>
                    <div className="flex items-center gap-1.5">
                        {chunks.map((chunk, i) => (
                            <button
                                key={chunk.sequence}
                                type="button"
                                onClick={() => setIndex(i)}
                                title={`Segment ${i + 1} · uploaded ${formatDateTime(chunk.uploadedAt)}`}
                                aria-label={`Jump to segment ${i + 1}`}
                                aria-current={i === index}
                                className={`w-2 h-2 rounded-full transition-colors cursor-pointer ${i === index ? 'bg-primary' : 'bg-borderDark hover:bg-textTertiary'}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MergedSegmentPlayer;
