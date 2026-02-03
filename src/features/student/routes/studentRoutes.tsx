import { RouteObject } from "react-router-dom";
import { UserRole } from "../../../utils/enum";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import StudentExamsPage from "../exams/pages/StudentExamsPage";
import StudentExamRoomPage from "../exams/pages/StudentExamRoomPage";
import StudentExamWaitingPage from "../exams/pages/StudentExamWaitingPage";
import StudentDashboardPage from "../dashboard/pages/StudentDashboardPage";
import StudentEnvironmentCheckPage from "../exams/pages/StudentEnvironmentCheckPage";


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
        path: "/student/exams",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <StudentExamsPage />
            </RoleGuard>
        ),
    },
    {
        path: "/student/exams/:examId/environment-check",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <StudentEnvironmentCheckPage />
            </RoleGuard>
        ),
    },
    {
        path: "/student/exams/:examId/waiting",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <StudentExamWaitingPage />
            </RoleGuard>
        ),
    },
    {
        path: "/student/exams/:examId/room",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <StudentExamRoomPage />
            </RoleGuard>
        ),
    },
];