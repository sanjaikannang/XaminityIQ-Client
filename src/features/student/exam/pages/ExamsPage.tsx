import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { StudentExam } from "../../../../types/exam-types";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { Calendar, CheckCircle, Clock, Monitor, Timer } from "lucide-react";
import { useGetStudentExamsQuery } from "../../../../state/services/endpoints/exam";

const ExamsPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetStudentExamsQuery();

    const handleJoinExam = (exam: StudentExam) => {
        navigate(`/student/exam/${exam.examId}/environment-check`);
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const ExamSkeleton = () => (
        <>
            <div className="bg-whiteColor border border-borderLight rounded-lg p-6 animate-pulse">
                <div className="h-5 bg-borderLight rounded w-3/4 mb-4" />
                <div className="space-y-3">
                    <div className="h-4 bg-borderLight rounded w-1/2" />
                    <div className="h-4 bg-borderLight rounded w-2/3" />
                    <div className="h-4 bg-borderLight rounded w-1/3" />
                    <div className="h-4 bg-borderLight rounded w-1/4" />
                </div>
                <div className="mt-6 h-10 bg-borderLight rounded-lg" />
            </div>
        </>
    );

    if (isLoading) {
        return (
            <>
                <PageHeader>Exams</PageHeader>
                <Container>
                    <div className="grid grid-cols-2 gap-6 py-6">
                        {[...Array(4)].map((_, i) => (
                            <ExamSkeleton key={i} />
                        ))}
                    </div>
                </Container>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Container>
                    <div className="bg-danger/10 border border-danger text-danger rounded-lg p-6 text-center">
                        Failed to load exams. Please try again.
                    </div>
                </Container>
            </>
        );
    }

    const exams = data?.data || [];

    return (
        <>
            <PageHeader>Exams</PageHeader>
            <Container>
                <div className="py-4">
                    {exams.length === 0 ? (
                        <div className="text-center py-12 bg-bgSecondary rounded-lg">
                            <h3 className="text-lg font-medium text-textPrimary">
                                No exams available
                            </h3>
                            <p className="text-textSecondary mt-1">
                                You don't have any scheduled exams at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-6">
                            {exams.map((exam) => (
                                <div
                                    key={exam.examId}
                                    className="bg-whiteColor border border-borderDefault rounded-xl hover:shadow-md transition-shadow"
                                >
                                    <div className="p-5">
                                        <h3 className="text-xl font-semibold text-textPrimary mb-4">
                                            {exam.examName}
                                        </h3>

                                        <div className="space-y-3 mb-4 text-textSecondary">
                                            <div className="flex items-center">
                                                <Calendar className="w-5 h-5 mr-2" />
                                                <span className="text-sm">
                                                    {formatDate(exam.examDate)}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <Clock className="w-5 h-5 mr-2" />
                                                <span className="text-sm">
                                                    {exam.startTime} - {exam.endTime}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <Timer className="w-5 h-5 mr-2" />
                                                <span className="text-sm">
                                                    {exam.duration} minutes
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <Monitor className="w-5 h-5 mr-2" />
                                                <span className="text-sm capitalize">
                                                    {exam.mode}
                                                </span>
                                            </div>

                                            <div className="flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-2" />
                                                <span className="text-sm capitalize">
                                                    {exam.status}
                                                </span>
                                            </div>
                                        </div>

                                        <Button
                                            fullWidth
                                            variant="primary"
                                            disabled={!exam.canJoin}
                                            onClick={() => handleJoinExam(exam)}
                                        >
                                            Join Exam
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default ExamsPage;