import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import { GetMyStudentProfileResponse, UpdateMyStudentProfileRequest, UpdateMyProfileResponse } from "../../../types/students-types";

export const studentProfileApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getMyStudentProfile: build.query<GetMyStudentProfileResponse, void>({
            query: () => ({
                url: api.students.getMyProfile(),
                method: "GET",
            }),
            providesTags: ['my-student-profile'],
        }),
        updateMyStudentProfile: build.mutation<UpdateMyProfileResponse, UpdateMyStudentProfileRequest>({
            query: (data) => ({
                url: api.students.updateMyProfile(),
                method: "PATCH",
                data,
            }),
            invalidatesTags: ['my-student-profile'],
        }),
    }),
});

export const {
    useGetMyStudentProfileQuery,
    useUpdateMyStudentProfileMutation,
} = studentProfileApiService;
