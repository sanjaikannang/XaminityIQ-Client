export interface BatchData {
    _id: string;
    batchName: string;
    startYear: number;
    endYear: number;
    createdAt: Date;
}

export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface GetAllBatchesResponse {
    success: boolean;
    message: string;
    data?: BatchData[];
    pagination?: PaginationMeta;
}

export interface CourseData {
    _id: string;
    batchCourseId: string;
    streamCode: string;
    streamName: string;
    courseCode: string;
    courseName: string;
    level: string;
    duration: string;
    semesters: number;
    createdAt: Date;
}

export interface GetAllCoursesForBatchResponse {
    success: boolean;
    message: string;
    data?: CourseData[];
    pagination?: PaginationMeta;
}