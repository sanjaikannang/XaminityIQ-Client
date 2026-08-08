import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    CreateExamRequest,
    CreateExamResponse,
    EditExamRequest,
    EditExamResponse,
    DeleteExamResponse,
    PublishExamResponse,
    GetExamResponse,
    GetAllExamsParams,
    GetAllExamsResponse,
    AddQuestionRequest,
    AddQuestionResponse,
    EditQuestionRequest,
    EditQuestionResponse,
    DeleteQuestionResponse,
} from "../../../types/exams-types";

export const examsApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        createExam: build.mutation<CreateExamResponse, CreateExamRequest>({
            query: (data) => ({
                url: api.exams.createExam(),
                method: "POST",
                data,
            }),
            invalidatesTags: ['exams'],
        }),
        getAllExams: build.query<GetAllExamsResponse, GetAllExamsParams>({
            query: (params) => ({
                url: api.exams.getAllExams(),
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.search && { search: params.search }),
                    ...(params.mode && { mode: params.mode }),
                    ...(params.status && { status: params.status }),
                    ...(params.batchId && { batchId: params.batchId }),
                    ...(params.courseId && { courseId: params.courseId }),
                    ...(params.departmentId && { departmentId: params.departmentId }),
                    ...(params.sortBy && { sortBy: params.sortBy, sortOrder: params.sortOrder || 'asc' }),
                },
            }),
            providesTags: ['exams'],
        }),
        getExam: build.query<GetExamResponse, string>({
            query: (id) => ({
                url: api.exams.getExam(id),
                method: "GET",
            }),
            providesTags: ['exam-detail'],
        }),
        updateExam: build.mutation<EditExamResponse, { id: string; data: EditExamRequest }>({
            query: ({ id, data }) => ({
                url: api.exams.updateExam(id),
                method: "PATCH",
                data,
            }),
            invalidatesTags: ['exams', 'exam-detail'],
        }),
        deleteExam: build.mutation<DeleteExamResponse, string>({
            query: (id) => ({
                url: api.exams.deleteExam(id),
                method: "DELETE",
            }),
            invalidatesTags: ['exams', 'exam-detail'],
        }),
        publishExam: build.mutation<PublishExamResponse, string>({
            query: (id) => ({
                url: api.exams.publishExam(id),
                method: "PATCH",
            }),
            invalidatesTags: ['exams', 'exam-detail'],
        }),
        addQuestion: build.mutation<AddQuestionResponse, { examId: string; data: AddQuestionRequest }>({
            query: ({ examId, data }) => ({
                url: api.exams.addQuestion(examId),
                method: "POST",
                data,
            }),
            invalidatesTags: ['exam-detail'],
        }),
        updateQuestion: build.mutation<EditQuestionResponse, { examId: string; questionId: string; data: EditQuestionRequest }>({
            query: ({ examId, questionId, data }) => ({
                url: api.exams.updateQuestion(examId, questionId),
                method: "PATCH",
                data,
            }),
            invalidatesTags: ['exam-detail'],
        }),
        deleteQuestion: build.mutation<DeleteQuestionResponse, { examId: string; questionId: string }>({
            query: ({ examId, questionId }) => ({
                url: api.exams.deleteQuestion(examId, questionId),
                method: "DELETE",
            }),
            invalidatesTags: ['exam-detail'],
        }),
    }),
});

export const {
    useCreateExamMutation,
    useGetAllExamsQuery,
    useGetExamQuery,
    useUpdateExamMutation,
    useDeleteExamMutation,
    usePublishExamMutation,
    useAddQuestionMutation,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
} = examsApiService;
