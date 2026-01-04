import { UserRole } from "../../../utils/enum";
import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import StudentDashboardPage from "../dashboard/pages/StudentDashboardPage";
import ExamsPage from "../exam/pages/ExamsPage";
import StudentExamRoomPage from "../exam/pages/StudentExamRoomPage";
import StudentEnvironmentCheckPage from "../exam/pages/StudentEnvironmentCheckPage ";

export const studentRoutes: RouteObject[] = [
    // ===== Dashboard =====
    {
        path: "/student/dashboard",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <StudentDashboardPage />
            </RoleGuard>
        ),
    },
    // ===== Exams =====
    {
        path: "/student/exams",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <ExamsPage />
            </RoleGuard>
        ),
    },
    {
        path: "/student/exam-room/:examId",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <StudentExamRoomPage />
            </RoleGuard>
        ),
    },
     {
        path: "/student/exam/:examId/environment-check",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <StudentEnvironmentCheckPage />
            </RoleGuard>
        ),
    }
];