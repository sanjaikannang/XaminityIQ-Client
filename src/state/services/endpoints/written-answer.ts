import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GenerateWrittenQrResponse,
    GetWrittenQrStatusResponse,
    FinalizeWrittenAnswerResponse,
    DeleteWrittenAnswerPageResponse,
} from "../../../types/written-answer-types";

export const writtenAnswerApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        generateWrittenQr: build.mutation<GenerateWrittenQrResponse, { attemptId: string; questionId: string }>({
            query: ({ attemptId, questionId }) => ({
                url: api.writtenAnswer.generateQr(attemptId, questionId),
                method: "POST",
            }),
        }),
        getWrittenQrStatus: build.query<GetWrittenQrStatusResponse, { attemptId: string; questionId: string }>({
            query: ({ attemptId, questionId }) => ({
                url: api.writtenAnswer.getQrStatus(attemptId, questionId),
                method: "GET",
            }),
        }),
        finalizeWrittenAnswer: build.mutation<FinalizeWrittenAnswerResponse, { attemptId: string; questionId: string }>({
            query: ({ attemptId, questionId }) => ({
                url: api.writtenAnswer.finalize(attemptId, questionId),
                method: "POST",
            }),
        }),
        deleteWrittenAnswerPage: build.mutation<DeleteWrittenAnswerPageResponse, { attemptId: string; questionId: string; pageNumber: number }>({
            query: ({ attemptId, questionId, pageNumber }) => ({
                url: api.writtenAnswer.deletePage(attemptId, questionId, pageNumber),
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGenerateWrittenQrMutation,
    useGetWrittenQrStatusQuery,
    useFinalizeWrittenAnswerMutation,
    useDeleteWrittenAnswerPageMutation,
} = writtenAnswerApiService;
