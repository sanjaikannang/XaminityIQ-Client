import { UserRole } from "../../../utils/enum";
import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import BatchesPage from "../academics/pages/BatchesPage";
import CoursesPage from "../academics/pages/CoursesPage";
import StudentsPage from "../students/pages/StudentsPage";
import FacultiesPage from "../faculties/pages/FacultiesPage";
import DepartmentsPage from "../academics/pages/DepartmentsPage";
import SectionsPage from "../academics/pages/SectionsPage";
import DepartmentSubjectsPage from "../academics/pages/DepartmentSubjectsPage";
import SuperAdminDashboardPage from "../dashboard/pages/SuperAdminDashboardPage";
import ExamsPage from "../exams/pages/ExamsPage";
import ExamRoomAllocationPage from "../exams/pages/ExamRoomAllocationPage";
import CreateExamPage from "../exams/pages/CreateExamPage";
import ExamDetailPage from "../exams/pages/ExamDetailPage";
import EditExamPage from "../exams/pages/EditExamPage";
import StudentDetailPage from "../students/pages/StudentDetailPage";
import FacultyDetailPage from "../faculties/pages/FacultyDetailPage ";
import CreateStudentPage from "../students/pages/CreateStudentPage";
import EditStudentPage from "../students/pages/EditStudentPage";
import CreateFacultyPage from "../faculties/pages/CreateFacultyPage";
import EditFacultyPage from "../faculties/pages/EditFacultyPage";

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
        path: "/super-admin/academics/departments/:batchDepartmentId/sections",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <SectionsPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/academics/departments/:batchDepartmentId/subjects",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <DepartmentSubjectsPage />
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
    {
        path: "/super-admin/students/create",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <CreateStudentPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/students/:id",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <StudentDetailPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/students/:id/edit",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <EditStudentPage />
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
    {
        path: "/super-admin/faculties/create",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <CreateFacultyPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/faculties/:id",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <FacultyDetailPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/faculties/:id/edit",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <EditFacultyPage />
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
    {
        path: "/super-admin/exams/create",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <CreateExamPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/exams/rooms",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <ExamRoomAllocationPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/exams/:id",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <ExamDetailPage />
            </RoleGuard>
        ),
    },
    {
        path: "/super-admin/exams/:id/edit",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <EditExamPage />
            </RoleGuard>
        ),
    },
];