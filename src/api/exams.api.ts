export const exams = {
    createExam: () => "/admin/exams",
    getAllExams: () => "/admin/exams",
    getExam: (id: string) => `/admin/exams/${id}`,
    updateExam: (id: string) => `/admin/exams/${id}`,
    deleteExam: (id: string) => `/admin/exams/${id}`,
    publishExam: (id: string) => `/admin/exams/${id}/publish`,
    addQuestion: (examId: string) => `/admin/exams/${examId}/questions`,
    updateQuestion: (examId: string, questionId: string) => `/admin/exams/${examId}/questions/${questionId}`,
    deleteQuestion: (examId: string, questionId: string) => `/admin/exams/${examId}/questions/${questionId}`,
    formExamRooms: (examId: string) => `/admin/exams/${examId}/rooms`,
    getExamRooms: (examId: string) => `/admin/exams/${examId}/rooms`,
};
