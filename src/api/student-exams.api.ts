export const studentExams = {
    getAllExams: () => "/student/exams",
    startAttempt: (examId: string) => `/student/exams/${examId}/start`,
    getAttempt: (attemptId: string) => `/student/exams/attempts/${attemptId}`,
    saveAnswer: (attemptId: string, questionId: string) => `/student/exams/attempts/${attemptId}/answers/${questionId}`,
    submitAttempt: (attemptId: string) => `/student/exams/attempts/${attemptId}/submit`,
    getRecordingSignature: (attemptId: string) => `/student/exams/attempts/${attemptId}/recordings/signature`,
    recordChunk: (attemptId: string) => `/student/exams/attempts/${attemptId}/recordings/chunk`,
    finalizeRecording: (attemptId: string) => `/student/exams/attempts/${attemptId}/recordings/finalize`,
    networkProbeDownload: () => "/student/exams/network-probe/download",
    networkProbeUpload: () => "/student/exams/network-probe/upload",
};
