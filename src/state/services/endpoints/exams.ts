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
    AssignEvaluatorsRequest,
    AssignEvaluatorsResponse,
    GetEvaluationProgressResponse,
    PublishResultsResponse,
    GetExamAttemptsResponse,
} from "../../../types/exams-types";
import { FormExamRoomsResponse, GetExamRoomsResponse } from "../../../types/proctoring-types";

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
        formExamRooms: build.mutation<FormExamRoomsResponse, string>({
            query: (examId) => ({
                url: api.exams.formExamRooms(examId),
                method: "POST",
            }),
            invalidatesTags: ['exam-rooms'],
        }),
        getExamRooms: build.query<GetExamRoomsResponse, string>({
            query: (examId) => ({
                url: api.exams.getExamRooms(examId),
                method: "GET",
            }),
            providesTags: ['exam-rooms'],
        }),
        assignEvaluators: build.mutation<AssignEvaluatorsResponse, { examId: string; data: AssignEvaluatorsRequest }>({
            query: ({ examId, data }) => ({
                url: api.exams.assignEvaluators(examId),
                method: "PATCH",
                data,
            }),
            invalidatesTags: ['exam-detail'],
        }),
        getEvaluationProgress: build.query<GetEvaluationProgressResponse, string>({
            query: (examId) => ({
                url: api.exams.getEvaluationProgress(examId),
                method: "GET",
            }),
            providesTags: ['evaluation-progress'],
        }),
        publishResults: build.mutation<PublishResultsResponse, string>({
            query: (examId) => ({
                url: api.exams.publishResults(examId),
                method: "POST",
            }),
            invalidatesTags: ['exams', 'exam-detail', 'evaluation-progress'],
        }),
        getExamAttempts: build.query<GetExamAttemptsResponse, string>({
            query: (examId) => ({
                url: api.exams.getExamAttempts(examId),
                method: "GET",
            }),
            providesTags: ['exam-attempts'],
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
    useFormExamRoomsMutation,
    useGetExamRoomsQuery,
    useAssignEvaluatorsMutation,
    useGetEvaluationProgressQuery,
    usePublishResultsMutation,
    useGetExamAttemptsQuery,
} = examsApiService;
