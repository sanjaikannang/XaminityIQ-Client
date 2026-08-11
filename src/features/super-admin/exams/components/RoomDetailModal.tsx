import { UserCheck, Clock, AlertTriangle } from "lucide-react";
import Modal from "../../../../common/ui/Modal";
import Chip from "../../../../common/ui/Chip";
import { formatEnumLabel, getChipVariant } from "../../../../utils/utils";
import { formatDateTime } from "../../../../utils/date";
import type { RoomOverviewData } from "../../../../types/proctoring-types";

interface RoomDetailModalProps {
    room: RoomOverviewData | null;
    onClose: () => void;
}

const RoomDetailModal = ({ room, onClose }: RoomDetailModalProps) => {
    return (
        <Modal isOpen={!!room} onClose={onClose} title="Room Details" size="xl">
            {room && (
                <div className="space-y-5">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Chip label={formatEnumLabel(room.effectiveStatus)} variant={getChipVariant(room.effectiveStatus)} />
                        <span className="text-sm text-textSecondary">
                            {room.totalOccupancy} student{room.totalOccupancy !== 1 ? "s" : ""} assigned
                        </span>
                        {room.removedOrRejectedCount > 0 && (
                            <span className="flex items-center gap-1 text-xs text-red-600">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {room.removedOrRejectedCount} removed/rejected
                            </span>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="rounded-md border border-borderLight p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <UserCheck size={16} className="text-primary" />
                                <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">
                                    Invigilating Faculty
                                </span>
                            </div>
                            <p className="text-sm font-medium text-textPrimary">{room.facultyName || "—"}</p>
                            <p className="text-xs text-textSecondary">{room.facultyEmail}</p>
                            <p className="text-xs text-textTertiary">{room.facultyCode}</p>
                        </div>
                        <div className="rounded-md border border-borderLight p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Clock size={16} className="text-primary" />
                                <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">
                                    Session
                                </span>
                            </div>
                            <p className="text-sm text-textPrimary">
                                {formatDateTime(room.startDateTime)} — {formatDateTime(room.endDateTime)}
                            </p>
                            <p className="text-xs text-textTertiary mt-1">LiveKit session: {room.liveKitSessionId}</p>
                            {room.examNames.length > 0 && (
                                <p className="text-xs text-textSecondary mt-1">Exam(s): {room.examNames.join(", ")}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                        {[
                            { label: "Waiting", value: room.waitingCount, variant: "yellow" as const },
                            { label: "Admitted", value: room.admittedCount, variant: "green" as const },
                            { label: "In Progress", value: room.inProgressCount, variant: "blue" as const },
                            { label: "Completed", value: room.completedCount, variant: "gray" as const },
                            { label: "Removed/Rejected", value: room.removedOrRejectedCount, variant: "red" as const },
                        ].map((stat) => (
                            <div key={stat.label} className="rounded-md border border-borderLight p-2 text-center">
                                <p className="text-lg font-bold text-textPrimary">{stat.value}</p>
                                <Chip label={stat.label} variant={stat.variant} />
                            </div>
                        ))}
                    </div>

                    <div>
                        <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">
                            Assigned Students ({room.assignments.length})
                        </span>
                        <div className="mt-2 overflow-x-auto rounded-md border border-borderLight max-h-72 overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-bgSecondary sticky top-0">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium text-textSecondary">Student</th>
                                        <th className="px-3 py-2 text-left font-medium text-textSecondary">Exam</th>
                                        <th className="px-3 py-2 text-left font-medium text-textSecondary">Status</th>
                                        <th className="px-3 py-2 text-left font-medium text-textSecondary">Timeline</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-borderLight">
                                    {room.assignments.map((a) => (
                                        <tr key={a.assignmentId}>
                                            <td className="px-3 py-2">
                                                <div className="font-medium text-textPrimary">{a.studentName || "—"}</div>
                                                <div className="text-xs text-textSecondary">{a.studentEmail}</div>
                                                <div className="text-xs text-textTertiary">{a.studentCode}</div>
                                            </td>
                                            <td className="px-3 py-2 text-textSecondary">{a.examName}</td>
                                            <td className="px-3 py-2">
                                                <Chip label={formatEnumLabel(a.status)} variant={getChipVariant(a.status)} />
                                            </td>
                                            <td className="px-3 py-2 text-xs text-textSecondary">
                                                {a.admittedAt && <div>Admitted: {formatDateTime(a.admittedAt)}</div>}
                                                {a.removedAt && (
                                                    <div className="text-red-600">
                                                        Removed: {formatDateTime(a.removedAt)}
                                                        {a.removalReason ? ` (${a.removalReason})` : ""}
                                                    </div>
                                                )}
                                                {!a.admittedAt && !a.removedAt && a.enteredWaitingRoomAt && (
                                                    <div>Waiting since {formatDateTime(a.enteredWaitingRoomAt)}</div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {room.assignments.length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-3 py-4 text-center text-textSecondary">
                                                No students assigned.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default RoomDetailModal;
