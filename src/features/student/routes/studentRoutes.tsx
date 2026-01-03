import { UserRole } from "../../../utils/enum";
import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import StudentDashboardPage from "../dashboard/pages/StudentDashboardPage";
import ExamsPage from "../exam/pages/ExamsPage";

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
];