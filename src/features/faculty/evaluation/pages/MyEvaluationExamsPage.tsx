import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { ExamStatus } from "../../../../utils/enum";
import { useGetMyEvaluationExamsQuery } from "../../../../state/services/endpoints/evaluation";

const MyEvaluationExamsPage = () => {
    const navigate = useNavigate();
    const { data, isLoading } = useGetMyEvaluationExamsQuery();
    const exams = data?.data || [];

    return (
        <>
            <PageHeader>Evaluation</PageHeader>
            <Container>
                <div className="py-6 space-y-4">
                    {isLoading && <p className="text-textSecondary">Loading...</p>}
                    {!isLoading && exams.length === 0 && (
                        <p className="text-textSecondary">No exams assigned to you for evaluation right now.</p>
                    )}
                    {exams.map((exam) => (
                        <div
                            key={exam.examId}
                            className="flex items-center justify-between rounded-lg border border-borderLight bg-whiteColor p-4 shadow-sm"
                        >
                            <div>
                                <p className="font-semibold text-textPrimary">{exam.name}</p>
                                <p className="text-sm text-textSecondary">
                                    {exam.totalMarks} marks • {exam.status}
                                </p>
                            </div>
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={() => navigate(`/faculty/evaluation/${exam.examId}`)}
                            >
                                {exam.status === ExamStatus.RESULTS_PUBLISHED ? 'View Grading' : 'Grade Answers'}
                            </Button>
                        </div>
                    ))}
                </div>
            </Container>
        </>
    );
};

export default MyEvaluationExamsPage;
