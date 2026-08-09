import { ExamStatus } from "../utils/enum";

export interface MyEvaluationExamData {
    examId: string;
    name: string;
    status: ExamStatus;
    totalMarks: number;
}

export interface GetMyEvaluationExamsResponse {
    success: boolean;
    message: string;
    data?: MyEvaluationExamData[];
}

export interface AnswerPageData {
    pageNumber: number;
    cloudinaryUrl: string;
    uploadedAt: string;
}

export interface EvaluationAnswerData {
    answerId: string;
    attemptId: string;
    studentCode: string;
    questionText: string;
    maxMarks: number;
    pages: AnswerPageData[];
    marksAwarded?: number;
    remarks?: string;
    evaluatedAt?: string;
}

export interface GetExamAnswersForEvaluationResponse {
    success: boolean;
    message: string;
    data?: EvaluationAnswerData[];
}

export interface EvaluateAnswerRequest {
    marksAwarded: number;
    remarks?: string;
}

export interface EvaluateAnswerResponse {
    success: boolean;
    message: string;
}
