import axios from "axios";
import type { AxiosInstance, AxiosRequestConfig } from "axios";
import { getItemFromStorage, setItemInStorage, removeItemFromStorage } from "../../utils/storage";

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
    let isRefreshing = false;
    let failedQueue: Array<{
        resolve: (token: string) => void;
        reject: (error: Error) => void;
    }> = [];

    // URLs that don't require authentication
    const publicEndpoints = [
        '/auth/login',
        '/auth/refresh-token',
        '/auth/reset-password'
    ];

    const isPublicEndpoint = (url: string): boolean => {
        return publicEndpoints.some(endpoint => url.includes(endpoint));
    };

    // Process queued requests after token refresh
    const processQueue = (error: Error | null, token: string | null = null) => {
        failedQueue.forEach(promise => {
            if (error) {
                promise.reject(error);
            } else if (token) {
                promise.resolve(token);
            }
        });
        failedQueue = [];
    };

    // Refresh token function
    const refreshTokens = async (): Promise<{ accessToken: string; refreshToken: string } | null> => {
        try {
            const refreshToken = getItemFromStorage({ key: "refreshToken" });

            if (!refreshToken) {
                throw new Error("No refresh token available");
            }

            // Call refresh token API
            const response = await axios.post(`${baseUrl}/auth/refresh-token`, {
                refreshToken
            });

            const { accessToken, refreshToken: newRefreshToken } = response.data.data;

            // Save new tokens
            setItemInStorage({ key: "accessToken", value: accessToken });
            setItemInStorage({ key: "refreshToken", value: newRefreshToken });

            // Reset token expiry time to recalculate
            tokenExpTimeInSeconds = 0;

            return { accessToken, refreshToken: newRefreshToken };
        } catch (error) {
            console.error("Token refresh failed:", error);

            // Clear all auth data and redirect to login
            removeItemFromStorage({ key: "accessToken" });
            removeItemFromStorage({ key: "refreshToken" });
            removeItemFromStorage({ key: "user" });
            removeItemFromStorage({ key: "userRole" });

            window.location.href = "/login";
            return null;
        }
    };

    // Add access token to every request
    instance.interceptors.request.use(
        async (config) => {
            try {
                // Skip token check for public endpoints
                if (config.url && isPublicEndpoint(config.url)) {
                    return config;
                }

                const token = getItemFromStorage({ key: "accessToken" });

                if (!token) {
                    window.location.href = "/login";
                    return Promise.reject(new Error("No access token found"));
                }

                // Decode token and check expiry
                if (!tokenExpTimeInSeconds) {
                    try {
                        const arrayToken = (token as string).split(".");
                        if (arrayToken.length !== 3) {
                            throw new Error("Invalid JWT format");
                        }
                        const tokenPayload = arrayToken[1];
                        const decodedPayload = JSON.parse(atob(tokenPayload));
                        if (!decodedPayload.exp || typeof decodedPayload.exp !== "number") {
                            throw new Error("Invalid or missing exp claim");
                        }
                        tokenExpTimeInSeconds = decodedPayload.exp;
                    } catch (error) {
                        console.error("Token decode error:", error);
                        window.location.href = "/login";
                        return Promise.reject(new Error("Invalid token format"));
                    }
                }

                const currentTimeInSeconds = Math.floor(Date.now() / 1000);

                // Token is about to expire or already expired
                if (tokenExpTimeInSeconds - currentTimeInSeconds <= graceTime) {
                    if (!isRefreshing) {
                        isRefreshing = true;

                        try {
                            const newTokens = await refreshTokens();
                            isRefreshing = false;

                            if (newTokens) {
                                processQueue(null, newTokens.accessToken);
                                config.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                                return config;
                            } else {
                                processQueue(new Error("Token refresh failed"), null);
                                return Promise.reject(new Error("Token refresh failed"));
                            }
                        } catch (error) {
                            isRefreshing = false;
                            processQueue(error as Error, null);
                            return Promise.reject(error);
                        }
                    } else {
                        // Token is being refreshed, queue this request
                        return new Promise((resolve, reject) => {
                            failedQueue.push({
                                resolve: (newToken: string) => {
                                    config.headers.Authorization = `Bearer ${newToken}`;
                                    resolve(config);
                                },
                                reject: (error: Error) => {
                                    reject(error);
                                }
                            });
                        });
                    }
                }

                // Token is still valid
                config.headers.Authorization = `Bearer ${token}`;
                return config;
            } catch (error) {
                console.error("Request interceptor error:", error);
                return Promise.reject(error);
            }
        },
        (error) => Promise.reject(error)
    );

    // Handle expired token and retry logic
    instance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config as AxiosRequestConfig & {
                _retry?: boolean;
            };

            // If access token expired (401) and we haven't retried yet
            if (error.response?.status === 401 && !originalRequest._retry) {
                // Skip retry for public endpoints
                if (originalRequest.url && isPublicEndpoint(originalRequest.url)) {
                    return Promise.reject(error);
                }

                originalRequest._retry = true;

                if (!isRefreshing) {
                    isRefreshing = true;

                    try {
                        const newTokens = await refreshTokens();
                        isRefreshing = false;

                        if (newTokens && originalRequest.headers) {
                            processQueue(null, newTokens.accessToken);

                            // Retry original request with new token
                            originalRequest.headers.Authorization = `Bearer ${newTokens.accessToken}`;
                            return instance(originalRequest);
                        } else {
                            processQueue(new Error("Token refresh failed"), null);
                            return Promise.reject(error);
                        }
                    } catch (refreshError) {
                        isRefreshing = false;
                        processQueue(refreshError as Error, null);
                        return Promise.reject(refreshError);
                    }
                } else {
                    // Token is being refreshed, queue this request
                    return new Promise((resolve, reject) => {
                        failedQueue.push({
                            resolve: (newToken: string) => {
                                if (originalRequest.headers) {
                                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                                }
                                resolve(instance(originalRequest));
                            },
                            reject: (err: Error) => {
                                reject(err);
                            }
                        });
                    });
                }
            }

            // Handle 403 Forbidden
            if (error.response?.status === 403) {
                console.error("Access forbidden: You do not have permission to access this resource.");
                window.location.href = "/unauthorized";
            }

            return Promise.reject(error);
        }
    );

    return instance;
};