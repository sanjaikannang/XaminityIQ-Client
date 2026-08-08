import { SubjectType } from "../utils/enum";

export interface SubjectData {
    _id: string;
    subjectCode: string;
    subjectName: string;
    semester: number;
    credits: number;
    subjectType: SubjectType;
    description?: string;
    deptId?: string;
    deptCode?: string;
    deptName?: string;
    createdAt: string;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Faculty (HOD) types
export interface CreateSubjectRequest {
    subjectCode: string;
    subjectName: string;
    semester: number;
    credits: number;
    subjectType: SubjectType;
    description?: string;
}

export type EditSubjectRequest = Partial<CreateSubjectRequest>;

export interface GetMySubjectsParams {
    semester?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface GetMySubjectsResponse {
    success: boolean;
    message: string;
    data?: SubjectData[];
    pagination?: PaginationMeta;
}

export interface CreateSubjectResponse {
    success: boolean;
    message: string;
    subjectId?: string;
}

export interface EditSubjectResponse {
    success: boolean;
    message: string;
}

export interface DeleteSubjectResponse {
    success: boolean;
    message: string;
}

export interface GetSubjectResponse {
    success: boolean;
    message: string;
    data?: SubjectData;
}

// Student types
export interface GetStudentSubjectsResponse {
    success: boolean;
    message: string;
    data?: SubjectData[];
}

// Admin types
export interface GetAllSubjectsAdminParams {
    departmentId?: string;
    semester?: number;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface GetAllSubjectsAdminResponse {
    success: boolean;
    message: string;
    data?: SubjectData[];
    pagination?: PaginationMeta;
}
