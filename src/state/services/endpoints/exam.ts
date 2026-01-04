import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetFacultyExamsResponse,
    GetStudentExamsResponse,
    JoinExamRequest,
    JoinFacultyExamResponse,    
    GetExamDetailsResponse,
    RequestJoinExamResponse,
    CheckJoinRequestStatusResponse,
    JoinExamRoomRequest,
    JoinExamRoomResponse,
    GetPendingJoinRequestsResponse,
    ApproveRejectRequest,
    RemoveStudentRequest,
} from "../../../types/exam-types";

export const examApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        // Existing endpoints
        getFacultyExams: build.query<GetFacultyExamsResponse, void>({
            query: () => ({
                url: api.exam.getFacultyExams,
                method: "GET",
            }),
            providesTags: ["FacultyExams"],
        }),

        getStudentExams: build.query<GetStudentExamsResponse, void>({
            query: () => ({
                url: api.exam.getStudentExams,
                method: "GET",
            }),
            providesTags: ["StudentExams"],
        }),

        joinFacultyExam: build.mutation<JoinFacultyExamResponse, JoinExamRequest>({
            query: (data) => ({
                url: api.exam.joinFacultyExam,
                method: "POST",
                data,
            }),
        }),

        // New student endpoints
        getExamDetails: build.query<GetExamDetailsResponse, string>({
            query: (examId) => ({
                url: api.exam.getExamDetails.replace(':examId', examId),
                method: "GET",
            }),
        }),

        requestJoinExam: build.mutation<RequestJoinExamResponse, string>({
            query: (examId) => ({
                url: api.exam.requestJoinExam.replace(':examId', examId),
                method: "POST",
            }),
        }),

        checkJoinRequestStatus: build.query<CheckJoinRequestStatusResponse, string>({
            query: (requestId) => ({
                url: api.exam.checkJoinRequestStatus.replace(':requestId', requestId),
                method: "GET",
            }),
        }),

        joinExamRoom: build.mutation<JoinExamRoomResponse, JoinExamRoomRequest>({
            query: (data) => ({
                url: api.exam.joinExamRoom.replace(':requestId', data.requestId),
                method: "POST",
            }),
        }),

        updateStudentLeftStatus: build.mutation<any, string>({
            query: (examId) => ({
                url: api.exam.updateStudentLeftStatus.replace(':examId', examId),
                method: "POST",
            }),
        }),

        // New faculty endpoints
        getPendingJoinRequests: build.query<GetPendingJoinRequestsResponse, string>({
            query: (examId) => ({
                url: api.exam.getPendingJoinRequests.replace(':examId', examId),
                method: "GET",
            }),
            providesTags: ["JoinRequests"],
        }),

        approveJoinRequest: build.mutation<any, ApproveRejectRequest>({
            query: (data) => ({
                url: api.exam.approveJoinRequest.replace(':requestId', data.requestId),
                method: "POST",
            }),
            invalidatesTags: ["JoinRequests"],
        }),

        rejectJoinRequest: build.mutation<any, ApproveRejectRequest>({
            query: (data) => ({
                url: api.exam.rejectJoinRequest.replace(':requestId', data.requestId),
                method: "POST",
                data: { reason: data.reason },
            }),
            invalidatesTags: ["JoinRequests"],
        }),

        removeStudent: build.mutation<any, { examId: string } & RemoveStudentRequest>({
            query: ({ examId, ...data }) => ({
                url: api.exam.removeStudent.replace(':examId', examId),
                method: "POST",
                data,
            }),
        }),
    }),
});

export const {
    useGetFacultyExamsQuery,
    useGetStudentExamsQuery,
    useJoinFacultyExamMutation,
    useGetExamDetailsQuery,
    useRequestJoinExamMutation,
    useCheckJoinRequestStatusQuery,
    useJoinExamRoomMutation,
    useUpdateStudentLeftStatusMutation,
    useGetPendingJoinRequestsQuery,
    useApproveJoinRequestMutation,
    useRejectJoinRequestMutation,
    useRemoveStudentMutation,
} = examApiService;