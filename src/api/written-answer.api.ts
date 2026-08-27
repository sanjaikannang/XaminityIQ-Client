export const writtenAnswer = {
    generateQr: (attemptId: string, questionId: string) => `/student/exams/attempts/${attemptId}/answers/${questionId}/qr`,
    getQrStatus: (attemptId: string, questionId: string) => `/student/exams/attempts/${attemptId}/answers/${questionId}/qr-status`,
    finalize: (attemptId: string, questionId: string) => `/student/exams/attempts/${attemptId}/answers/${questionId}/finalize`,
    deletePage: (attemptId: string, questionId: string, pageNumber: number) =>
        `/student/exams/attempts/${attemptId}/answers/${questionId}/pages/${pageNumber}`,
};
