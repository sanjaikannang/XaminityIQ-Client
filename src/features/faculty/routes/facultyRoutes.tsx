import { RouteObject } from "react-router-dom";
import { UserRole } from "../../../utils/enum";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import FacultyDashboardPage from "../dashboard/pages/FacultyDashboardPage";
import SubjectsPage from "../subjects/pages/SubjectsPage";

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
        path: "/faculty/subjects",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <SubjectsPage />
            </RoleGuard>
        ),
    },
];