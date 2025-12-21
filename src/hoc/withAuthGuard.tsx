import { Navigate } from "react-router-dom";
import { getItemFromStorage } from "../utils/storage";

// Guard for PROTECTED routes - redirects unauthenticated users to login
export function withAuthGuard<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    const ComponentWithAuthGuard: React.FC<P> = (props) => {
        const checkAuthentication = (): boolean => {
            const accessToken = getItemFromStorage({ key: "accessToken" });
            const refreshToken = getItemFromStorage({ key: "refreshToken" });
            return !!(accessToken && refreshToken);
        };

        const isAuthenticated = checkAuthentication();

        // Check authentication BEFORE rendering - prevents flash
        if (!isAuthenticated) {
            // User is NOT authenticated, redirect to login immediately
            return <Navigate to="/login" replace />;
        }

        return <WrappedComponent {...props} />;
    };

    ComponentWithAuthGuard.displayName = `withAuthGuard(${WrappedComponent.displayName || WrappedComponent.name || "Component"
        })`;

    return ComponentWithAuthGuard;
}