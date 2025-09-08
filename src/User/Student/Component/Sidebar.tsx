import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logoutAPI } from "../../../Services/Auth/authAPI";
import toast from "react-hot-toast";
import { logout } from "../../../State/Slices/authSlice";
import Spinner from "../../../Common/UI/Spinner";
import { LayoutDashboard, LogOut } from "lucide-react";

interface SidebarProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (open: boolean) => void;
}

interface NavigationItem {
    name: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
}

const Sidebar: React.FC<SidebarProps> = ({ isSidebarOpen, setIsSidebarOpen }) => {

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const navigation: NavigationItem[] = [
        { name: 'Dashboard', href: '/student', icon: LayoutDashboard }        
    ];

    const isActive = (path: string) => {
        if (path === '/student' && location.pathname === '/student') return true;
        if (path !== '/student' && location.pathname.startsWith(path)) return true;
        return false;
    };

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
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-48 bg-whiteColor shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col`}>

                {/* Logo */}
                <div className="h-16 flex items-center justify-center flex-shrink-0">
                    <h1 className="text-xl font-semibold text-gray-700">XaminityIQ</h1>
                </div>

                {/* Navigation */}
                <div className="flex-1 flex flex-col">
                    <div className="flex-1">
                        <nav className="space-y-2 px-3">
                            {navigation.map((item) => {
                                const IconComponent = item.icon;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.href}
                                        className={`${isActive(item.href)
                                            ? 'bg-tertiary border-primary'
                                            : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            } group flex items-center px-3 py-3 text-sm font-medium border-l-4 transition-colors -mx-3`}
                                        onClick={() => setIsSidebarOpen(false)}
                                    >
                                        <IconComponent className="mr-3 h-5 w-5" />
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    {/* Logout Button at Bottom */}
                    <div className="flex-shrink-0 p-2 h-16 hover:bg-red-50 border-t border-gray-200">
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
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-opacity-25 backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </>
    )
}

export default Sidebar