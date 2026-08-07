import { type RouteObject } from "react-router-dom";
import { withGuestGuard } from "../../hoc/withGuestGuard";
import { AuthLayout } from "../../layouts/auth/AuthLayout";
import LoginPage from "../../features/auth/login/pages/LoginPage";
import ResetPassword from "../../features/auth/reset-password/pages/ResetPassword";
import ForgotPasswordPage from "../../features/auth/forgot-password/pages/ForgotPasswordPage";
import ResetPasswordPage from "../../features/auth/forgot-password/pages/ResetPasswordPage";

const ProtectedAuthLayout = withGuestGuard(AuthLayout);

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
            },
            {
                path: "/forgot-password",
                element: <ForgotPasswordPage />
            },
            {
                path: "/reset-password/:token",
                element: <ResetPasswordPage />
            }
        ],
    },
];
