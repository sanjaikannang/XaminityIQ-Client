import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAPI } from "../../Services/Auth/authAPI";
import { logout } from "../../State/Slices/authSlice";
import { LogOut } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import Spinner from "../../Common/UI/Spinner";

const StudentLayout = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);

      // Call the logout API
      await logoutAPI();

      toast.success('Logged out successfully');

      // Dispatch logout action to clear Redux state and localStorage
      dispatch(logout());

      // Navigate to login page
      navigate('/login');
    } catch (error: any) {
      console.error('Logout failed:', error);

      const errorMessage = error?.response?.data?.message ||
        error?.message ||
        'Logout failed. Please try again.';
      toast.error(errorMessage);

      // Even if API fails, clear local state and redirect
      dispatch(logout());
      navigate('/login');
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <h1>StudentLayout</h1>
        <div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className={`group flex items-center justify-center w-full px-3 py-3 text-sm font-medium transition-colors cursor-pointer ${isLoggingOut
              ? 'text-red-400 cursor-not-allowed'
              : 'text-red-500 hover:text-red-600'
              }`}
          >
            {isLoggingOut ? (
              <>
                <Spinner borderColor={"red-500"} />
              </>
            ) : (
              <>
                <LogOut className="mr-3 h-5 w-5" />
                Logout
              </>
            )}
          </button>
        </div>
      </div>
    </>
  )
}

export default StudentLayout