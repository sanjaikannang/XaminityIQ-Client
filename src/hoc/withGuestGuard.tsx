import { useEffect } from "react";
import { UserRole } from "../utils/enum";
import { useNavigate } from "react-router-dom";
import { getItemFromStorage } from "../utils/storage";
import { navigateByUserRole } from "../utils/navigation";

// Guard for AUTH/PUBLIC routes (login, register, etc.)
// Redirects authenticated users to their dashboard
export function withGuestGuard<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    const ComponentWithGuestGuard: React.FC<P> = (props) => {
        const navigate = useNavigate();

        useEffect(() => {
            const checkAuthentication = (): boolean => {
                const accessToken = getItemFromStorage({ key: "accessToken" });
                const refreshToken = getItemFromStorage({ key: "refreshToken" });
                return !!(accessToken && refreshToken);
            };

            const isAuthenticated = checkAuthentication();

            if (isAuthenticated) {
                // User IS authenticated, redirect to their dashboard
                const userRole = getItemFromStorage({ key: "userRole" }) as UserRole;
                navigateByUserRole(userRole, navigate);
            }
        }, [navigate]);

        return <WrappedComponent {...props} />;
    };

    ComponentWithGuestGuard.displayName = `withGuestGuard(${
        WrappedComponent.displayName || WrappedComponent.name || "Component"
    })`;

    return ComponentWithGuestGuard;
}