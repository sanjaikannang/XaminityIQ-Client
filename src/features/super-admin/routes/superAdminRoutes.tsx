import { UserRole } from "../../../utils/enum";
import type { RouteObject } from "react-router-dom";
import { RoleGuard } from "../../../hoc/withRoleGuard";
import SuperAdminDashboardPage from "../dashboard/pages/SuperAdminDashboardPage";

export const superAdminRoutes: RouteObject[] = [
    {
        path: "/super-admin/dashboard",
        element: (
            <RoleGuard allowedRoles={[UserRole.ADMIN]}>
                <SuperAdminDashboardPage />
            </RoleGuard>
        ),
    }
];