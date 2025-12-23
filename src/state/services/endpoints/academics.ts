import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import { GetAllBatchesResponse } from "../../../types/academics-types";

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
    }),
});

export const {
    useGetBatchesQuery,
    useLazyGetBatchesQuery,
} = academicsApiService;