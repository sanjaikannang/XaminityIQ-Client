import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { useGetMyExamRoomsQuery } from "../../../../state/services/endpoints/faculty-proctoring";

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
                                <p className="font-semibold text-textPrimary">{room.examName}</p>
                                <p className="text-sm text-textSecondary">
                                    {room.studentCount} student{room.studentCount === 1 ? '' : 's'} • {room.status}
                                </p>
                                <p className="text-xs text-textSecondary">
                                    {new Date(room.startDateTime).toLocaleString()} - {new Date(room.endDateTime).toLocaleString()}
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate(`/faculty/proctoring/${room.roomId}`)}
                            >
                                Open Room
                            </Button>
                        </div>
                    ))}
                </div>
            </Container>
        </>
    );
};

export default MyExamRoomsPage;
