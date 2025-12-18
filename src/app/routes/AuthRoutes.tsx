import { type RouteObject } from "react-router-dom";
import { AuthLayout } from "../../layouts/auth/AuthLayout";
import { withAuthRedirection } from "../../hoc/with-auth-redirection";
import LoginPage from "../../features/auth/dashboard/pages/LoginPage";
import ResetPassword from "../../features/auth/dashboard/pages/ResetPassword";

const ProtectedAuthLayout = withAuthRedirection(AuthLayout);

export const authRoutes: RouteObject[] = [
    {
        element: <ProtectedAuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />
            },
            {
                path: "/reset-password",
                element: <ResetPassword />
            }
        ],
    },
];
