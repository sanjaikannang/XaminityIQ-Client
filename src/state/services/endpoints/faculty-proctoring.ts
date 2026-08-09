import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetMyExamRoomsResponse,
    GetExamRoomDetailResponse,
    AdmitStudentResponse,
    RejectStudentRequest,
    RemoveStudentRequest,
    FacultySendChatRequest,
    SendChatResponse,
    GetChatHistoryResponse,
    GetFacultyLiveKitTokenResponse,
} from "../../../types/proctoring-types";

export const facultyProctoringApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getMyExamRooms: build.query<GetMyExamRoomsResponse, void>({
            query: () => ({
                url: api.facultyProctoring.getMyExamRooms(),
                method: "GET",
            }),
            providesTags: ['faculty-exam-rooms'],
        }),
        getExamRoomDetail: build.query<GetExamRoomDetailResponse, string>({
            query: (roomId) => ({
                url: api.facultyProctoring.getExamRoomDetail(roomId),
                method: "GET",
            }),
            providesTags: ['faculty-exam-room-detail'],
        }),
        admitStudent: build.mutation<AdmitStudentResponse, { roomId: string; assignmentId: string }>({
            query: ({ roomId, assignmentId }) => ({
                url: api.facultyProctoring.admitStudent(roomId, assignmentId),
                method: "POST",
            }),
            invalidatesTags: ['faculty-exam-room-detail', 'faculty-exam-rooms'],
        }),
        rejectStudent: build.mutation<{ success: boolean; message: string }, { roomId: string; assignmentId: string; data: RejectStudentRequest }>({
            query: ({ roomId, assignmentId, data }) => ({
                url: api.facultyProctoring.rejectStudent(roomId, assignmentId),
                method: "POST",
                data,
            }),
            invalidatesTags: ['faculty-exam-room-detail', 'faculty-exam-rooms'],
        }),
        removeStudent: build.mutation<{ success: boolean; message: string }, { roomId: string; assignmentId: string; data: RemoveStudentRequest }>({
            query: ({ roomId, assignmentId, data }) => ({
                url: api.facultyProctoring.removeStudent(roomId, assignmentId),
                method: "POST",
                data,
            }),
            invalidatesTags: ['faculty-exam-room-detail', 'faculty-exam-rooms'],
        }),
        sendFacultyChat: build.mutation<SendChatResponse, { roomId: string; data: FacultySendChatRequest }>({
            query: ({ roomId, data }) => ({
                url: api.facultyProctoring.sendChat(roomId),
                method: "POST",
                data,
            }),
        }),
        getFacultyChatHistory: build.query<GetChatHistoryResponse, string>({
            query: (roomId) => ({
                url: api.facultyProctoring.getChatHistory(roomId),
                method: "GET",
            }),
        }),
        getFacultyLiveKitToken: build.mutation<GetFacultyLiveKitTokenResponse, string>({
            query: (roomId) => ({
                url: api.facultyProctoring.getLiveKitToken(roomId),
                method: "POST",
            }),
        }),
    }),
});

export const {
    useGetMyExamRoomsQuery,
    useGetExamRoomDetailQuery,
    useAdmitStudentMutation,
    useRejectStudentMutation,
    useRemoveStudentMutation,
    useSendFacultyChatMutation,
    useGetFacultyChatHistoryQuery,
    useLazyGetFacultyChatHistoryQuery,
    useGetFacultyLiveKitTokenMutation,
} = facultyProctoringApiService;
