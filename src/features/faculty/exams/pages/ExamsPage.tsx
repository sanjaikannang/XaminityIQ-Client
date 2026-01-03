import { useState } from "react";
import { Container } from "../../../../common/ui/Container";
import { FacultyExam } from "../../../../types/exam-types";
import { useNavigate } from "react-router-dom";
import { useGetFacultyExamsQuery, useJoinExamMutation } from "../../../../state/services/endpoints/exam";

const ExamsPage = () => {
    const navigate = useNavigate();
    const { data, isLoading, error, refetch } = useGetFacultyExamsQuery();
    const [joinExam] = useJoinExamMutation();

    const [isJoining, setIsJoining] = useState(false);

    const handleJoinExam = async (exam: FacultyExam) => {
        if (!exam.roomCreated) {
            alert("Exam room has not been created yet.");
            return;
        }

        setIsJoining(true);
        try {
            const response = await joinExam({
                examId: exam.examId,
                role: "faculty",
            }).unwrap();

            navigate(`/faculty/exam-room/${exam.examId}`, {
                state: {
                    examName: exam.examName,
                    roomCode: response.roomCode,
                    authToken: response.authToken,
                    totalStudents: exam.totalStudents,
                },
            });
        } catch (err: any) {
            alert(err?.data?.message || "Failed to join exam. Please try again.");
        } finally {
            setIsJoining(false);
        }
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
                <div className="flex items-center justify-center h-64">
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
                    <p className="text-red-600">Failed to load exams. Please try again.</p>
                    <button
                        onClick={() => refetch()}
                        className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                        Retry
                    </button>
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
                    <button
                        onClick={() => refetch()}
                        className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                        Refresh
                    </button>
                </div>

                {exams.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                        </svg>
                        <h3 className="mt-2 text-lg font-medium text-gray-900">No exams to monitor</h3>
                        <p className="mt-1 text-gray-500">You are not assigned to monitor any exams at the moment.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {exams.map((exam) => (
                            <div
                                key={exam.examId}
                                className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-xl font-semibold text-gray-800 flex-1">
                                            {exam.examName}
                                        </h3>
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                                exam.status
                                            )}`}
                                        >
                                            {exam.status}
                                        </span>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-gray-600">
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
                                            <span className="text-sm">{formatDate(exam.examDate)}</span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
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
                                            <span className="text-sm">
                                                {exam.startTime} - {exam.endTime}
                                            </span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
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
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                            <span className="text-sm">{exam.duration} minutes</span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
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
                                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                />
                                            </svg>
                                            <span className="text-sm">{exam.totalStudents} Students</span>
                                        </div>

                                        <div className="flex items-center text-gray-600">
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
                                            <span className="text-sm capitalize">{exam.mode}</span>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200">
                                        <div className="mb-3 flex items-center">
                                            <span className="text-sm text-gray-500">Room Status:</span>
                                            <span className={`ml-2 px-2 py-1 rounded text-xs font-medium ${exam.roomCreated
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                                }`}>
                                                {exam.roomCreated ? "Created" : "Not Created"}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleJoinExam(exam)}
                                            disabled={!exam.roomCreated || isJoining}
                                            className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${exam.roomCreated && !isJoining
                                                    ? "bg-blue-600 text-white hover:bg-blue-700"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                }`}
                                        >
                                            {isJoining ? "Joining..." : exam.roomCreated ? "Monitor Exam" : "Room Not Ready"}
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