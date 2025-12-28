import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetAllStudentsResponse,
    GetStudentResponse,
    BasePaginationParams,
} from "../../../types/students-types";

export const studentsApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getAllStudents: build.query<GetAllStudentsResponse, BasePaginationParams>({
            query: (params) => ({
                url: api.students.getAllStudents(),
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.search && { search: params.search }),
                },
            }),
            providesTags: ['students'],
        }),
        getStudentById: build.query<GetStudentResponse, string>({
            query: (id) => ({
                url: api.students.getStudentById(id),
                method: "GET",
            }),
            providesTags: ['student'],
        }),
    }),
});

export const {
    useGetAllStudentsQuery,
    useLazyGetAllStudentsQuery,
    useGetStudentByIdQuery,
    useLazyGetStudentByIdQuery,
} = studentsApiService;