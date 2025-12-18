import { type RouteObject } from "react-router-dom";
import { AuthLayout } from "../../layouts/auth/AuthLayout";
import LoginPage from "../../features/auth/login/pages/LoginPage";
import { withAuthRedirection } from "../../hoc/with-auth-redirection";
import ResetPassword from "../../features/auth/reset-password/pages/ResetPassword";

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
