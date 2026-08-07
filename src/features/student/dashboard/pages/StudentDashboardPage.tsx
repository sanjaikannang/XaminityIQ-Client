import Button from "../../../../common/ui/Button";
import { useLogout } from "../../../auth/logout/useLogout";

const StudentDashboardPage = () => {
    const { logout } = useLogout();

    const handleLogout = () => {
        logout();
    };

    return (
        <>
            <div className="h-screen flex justify-center items-center">
                <div className="text-center space-y-6">
                    <h1 className="text-xl">Student Dashboard Page</h1>
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

export default StudentDashboardPage;