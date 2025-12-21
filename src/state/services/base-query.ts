import { type BaseQueryFn } from "@reduxjs/toolkit/query";
import type { AxiosRequestConfig, AxiosError } from "axios";
import { createAxiosInstance } from "./axios-instance";
import { getItemFromStorage } from "../../utils/storage";

export interface AxiosBaseQueryArgs {
    url: string;
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    data?: AxiosRequestConfig["data"];
    params?: AxiosRequestConfig["params"];
    headers?: AxiosRequestConfig["headers"];
}

export interface AxiosBaseQueryError {
    status?: number;
    data: unknown;
}

export interface AxiosBaseQueryFnArgs {
    baseUrl: string;
    prepareHeaders?: (headers: Record<string, string>) => Record<string, string>;
}

export const axiosBaseQuery = (
    { baseUrl, prepareHeaders }: AxiosBaseQueryFnArgs = { baseUrl: "" }
): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> => {
    const axiosInstance = createAxiosInstance(baseUrl);

    return async ({ url, method = "GET", data, params, headers }) => {
        try {
            // Get token from localStorage or your preferred storage
            const token = getItemFromStorage({ key: "accessToken" });

            // Prepare headers with token
            let finalHeaders: Record<string, string> = Object.fromEntries(
                Object.entries(headers || {}).filter(
                    ([_, value]) => typeof value === "string"
                )
            );

            // Add Authorization header if token exists
            if (token) {
                finalHeaders.Authorization = `Bearer ${token}`;
            }

            // Apply prepareHeaders if provided
            if (prepareHeaders) {
                finalHeaders = prepareHeaders(finalHeaders);
            }

            const result = await axiosInstance({
                url,
                method,
                data,
                params,
                headers: finalHeaders,
            });
            return { data: result.data };
        } catch (axiosError) {
            const err = axiosError as AxiosError;
            return {
                error: {
                    status: err.response?.status,
                    data: err.response?.data || err.message,
                },
            };
        }
    };
};
