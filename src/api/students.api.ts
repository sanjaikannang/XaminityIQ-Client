export const students = {
    // Student (self) endpoints
    getMyProfile: () => "/student/profile",
    updateMyProfile: () => "/student/profile",

    // Admin endpoints
    getAllStudents: () => "/admin/students",
    getStudentById: (id: string) => `/admin/students/${id}`,
    createStudent: () => "/admin/students",
    updateStudent: (id: string) => `/admin/students/${id}`,
    deleteStudent: (id: string) => `/admin/students/${id}`,
    getStudentActivity: (id: string) => `/admin/students/${id}/activity`,
    bulkUploadStudents: () => "/admin/students/bulk-upload",
};
