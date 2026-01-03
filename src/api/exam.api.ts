export const exam = {
    getFacultyExams: "/faculty/exams",
    getStudentExams: "/student/exams",
    joinExam: (role: string) => `/${role}/exam/join`,
};