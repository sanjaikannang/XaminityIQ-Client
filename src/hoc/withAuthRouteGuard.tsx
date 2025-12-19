import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getItemFromStorage } from "../utils/storage";

export function withAuthRouteGuard<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    const ComponentWithAuthRouteGuard: React.FC<P> = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuthentication = (): boolean => {
                const accessToken = getItemFromStorage({ key: "access_token" });
                const refreshToken = getItemFromStorage({ key: "refresh_token" });
                return !!(accessToken && refreshToken);
            };

            const isAuthenticated = checkAuthentication();

            if (isAuthenticated) {
                // User IS authenticated, redirect them to their dashboard
                const userRole = getItemFromStorage({ key: "user_role" });

                switch (userRole) {
                    case "super-admin":
                        navigate("/super-admin/dashboard", { replace: true });
                        break;
                    case "faculty":
                        navigate("/faculty/dashboard", { replace: true });
                        break;
                    case "student":
                        navigate("/student/dashboard", { replace: true });
                        break;
                    default:
                        navigate("/dashboard", { replace: true });
                }
            }
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };

    ComponentWithAuthRouteGuard.displayName = `withAuthRouteGuard(${WrappedComponent.displayName || WrappedComponent.name || "Component"
        })`;

    return ComponentWithAuthRouteGuard;
}