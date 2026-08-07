import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    LoginRequest,
    LoginResponse,
    LogoutResponse,
    ForgotPasswordRequest,
    ForgotPasswordResponse,
    ResetPasswordRequest,
    ResetPasswordResponse,
} from "../../../types/auth-types";

export const authApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<LoginResponse, LoginRequest>({
            query: (credentials) => {
                return {
                    url: api.auth.login(),
                    method: "POST",
                    data: credentials,
                };
            },
        }),
        logout: build.mutation<LogoutResponse, void>({
            query: () => {
                return {
                    url: api.auth.logout(),
                    method: "POST",
                };
            },
        }),
        forgotPassword: build.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
            query: (data) => {
                return {
                    url: api.auth.forgotPassword(),
                    method: "POST",
                    data,
                };
            },
        }),
        resetPassword: build.mutation<ResetPasswordResponse, ResetPasswordRequest>({
            query: (data) => {
                return {
                    url: api.auth.resetPassword(),
                    method: "POST",
                    data,
                };
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useLogoutMutation,
    useForgotPasswordMutation,
    useResetPasswordMutation,
} = authApiService;
