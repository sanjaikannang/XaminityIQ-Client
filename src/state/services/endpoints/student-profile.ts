import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import { GetMyStudentProfileResponse } from "../../../types/students-types";

export const studentProfileApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getMyStudentProfile: build.query<GetMyStudentProfileResponse, void>({
            query: () => ({
                url: api.students.getMyProfile(),
                method: "GET",
            }),
            providesTags: ['my-student-profile'],
        }),
    }),
});

export const {
    useGetMyStudentProfileQuery,
} = studentProfileApiService;
