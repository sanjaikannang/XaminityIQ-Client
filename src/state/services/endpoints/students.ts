import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import { GetActivityResponse } from "../../../types/activity-types";
import {
    GetAllStudentsResponse,
    GetStudentResponse,
    GetAllStudentsParams,
    CreateStudentRequest,
    CreateStudentResponse,
    EditStudentRequest,
    EditStudentResponse,
    DeleteStudentResponse,
    BulkUploadStudentsResponse,
} from "../../../types/students-types";

export const studentsApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getAllStudents: build.query<GetAllStudentsResponse, GetAllStudentsParams>({
            query: (params) => ({
                url: api.students.getAllStudents(),
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.search && { search: params.search }),
                    ...(params.batchId && { batchId: params.batchId }),
                    ...(params.courseId && { courseId: params.courseId }),
                    ...(params.departmentId && { departmentId: params.departmentId }),
                    ...(params.sectionId && { sectionId: params.sectionId }),
                    ...(params.status && { status: params.status }),
                    ...(params.sortBy && { sortBy: params.sortBy }),
                    ...(params.sortOrder && { sortOrder: params.sortOrder }),
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
        getStudentActivity: build.query<GetActivityResponse, string>({
            query: (id) => ({
                url: api.students.getStudentActivity(id),
                method: "GET",
            }),
        }),
        bulkUploadStudents: build.mutation<BulkUploadStudentsResponse, { students: CreateStudentRequest[] }>({
            query: (data) => ({
                url: api.students.bulkUploadStudents(),
                method: "POST",
                data,
            }),
            invalidatesTags: ['students'],
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
    useGetStudentActivityQuery,
    useBulkUploadStudentsMutation,
} = studentsApiService;
