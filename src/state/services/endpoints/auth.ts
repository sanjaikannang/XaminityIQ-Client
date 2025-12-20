import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from "../../../types/auth.types";

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
        refreshToken: build.mutation<RefreshTokenResponse, RefreshTokenRequest>({
            query: (credentials) => {
                return {
                    url: api.auth.refreshToken(),
                    method: "POST",
                    data: credentials,
                };
            },
        }),
    }),
});

export const {
    useLoginMutation,
    useRefreshTokenMutation
} = authApiService;
