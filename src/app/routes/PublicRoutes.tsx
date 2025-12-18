import type { RouteObject } from "react-router-dom";
import LandingPage from "../../features/public/landing/pages/LandingPage";

export const publicRoutes: RouteObject[] = [
    {
        path: "/",
        element: <LandingPage />,
    }
];
