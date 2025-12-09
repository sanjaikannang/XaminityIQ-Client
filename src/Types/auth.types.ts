import { UserRole } from "../Utils/enum";

export interface User {
    id: string;
    email: string;
    role: UserRole;
    isFirstLogin: boolean;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: User;
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    };
}

export interface RefreshTokenRequest {
    refreshToken: string;    
}

export interface RefreshTokenResponse {
    success: boolean;
    message: string;
    data: {
        accessToken: string;
        refreshToken: string;
    };
}

export interface ChangePasswordRequest {
    email: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    isFirstLogin: boolean;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: any;
}