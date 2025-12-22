import { UserRole } from "../../../utils/enum";
import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import BatchesPage from "../academics/pages/BatchesPage";
import CoursesPage from "../academics/pages/CoursesPage";
import SectionsPage from "../academics/pages/SectionsPage";
import DepartmentsPage from "../academics/pages/DepartmentsPage";
import SuperAdminDashboardPage from "../dashboard/pages/SuperAdminDashboardPage";

export const superAdminRoutes: RouteObject[] = [
    {
        path: "/super-admin/dashboard",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <SuperAdminDashboardPage />
            </RoleGuard>
        ),
    },
    // ===== Academic Structure =====
    {
        path: "/super-admin/academics/batches",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <BatchesPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/academics/batches/:batchId/courses",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <CoursesPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/academics/courses/:courseId/departments",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <DepartmentsPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/academics/departments/:departmentId/sections",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <SectionsPage />
            </RoleGuard>
        ),
    }
];