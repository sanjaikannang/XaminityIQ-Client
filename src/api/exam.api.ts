export const exam = {
    getFacultyExams: "/faculty/exams",
    getStudentExams: "/student/exams",
    joinFacultyExam: "/faculty/exam/join",
    joinStudentExam: "/student/exam/join",

    // New routes for students
    getExamDetails: "/student/exam/:examId/details",
    requestJoinExam: "/student/exam/:examId/request-join",
    checkJoinRequestStatus: "/student/exam/request/:requestId/status",
    joinExamRoom: "/student/exam/request/:requestId/join-room",
    updateStudentLeftStatus: "/student/exam/:examId/left",

    // New routes for faculty
    getPendingJoinRequests: "/faculty/exam/:examId/join-requests",
    approveJoinRequest: "/faculty/exam/request/:requestId/approve",
    rejectJoinRequest: "/faculty/exam/request/:requestId/reject",
    removeStudent: "/faculty/exam/:examId/remove-student"
}