import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutAPI } from "../../Services/Auth/authAPI";
import { logout } from "../../State/Slices/authSlice";
import { LogOut } from "lucide-react";

const StudentLayout = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      // Call the logout API
      await logoutAPI();

      // Dispatch logout action to clear Redux state and localStorage
      dispatch(logout());

      // Navigate to login page
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);

      // Even if API fails, clear local state and redirect
      dispatch(logout());
      navigate('/login');
    }
  };

  return (
    <>
      <div className="h-screen flex justify-center items-center">
        <h1>StudentLayout</h1>
        <div>
          <button
            onClick={handleLogout}
            className="group flex items-center w-full px-3 py-3 text-sm font-medium text-red-500 transition-colors cursor-pointer"
          >
            <LogOut className="mr-3 h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </>
  )
}

export default StudentLayout