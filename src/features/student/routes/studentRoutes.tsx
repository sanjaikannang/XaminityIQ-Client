import { RouteObject } from "react-router-dom";
import { UserRole } from "../../../utils/enum";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import StudentDashboardPage from "../dashboard/pages/StudentDashboardPage";
import SubjectsPage from "../subjects/pages/SubjectsPage";


export const studentRoutes: RouteObject[] = [
    {
        path: "/student/dashboard",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <StudentDashboardPage />
            </RoleGuard>
        ),
    },
    {
        path: "/student/subjects",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <SubjectsPage />
            </RoleGuard>
        ),
    },
];