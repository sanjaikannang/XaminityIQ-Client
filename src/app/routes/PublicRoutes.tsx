import type { RouteObject } from "react-router-dom";
import PublicLayout from "../../layouts/public/PublicLayout";
import LandingPage from "../../features/public/landing/pages/LandingPage";
import DocumentationPage from "../../features/public/landing/pages/DocumentationPage";

export const publicRoutes: RouteObject[] = [
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <LandingPage />,
            },
            {
                path: "/documentation",
                element: <DocumentationPage />,
            }
        ]
    }
];
