import { useNavigate } from "react-router-dom";
import ExamSkeleton from "../components/ExamSkeleton";
import { FacultyExam } from "../../../../types/exam-types";
import { Container } from "../../../../common/ui/Container";
import { useGetFacultyExamsQuery, useJoinFacultyExamMutation } from "../../../../state/services/endpoints/exam";

const ExamsPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetFacultyExamsQuery();
    const [joinExam, { isLoading: isJoining }] = useJoinFacultyExamMutation();

    const handleJoinExam = async (exam: FacultyExam) => {
        if (!exam.roomCreated) {
            alert("Exam room has not been created yet.");
            return;
        }

        console.log("Attempting to join exam with ID:", exam.examId);

        try {
            const response = await joinExam({
                examId: exam.examId,
            }).unwrap();

            console.log("Join exam response:", response);

            navigate(`/faculty/exam-room/${exam.examId}`, {
                state: {
                    roomId: response.data.roomId,
                    authToken: response.data.authToken,
                    examName: response.data.examName,
                    totalStudents: response.data.totalStudents,
                },
            });
        } catch (err: any) {
            console.error("Join exam error:", err);
            alert(err?.data?.message || err?.message || "Failed to join exam. Please try again.");
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <Container>
                <div className="py-6 grid grid-cols-2 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <ExamSkeleton key={i} />
                    ))}
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div className="bg-error/10 border border-error rounded-lg p-6 text-center">
                    <p className="text-error">
                        Failed to load exams. Please try again.
                    </p>
                </div>
            </Container>
        );
    }

    const exams = data?.data || [];

    return (
        <Container>
            <div className="py-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-textPrimary">Monitoring Schedule</h1>
                </div>

                {exams.length === 0 ? (
                    <div className="text-center py-12 bg-bgSecondary rounded-lg">
                        <h3 className="text-lg font-medium text-textPrimary">
                            No exams to monitor
                        </h3>
                        <p className="text-textSecondary">
                            You are not assigned to monitor any exams at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-6">
                        {exams.map((exam) => (
                            <div
                                key={exam.examId}
                                className="bg-whiteColor border border-borderLight rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-textPrimary">
                                            {exam.examName}
                                        </h3>
                                        <span
                                            className="px-3 py-1 rounded-full text-xs font-medium border"
                                        >
                                            {exam.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-textSecondary text-sm mb-4">
                                        <div>{formatDate(exam.examDate)}</div>
                                        <div>
                                            {exam.startTime} - {exam.endTime}
                                        </div>
                                        <div>{exam.duration} minutes</div>
                                        <div>{exam.totalStudents} Students</div>
                                        <div className="capitalize">{exam.mode}</div>
                                    </div>

                                    <div className="pt-4 border-t border-borderLight">
                                        <div className="mb-3">
                                            <span className="text-sm text-textSecondary">
                                                Room Status:
                                            </span>
                                            <span
                                                className={`ml-2 px-2 py-1 rounded text-xs font-medium ${exam.roomCreated
                                                    ? "bg-success/10 text-success"
                                                    : "bg-warning/10 text-warning"
                                                    }`}
                                            >
                                                {exam.roomCreated
                                                    ? "Created"
                                                    : "Not Created"}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleJoinExam(exam)}
                                            disabled={!exam.roomCreated || isJoining}
                                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${exam.roomCreated && !isJoining
                                                ? "bg-primary text-whiteColor hover:bg-info"
                                                : "bg-borderLight text-textDisabled cursor-not-allowed"
                                                }`}
                                        >
                                            {isJoining
                                                ? "Joining..."
                                                : exam.roomCreated
                                                    ? "Monitor Exam"
                                                    : "Room Not Ready"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )
                }
            </div>
        </Container>
    );
};

export default ExamsPage;