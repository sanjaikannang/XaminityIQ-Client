import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import { GetAllBatchesResponse, GetAllCoursesForBatchResponse } from "../../../types/academics-types";

export const academicsApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getBatches: build.query<GetAllBatchesResponse, {
            page?: number;
            limit?: number;
            search?: string;
        }>({
            query: (params) => ({
                url: api.academics.getBatches(),
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.search && { search: params.search }),
                },
            }),
        }),
        getCourses: build.query<GetAllCoursesForBatchResponse, {
            batchId: string;
            page?: number;
            limit?: number;
            search?: string;
        }>({
            query: ({ batchId, ...params }) => ({
                url: api.academics.getCourses(batchId),
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.search && { search: params.search }),
                },
            }),
        }),
    }),
});

export const {
    useGetBatchesQuery,
    useLazyGetBatchesQuery,
    useGetCoursesQuery,
    useLazyGetCoursesQuery,
} = academicsApiService;