import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import { LoginRequest, LoginResponse } from "../../../types/auth-types";

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
    }),
});

export const {
    useLoginMutation,    
} = authApiService;
