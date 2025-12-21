import { UserRole } from "./enum";
import { NavigateFunction } from "react-router-dom";

export const navigateByUserRole = (
    role: UserRole,
    navigate: NavigateFunction
) => {
    switch (role) {
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
};
