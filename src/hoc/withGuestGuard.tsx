import { Navigate } from "react-router-dom";
import { UserRole } from "../utils/enum";
import { getItemFromStorage } from "../utils/storage";

// Guard for AUTH/PUBLIC routes (login, register, etc.)
// Redirects authenticated users to their dashboard
export function withGuestGuard<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    const ComponentWithGuestGuard: React.FC<P> = (props) => {
        const checkAuthentication = (): boolean => {
            const accessToken = getItemFromStorage({ key: "accessToken" });
            const refreshToken = getItemFromStorage({ key: "refreshToken" });
            return !!(accessToken && refreshToken);
        };

        const isAuthenticated = checkAuthentication();

        // Check authentication BEFORE rendering
        if (isAuthenticated) {
            // User IS authenticated, redirect to their dashboard immediately
            const userRole = getItemFromStorage({ key: "userRole" }) as UserRole;

            // Map role to route
            const roleRouteMap: Record<UserRole, string> = {
                [UserRole.ADMIN]: "/super-admin/dashboard",
                [UserRole.FACULTY]: "/faculty/dashboard",
                [UserRole.STUDENT]: "/student/dashboard",
            };

            const redirectPath = roleRouteMap[userRole] || "/";
            return <Navigate to={redirectPath} replace />;
        }

        return <WrappedComponent {...props} />;
    };

    ComponentWithGuestGuard.displayName = `withGuestGuard(${WrappedComponent.displayName || WrappedComponent.name || "Component"
        })`;

    return ComponentWithGuestGuard;
}