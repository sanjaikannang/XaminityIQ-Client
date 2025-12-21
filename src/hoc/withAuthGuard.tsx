import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getItemFromStorage } from "../utils/storage";

// Guard for PROTECTED routes - redirects unauthenticated users to login
export function withAuthGuard<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    const ComponentWithAuthGuard: React.FC<P> = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuthentication = (): boolean => {
                const accessToken = getItemFromStorage({ key: "accessToken" });
                const refreshToken = getItemFromStorage({ key: "refreshToken" });
                return !!(accessToken && refreshToken);
            };

            const isAuthenticated = checkAuthentication();

            if (!isAuthenticated) {
                // User is NOT authenticated, redirect to login
                navigate("/login", { replace: true });
            }
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };

    ComponentWithAuthGuard.displayName = `withAuthGuard(${WrappedComponent.displayName || WrappedComponent.name || "Component"
        })`;

    return ComponentWithAuthGuard;
}