import { RouteObject } from "react-router-dom";
import { UserRole } from "../../../../utils/enum";
import { RoleGuard } from "../../../../hoc/withRoleGuard";
import ProctoringDashboardPage from "../pages/ProctoringDashboardPage";

export const proctoringRoomRoutes: RouteObject[] = [
    {
        path: "/faculty/proctoring/:roomId",
        element: (
            <RoleGuard allowedRoles={[UserRole.FACULTY]}>
                <ProctoringDashboardPage />
            </RoleGuard>
        ),
    },
];
