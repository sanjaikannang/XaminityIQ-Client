export interface UserActivityRecord {
    action: 'LOGIN' | 'LOGOUT';
    ipAddress?: string;
    userAgent?: string;
    createdAt: string;
}

export interface GetActivityResponse {
    success: boolean;
    message: string;
    data?: UserActivityRecord[];
}
