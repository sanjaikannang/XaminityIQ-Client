import { ExamMode, ExamStatus, QuestionType } from "../utils/enum";

export interface SecuritySettings {
    shuffleQuestions?: boolean;
    shuffleOptions?: boolean;
    disableCopyPaste?: boolean;
    disableRightClick?: boolean;
    requireFullScreenThroughout?: boolean;
    blockBackwardNavigation?: boolean;
    tabSwitchViolationThreshold?: number;
    fullScreenExitViolationThreshold?: number;
    connectionLossGracePeriodMinutes?: number;
    cameraMicLossGracePeriodMinutes?: number;
    faceDetectionEnabled?: boolean;
    minTimePerQuestionSeconds?: number;
    minTimePerExamMinutes?: number;
}

// A named group of questions ("Section A", "Section B", ...) — not to be
// confused with the academic `sectionId` (class/division) field on ExamData.
export interface ExamSectionInput {
    _id?: string;
    label: string;
    order: number;
}

export interface ExamSectionData {
    _id: string;
    label: string;
    order: number;
}

export interface ExamData {
    _id: string;
    name: string;
    description?: string;
    mode: ExamMode;
    status: ExamStatus;
    batchId: string;
    batchName?: string;
    courseId: string;
    courseName?: string;
    departmentId: string;
    deptName?: string;
    sectionId: string;
    sectionName?: string;
    semester: number;
    subjectId: string;
    subjectName?: string;
    durationMinutes: number;
    totalMarks: number;
    passingMarks: number;
    startDate: string;
    endDate: string;
    startTime?: string;
    endTime?: string;
    createdAt: string;
}

export interface QuestionOption {
    optionId: string;
    text: string;
}

export interface QuestionData {
    _id: string;
    type: QuestionType;
    text: string;
    marks: number;
    order: number;
    examSectionId?: string;
    options?: QuestionOption[];
    correctOptionIds?: string[];
    createdAt: string;
}

export interface ExamDetailData extends ExamData {
    evaluatorFacultyIds: string[];
    securitySettings: SecuritySettings;
    examSections: ExamSectionData[];
    questions: QuestionData[];
    totalQuestionMarks: number;
    matchedStudentCount: number;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Create / Edit Exam
export interface CreateExamRequest {
    name: string;
    description?: string;
    mode: ExamMode;
    batchId: string;
    courseId: string;
    departmentId: string;
    sectionId: string;
    semester: number;
    subjectId: string;
    durationMinutes: number;
    totalMarks: number;
    passingMarks: number;
    startDate: string;
    endDate: string;
    // Required for both AUTO and PROCTORING — always IST
    startTime: string;
    endTime: string;
    examSections?: ExamSectionInput[];
    securitySettings?: SecuritySettings;
}

export type EditExamRequest = Partial<CreateExamRequest>;

export interface CreateExamResponse {
    success: boolean;
    message: string;
    examId?: string;
}

export interface EditExamResponse {
    success: boolean;
    message: string;
}

export interface DeleteExamResponse {
    success: boolean;
    message: string;
}

export interface PublishExamResponse {
    success: boolean;
    message: string;
}

export interface GetExamResponse {
    success: boolean;
    message: string;
    data?: ExamDetailData;
}

export interface GetAllExamsParams {
    page?: number;
    limit?: number;
    search?: string;
    mode?: ExamMode;
    status?: ExamStatus;
    batchId?: string;
    courseId?: string;
    departmentId?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface GetAllExamsResponse {
    success: boolean;
    message: string;
    data?: ExamData[];
    pagination?: PaginationMeta;
}

// Questions
export interface QuestionOptionInput {
    text: string;
    isCorrect: boolean;
}

export interface AddQuestionRequest {
    type: QuestionType;
    text: string;
    marks: number;
    examSectionId?: string;
    options?: QuestionOptionInput[];
}

export type EditQuestionRequest = Partial<AddQuestionRequest>;

export interface AddQuestionResponse {
    success: boolean;
    message: string;
    data?: QuestionData;
}

// Bulk Upload Questions (CSV)
export interface QuestionUploadResult {
    rowNumber: number;
    questionId?: string;
    status: 'success' | 'failed';
    error?: string;
}

export interface BulkUploadQuestionsSummary {
    totalRecords: number;
    successCount: number;
    failedCount: number;
    successfulUploads: QuestionUploadResult[];
    failedUploads: QuestionUploadResult[];
}

export interface BulkUploadQuestionsResponse {
    success: boolean;
    message: string;
    summary: BulkUploadQuestionsSummary;
}

export interface EditQuestionResponse {
    success: boolean;
    message: string;
}

export interface DeleteQuestionResponse {
    success: boolean;
    message: string;
}

// Evaluation & Results
export interface AssignEvaluatorsRequest {
    evaluatorFacultyIds: string[];
}

export interface AssignEvaluatorsResponse {
    success: boolean;
    message: string;
}

export interface EvaluationProgressData {
    totalWrittenAnswers: number;
    evaluatedCount: number;
    pendingCount: number;
}

export interface GetEvaluationProgressResponse {
    success: boolean;
    message: string;
    data?: EvaluationProgressData;
}

export interface PublishResultsResponse {
    success: boolean;
    message: string;
}

export interface ExamAttemptSummaryData {
    attemptId: string;
    studentId: string;
    studentCode: string;
    studentName: string;
    studentEmail: string;
    status: string;
    isFlagged: boolean;
    violationCounts: Record<string, number>;
    totalScore?: number;
    passed?: boolean;
}

export interface GetExamAttemptsResponse {
    success: boolean;
    message: string;
    data?: { attempts: ExamAttemptSummaryData[] };
}

// Attempt Recording (admin viewer) Types
export interface RecordingChunkData {
    sequence: number;
    cloudinaryUrl: string;
    uploadedAt: string;
}

export interface RecordingStreamData {
    status: string;
    chunks: RecordingChunkData[];
}

export interface AttemptRecordingData {
    attemptId: string;
    examId: string;
    examName: string;
    studentId: string;
    studentCode: string;
    studentName: string;
    studentEmail: string;
    attemptStatus: string;
    mediaStatus: string;
    video: RecordingStreamData;
    screen: RecordingStreamData;
}

export interface GetAttemptRecordingResponse {
    success: boolean;
    message: string;
    data?: AttemptRecordingData;
}

// Attempt Answers (admin per-attempt review — every question type)
export interface AttemptAnswerPageData {
    pageNumber: number;
    cloudinaryUrl: string;
    uploadedAt: string;
}

export interface AttemptQuestionAnswerData {
    questionId: string;
    type: QuestionType;
    text: string;
    marks: number;
    order: number;
    examSectionId?: string;
    selectedOptionText?: string;
    selectedOptionTexts?: string[];
    isCorrect?: boolean;
    pages?: AttemptAnswerPageData[];
    answerText?: string;
    marksAwarded?: number;
    remarks?: string;
}

export interface GetAttemptAnswersResponse {
    success: boolean;
    message: string;
    data?: AttemptQuestionAnswerData[];
}
