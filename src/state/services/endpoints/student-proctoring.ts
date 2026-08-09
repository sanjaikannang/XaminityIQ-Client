import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    JoinLobbyResponse,
    GetLobbyStatusResponse,
    GetLiveKitTokenResponse,
    SendChatResponse,
    GetChatHistoryResponse,
} from "../../../types/proctoring-types";

export const studentProctoringApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        joinLobby: build.mutation<JoinLobbyResponse, string>({
            query: (examId) => ({
                url: api.studentProctoring.joinLobby(examId),
                method: "POST",
            }),
        }),
        getLobbyStatus: build.query<GetLobbyStatusResponse, string>({
            query: (assignmentId) => ({
                url: api.studentProctoring.getLobbyStatus(assignmentId),
                method: "GET",
            }),
        }),
        getStudentLiveKitToken: build.mutation<GetLiveKitTokenResponse, string>({
            query: (attemptId) => ({
                url: api.studentProctoring.getLiveKitToken(attemptId),
                method: "POST",
            }),
        }),
        sendStudentChat: build.mutation<SendChatResponse, { roomId: string; message: string }>({
            query: ({ roomId, message }) => ({
                url: api.studentProctoring.sendChat(roomId),
                method: "POST",
                data: { message },
            }),
        }),
        getStudentChatHistory: build.query<GetChatHistoryResponse, string>({
            query: (roomId) => ({
                url: api.studentProctoring.getChatHistory(roomId),
                method: "GET",
            }),
        }),
    }),
});

export const {
    useJoinLobbyMutation,
    useGetLobbyStatusQuery,
    useGetStudentLiveKitTokenMutation,
    useSendStudentChatMutation,
    useGetStudentChatHistoryQuery,
    useLazyGetStudentChatHistoryQuery,
} = studentProctoringApiService;
