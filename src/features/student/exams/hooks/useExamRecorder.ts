import { useRef, useCallback, useEffect } from "react";
import { RecordingMediaType } from "../../../../utils/enum";
import { uploadChunkToCloudinary } from "../utils/cloudinaryUpload";
import {
    useGetRecordingSignatureMutation,
    useRecordChunkMutation,
    useFinalizeRecordingMutation,
} from "../../../../state/services/endpoints/student-exams";

const CHUNK_INTERVAL_MS = 30000;
const MEDIA_TYPES: RecordingMediaType[] = [RecordingMediaType.VIDEO, RecordingMediaType.AUDIO, RecordingMediaType.SCREEN];

function pickMimeType(): string {
    const candidates = ['video/webm;codecs=vp8,opus', 'video/webm', 'audio/webm'];
    return candidates.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

interface UseExamRecorderParams {
    attemptId: string;
    videoStream: MediaStream | null;
    audioStream: MediaStream | null;
    screenStream: MediaStream | null;
}

export function useExamRecorder({ attemptId, videoStream, audioStream, screenStream }: UseExamRecorderParams) {
    const [getSignature] = useGetRecordingSignatureMutation();
    const [recordChunk] = useRecordChunkMutation();
    const [finalizeRecording] = useFinalizeRecordingMutation();

    const recordersRef = useRef<Partial<Record<RecordingMediaType, MediaRecorder>>>({});
    const sequenceRef = useRef<Record<RecordingMediaType, number>>({
        [RecordingMediaType.VIDEO]: 0,
        [RecordingMediaType.AUDIO]: 0,
        [RecordingMediaType.SCREEN]: 0,
    });
    const pendingUploadsRef = useRef<Record<RecordingMediaType, Promise<void>[]>>({
        [RecordingMediaType.VIDEO]: [],
        [RecordingMediaType.AUDIO]: [],
        [RecordingMediaType.SCREEN]: [],
    });

    const uploadChunk = useCallback(async (mediaType: RecordingMediaType, blob: Blob) => {
        const sequence = sequenceRef.current[mediaType]++;
        try {
            const sigResponse = await getSignature({ attemptId, mediaType, sequence }).unwrap();
            if (!sigResponse.data) return;
            const { assetId, url } = await uploadChunkToCloudinary(blob, sigResponse.data);
            await recordChunk({
                attemptId,
                data: { mediaType, sequence, cloudinaryAssetId: assetId, cloudinaryUrl: url },
            }).unwrap();
        } catch (error) {
            // Recording upload failures shouldn't interrupt the exam itself —
            // logged for now; retry/alerting is a later hardening pass.
            console.error(`Failed to upload ${mediaType} chunk ${sequence}`, error);
        }
    }, [attemptId, getSignature, recordChunk]);

    const startStream = useCallback((mediaType: RecordingMediaType, stream: MediaStream | null) => {
        if (!stream || recordersRef.current[mediaType]) return;

        const mimeType = pickMimeType();
        const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);

        recorder.ondataavailable = (event: BlobEvent) => {
            if (event.data.size > 0) {
                const uploadPromise = uploadChunk(mediaType, event.data);
                pendingUploadsRef.current[mediaType].push(uploadPromise);
            }
        };

        recorder.start(CHUNK_INTERVAL_MS);
        recordersRef.current[mediaType] = recorder;
    }, [uploadChunk]);

    useEffect(() => {
        startStream(RecordingMediaType.VIDEO, videoStream);
        startStream(RecordingMediaType.AUDIO, audioStream);
        startStream(RecordingMediaType.SCREEN, screenStream);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoStream, audioStream, screenStream]);

    // Stops all recorders, waits for every in-flight upload to land, then
    // finalizes each stream so the attempt can roll up to COMPLETE.
    const stopAndFinalize = useCallback(async () => {
        for (const mediaType of MEDIA_TYPES) {
            const recorder = recordersRef.current[mediaType];
            if (recorder && recorder.state !== 'inactive') {
                await new Promise<void>((resolve) => {
                    recorder.onstop = () => resolve();
                    recorder.stop();
                });
            }
        }

        for (const mediaType of MEDIA_TYPES) {
            await Promise.all(pendingUploadsRef.current[mediaType]).catch(() => { });
        }

        for (const mediaType of MEDIA_TYPES) {
            try {
                await finalizeRecording({ attemptId, mediaType }).unwrap();
            } catch (error) {
                console.error(`Failed to finalize ${mediaType} recording`, error);
            }
        }
    }, [attemptId, finalizeRecording]);

    return { stopAndFinalize };
}
