import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { QuestionType } from "../../../../utils/enum";
import { useGetMyResultQuery } from "../../../../state/services/endpoints/student-exams";

const ExamResultPage = () => {
    const navigate = useNavigate();
    const { attemptId } = useParams<{ attemptId: string }>();
    const { data, isLoading } = useGetMyResultQuery(attemptId as string, { skip: !attemptId });
    const result = data?.data;

    if (isLoading || !result) {
        return (
            <>
                <PageHeader>Exam Result</PageHeader>
                <Container>
                    <div className="py-10 text-center text-textSecondary">Loading...</div>
                </Container>
            </>
        );
    }

    return (
        <>
            <PageHeader>{result.examName}</PageHeader>
            <Container>
                <div className="py-6 space-y-6">
                    <Button variant="outline" size="sm" onClick={() => navigate('/student/exams')}>
                        ← Back to My Exams
                    </Button>

                    <div className={`rounded-lg border p-4 flex items-center justify-between ${result.passed ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <div>
                            <p className={`text-lg font-semibold ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
                                {result.passed ? 'PASSED' : 'FAILED'}
                            </p>
                            <p className="text-sm text-textSecondary">
                                Passing marks: {result.passingMarks} / {result.totalMarks}
                            </p>
                        </div>
                        <p className={`text-3xl font-bold ${result.passed ? 'text-green-700' : 'text-red-700'}`}>
                            {result.totalScore ?? 0} / {result.totalMarks}
                        </p>
                    </div>

                    <div className="space-y-4">
                        {result.questions.map((question, index) => (
                            <div key={question.questionId} className="rounded-lg border border-borderLight bg-whiteColor p-4 space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-textSecondary">Question {index + 1} • {question.type}</p>
                                    <p className="font-semibold text-textPrimary">{question.marksObtained} / {question.maxMarks}</p>
                                </div>
                                <p className="text-textPrimary">{question.text}</p>

                                {question.type === QuestionType.WRITTEN && (
                                    <div className="space-y-2 pt-2 border-t border-borderLight">
                                        {question.remarks && (
                                            <p className="text-sm text-textSecondary italic">"{question.remarks}"</p>
                                        )}
                                        <div className="flex gap-2 flex-wrap">
                                            {question.pages?.map((page) => (
                                                <a key={page.pageNumber} href={page.cloudinaryUrl} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={page.cloudinaryUrl}
                                                        alt={`Page ${page.pageNumber}`}
                                                        loading="lazy"
                                                        decoding="async"
                                                        className="h-28 w-20 object-cover rounded-md border border-borderLight"
                                                    />
                                                </a>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </>
    );
};

export default ExamResultPage;
