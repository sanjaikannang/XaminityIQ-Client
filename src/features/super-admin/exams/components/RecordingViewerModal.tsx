import { Video, MonitorPlay, Info } from "lucide-react";
import Modal from "../../../../common/ui/Modal";
import Chip from "../../../../common/ui/Chip";
import { formatEnumLabel, getChipVariant } from "../../../../utils/utils";
import { useGetAttemptRecordingQuery } from "../../../../state/services/endpoints/exams";
import MergedSegmentPlayer from "./MergedSegmentPlayer";
import type { RecordingStreamData } from "../../../../types/exams-types";

interface RecordingViewerModalProps {
    attemptId: string | null;
    onClose: () => void;
}

const StreamSection = ({
    icon: Icon,
    label,
    stream,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    stream: RecordingStreamData;
}) => (
    <div className="rounded-md border border-borderLight p-3">
        <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-sm font-semibold text-textPrimary">{label}</span>
            </div>
            <Chip label={formatEnumLabel(stream.status)} variant={getChipVariant(stream.status)} />
        </div>

        {stream.chunks.length === 0 ? (
            <p className="text-sm text-textSecondary">No {label.toLowerCase()} segments recorded.</p>
        ) : (
            <MergedSegmentPlayer chunks={stream.chunks} />
        )}
    </div>
);

const RecordingViewerModal = ({ attemptId, onClose }: RecordingViewerModalProps) => {
    const { data, isFetching } = useGetAttemptRecordingQuery(attemptId as string, { skip: !attemptId });
    const recording = data?.data;

    return (
        <Modal isOpen={!!attemptId} onClose={onClose} title="Exam Recording" size="xl">
            {isFetching && !recording ? (
                <p className="text-sm text-textSecondary py-6 text-center">Loading recording...</p>
            ) : !recording ? (
                <p className="text-sm text-textSecondary py-6 text-center">Recording not found.</p>
            ) : (
                <div className="space-y-4">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                            <p className="font-semibold text-textPrimary">{recording.studentName || recording.studentCode}</p>
                            <p className="text-sm text-textSecondary">{recording.studentEmail}</p>
                            <p className="text-xs text-textTertiary">{recording.examName}</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <Chip label={formatEnumLabel(recording.attemptStatus)} variant={getChipVariant(recording.attemptStatus)} />
                            <Chip label={`Media: ${formatEnumLabel(recording.mediaStatus)}`} variant={getChipVariant(recording.mediaStatus)} />
                        </div>
                    </div>

                    <div className="flex items-start gap-2 rounded-md bg-bgSecondary border border-borderLight p-3">
                        <Info className="w-4 h-4 text-textTertiary shrink-0 mt-0.5" />
                        <p className="text-xs text-textSecondary">
                            Recordings are captured in 30-second segments and uploaded directly from the student's
                            browser — each player below advances through its segments automatically for continuous
                            playback (use the dots to jump to a specific segment). The Video stream includes the
                            student's microphone audio. Upload completion is self-reported by the client and isn't
                            independently re-verified, so a segment can occasionally fail to load if the underlying
                            file didn't fully land.
                        </p>
                    </div>

                    <StreamSection icon={Video} label="Video (with audio)" stream={recording.video} />
                    <StreamSection icon={MonitorPlay} label="Screen" stream={recording.screen} />
                </div>
            )}
        </Modal>
    );
};

export default RecordingViewerModal;
