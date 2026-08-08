import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetAllExamsResponse,
    StartAttemptResponse,
    GetAttemptResponse,
    SaveAnswerRequest,
    SubmitAttemptResponse,
    RecordingSignatureResponse,
    RecordChunkRequest,
    FinalizeRecordingResponse,
} from "../../../types/student-exam-types";
import { RecordingMediaType, SubmissionTrigger } from "../../../utils/enum";

export const studentExamsApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getMyExams: build.query<GetAllExamsResponse, void>({
            query: () => ({
                url: api.studentExams.getAllExams(),
                method: "GET",
            }),
            providesTags: ['student-exams'],
        }),
        startExam: build.mutation<StartAttemptResponse, string>({
            query: (examId) => ({
                url: api.studentExams.startAttempt(examId),
                method: "POST",
            }),
            invalidatesTags: ['student-exams'],
        }),
        getAttempt: build.query<GetAttemptResponse, string>({
            query: (attemptId) => ({
                url: api.studentExams.getAttempt(attemptId),
                method: "GET",
            }),
        }),
        saveAnswer: build.mutation<{ success: boolean; message: string }, { attemptId: string; questionId: string; data: SaveAnswerRequest }>({
            query: ({ attemptId, questionId, data }) => ({
                url: api.studentExams.saveAnswer(attemptId, questionId),
                method: "PATCH",
                data,
            }),
        }),
        submitAttempt: build.mutation<SubmitAttemptResponse, { attemptId: string; trigger: SubmissionTrigger }>({
            query: ({ attemptId, trigger }) => ({
                url: api.studentExams.submitAttempt(attemptId),
                method: "POST",
                data: { trigger },
            }),
            invalidatesTags: ['student-exams'],
        }),
        getRecordingSignature: build.mutation<RecordingSignatureResponse, { attemptId: string; mediaType: RecordingMediaType; sequence: number }>({
            query: ({ attemptId, mediaType, sequence }) => ({
                url: api.studentExams.getRecordingSignature(attemptId),
                method: "POST",
                data: { mediaType, sequence },
            }),
        }),
        recordChunk: build.mutation<{ success: boolean; message: string }, { attemptId: string; data: RecordChunkRequest }>({
            query: ({ attemptId, data }) => ({
                url: api.studentExams.recordChunk(attemptId),
                method: "POST",
                data,
            }),
        }),
        finalizeRecording: build.mutation<FinalizeRecordingResponse, { attemptId: string; mediaType: RecordingMediaType }>({
            query: ({ attemptId, mediaType }) => ({
                url: api.studentExams.finalizeRecording(attemptId),
                method: "POST",
                data: { mediaType },
            }),
        }),
    }),
});

export const {
    useGetMyExamsQuery,
    useStartExamMutation,
    useGetAttemptQuery,
    useSaveAnswerMutation,
    useSubmitAttemptMutation,
    useGetRecordingSignatureMutation,
    useRecordChunkMutation,
    useFinalizeRecordingMutation,
} = studentExamsApiService;
