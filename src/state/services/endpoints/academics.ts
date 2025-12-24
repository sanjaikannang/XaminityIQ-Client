import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetAllBatchesResponse,
    GetAllCoursesForBatchResponse,
    GetAllDepartmentForBatchCourseResponse,
    BasePaginationParams,
    GetCoursesParams,
    GetDepartmentsParams,
    CreateBatchRequest,
    CreateBatchResponse,
} from "../../../types/academics-types";

export const academicsApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getBatches: build.query<GetAllBatchesResponse, BasePaginationParams>({
            query: (params) => ({
                url: api.academics.getBatches(),
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.search && { search: params.search }),
                },
            }),
            providesTags: ['batches'],
        }),
        createBatch: build.mutation<CreateBatchResponse, CreateBatchRequest>({
            query: (data) => ({
                url: api.academics.createBatch(),
                method: "POST",
                data,
            }),
            invalidatesTags: ['batches'],
        }),
        getCourses: build.query<GetAllCoursesForBatchResponse, GetCoursesParams>({
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
        getDepartments: build.query<GetAllDepartmentForBatchCourseResponse, GetDepartmentsParams>({
            query: ({ batchCourseId, ...params }) => ({
                url: api.academics.getDepartments(batchCourseId),
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
    useCreateBatchMutation,
    useGetCoursesQuery,
    useLazyGetCoursesQuery,
    useGetDepartmentsQuery,
    useLazyGetDepartmentsQuery,
} = academicsApiService;