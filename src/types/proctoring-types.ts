import { ChatRecipientType, ExamRoomStatus, RoomAssignmentStatus } from "../utils/enum";

// ---- Admin: room formation ----

export interface FormedRoomData {
    roomId: string;
    facultyId: string;
    facultyCode: string;
    liveKitSessionId: string;
    studentCount: number;
}

export interface FormExamRoomsResponse {
    success: boolean;
    message: string;
    data?: { rooms: FormedRoomData[] };
}

export interface ExamRoomSummaryData {
    roomId: string;
    facultyId: string;
    facultyCode: string;
    liveKitSessionId: string;
    startDateTime: string;
    endDateTime: string;
    status: ExamRoomStatus;
    waitingCount: number;
    admittedCount: number;
    inProgressCount: number;
    completedCount: number;
    removedOrRejectedCount: number;
    totalCount: number;
}

export interface GetExamRoomsResponse {
    success: boolean;
    message: string;
    data?: { rooms: ExamRoomSummaryData[] };
}

// ---- Student: lobby + LiveKit + chat ----

export interface JoinLobbyData {
    roomId: string;
    assignmentId: string;
    status: RoomAssignmentStatus;
}

export interface JoinLobbyResponse {
    success: boolean;
    message: string;
    data?: JoinLobbyData;
}

export interface LobbyStatusData {
    status: RoomAssignmentStatus;
    attemptId: string | null;
    removalReason?: string;
}

export interface GetLobbyStatusResponse {
    success: boolean;
    message: string;
    data?: LobbyStatusData;
}

export interface LiveKitTokenData {
    token: string;
    liveKitUrl: string;
    roomName: string;
    roomId: string;
    identity: string;
    facultyIdentity: string;
}

export interface GetLiveKitTokenResponse {
    success: boolean;
    message: string;
    data?: LiveKitTokenData;
}

export interface ChatMessageData {
    _id: string;
    senderRole: string;
    senderId: string;
    recipientType: ChatRecipientType;
    recipientStudentId?: string;
    message: string;
    sentAt: string;
}

export interface SendChatResponse {
    success: boolean;
    message: string;
    data?: ChatMessageData;
}

export interface GetChatHistoryResponse {
    success: boolean;
    message: string;
    data?: ChatMessageData[];
}

// ---- Faculty: rooms + queue + actions ----

export interface MyExamRoomData {
    roomId: string;
    examId: string;
    examName: string;
    startDateTime: string;
    endDateTime: string;
    status: ExamRoomStatus;
    studentCount: number;
}

export interface GetMyExamRoomsResponse {
    success: boolean;
    message: string;
    data?: MyExamRoomData[];
}

export interface RoomAssignmentData {
    assignmentId: string;
    studentId: string;
    studentCode: string;
    attemptId: string | null;
    status: RoomAssignmentStatus;
    enteredWaitingRoomAt?: string;
    admittedAt?: string;
    removedAt?: string;
    removalReason?: string;
}

export interface ExamRoomDetailData {
    roomId: string;
    examId: string;
    examName: string;
    startDateTime: string;
    endDateTime: string;
    status: ExamRoomStatus;
    liveKitSessionId: string;
    assignments: RoomAssignmentData[];
}

export interface GetExamRoomDetailResponse {
    success: boolean;
    message: string;
    data?: ExamRoomDetailData;
}

export interface AdmitStudentResponse {
    success: boolean;
    message: string;
    attemptId?: string;
}

export interface RejectStudentRequest {
    reason: string;
}

export interface RemoveStudentRequest {
    reason?: string;
}

export interface FacultySendChatRequest {
    message: string;
    recipientType: ChatRecipientType;
    recipientStudentId?: string;
}

export interface FacultyLiveKitTokenData {
    token: string;
    liveKitUrl: string;
    roomName: string;
    identity: string;
}

export interface GetFacultyLiveKitTokenResponse {
    success: boolean;
    message: string;
    data?: FacultyLiveKitTokenData;
}
