import type { RouteObject } from "react-router-dom";
import PublicLayout from "../../layouts/public/PublicLayout";
import LandingPage from "../../features/public/landing/pages/LandingPage";
import DocumentationPage from "../../features/public/documentation/pages/DocumentationPage";
import MobileWrittenAnswerPage from "../../features/public/written-answer/pages/MobileWrittenAnswerPage";
import { withGuestGuard } from "../../hoc/withGuestGuard";

// Landing page is an "open" route — an already-authenticated user hitting it
// (back button, bookmark, typed URL) gets bounced to their dashboard, same as
// /login already does. Documentation stays open to everyone regardless of
// auth state, so it's intentionally NOT wrapped here.
const GuardedLandingPage = withGuestGuard(LandingPage);

export const publicRoutes: RouteObject[] = [
    {
        element: <PublicLayout />,
        children: [
            {
                path: "/",
                element: <GuardedLandingPage />,
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
