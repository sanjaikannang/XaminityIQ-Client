export const faculty = {
    getAllFaculty: () => "/admin/faculty",
    getFacultyById: (id: string) => `/admin/faculty/${id}`,
    createFaculty: () => "/admin/faculty",
    updateFaculty: (id: string) => `/admin/faculty/${id}`,
    deleteFaculty: (id: string) => `/admin/faculty/${id}`,
    getFacultyActivity: (id: string) => `/admin/faculty/${id}/activity`,
};
