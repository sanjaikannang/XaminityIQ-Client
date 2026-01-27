export const exam = {
    // FACULTY
    getFacultyExams: () => "/faculty/exams/my-exams",
    facultyJoinExam: (examId: string) => `/faculty/exams/${examId}/faculty-join`,
    getPendingJoinRequests: (examId: string) =>
        `/faculty/exams/${examId}/join-requests/pending`,
    approveJoinRequest: (examId: string) =>
        `/faculty/exams/${examId}/join-requests/approve`,
    rejectJoinRequest: (examId: string) =>
        `/faculty/exams/${examId}/join-requests/reject`,
    facultyMessages: (examId: string) =>
        `/faculty/exams/${examId}/messages`,
    removeStudent: (examId: string) =>
        `/faculty/exams/${examId}/remove-student`,
    endExam: (examId: string) =>
        `/faculty/exams/${examId}/end`,

    // STUDENT
    getStudentExams: () => "/student/exams/my-exams",
    studentJoinRequest: (examId: string) =>
        `/student/exams/${examId}/join-request`,
    checkJoinStatus: (examId: string) =>
        `/student/exams/${examId}/join-request/status`,
    studentMessages: (examId: string) =>
        `/student/exams/${examId}/messages/my-messages`,
    finishExam: (examId: string) =>
        `/student/exams/${examId}/finish`,
};
