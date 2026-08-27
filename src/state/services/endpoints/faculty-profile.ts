import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import { GetMyFacultyProfileResponse, UpdateMyFacultyProfileRequest, UpdateMyProfileResponse } from "../../../types/faculty-types";

export const facultyProfileApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getMyFacultyProfile: build.query<GetMyFacultyProfileResponse, void>({
            query: () => ({
                url: api.faculty.getMyProfile(),
                method: "GET",
            }),
            providesTags: ['my-faculty-profile'],
        }),
        updateMyFacultyProfile: build.mutation<UpdateMyProfileResponse, UpdateMyFacultyProfileRequest>({
            query: (data) => ({
                url: api.faculty.updateMyProfile(),
                method: "PATCH",
                data,
            }),
            invalidatesTags: ['my-faculty-profile'],
        }),
    }),
});

export const {
    useGetMyFacultyProfileQuery,
    useUpdateMyFacultyProfileMutation,
} = facultyProfileApiService;
