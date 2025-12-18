import { api } from "../../../api";
import { apiInstance } from "../api-instance";

interface UserResponse {

}

interface LoginRequest {

}

export const authApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        login: build.mutation<UserResponse, LoginRequest>({
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
