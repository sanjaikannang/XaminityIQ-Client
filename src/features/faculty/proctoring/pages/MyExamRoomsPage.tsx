import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { ExamRoomStatus } from "../../../../utils/enum";
import { useGetMyExamRoomsQuery } from "../../../../state/services/endpoints/faculty-proctoring";
import { formatDateTime } from "../../../../utils/date";

const MyExamRoomsPage = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetMyExamRoomsQuery();
    const rooms = data?.data || [];

    return (
        <>
            <PageHeader>Proctoring</PageHeader>
            <Container>
                <div className="py-6 space-y-4">
                    {isLoading && <p className="text-textSecondary">Loading...</p>}
                    {!isLoading && rooms.length === 0 && (
                        <p className="text-textSecondary">No exam rooms assigned to you right now.</p>
                    )}
                    {rooms.map((room) => (
                        <div
                            key={room.roomId}
                            className="flex items-center justify-between rounded-lg border border-borderLight bg-whiteColor p-4 shadow-sm"
                        >
                            <div>
                                <p className="font-semibold text-textPrimary">
                                    {room.exams.map((e) => e.examName).join(', ')}
                                </p>
                                <p className="text-sm text-textSecondary">
                                    {room.studentCount} student{room.studentCount === 1 ? '' : 's'} • {room.status}
                                </p>
                                <p className="text-xs text-textSecondary">
                                    {formatDateTime(room.startDateTime)} - {formatDateTime(room.endDateTime)}
                                </p>
                            </div>
                            {room.status === ExamRoomStatus.CLOSED ? (
                                <span className="text-sm text-textTertiary font-medium">Closed</span>
                            ) : (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={() => navigate(`/faculty/proctoring/${room.roomId}`)}
                                >
                                    {room.status === ExamRoomStatus.ACTIVE ? 'Open Room' : 'View Room (Not Started)'}
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </>
    );
};

export default MyExamRoomsPage;
