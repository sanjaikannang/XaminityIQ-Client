export const academics = {
    getBatches: () => "/admin/batches",
    getCourses: (batchId: string) => `/admin/batches/${batchId}/courses`,
    getAvailableCourses: (batchId: string) => `/admin/batches/${batchId}/available-courses`,
    mapCourseToBatch: (batchId: string) => `/admin/batches/${batchId}/courses`,
    getDepartments: (batchCourseId: string) => `/admin/batch-courses/${batchCourseId}/departments`,
    createBatch: () => `/admin/batches`,
    getCoursesWithDepartments: () => "/admin/courses-with-departments",
};