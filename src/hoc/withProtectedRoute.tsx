import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getItemFromStorage } from "../utils/storage";

export function withProtectedRoute<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    const ComponentWithProtectedRoute: React.FC<P> = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuthentication = (): boolean => {
                const accessToken = getItemFromStorage({ key: "access_token" });
                const refreshToken = getItemFromStorage({ key: "refresh_token" });
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

    ComponentWithProtectedRoute.displayName = `withProtectedRoute(${WrappedComponent.displayName || WrappedComponent.name || "Component"
        })`;

    return ComponentWithProtectedRoute;
}