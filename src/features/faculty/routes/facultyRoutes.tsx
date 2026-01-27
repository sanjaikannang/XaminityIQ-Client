import { RouteObject } from "react-router-dom";
import { UserRole } from "../../../utils/enum";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import FacultyDashboardPage from "../dashboard/pages/FacultyDashboardPage";
import FacultyExamsPage from "../exams/pages/FacultyExamsPage";
import FacultyExamRoomPage from "../exams/pages/FacultyExamRoomPage";

export const facultyRoutes: RouteObject[] = [
    {
        path: "/faculty/dashboard",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <FacultyDashboardPage />
            </RoleGuard>
        ),
    },
    {
        path: "/faculty/exams",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <FacultyExamsPage />
            </RoleGuard>
        ),
    },
    {
        path: "/faculty/exams/:examId/monitor",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <FacultyExamRoomPage />
            </RoleGuard>
        ),
    },
];