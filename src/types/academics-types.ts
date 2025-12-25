// Base Types
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface BaseApiResponse<T> {
    success: boolean;
    message: string;
    data?: T[];
    pagination?: PaginationMeta;
}

export interface BaseTimestampedEntity {
    _id: string;
    createdAt: Date;
}

// Specific Data Types
export interface BatchData extends BaseTimestampedEntity {
    batchName: string;
    startYear: number;
    endYear: number;
}

export interface CourseData extends BaseTimestampedEntity {
    batchCourseId: string;
    streamCode: string;
    streamName: string;
    courseCode: string;
    courseName: string;
    level: string;
    duration: string;
    semesters: number;
}

export interface SectionData extends BaseTimestampedEntity {
    sectionName: string;
    capacity: number;
    currentStrength: number;
}

export interface DepartmentData extends BaseTimestampedEntity {
    batchDepartmentId: string;
    deptCode: string;
    deptName: string;
    totalSeats: number;
    sectionCapacity: number;
    sections: SectionData[];
}

// API Response Types (Using Generic)
export type GetAllBatchesResponse = BaseApiResponse<BatchData>;
export type GetAllCoursesForBatchResponse = BaseApiResponse<CourseData>;
export type GetAllDepartmentForBatchCourseResponse = BaseApiResponse<DepartmentData>;
export type GetAllSectionsForDepartmentResponse = BaseApiResponse<SectionData>;

// Query Parameter Types
export interface BasePaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface GetCoursesParams extends BasePaginationParams {
    batchId: string;
}

export interface GetDepartmentsParams extends BasePaginationParams {
    batchCourseId: string;
}

export interface GetSectionsParams extends BasePaginationParams {
    batchDepartmentId: string;
}

// Create Batch Types
export interface CreateBatchRequest {
    batchName: string;
    startYear: string;
    endYear: string;
}

export interface CreateBatchResponse {
    success: boolean;
    message: string;
}

// Available Courses Types
export interface CourseInfo {
    _id: string;
    courseCode: string;
    courseName: string;
}

export interface GetAvailableCoursesResponse {
    success: boolean;
    message: string;
    data?: CourseInfo[];
}

// Map Course to Batch Types
export interface MapCourseToBatchRequest {
    batchId: string;
    courseId: string;
}

export interface MapCourseToBatchResponse {
    message: string;
    batchCourseId: string;
}

// Courses with Departments Types
export interface CourseDepartment {
    _id: string;
    deptCode: string;
    deptName: string;
}

export interface CourseWithDepartments {
    _id: string;
    streamCode: string;
    streamName: string;
    courseCode: string;
    courseName: string;
    level: string;
    duration: string;
    semesters: number;
    departments: CourseDepartment[];
}

export type GetCoursesWithDepartmentsResponse = BaseApiResponse<CourseWithDepartments>;