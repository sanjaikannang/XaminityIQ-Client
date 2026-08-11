import { MessageSquare, Mic, MicOff, UserX, MonitorOff } from "lucide-react";
import type { RemoteTrack } from "livekit-client";
import type { RoomAssignmentData } from "../../../../types/proctoring-types";

export interface TileTracks {
    video?: RemoteTrack;
    screen?: RemoteTrack;
    hasAudio?: boolean;
    micMuted?: boolean;
}

interface StudentMonitorCardProps {
    assignment: RoomAssignmentData;
    tile?: TileTracks;
    showExamName: boolean;
    videoRef: (node: HTMLVideoElement | null) => void;
    screenRef: (node: HTMLVideoElement | null) => void;
    onChat: () => void;
    onToggleMic: () => void;
    isMutingMic: boolean;
    onRemove: () => void;
}

const StudentMonitorCard = ({
    assignment,
    tile,
    showExamName,
    videoRef,
    screenRef,
    onChat,
    onToggleMic,
    isMutingMic,
    onRemove,
}: StudentMonitorCardProps) => {
    const hasScreen = !!tile?.screen;
    const hasVideo = !!tile?.video;
    const isMicMuted = !!tile?.micMuted;

    return (
        <div className="rounded-xl border border-borderDefault bg-whiteColor overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            {/* Media area: screen-share is primary when present, webcam becomes a PIP overlay */}
            <div className="relative bg-black aspect-video">
                <video
                    ref={screenRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-contain bg-black ${hasScreen ? "" : "hidden"}`}
                />
                {!hasScreen && (
                    <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                )}

                {hasScreen && (
                    <div className="absolute bottom-2 right-2 w-20 sm:w-24 aspect-video rounded-md overflow-hidden border-2 border-whiteColor/70 bg-black shadow-lg">
                        {hasVideo ? (
                            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-whiteColor/70 text-[10px]">No cam</div>
                        )}
                    </div>
                )}

                {!hasVideo && !hasScreen && (
                    <div className="absolute inset-0 flex items-center justify-center text-whiteColor/70 text-xs gap-1.5">
                        No video
                    </div>
                )}

                {!hasScreen && (
                    <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black/50 text-whiteColor/80 text-[10px]">
                        <MonitorOff className="w-3 h-3" /> Not sharing screen
                    </div>
                )}

                <div className="absolute top-2 right-2 flex items-center gap-1">
                    {isMicMuted ? (
                        <span title="Mic muted by faculty" className="p-1 rounded bg-red-600/90 text-whiteColor">
                            <MicOff className="w-3 h-3" />
                        </span>
                    ) : tile?.hasAudio ? (
                        <span title="Mic live" className="p-1 rounded bg-green-600/90 text-whiteColor">
                            <Mic className="w-3 h-3" />
                        </span>
                    ) : null}
                </div>
            </div>

            {/* Identity */}
            <div className="px-3 py-2.5 border-t border-borderLight">
                <p className="font-semibold text-textPrimary text-sm truncate">{assignment.studentName || assignment.studentCode}</p>
                <p className="text-xs text-textSecondary truncate">{assignment.studentEmail}</p>
                <div className="flex items-center justify-between mt-0.5">
                    <p className="text-xs text-textTertiary truncate">Roll: {assignment.studentCode}</p>
                    {showExamName && (
                        <p className="text-[10px] text-textTertiary truncate max-w-[45%]" title={assignment.examName}>{assignment.examName}</p>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-3 border-t border-borderLight text-xs font-medium">
                <button
                    type="button"
                    onClick={onChat}
                    className="flex items-center justify-center gap-1.5 py-2 text-textSecondary hover:bg-bgSecondary hover:text-textPrimary transition-colors cursor-pointer border-r border-borderLight"
                >
                    <MessageSquare className="w-3.5 h-3.5" /> Chat
                </button>
                <button
                    type="button"
                    onClick={onToggleMic}
                    disabled={isMutingMic}
                    className={`flex items-center justify-center gap-1.5 py-2 transition-colors cursor-pointer border-r border-borderLight disabled:opacity-50 ${isMicMuted ? "text-red-600 hover:bg-red-50" : "text-textSecondary hover:bg-bgSecondary hover:text-textPrimary"}`}
                >
                    {isMicMuted ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                    {isMicMuted ? "Unmute" : "Mic"}
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="flex items-center justify-center gap-1.5 py-2 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                    <UserX className="w-3.5 h-3.5" /> Remove
                </button>
            </div>
        </div>
    );
};

export default StudentMonitorCard;
