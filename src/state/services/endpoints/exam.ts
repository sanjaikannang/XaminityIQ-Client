import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetFacultyExamsResponse,
    GetStudentExamsResponse,
    JoinExamRequest,
    JoinFacultyExamResponse,
    JoinStudentExamResponse,
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

        joinFacultyExam: build.mutation<JoinFacultyExamResponse, JoinExamRequest>({
            query: (data) => ({
                url: api.exam.joinFacultyExam,
                method: "POST",
                data,
            }),
        }),

        joinStudentExam: build.mutation<JoinStudentExamResponse, JoinExamRequest>({
            query: (data) => ({
                url: api.exam.joinStudentExam,
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
    useJoinStudentExamMutation,
} = examApiService;
