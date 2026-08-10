import { RouteObject } from "react-router-dom";
import { UserRole } from "../../../utils/enum";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import FacultyDashboardPage from "../dashboard/pages/FacultyDashboardPage";
import FacultyProfilePage from "../profile/pages/FacultyProfilePage";
import SubjectsPage from "../subjects/pages/SubjectsPage";
import MyExamRoomsPage from "../proctoring/pages/MyExamRoomsPage";
import MyEvaluationExamsPage from "../evaluation/pages/MyEvaluationExamsPage";
import EvaluationQueuePage from "../evaluation/pages/EvaluationQueuePage";

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
        path: "/faculty/profile",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <FacultyProfilePage />
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
    {
        path: "/faculty/proctoring",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <MyExamRoomsPage />
            </RoleGuard>
        ),
    },
    {
        path: "/faculty/evaluation",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <MyEvaluationExamsPage />
            </RoleGuard>
        ),
    },
    {
        path: "/faculty/evaluation/:examId",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <EvaluationQueuePage />
            </RoleGuard>
        ),
    },
];