import { Users, Clock, UserCheck } from "lucide-react";
import Chip from "../../../../common/ui/Chip";
import { formatEnumLabel, getChipVariant } from "../../../../utils/utils";
import { formatDateTime } from "../../../../utils/date";
import type { RoomOverviewData } from "../../../../types/proctoring-types";

interface RoomCardProps {
    room: RoomOverviewData;
    onClick: () => void;
}

const RoomCard = ({ room, onClick }: RoomCardProps) => {
    const isLive = room.effectiveStatus === "IN_PROGRESS";

    return (
        <button
            type="button"
            onClick={onClick}
            className="text-left bg-whiteColor rounded-xl border border-borderDefault p-4 hover:border-primary hover:shadow-md transition-all cursor-pointer w-full"
        >
            <div className="flex items-center justify-between gap-2 mb-3">
                <Chip label={formatEnumLabel(room.effectiveStatus)} variant={getChipVariant(room.effectiveStatus)} />
                {isLive && (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-700">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                        </span>
                        Live
                    </span>
                )}
            </div>

            <div className="flex items-center gap-2 mb-1">
                <UserCheck className="w-4 h-4 text-textTertiary shrink-0" />
                <p className="font-semibold text-textPrimary truncate">{room.facultyName || room.facultyCode}</p>
            </div>

            <p className="text-sm text-textSecondary truncate mb-3">
                {room.examNames.length > 0 ? room.examNames.join(", ") : "—"}
            </p>

            <div className="flex items-center justify-between text-xs text-textTertiary">
                <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDateTime(room.startDateTime)}
                </span>
                <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    {room.totalOccupancy}
                </span>
            </div>
        </button>
    );
};

export default RoomCard;
