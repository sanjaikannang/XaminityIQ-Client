import type { RouteObject } from "react-router-dom";
import { withAuthGuard } from "../../hoc/withAuthGuard";
import { RootLayout } from "../../layouts/root/RootLayout";
import { withScreenGuard } from "../../hoc/withScreenGuard";
import FacultyDashboardPage from "../../features/faculty/dashboard/pages/FacultyDashboardPage";
import StudentDashboardPage from "../../features/student/dashboard/pages/StudentDashboardPage";
import SuperAdminDashboardPage from "../../features/super-admin/dashboard/pages/SuperAdminDashboardPage";

const ProtectedRootLayout = withAuthGuard(withScreenGuard(RootLayout));

export const protectedRoutes: RouteObject[] = [
    {
        element: <ProtectedRootLayout />,
        children: [
            {
                path: "/super-admin/dashboard",
                element: <SuperAdminDashboardPage />,
            },
            {
                path: "/faculty/dashboard",
                element: <FacultyDashboardPage />,
            },
            {
                path: "/student/dashboard",
                element: <StudentDashboardPage />,
            },
        ],
    },
];
