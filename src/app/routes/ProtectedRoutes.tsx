import type { RouteObject } from "react-router-dom";
import { RootLayout } from "../../layouts/root/RootLayout";
import { withAuthRedirection } from "../../hoc/with-auth-redirection";
import FacultyDashboardPage from "../../features/faculty/dashboard/pages/FacultyDashboardPage";
import StudentDashboardPage from "../../features/student/dashboard/pages/StudentDashboardPage";
import SuperAdminDashboardPage from "../../features/super-admin/dashboard/pages/SuperAdminDashboardPage";

const ProtectedRootLayout = withAuthRedirection(RootLayout);

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
