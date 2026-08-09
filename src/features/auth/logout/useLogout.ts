import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { clearStorage } from "../../../utils/storage";
import { useLogoutMutation } from "../../../state/services/endpoints/auth";

// Notifies the backend (for the login/logout audit log) before clearing local
// auth state - best-effort, since a failed network call shouldn't trap the user.
export function useLogout() {
    const navigate = useNavigate();
    const [logoutMutation] = useLogoutMutation();

    const logout = async () => {
        try {
            await logoutMutation().unwrap();
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            clearStorage();
            toast.success('Logged out successfully');
            navigate('/login', { replace: true });
        }
    };

    return { logout };
}
