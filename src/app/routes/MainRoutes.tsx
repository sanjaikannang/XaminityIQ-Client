import { authRoutes } from "./AuthRoutes";
import { publicRoutes } from "./PublicRoutes";
import { type RouteObject } from "react-router-dom";
import { protectedRoutes } from "./ProtectedRoutes";
import PageNotFound from "../../features/common/page-not-found/pages/PageNotFound";
import UnAuthorizedPage from "../../features/common/un-authorized/pages/UnAuthorizedPage";

export const routes: RouteObject[] = [
    ...authRoutes,
    ...publicRoutes,
    ...protectedRoutes,
    {
        path: "/unauthorized",
        element: <UnAuthorizedPage />
    },
    {
        path: "*",
        element: <PageNotFound />
    }
];
