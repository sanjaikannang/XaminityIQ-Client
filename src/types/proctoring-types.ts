import { ChatRecipientType, ExamRoomStatus, RoomAssignmentStatus } from "../utils/enum";

// ---- Admin: room formation ----

export interface FormedRoomData {
    roomId: string;
    facultyId: string;
    facultyCode: string;
    liveKitSessionId: string;
    studentCount: number;
    // Names of every exam represented in this room — more than one entry means
    // this room combines leftover students pooled across window-sibling exams
    pooledExamNames: string[];
}

export interface FormExamRoomsResponse {
    success: boolean;
    message: string;
    data?: { rooms: FormedRoomData[] };
}

export interface AdminRoomAssignmentData {
    assignmentId: string;
    // Own exam identity — a pooled room mixes students from multiple exams,
    // so exam identity is read per-assignment, not inherited from the room
    examId: string;
    examName: string;
    studentId: string;
    studentCode: string;
    studentName: string;
    studentEmail: string;
    status: RoomAssignmentStatus;
    enteredWaitingRoomAt?: string;
    admittedAt?: string;
    removedAt?: string;
    removalReason?: string;
}

export interface ExamRoomSummaryData {
    roomId: string;
    facultyId: string;
    facultyCode: string;
    facultyName: string;
    facultyEmail: string;
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
    // Every assignment in the room, any exam — differs from totalCount (this
    // exam's own count) only when the room has been pooled with other exams
    roomTotalOccupancy: number;
    // Names of other exams sharing this room, empty if it wasn't pooled
    pooledWithExamNames: string[];
    // Every student assigned to this room, across all pooled exams
    assignments: AdminRoomAssignmentData[];
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

export interface RoomExamRef {
    examId: string;
    examName: string;
}

export interface MyExamRoomData {
    roomId: string;
    // Every distinct exam represented in this room — more than one entry means
    // this room pools leftover students from multiple window-sibling exams
    exams: RoomExamRef[];
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
    // Own exam identity — a pooled room mixes students from multiple exams,
    // so exam identity is read per-assignment, not inherited from the room
    examId: string;
    examName: string;
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
    // Every distinct exam represented in this room
    exams: RoomExamRef[];
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
