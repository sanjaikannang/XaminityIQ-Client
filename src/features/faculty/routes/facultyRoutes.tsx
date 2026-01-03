import { UserRole } from "../../../utils/enum";
import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import ExamsPage from "../exams/pages/ExamsPage";
import FacultyDashboardPage from "../dashboard/pages/FacultyDashboardPage";

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
];