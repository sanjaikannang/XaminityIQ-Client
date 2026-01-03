import { UserRole } from "../../../utils/enum";
import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import ExamsPage from "../exams/pages/ExamsPage";
import FacultyDashboardPage from "../dashboard/pages/FacultyDashboardPage";
import FacultyExamRoomPage from "../exams/pages/FacultyExamRoomPage";

export const facultyRoutes: RouteObject[] = [
    // ===== Dashboard =====
    {
        path: "/faculty/dashboard",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <FacultyDashboardPage />
            </RoleGuard>
        ),
    },
    // ===== Exams =====
    {
        path: "/faculty/exams",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <ExamsPage />
            </RoleGuard>
        ),
    },
    {
        path: "/faculty/exam-room/:examId",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <FacultyExamRoomPage />
            </RoleGuard>
        ),
    },
];