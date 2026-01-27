export interface CreateExamRequest {
    examName: string;
    date: string;
    time: string;
    duration: number;
    facultyId: string;
    studentIds: string[];
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

export interface ExamData {
    examId: string;
    examName: string;
    date: string;
    time: string;
    duration: number;
    status: 'upcoming' | 'ongoing' | 'completed';
    myStatus?: 'invited' | 'waiting' | 'joined' | 'finished' | 'removed' | 'rejected';
}

export interface GetExamsResponse {
    success: boolean;
    message: string;
    data?: ExamData[];
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
    studentId: string;
    studentName: string;
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
    type: 'broadcast' | 'direct';
    timestamp: string;
}

export interface GetMessagesResponse {
    success: boolean;
    message: string;
    data?: ChatMessageData[];
}

export interface StudentJoinRequestRequest {
    studentId: string;
    deviceStatus: {
        camera: boolean;
        microphone: boolean;
        screenShare: boolean;
        fullscreen: boolean;
    };
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
        status: 'pending' | 'approved' | 'rejected';
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
