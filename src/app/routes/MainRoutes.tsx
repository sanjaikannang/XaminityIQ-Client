import { type RouteObject } from "react-router-dom";
import { authRoutes } from "./AuthRoutes";
import { publicRoutes } from "./PublicRoutes";
import { protectedRoutes } from "./ProtectedRoutes";

export const routes: RouteObject[] = [
    ...authRoutes,
    ...publicRoutes,
    ...protectedRoutes,
];
