import { useEffect } from "react";
import { UserRole } from "../utils/enum";
import { useNavigate } from "react-router-dom";
import { getItemFromStorage } from "../utils/storage";

export function withAuthRouteGuard<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    const ComponentWithAuthRouteGuard: React.FC<P> = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuthentication = (): boolean => {
                const accessToken = getItemFromStorage({ key: "accessToken" });
                const refreshToken = getItemFromStorage({ key: "refreshToken" });
                return !!(accessToken && refreshToken);
            };

            const isAuthenticated = checkAuthentication();

            if (isAuthenticated) {
                // User IS authenticated, redirect them to their dashboard
                const userRole = getItemFromStorage({ key: "userRole" });

                switch (userRole) {
                    case UserRole.ADMIN:
                        navigate("/super-admin/dashboard", { replace: true });
                        break;
                    case UserRole.FACULTY:
                        navigate("/faculty/dashboard", { replace: true });
                        break;
                    case UserRole.STUDENT:
                        navigate("/student/dashboard", { replace: true });
                        break;
                    default:
                        navigate("/login", { replace: true });
                }
            }
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };

    ComponentWithAuthRouteGuard.displayName = `withAuthRouteGuard(${WrappedComponent.displayName || WrappedComponent.name || "Component"
        })`;

    return ComponentWithAuthRouteGuard;
}