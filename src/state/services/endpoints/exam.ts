import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetFacultyExamsResponse,
    GetStudentExamsResponse,
    JoinExamRequest,
    JoinExamResponse,
} from "../../../types/exam-types";

export const examApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
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

        joinExam: build.mutation<JoinExamResponse, JoinExamRequest & { role: string }>({
            query: ({ examId, role }) => ({
                url: api.exam.joinExam(role),
                method: "POST",
                body: { examId },
            }),
        }),
    }),
});

export const {
    useGetFacultyExamsQuery,
    useGetStudentExamsQuery,
    useJoinExamMutation,
} = examApiService;