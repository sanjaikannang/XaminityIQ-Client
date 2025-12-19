import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getItemFromStorage } from "../utils/storage";

export function withAuthRedirection<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    const ComponentWithAuthRedirection: React.FC<P> = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuthentication = (): boolean => {
                const accessToken = getItemFromStorage({ key: "access_token" });
                const refreshToken = getItemFromStorage({ key: "refresh_token" });
                return !!(accessToken && refreshToken);
            };

            const isAuthenticated = checkAuthentication();

            if (isAuthenticated) {
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

    ComponentWithAuthRedirection.displayName = `withAuthRedirection(${WrappedComponent.displayName || WrappedComponent.name || "Component"
        })`;

    return ComponentWithAuthRedirection;
}