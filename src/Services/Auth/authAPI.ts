import api from '../../Api/axios';
import {
    LoginRequest,
    LoginResponse,
    RefreshTokenRequest,
    RefreshTokenResponse,
    ChangePasswordRequest,
    ChangePasswordResponse,
} from '../../Types/auth.types'


// Login user
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    return response.data;
}


// Refresh token
export async function refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh-token', data);
    return response.data;
}


// Change password
export async function changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    const response = await api.post<ChangePasswordResponse>('/auth/change-password', data);
    return response.data;
}


// Logout
export async function logout() {
    await api.post('/auth/logout');
}