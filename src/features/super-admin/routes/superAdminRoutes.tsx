import { UserRole } from "../../../utils/enum";
import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import BatchesPage from "../academics/pages/BatchesPage";
import CoursesPage from "../academics/pages/CoursesPage";
import StudentsPage from "../students/pages/StudentsPage";
import FacultiesPage from "../faculties/pages/FacultiesPage";
import DepartmentsPage from "../academics/pages/DepartmentsPage";
import SuperAdminDashboardPage from "../dashboard/pages/SuperAdminDashboardPage";
import ExamsPage from "../exams/pages/ExamsPage";

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
    // ===== Students =====
    {
        path: "/super-admin/students",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <StudentsPage />
            </RoleGuard>
        ),
    },
    // ===== Faculties =====
    {
        path: "/super-admin/faculties",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <FacultiesPage />
            </RoleGuard>
        ),
    },
    // ===== Exams =====
    {
        path: "/super-admin/exams",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <ExamsPage />
            </RoleGuard>
        ),
    },
];