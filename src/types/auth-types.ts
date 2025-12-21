export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: {
            id: string;
            email: string;
            name: string;
            role: string;
            isFirstLogin: boolean;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        }
    };
}