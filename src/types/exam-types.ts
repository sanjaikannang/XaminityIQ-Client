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
}

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

export interface GetFacultyExamsResponse {
    success: boolean;
    message: string;
    data: FacultyExam[];
}

export interface GetStudentExamsResponse {
    message: string;
    success: boolean;
    data: StudentExam[];
}

export interface JoinExamRequest {
    examId: string;
}

export interface JoinExamResponse {
    success: boolean;
    message: string;
    roomCode: string;
    authToken: string;
}

export interface MediaPermissions {
    audio: boolean;
    video: boolean;
}