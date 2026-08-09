import type { RouteObject } from "react-router-dom";
import PublicLayout from "../../layouts/public/PublicLayout";
import LandingPage from "../../features/public/landing/pages/LandingPage";
import DocumentationPage from "../../features/public/documentation/pages/DocumentationPage";
import MobileWrittenAnswerPage from "../../features/public/written-answer/pages/MobileWrittenAnswerPage";

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
    },
    // No layout wrapper — this is a bare, distraction-free page opened by scanning
    // a QR code on a phone that was never logged into the app.
    {
        path: "/mobile/written-answer/:token",
        element: <MobileWrittenAnswerPage />,
    }
];
