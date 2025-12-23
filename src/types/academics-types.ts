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