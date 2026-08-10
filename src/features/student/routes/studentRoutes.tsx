import { RouteObject } from "react-router-dom";
import { UserRole } from "../../../utils/enum";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import StudentDashboardPage from "../dashboard/pages/StudentDashboardPage";
import StudentProfilePage from "../profile/pages/StudentProfilePage";
import SubjectsPage from "../subjects/pages/SubjectsPage";
import MyExamsPage from "../exams/pages/MyExamsPage";
import ExamResultPage from "../exams/pages/ExamResultPage";


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
        path: "/student/profile",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <StudentProfilePage />
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
    {
        path: "/student/exams",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <MyExamsPage />
            </RoleGuard>
        ),
    },
    {
        path: "/student/exams/results/:attemptId",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <ExamResultPage />
            </RoleGuard>
        ),
    },
];