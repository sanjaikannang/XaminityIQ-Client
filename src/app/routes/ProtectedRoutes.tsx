import type { RouteObject } from "react-router-dom";
import { withAuthGuard } from "../../hoc/withAuthGuard";
import { RootLayout } from "../../layouts/root/RootLayout";
import { withScreenGuard } from "../../hoc/withScreenGuard";
import { facultyRoutes } from "../../features/faculty/routes/facultyRoutes";
import { studentRoutes } from "../../features/student/routes/studentRoutes";
import { superAdminRoutes } from "../../features/super-admin/routes/superAdminRoutes";

const ProtectedRootLayout = withAuthGuard(withScreenGuard(RootLayout));

export const protectedRoutes: RouteObject[] = [
    {
        element: <ProtectedRootLayout />,
        children: [
            ...superAdminRoutes,
            ...facultyRoutes,
            ...studentRoutes,
        ],
    },
];