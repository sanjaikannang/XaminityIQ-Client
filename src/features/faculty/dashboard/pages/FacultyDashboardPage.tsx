import Button from "../../../../common/ui/Button";
import { useLogout } from "../../../auth/logout/useLogout";

const FacultyDashboardPage = () => {
    const { logout } = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <div className="h-screen flex justify-center items-center">
                <div className="text-center space-y-6">
                    <h1 className="text-xl">Faculty Dashboard Page</h1>
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
    )
}

export default FacultyDashboardPage;