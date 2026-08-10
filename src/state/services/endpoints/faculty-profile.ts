import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import { GetMyFacultyProfileResponse } from "../../../types/faculty-types";

export const facultyProfileApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getMyFacultyProfile: build.query<GetMyFacultyProfileResponse, void>({
            query: () => ({
                url: api.faculty.getMyProfile(),
                method: "GET",
            }),
            providesTags: ['my-faculty-profile'],
        }),
    }),
});

export const {
    useGetMyFacultyProfileQuery,
} = facultyProfileApiService;
