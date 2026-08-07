import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetAllStudentsResponse,
    GetStudentResponse,
    BasePaginationParams,
    CreateStudentRequest,
    CreateStudentResponse,
    EditStudentRequest,
    EditStudentResponse,
    DeleteStudentResponse,
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
        createStudent: build.mutation<CreateStudentResponse, CreateStudentRequest>({
            query: (data) => ({
                url: api.students.createStudent(),
                method: "POST",
                data,
            }),
            invalidatesTags: ['students'],
        }),
        updateStudent: build.mutation<EditStudentResponse, { id: string; data: EditStudentRequest }>({
            query: ({ id, data }) => ({
                url: api.students.updateStudent(id),
                method: "PATCH",
                data,
            }),
            invalidatesTags: ['students', 'student'],
        }),
        deleteStudent: build.mutation<DeleteStudentResponse, string>({
            query: (id) => ({
                url: api.students.deleteStudent(id),
                method: "DELETE",
            }),
            invalidatesTags: ['students', 'student'],
        }),
    }),
});

export const {
    useGetAllStudentsQuery,
    useLazyGetAllStudentsQuery,
    useGetStudentByIdQuery,
    useLazyGetStudentByIdQuery,
    useCreateStudentMutation,
    useUpdateStudentMutation,
    useDeleteStudentMutation,
} = studentsApiService;
