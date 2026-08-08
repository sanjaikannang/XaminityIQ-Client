import { RouteObject } from "react-router-dom";
import { UserRole } from "../../../../utils/enum";
import { RoleGuard } from "../../../../hoc/withRoleGuard";
import PreFlightCheckPage from "../pages/PreFlightCheckPage";
import ExamRoomPage from "../pages/ExamRoomPage";

export const examRoomRoutes: RouteObject[] = [
    {
        path: "/student/exams/:examId/pre-flight",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <PreFlightCheckPage />
            </RoleGuard>
        ),
    },
    {
        path: "/student/exams/:examId/room/:attemptId",
        element: (
            <RoleGuard allowedRoles={[UserRole.STUDENT]}>
                <ExamRoomPage />
            </RoleGuard>
        ),
    },
];
