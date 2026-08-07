import { api } from "../../../api";
import { apiInstance } from "../api-instance";
import {
    GetAllFacultyResponse,
    GetFacultyResponse,
    BasePaginationParams,
    CreateFacultyRequest,
    CreateFacultyResponse,
    EditFacultyRequest,
    EditFacultyResponse,
    DeleteFacultyResponse,
} from "../../../types/faculty-types";

export const facultyApiService = apiInstance.injectEndpoints({
    endpoints: (build) => ({
        getAllFaculty: build.query<GetAllFacultyResponse, BasePaginationParams>({
            query: (params) => ({
                url: api.faculty.getAllFaculty(),
                method: "GET",
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    ...(params.search && { search: params.search }),
                },
            }),
            providesTags: ['faculty'],
        }),
        getFacultyById: build.query<GetFacultyResponse, string>({
            query: (id) => ({
                url: api.faculty.getFacultyById(id),
                method: "GET",
            }),
            providesTags: ['faculty-detail'],
        }),
        createFaculty: build.mutation<CreateFacultyResponse, CreateFacultyRequest>({
            query: (data) => ({
                url: api.faculty.createFaculty(),
                method: "POST",
                data,
            }),
            invalidatesTags: ['faculty'],
        }),
        updateFaculty: build.mutation<EditFacultyResponse, { id: string; data: EditFacultyRequest }>({
            query: ({ id, data }) => ({
                url: api.faculty.updateFaculty(id),
                method: "PATCH",
                data,
            }),
            invalidatesTags: ['faculty', 'faculty-detail'],
        }),
        deleteFaculty: build.mutation<DeleteFacultyResponse, string>({
            query: (id) => ({
                url: api.faculty.deleteFaculty(id),
                method: "DELETE",
            }),
            invalidatesTags: ['faculty', 'faculty-detail'],
        }),
    }),
});

export const {
    useGetAllFacultyQuery,
    useLazyGetAllFacultyQuery,
    useGetFacultyByIdQuery,
    useLazyGetFacultyByIdQuery,
    useCreateFacultyMutation,
    useUpdateFacultyMutation,
    useDeleteFacultyMutation,
} = facultyApiService;
