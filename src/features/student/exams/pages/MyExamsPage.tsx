import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { AttemptStatus, ExamMode, ExamStatus } from "../../../../utils/enum";
import { useGetMyExamsQuery } from "../../../../state/services/endpoints/student-exams";

const MyExamsPage = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetMyExamsQuery();
    const exams = data?.data || [];

    const renderAction = (exam: (typeof exams)[number]) => {
        if (exam.status === ExamStatus.RESULTS_PUBLISHED && exam.myAttemptId) {
            return (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(`/student/exams/results/${exam.myAttemptId}`)}
                >
                    View Result
                </Button>
            );
        }
        if (exam.myAttemptStatus === AttemptStatus.SUBMITTED || exam.myAttemptStatus === AttemptStatus.COMPLETED) {
            return <span className="text-sm text-textSecondary font-medium">Completed</span>;
        }
        if (exam.myAttemptStatus === AttemptStatus.IN_PROGRESS && exam.myAttemptId) {
            const roomPath = exam.mode === ExamMode.PROCTORING
                ? `/student/exams/${exam._id}/proctored-room/${exam.myAttemptId}`
                : `/student/exams/${exam._id}/room/${exam.myAttemptId}`;
            return (
                <Button
                    variant="primary"
                    size="sm"
                    onClick={() => navigate(roomPath)}
                >
                    Resume
                </Button>
            );
        }
        return (
            <Button
                variant="primary"
                size="sm"
                onClick={() => navigate(`/student/exams/${exam._id}/pre-flight`, { state: { mode: exam.mode } })}
            >
                {exam.mode === ExamMode.PROCTORING ? 'Join Lobby' : 'Take Exam'}
            </Button>
        );
    };

    return (
        <>
            <PageHeader>My Exams</PageHeader>
            <Container>
                <div className="py-6 space-y-4">
                    {isLoading && <p className="text-textSecondary">Loading...</p>}
                    {!isLoading && exams.length === 0 && (
                        <p className="text-textSecondary">No exams assigned right now.</p>
                    )}
                    {exams.map((exam) => (
                        <div
                            key={exam._id}
                            className="flex items-center justify-between rounded-lg border border-borderLight bg-whiteColor p-4 shadow-sm"
                        >
                            <div>
                                <p className="font-semibold text-textPrimary">{exam.name}</p>
                                <p className="text-sm text-textSecondary">
                                    {exam.subjectName} • {exam.durationMinutes} min • {exam.totalMarks} marks
                                </p>
                                <p className="text-xs text-textSecondary">
                                    {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
                                </p>
                            </div>
                            {renderAction(exam)}
                        </div>
                    ))}
                </div>
            </Container>
        </>
    );
};

export default MyExamsPage;
