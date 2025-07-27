import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    AuthState,
    User
} from '../../Types/auth.types';
import { tokenManager } from '../../Api/axios';

const initialState: AuthState = {
    user: tokenManager.getUser(),
    isAuthenticated: !!tokenManager.getAccessToken(),
    isLoading: false,
    error: null,
    isFirstLogin: false,
};

interface LoginSuccessPayload {
    user: User;
    isFirstLogin: boolean;
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        loginSuccess: (state, action: PayloadAction<LoginSuccessPayload>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload.user;
            state.isFirstLogin = action.payload.isFirstLogin;
            state.error = null;
        },
        loginFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
            state.isFirstLogin = false;
        },
        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            state.isFirstLogin = false;
            state.error = null;
            state.isLoading = false;
            // Clear tokens from storage
            tokenManager.clearTokens();
        },
        clearError: (state) => {
            state.error = null;
        },
        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = { ...state.user, ...action.payload };
                tokenManager.setUser(state.user);
            }
        },
        setFirstLoginComplete: (state) => {
            state.isFirstLogin = false;
            if (state.user) {
                state.user.isFirstLogin = false;
                tokenManager.setUser(state.user);
            }
        },
    }
});

export const {
    loginStart,
    loginSuccess,
    loginFailure,
    logout,
    clearError,
    updateUser,
    setFirstLoginComplete
} = authSlice.actions;

export default authSlice.reducer;