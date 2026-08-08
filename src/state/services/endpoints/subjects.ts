import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    CreateSubjectRequest,
    CreateSubjectResponse,
    EditSubjectRequest,
    EditSubjectResponse,
    DeleteSubjectResponse,
    GetSubjectResponse,
    GetMySubjectsParams,
    GetMySubjectsResponse,
    GetStudentSubjectsResponse,
    GetAllSubjectsAdminParams,
    GetAllSubjectsAdminResponse,
} from "../../../types/subjects-types";

export const subjectsApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        // Faculty (HOD)
        createSubject: build.mutation<CreateSubjectResponse, CreateSubjectRequest>({
            query: (data) => ({
                url: api.subjects.createSubject(),
                method: "POST",
                data,
            }),
            invalidatesTags: ['subjects'],
        }),
        getMySubjects: build.query<GetMySubjectsResponse, GetMySubjectsParams>({
            query: (params) => ({
                url: api.subjects.getMySubjects(),
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.semester && { semester: params.semester }),
                    ...(params.sortBy && { sortBy: params.sortBy }),
                    ...(params.sortOrder && { sortOrder: params.sortOrder }),
                },
            }),
            providesTags: ['subjects'],
        }),
        getSubject: build.query<GetSubjectResponse, string>({
            query: (id) => ({
                url: api.subjects.getSubject(id),
                method: "GET",
            }),
        }),
        updateSubject: build.mutation<EditSubjectResponse, { id: string; data: EditSubjectRequest }>({
            query: ({ id, data }) => ({
                url: api.subjects.updateSubject(id),
                method: "PATCH",
                data,
            }),
            invalidatesTags: ['subjects'],
        }),
        deleteSubject: build.mutation<DeleteSubjectResponse, string>({
            query: (id) => ({
                url: api.subjects.deleteSubject(id),
                method: "DELETE",
            }),
            invalidatesTags: ['subjects'],
        }),

        // Student
        getStudentSubjects: build.query<GetStudentSubjectsResponse, void>({
            query: () => ({
                url: api.subjects.getStudentSubjects(),
                method: "GET",
            }),
            providesTags: ['subjects'],
        }),

        // Admin
        getAllSubjectsAdmin: build.query<GetAllSubjectsAdminResponse, GetAllSubjectsAdminParams>({
            query: (params) => ({
                url: api.subjects.getAllSubjectsAdmin(),
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.departmentId && { departmentId: params.departmentId }),
                    ...(params.semester && { semester: params.semester }),
                    ...(params.sortBy && { sortBy: params.sortBy }),
                    ...(params.sortOrder && { sortOrder: params.sortOrder }),
                },
            }),
            providesTags: ['subjects'],
        }),
    }),
});

export const {
    useCreateSubjectMutation,
    useGetMySubjectsQuery,
    useGetSubjectQuery,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
    useGetStudentSubjectsQuery,
    useGetAllSubjectsAdminQuery,
} = subjectsApiService;
