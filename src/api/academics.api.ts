export const academics = {
    getBatches: () => "/admin/batches",
    getCourses: (batchId: string) => `/admin/batches/${batchId}/courses`,
    getDepartments: (batchCourseId: string) => `/admin/batch-courses/${batchCourseId}/departments`,
};
