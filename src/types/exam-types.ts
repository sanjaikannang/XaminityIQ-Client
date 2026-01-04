// Existing types
export interface StudentExam {
    examId: string;
    examName: string;
    examDate: Date;
    startTime: string;
    endTime: string;
    duration: number;
    mode: string;
    status: string;
    enrollmentStatus: string;
    canJoin: boolean;
}

export interface FacultyExam {
    examId: string;
    examName: string;
    examDate: Date;
    startTime: string;
    endTime: string;
    duration: number;
    mode: string;
    status: string;
    totalStudents: number;
    roomCreated: boolean;
    hmsRoomId?: string;
    canMonitor?: boolean;
}

// New types for exam details
export interface ExamDetails {
    examName: string;
    examDate: Date;
    startTime: string;
    endTime: string;
    duration: number;
    mode: string;
    instructions: string[];
    faculty: {
        name: string;
        email: string;
        phone: string;
    };
}

export interface JoinRequestResponse {
    message: string;
    requestId: string;
    status: 'pending' | 'approved' | 'rejected';
    isRejoin: boolean;
}

export interface JoinRequestStatus {
    status: 'pending' | 'approved' | 'rejected';
    isRejoin: boolean;
    approvedAt?: Date;
    rejectedAt?: Date;
    rejectionReason?: string;
}

export interface PendingJoinRequest {
    requestId: string;
    studentId: string;
    studentName: string;
    isRejoin: boolean;
    createdAt: Date;
}

// API Request/Response types
export interface GetExamDetailsResponse {
    success: boolean;
    message: string;
    data: ExamDetails;
}

export interface RequestJoinExamResponse {
    success: boolean;
    message: string;
    data: JoinRequestResponse;
}

export interface CheckJoinRequestStatusResponse {
    success: boolean;
    message: string;
    data: JoinRequestStatus;
}

export interface JoinExamRoomRequest {
    requestId: string;
}

export interface JoinExamRoomResponse {
    success: boolean;
    message: string;
    data: {
        roomId: string;
        authToken: string;
        examName: string;
        duration: number;
    };
}

export interface GetPendingJoinRequestsResponse {
    success: boolean;
    message: string;
    data: PendingJoinRequest[];
}

export interface ApproveRejectRequest {
    requestId: string;
    reason?: string;
}

export interface RemoveStudentRequest {
    studentId: string;
    reason: string;
}

// Existing interfaces
export interface GetStudentExamsResponse {
    success: boolean;
    message: string;
    data: StudentExam[];
}

export interface GetFacultyExamsResponse {
    success: boolean;
    message: string;
    data: FacultyExam[];
}

export interface JoinExamRequest {
    examId: string;
}

export interface JoinStudentExamResponse {
    success: boolean;
    message: string;
    data: {
        roomId: string;
        authToken: string;
        examName: string;
        duration: number;
    };
}

export interface JoinFacultyExamResponse {
    success: boolean;
    message: string;
    data: {
        roomId: string;
        authToken: string;
        examName: string;
        totalStudents: number;
    };
}