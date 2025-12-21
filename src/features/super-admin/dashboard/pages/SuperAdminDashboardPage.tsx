import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { logout } from "../../../../utils/logout";

const SuperAdminDashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        logout(navigate);
    };

    return (
        <>
            <div className="h-screen flex justify-center items-center">
                <div className="text-center space-y-6">
                    <h1 className="text-xl">Super Admin Dashboard Page</h1>
                    <div>
                        <Button
                            type="button"
                            variant="danger"
                            size="md"
                            onClick={handleLogout}
                            fullWidth
                        >
                            Logout
                        </Button>
                    </div>
                </div>
            </div >
        </>
    );
};

export default SuperAdminDashboardPage;