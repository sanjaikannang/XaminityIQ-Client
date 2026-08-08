export const subjects = {
    // Faculty (HOD) endpoints
    createSubject: () => "/faculty/subjects",
    getMySubjects: () => "/faculty/subjects",
    getSubject: (id: string) => `/faculty/subjects/${id}`,
    updateSubject: (id: string) => `/faculty/subjects/${id}`,
    deleteSubject: (id: string) => `/faculty/subjects/${id}`,

    // Student endpoint
    getStudentSubjects: () => "/student/subjects",

    // Admin endpoint
    getAllSubjectsAdmin: () => "/admin/subjects",
};
