import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetAllFacultyResponse,
    GetFacultyResponse,
    BasePaginationParams,
} from "../../../types/faculty-types";

export const facultyApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getAllFaculty: build.query<GetAllFacultyResponse, BasePaginationParams>({
            query: (params) => ({
                url: api.faculty.getAllFaculty(),
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.search && { search: params.search }),
                },
            }),
            providesTags: ['faculty'],
        }),
        getFacultyById: build.query<GetFacultyResponse, string>({
            query: (id) => ({
                url: api.faculty.getFacultyById(id),
                method: "GET",
            }),
            providesTags: ['faculty-detail'],
        }),
    }),
});

export const {
    useGetAllFacultyQuery,
    useLazyGetAllFacultyQuery,
    useGetFacultyByIdQuery,
    useLazyGetFacultyByIdQuery,
} = facultyApiService;