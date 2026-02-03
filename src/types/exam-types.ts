import { ExamStatus, JoinRequestStatus, MessageType, ParticipantStatus, ExamMode } from "../utils/enum";

export interface CreateExamRequest {
    examMode: ExamMode;
    examName: string;
    duration: number;
    examDate?: string;
    startTime?: string;
    endTime?: string;
    examStartDate?: string;
    examEndDate?: string;
    facultyId?: string;
    studentIds?: string[];
}

export interface CreateExamResponse {
    success: boolean;
    message: string;
    data?: {
        examId: string;
        examName: string;
        channelName: string;
        participantsCount: number;
    };
}

// Student Exam Types
export interface StudentExamData {
    examId: string;
    examName: string;
    examMode: ExamMode;
    examDate?: string;
    startTime?: string;
    endTime?: string;
    examStartDate?: string;
    examEndDate?: string;
    duration: number;
    status: ExamStatus;
    myStatus: ParticipantStatus;
    canJoin: boolean;
    totalStudents: number;
}

export interface GetStudentExamsResponse {
    success: boolean;
    message: string;
    data: StudentExamData[];
}

// Faculty Exam Types
export interface FacultyExamData {
    examId: string;
    examName: string;
    examDate: string;
    startTime: string;
    endTime: string;
    duration: number;
    status: ExamStatus;
    canJoin: boolean;
    totalStudents: number;
    joinedStudents: number;
}

export interface GetFacultyExamsResponse {
    success: boolean;
    message: string;
    data: FacultyExamData[];
}

export interface FacultyJoinExamResponse {
    success: boolean;
    message: string;
    data?: {
        rtcToken: string;
        rtmToken: string;
        channelName: string;
        uid: string;
        expiresAt: string;
    };
}

export interface JoinRequestData {
    requestId: string;
    studentEmail: string;
    studentName: string;
    studentRollNumber: string;
    timestamp: string;
    deviceStatus: {
        camera: boolean;
        microphone: boolean;
        screenShare: boolean;
        fullscreen: boolean;
    };
}

export interface GetJoinRequestsResponse {
    success: boolean;
    message: string;
    data?: JoinRequestData[];
}

export interface ChatMessageData {
    messageId: string;
    senderId: string;
    senderName: string;
    recipientId?: string;
    message: string;
    type: MessageType;
    timestamp: string;
}

export interface GetMessagesResponse {
    success: boolean;
    message: string;
    data?: ChatMessageData[];
}

export interface StudentJoinRequestRequest {
    // deviceStatus: {
    //     camera: boolean;
    //     microphone: boolean;
    //     screenShare: boolean;
    //     fullscreen: boolean;
    // };
}

export interface StudentJoinRequestResponse {
    success: boolean;
    message: string;
    data?: {
        requestId: string;
        status: string;
        timestamp: string;
    };
}

export interface CheckJoinStatusResponse {
    success: boolean;
    message: string;
    data?: {
        status: JoinRequestStatus;
        reason?: string;
        tokens?: {
            rtcToken: string;
            rtmToken: string;
            channelName: string;
            uid: string;
            expiresAt: string;
        };
    };
}

// Add to existing types
export interface ExamData {
    _id: string;
    examName: string;
    examMode: ExamMode;
    examDate?: string;
    startTime?: string;
    endTime?: string;
    examStartDate?: string;
    examEndDate?: string;
    duration: number;
    status: ExamStatus;
    totalStudents: number;
    facultyName?: string;
    createdAt: string;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface GetAllExamsResponse {
    success: boolean;
    message: string;
    data?: ExamData[];
    pagination?: PaginationMeta;
}
