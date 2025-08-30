import api from "../../Api/axios";
import { CreateBatchRequest, CreateBatchResponse, CreateBranchRequest, CreateBranchResponse, CreateCourseRequest, CreateCourseResponse, CreateExamRequest, CreateExamResponse, CreateFacultyRequest, CreateFacultyResponse, CreateSectionRequest, CreateSectionResponse, CreateStudentRequest, CreateStudentResponse, DeleteFacultyResponse, DeleteStudentResponse, GetAllExamRequest, GetAllExamResponse, GetAllFacultyRequest, GetAllFacultyResponse, GetAllStudentRequest, GetAllStudentResponse, GetBatchesResponse, GetBranchesByCourseResponse, GetBranchesResponse, GetCoursesByBatchResponse, GetCoursesResponse, GetFacultyResponse, GetSectionsByBranchResponse, GetSectionsResponse, GetStudentResponse } from "../../Types/admin.types";

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


// Get All Batch
export async function getAllBatch(): Promise<GetBatchesResponse> {
    const response = await api.get<GetBatchesResponse>(`/admin/get-batches`);
    return response.data;
}


// Get All Courses
export async function getAllCourses(): Promise<GetCoursesResponse> {
    const response = await api.get<GetCoursesResponse>(`/admin/get-courses`);
    return response.data;
}


// Get All Branches
export async function getAllBranches(): Promise<GetBranchesResponse> {
    const response = await api.get<GetBranchesResponse>(`/admin/get-branches`);
    return response.data;
}


// Get All Sections
export async function getAllSections(): Promise<GetSectionsResponse> {
    const response = await api.get<GetSectionsResponse>(`/admin/get-sections`);
    return response.data;
}


// Get Course By Batch
export async function getCoursesByBatch(batchId: string): Promise<GetCoursesByBatchResponse> {
    const response = await api.get<GetCoursesByBatchResponse>(`/admin/get-courses-by-batch?batchId=${batchId}`);
    return response.data;
}


// Get Branch By Course
export async function getBranchesByCourse(courseId: string): Promise<GetBranchesByCourseResponse> {
    const response = await api.get<GetBranchesByCourseResponse>(`/admin/get-branches-by-course?courseId=${courseId}`);
    return response.data;
}


// Get Section By Branch
export async function getSectionsByBranch(branchId: string): Promise<GetSectionsByBranchResponse> {
    const response = await api.get<GetSectionsByBranchResponse>(`/admin/get-sections-by-branch?branchId=${branchId}`);
    return response.data;
}


// Create Batch
export async function createBatch(data: CreateBatchRequest): Promise<CreateBatchResponse> {
    const response = await api.post<CreateBatchResponse>('/admin/create-batch', data);
    return response.data;
}


// Create Course
export async function createCourse(data: CreateCourseRequest): Promise<CreateCourseResponse> {
    const response = await api.post<CreateCourseResponse>('/admin/create-course', data);
    return response.data;
}


// Create Branch
export async function createBranch(data: CreateBranchRequest): Promise<CreateBranchResponse> {
    const response = await api.post<CreateBranchResponse>('/admin/create-branch', data);
    return response.data;
}


// Create Section
export async function createSection(data: CreateSectionRequest): Promise<CreateSectionResponse> {
    const response = await api.post<CreateSectionResponse>('/admin/create-section', data);
    return response.data;
}