import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { useGetAllExamRoomsQuery } from "../../../../state/services/endpoints/exams";
import type { EffectiveRoomStatus, RoomOverviewData } from "../../../../types/proctoring-types";
import RoomCard from "../components/RoomCard";
import RoomDetailModal from "../components/RoomDetailModal";

const POLL_INTERVAL_MS = 20000;

const FILTER_TABS: { label: string; value: EffectiveRoomStatus | "ALL" }[] = [
    { label: "All", value: "ALL" },
    { label: "Upcoming", value: "UPCOMING" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Completed", value: "COMPLETED" },
];

const ExamRoomAllocationPage = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = useState<EffectiveRoomStatus | "ALL">("ALL");
    const [page, setPage] = useState(1);
    const [selectedRoom, setSelectedRoom] = useState<RoomOverviewData | null>(null);

    const { data, isFetching } = useGetAllExamRoomsQuery(
        { page, limit: 20, ...(filter !== "ALL" && { effectiveStatus: filter }) },
        { pollingInterval: POLL_INTERVAL_MS },
    );

    const rooms = data?.data?.rooms || [];
    const pagination = data?.data?.pagination;
    const statusCounts = data?.data?.statusCounts;
    const totalAllRooms = (statusCounts?.upcoming || 0) + (statusCounts?.inProgress || 0) + (statusCounts?.completed || 0);

    const tabCount = (tab: EffectiveRoomStatus | "ALL"): number => {
        if (tab === "ALL") return totalAllRooms;
        if (tab === "UPCOMING") return statusCounts?.upcoming || 0;
        if (tab === "IN_PROGRESS") return statusCounts?.inProgress || 0;
        return statusCounts?.completed || 0;
    };

    return (
        <>
            <PageHeader>Exam Room Allocation</PageHeader>
            <Container>
                <div className="py-6 space-y-6">
                    <div className="flex items-center justify-between flex-wrap gap-3">
                        <Button variant="outline" size="sm" onClick={() => navigate("/super-admin/exams")}>
                            ← Back to Exams
                        </Button>
                        <span className="flex items-center gap-1.5 text-xs text-textTertiary">
                            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
                            Auto-refreshing every 20s
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {FILTER_TABS.map((tab) => {
                            const isActive = filter === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => {
                                        setFilter(tab.value);
                                        setPage(1);
                                    }}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer border ${isActive
                                        ? "bg-primary text-whiteColor border-primary"
                                        : "bg-whiteColor text-textSecondary border-borderLight hover:bg-bgSecondary"
                                        }`}
                                >
                                    {tab.label}
                                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${isActive ? "bg-whiteColor/20" : "bg-bgSecondary"}`}>
                                        {tabCount(tab.value)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>

                    {rooms.length === 0 ? (
                        <div className="bg-whiteColor rounded-xl border border-borderDefault p-10 text-center text-textSecondary">
                            No exam rooms found for this filter.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {rooms.map((room) => (
                                <RoomCard key={room.roomId} room={room} onClick={() => setSelectedRoom(room)} />
                            ))}
                        </div>
                    )}

                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3">
                            <button
                                type="button"
                                onClick={() => setPage((p) => p - 1)}
                                disabled={!pagination.hasPreviousPage}
                                className="p-2 rounded-lg border border-borderLight text-textPrimary hover:bg-bgSecondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <span className="text-sm text-textSecondary">
                                Page {pagination.currentPage} of {pagination.totalPages}
                            </span>
                            <button
                                type="button"
                                onClick={() => setPage((p) => p + 1)}
                                disabled={!pagination.hasNextPage}
                                className="p-2 rounded-lg border border-borderLight text-textPrimary hover:bg-bgSecondary disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>
            </Container>

            <RoomDetailModal room={selectedRoom} onClose={() => setSelectedRoom(null)} />
        </>
    );
};

export default ExamRoomAllocationPage;
