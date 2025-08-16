import api from "../../Api/axios";
import { CreateExamRequest, CreateExamResponse, CreateFacultyRequest, CreateFacultyResponse, CreateStudentRequest, CreateStudentResponse, DeleteFacultyResponse, DeleteStudentResponse, GetAllExamRequest, GetAllExamResponse, GetAllFacultyRequest, GetAllFacultyResponse, GetAllStudentRequest, GetAllStudentResponse, GetFacultyResponse, GetStudentResponse } from "../../Types/admin.types";

// Create Student
export async function createStudent(data: CreateStudentRequest): Promise<CreateStudentResponse> {
    const response = await api.post<CreateStudentResponse>('/admin/create-student', data);
    return response.data;
}


// Create Faculty
export async function createFaculty(data: CreateFacultyRequest): Promise<CreateFacultyResponse> {
    const response = await api.post<CreateFacultyResponse>('/admin/create-faculty', data);
    return response.data;
}


// Delete Student
export async function deleteStudent(id: string): Promise<DeleteStudentResponse> {
    const response = await api.delete<DeleteStudentResponse>(`/admin/delete-student/${id}`);
    return response.data;
}


// Delete Faculty
export async function deleteFaculty(id: string): Promise<DeleteFacultyResponse> {
    const response = await api.delete<DeleteFacultyResponse>(`/admin/delete-faculty/${id}`);
    return response.data;
}


// Get All Student
export async function getAllStudent(params?: GetAllStudentRequest): Promise<GetAllStudentResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
        queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
    }

    const url = `/admin/get-all-student${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<GetAllStudentResponse>(url);
    return response.data;
}

// Get All Faculty
export async function getAllFaculty(params?: GetAllFacultyRequest): Promise<GetAllFacultyResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
        queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
    }

    const url = `/admin/get-all-faculty${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<GetAllFacultyResponse>(url);
    return response.data;
}


// Get Faculty by ID
export async function getFaculty(id: string): Promise<GetFacultyResponse> {
    const response = await api.get<GetFacultyResponse>(`/admin/get-faculty/${id}`);
    return response.data;
}


// Get Student
export async function getStudent(id: string): Promise<GetStudentResponse> {
    const response = await api.get<GetStudentResponse>(`/admin/get-student/${id}`);
    return response.data;
}


// Create Exam
export async function createExam(data: CreateExamRequest): Promise<CreateExamResponse> {
    const response = await api.post<CreateExamResponse>('/admin/create-exam', data);
    return response.data;
}


// Get All Exams
export async function getAllExam(params?: GetAllExamRequest): Promise<GetAllExamResponse> {
    const queryParams = new URLSearchParams();

    if (params?.page) {
        queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
    }

    const url = `/admin/get-all-exam${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    const response = await api.get<GetAllExamResponse>(url);
    return response.data;
}