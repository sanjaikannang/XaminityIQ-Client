export const evaluation = {
    getMyEvaluationExams: () => "/faculty/evaluation/exams",
    getExamAnswersForEvaluation: (examId: string) => `/faculty/evaluation/exams/${examId}/answers`,
    evaluateAnswer: (answerId: string) => `/faculty/evaluation/answers/${answerId}`,
};
