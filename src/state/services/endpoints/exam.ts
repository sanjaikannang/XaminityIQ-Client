import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import type {
    GetFacultyExamsResponse,
    FacultyJoinExamResponse,
    GetJoinRequestsResponse,
    GetMessagesResponse,
    StudentJoinRequestRequest,
    StudentJoinRequestResponse,
    CheckJoinStatusResponse,
    GetStudentExamsResponse,
} from "../../../types/exam-types";

export const examApiService = apiInstance.injectEndpoints({
    endpoints: (builder) => ({

        // ---------- FACULTY ----------
        getFacultyExams: builder.query<
            GetFacultyExamsResponse,
            { status?: string }
        >({
            query: ({ status }) => ({
                url: api.exam.getFacultyExams(),
                params: status ? { status } : {},
            }),
            providesTags: ["exam"],
        }),

        facultyJoinExam: builder.mutation<
            FacultyJoinExamResponse,
            { examId: string; facultyId: string }
        >({
            query: ({ examId, facultyId }) => ({
                url: api.exam.facultyJoinExam(examId),
                method: "POST",
                data: { facultyId },
            }),
        }),

        getPendingJoinRequests: builder.query<
            GetJoinRequestsResponse,
            string
        >({
            query: (examId) => ({
                url: api.exam.getPendingJoinRequests(examId),
            }),
            providesTags: ["JoinRequest"],
        }),

        approveJoinRequest: builder.mutation<
            { success: boolean },
            { examId: string; requestId: string }
        >({
            query: ({ examId, requestId }) => ({
                url: api.exam.approveJoinRequest(examId),
                method: "POST",
                data: { requestId },
            }),
            invalidatesTags: ["JoinRequest"],
        }),

        rejectJoinRequest: builder.mutation<
            { success: boolean },
            { examId: string; requestId: string; reason: string }
        >({
            query: ({ examId, requestId, reason }) => ({
                url: api.exam.rejectJoinRequest(examId),
                method: "POST",
                data: { requestId, reason },
            }),
            invalidatesTags: ["JoinRequest"],
        }),

        sendMessage: builder.mutation<
            { success: boolean },
            {
                examId: string;
                senderId: string;
                message: string;
                type: string;
                recipientId?: string;
            }
        >({
            query: ({ examId, ...data }) => ({
                url: api.exam.facultyMessages(examId),
                method: "POST",
                data,
            }),
        }),

        getChatHistory: builder.query<
            GetMessagesResponse,
            { examId: string; recipientId?: string }
        >({
            query: ({ examId, recipientId }) => ({
                url: api.exam.facultyMessages(examId),
                params: recipientId ? { recipientId } : {},
            }),
        }),

        removeStudent: builder.mutation<
            { success: boolean },
            { examId: string; studentId: string; reason: string }
        >({
            query: ({ examId, ...data }) => ({
                url: api.exam.removeStudent(examId),
                method: "POST",
                data,
            }),
        }),

        endExam: builder.mutation<{ success: boolean }, string>({
            query: (examId) => ({
                url: api.exam.endExam(examId),
                method: "POST",
            }),
            invalidatesTags: ["exam"],
        }),

        // ---------- STUDENT ----------
        getStudentExams: builder.query<
            GetStudentExamsResponse,
            { status?: string }
        >({
            query: ({ status }) => ({
                url: api.exam.getStudentExams(),
                params: status ? { status } : {},
            }),
            providesTags: ["exam"],
        }),

        studentJoinRequest: builder.mutation<
            StudentJoinRequestResponse,
            { examId: string } & StudentJoinRequestRequest
        >({
            query: ({ examId, ...data }) => ({
                url: api.exam.studentJoinRequest(examId),
                method: "POST",
                data,
            }),
        }),

        checkJoinStatus: builder.query<
            CheckJoinStatusResponse,
            { examId: string; requestId: string }
        >({
            query: ({ examId, requestId }) => ({
                url: api.exam.checkJoinStatus(examId),
                params: { requestId },
            }),
        }),

        getStudentMessages: builder.query<
            GetMessagesResponse,
            { examId: string; studentId: string }
        >({
            query: ({ examId, studentId }) => ({
                url: api.exam.studentMessages(examId),
                params: { studentId },
            }),
        }),

        finishExam: builder.mutation<
            { success: boolean },
            { examId: string; studentId: string }
        >({
            query: ({ examId, studentId }) => ({
                url: api.exam.finishExam(examId),
                method: "POST",
                data: { studentId },
            }),
            invalidatesTags: ["exam"],
        }),
    }),
});

export const {
    useGetFacultyExamsQuery,
    useFacultyJoinExamMutation,
    useGetPendingJoinRequestsQuery,
    useApproveJoinRequestMutation,
    useRejectJoinRequestMutation,
    useSendMessageMutation,
    useGetChatHistoryQuery,
    useRemoveStudentMutation,
    useEndExamMutation,
    useGetStudentExamsQuery,
    useStudentJoinRequestMutation,
    useCheckJoinStatusQuery,
    useGetStudentMessagesQuery,
    useFinishExamMutation,
} = examApiService;
