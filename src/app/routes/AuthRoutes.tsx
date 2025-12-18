import { type RouteObject } from "react-router-dom";
import { AuthLayout } from "../../layouts/auth/AuthLayout";
import { withAuthRedirection } from "../../hoc/with-auth-redirection";
import LoginPage from "../../features/auth/dashboard/components/LoginPage";

const ProtectedAuthLayout = withAuthRedirection(AuthLayout);

export const authRoutes: RouteObject[] = [
    {
        element: <ProtectedAuthLayout />,
        children: [
            {
                path: "/login",
                element: <LoginPage />,
            },
        ],
    },
];
