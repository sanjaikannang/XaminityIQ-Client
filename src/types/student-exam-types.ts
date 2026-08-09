import { AttemptStatus, ExamMode, ExamStatus, QuestionType, RecordingMediaType, ViolationType } from "../utils/enum";
import { SecuritySettings } from "./exams-types";

export interface MyExamData {
    _id: string;
    name: string;
    description?: string;
    mode: ExamMode;
    status: ExamStatus;
    subjectName?: string;
    durationMinutes: number;
    totalMarks: number;
    passingMarks: number;
    startDate: string;
    endDate: string;
    myAttemptId: string | null;
    myAttemptStatus: AttemptStatus | null;
    totalScore?: number;
    passed?: boolean;
}

export interface GetAllExamsResponse {
    success: boolean;
    message: string;
    data?: MyExamData[];
}

export interface AttemptQuestionOption {
    optionId: string;
    text: string;
}

export interface AttemptQuestionData {
    _id: string;
    type: QuestionType;
    text: string;
    marks: number;
    order: number;
    options?: AttemptQuestionOption[];
}

export interface StartAttemptData {
    attemptId: string;
    examId: string;
    examName: string;
    durationMinutes: number;
    startedAt: string;
    securitySettings: SecuritySettings;
    questions: AttemptQuestionData[];
}

export interface StartAttemptResponse {
    success: boolean;
    message: string;
    data?: StartAttemptData;
}

export interface AttemptAnswerData {
    questionId: string;
    selectedOptionId?: string;
    selectedOptionIds?: string[];
}

export interface GetAttemptData {
    attemptId: string;
    examId: string;
    examName: string;
    durationMinutes: number;
    startedAt: string;
    status: AttemptStatus;
    remainingMs: number;
    securitySettings: SecuritySettings;
    questions: AttemptQuestionData[];
    answers: AttemptAnswerData[];
}

export interface GetAttemptResponse {
    success: boolean;
    message: string;
    data?: GetAttemptData;
}

export interface SaveAnswerRequest {
    selectedOptionId?: string;
    selectedOptionIds?: string[];
}

export interface SubmitAttemptResponse {
    success: boolean;
    message: string;
    status?: AttemptStatus;
    objectiveScore?: number;
    totalScore?: number;
    passed?: boolean;
}

export interface ReportViolationRequest {
    type: ViolationType;
}

export interface ReportViolationResponse {
    success: boolean;
    message?: string;
    violationCount: number;
    terminated: boolean;
    status?: AttemptStatus;
    objectiveScore?: number;
    totalScore?: number;
    passed?: boolean;
}

export interface RecordingSignatureData {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    publicId: string;
    folder: string;
}

export interface RecordingSignatureResponse {
    success: boolean;
    message: string;
    data?: RecordingSignatureData;
}

export interface RecordChunkRequest {
    mediaType: RecordingMediaType;
    sequence: number;
    cloudinaryAssetId: string;
    cloudinaryUrl: string;
}

export interface FinalizeRecordingResponse {
    success: boolean;
    message: string;
    allComplete?: boolean;
}

export interface ResultAnswerPageData {
    pageNumber: number;
    cloudinaryUrl: string;
    uploadedAt: string;
}

export interface ResultQuestionData {
    questionId: string;
    type: QuestionType;
    text: string;
    maxMarks: number;
    marksObtained: number;
    remarks?: string;
    pages?: ResultAnswerPageData[];
}

export interface MyResultData {
    examName: string;
    totalMarks: number;
    passingMarks: number;
    objectiveScore?: number;
    writtenScore?: number;
    totalScore?: number;
    passed?: boolean;
    questions: ResultQuestionData[];
}

export interface GetMyResultResponse {
    success: boolean;
    message: string;
    data?: MyResultData;
}
