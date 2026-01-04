import { useNavigate } from "react-router-dom";
import { FacultyExam } from "../../../../types/exam-types";
import { Container } from "../../../../common/ui/Container";
import { useGetFacultyExamsQuery, useJoinFacultyExamMutation } from "../../../../state/services/endpoints/exam";
import toast from "react-hot-toast";

const ExamsPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetFacultyExamsQuery();
    const [joinExam, { isLoading: isJoining }] = useJoinFacultyExamMutation();

    const handleJoinExam = async (exam: FacultyExam) => {
        // if (!exam.roomCreated) {
        //     toast.error("Exam room has not been created yet");
        //     return;
        // }

        // if (!exam.canMonitor) {
        //     toast.error("You can only monitor the exam during the scheduled time");
        //     return;
        // }

        try {
            const response = await joinExam({
                examId: exam.examId,
            }).unwrap();

            navigate(`/faculty/exam-room/${exam.examId}`, {
                state: {
                    roomId: response.data.roomId,
                    authToken: response.data.authToken,
                    examName: response.data.examName,
                    totalStudents: response.data.totalStudents,
                },
            });
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to join exam. Please try again.");
        }
    };

    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case "ongoing":
                return "bg-green-100 text-green-800 border-green-300";
            case "upcoming":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "completed":
                return "bg-gray-100 text-gray-800 border-gray-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    if (isLoading) {
        return (
            <Container>
                <div className="py-6 flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading exams...</p>
                    </div>
                </div>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <p className="text-red-600">
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
                    <h1 className="text-3xl font-bold text-gray-800">Monitoring Schedule</h1>
                </div>

                {exams.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-medium text-gray-900">
                            No exams to monitor
                        </h3>
                        <p className="text-gray-500">
                            You are not assigned to monitor any exams at the moment.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <div
                                key={exam.examId}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800">
                                            {exam.examName}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(exam.status)}`}
                                        >
                                            {exam.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-gray-600 text-sm mb-4">
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {formatDate(exam.examDate)}
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            {exam.startTime} - {exam.endTime}
                                        </div>
                                        <div className="flex items-center">
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                                />
                                            </svg>
                                            {exam.totalStudents} Students
                                        </div>
                                        <div className="flex items-center capitalize">
                                            <svg
                                                className="w-5 h-5 mr-2"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                                />
                                            </svg>
                                            {exam.mode}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="mb-3">
                                            <span className="text-sm text-gray-500">
                                                Room Status:
                                            </span>
                                            <span
                                                className={`ml-2 px-2 py-1 rounded text-xs font-medium ${exam.roomCreated
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {exam.roomCreated
                                                    ? "Created"
                                                    : "Not Created"}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleJoinExam(exam)}
                                            //disabled={!exam.roomCreated || !exam.canMonitor || isJoining}
                                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${exam.roomCreated && exam.canMonitor && !isJoining
                                                ? "bg-blue-600 text-white hover:bg-blue-700"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                        >
                                            {/* {isJoining
                                                ? "Joining..."
                                                : exam.roomCreated
                                                    ? exam.canMonitor
                                                        ? "Monitor Exam"
                                                        : "Not in Exam Time"
                                                    : "Room Not Ready"} */}

                                            Monitor Exam
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Container>
    );
};

export default ExamsPage;