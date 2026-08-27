export const faculty = {
    // Faculty (self) endpoints
    getMyProfile: () => "/faculty/profile",
    updateMyProfile: () => "/faculty/profile",

    // Admin endpoints
    getAllFaculty: () => "/admin/faculty",
    getFacultyById: (id: string) => `/admin/faculty/${id}`,
    createFaculty: () => "/admin/faculty",
    updateFaculty: (id: string) => `/admin/faculty/${id}`,
    deleteFaculty: (id: string) => `/admin/faculty/${id}`,
    getFacultyActivity: (id: string) => `/admin/faculty/${id}/activity`,
};
