export enum UserRole {
    ADMIN = "ADMIN",
    FACULTY = "FACULTY",
    STUDENT = "STUDENT",
}


export enum ExamMode {
    AUTO = 'AUTO',
    PROCTORING = 'PROCTORING'
}

export enum ExamStatus {
    UPCOMING = 'UPCOMING',
    ONGOING = 'ONGOING',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED'
}

export enum ParticipantRole {
    FACULTY = 'FACULTY',
    STUDENT = 'STUDENT'
}

export enum ParticipantStatus {
    INVITED = 'INVITED',
    WAITING = 'WAITING',
    JOINED = 'JOINED',
    FINISHED = 'FINISHED',
    REMOVED = 'REMOVED',
    REJECTED = 'REJECTED',
    EXAM_ENDED = 'EXAM_ENDED'
}

export enum JoinRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED'
}

export enum MessageType {
    BROADCAST = 'BROADCAST',
    DIRECT = 'DIRECT'
}

export enum StudentActionType {
    JOINED = 'JOINED',
    FINISHED = 'FINISHED',
    REMOVED = 'REMOVED',
    CAMERA_OFF = 'CAMERA_OFF',
    CAMERA_ON = 'CAMERA_ON',
    MIC_OFF = 'MIC_OFF',
    MIC_ON = 'MIC_ON',
    SCREEN_SHARE_STARTED = 'SCREEN_SHARE_STARTED',
    SCREEN_SHARE_STOPPED = 'SCREEN_SHARE_STOPPED',
    FULLSCREEN_EXITED = 'FULLSCREEN_EXITED'
}
