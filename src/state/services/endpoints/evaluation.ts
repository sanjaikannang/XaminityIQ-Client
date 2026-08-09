import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetMyEvaluationExamsResponse,
    GetExamAnswersForEvaluationResponse,
    EvaluateAnswerRequest,
    EvaluateAnswerResponse,
} from "../../../types/evaluation-types";

export const evaluationApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getMyEvaluationExams: build.query<GetMyEvaluationExamsResponse, void>({
            query: () => ({
                url: api.evaluation.getMyEvaluationExams(),
                method: "GET",
            }),
            providesTags: ['evaluation-exams'],
        }),
        getExamAnswersForEvaluation: build.query<GetExamAnswersForEvaluationResponse, string>({
            query: (examId) => ({
                url: api.evaluation.getExamAnswersForEvaluation(examId),
                method: "GET",
            }),
            providesTags: ['evaluation-answers'],
        }),
        evaluateAnswer: build.mutation<EvaluateAnswerResponse, { answerId: string; data: EvaluateAnswerRequest }>({
            query: ({ answerId, data }) => ({
                url: api.evaluation.evaluateAnswer(answerId),
                method: "PATCH",
                data,
            }),
            invalidatesTags: ['evaluation-answers'],
        }),
    }),
});

export const {
    useGetMyEvaluationExamsQuery,
    useGetExamAnswersForEvaluationQuery,
    useEvaluateAnswerMutation,
} = evaluationApiService;
