import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { clearStorage } from "../../../../utils/storage";

const StudentDashboardPage = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        try {
            // Clear localStorage data
            clearStorage();

            toast.success('Logged out successfully');
            navigate('/login', { replace: true });
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to logout. Please try again.');
        }
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