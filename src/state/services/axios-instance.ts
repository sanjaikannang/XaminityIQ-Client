import type { AxiosInstance, AxiosRequestConfig } from "axios";
import axios from "axios";
import { getItemFromStorage } from "../../utils/storage";

export const createAxiosInstance = (baseUrl: string): AxiosInstance => {
    const instance = axios.create({
        baseURL: baseUrl,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });
    let tokenExpTimeInSeconds = 0;
    const graceTime = 5;
    const publicEndpoints = [
        /^cognitodetails\//,
        /^\d{12}\/users\/set-password$/,
        /^organizations\/onboarding$/,
    ];

    // Add access token to every request
    instance.interceptors.request.use(
        async (config) => {
            try {
                const urlPath = (config.url || "").replace(/^\/+/, "");

                const isPublic = publicEndpoints.some((regex) => regex.test(urlPath));

                if (isPublic) {
                    return config;
                }

                const token = getItemFromStorage({
                    key: "access_token",                    
                });
                if (token) {
                    if (!tokenExpTimeInSeconds) {
                        try {
                            const arrayToken = (token as string).split(".");
                            if (arrayToken.length !== 3) {
                                throw new Error("Invalid JWT format");
                            }
                            const tokenPayload = arrayToken[1];
                            const decodedPayload = JSON.parse(atob(tokenPayload));
                            if (
                                !decodedPayload.exp ||
                                typeof decodedPayload.exp !== "number"
                            ) {
                                throw new Error("Invalid or missing exp claim");
                            }
                            tokenExpTimeInSeconds = decodedPayload.exp;
                        } catch (error) {
                            console.error(error, { toast: true, pushLog: true });
                            window.location.href = "/";
                            return Promise.reject(new Error("Invalid token format"));
                        }
                    }

                    const currentTimeInSeconds = Math.floor(Date.now() / 1000);

                    if (tokenExpTimeInSeconds - currentTimeInSeconds <= graceTime) {
                        // const newTokens = await refreshTokens();
                        // if (newTokens) {
                        //     config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                        //     return config;
                        // }
                    }
                    config.headers.Authorization = `Bearer ${token}`;
                    return config;
                }

                window.location.href = "/";
                return Promise.reject(
                    new Error("No access token found. Redirecting to login.")
                );
            } catch (error) {
                console.log("Request interceptor error:", error);
                return Promise.reject(error);
            }
        },
        (error) => Promise.reject(error)
    );

    // Handle expired token and retry logic
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            try {
                const originalRequest = error.config as AxiosRequestConfig & {
                    _retry?: boolean;
                };

                // If access token expired
                if (error.response?.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;

                    // Try refreshing tokens
                    // const newTokens = await refreshTokens();
                    // if (newTokens && originalRequest.headers) {
                    //     // Set new token and retry the original request
                    //     originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                    //     return instance(originalRequest);
                    // } else {
                    //     window.location.href = "/";
                    // }
                }

                if (error.response?.status === 403) {
                    console.error(
                        "Access forbidden: You do not have permission to access this resource.",
                        { toast: true }
                    );
                }
                return Promise.reject(error);
            } catch (error) {
                console.log("Response interceptor error:", error);
                return Promise.reject(error);
            }
        }
    );

    return instance;
};
