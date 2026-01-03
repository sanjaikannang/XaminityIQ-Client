import { ReactNode } from "react";
import { logout } from "../../utils/logout";
import { getItemFromStorage } from "../../utils/storage";
import { Outlet, useLocation, Link, useNavigate } from "react-router-dom";
import { LogOut, type LucideIcon, ClipboardCheck, Home } from "lucide-react";

interface NavigationItem {
    id: string;
    label: string;
    path: string;
    icon: LucideIcon;
    matchPattern?: string;
}

const navigationItems: NavigationItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/faculty/dashboard",
        icon: Home,
    },
    {
        id: "exams",
        label: "Exams",
        path: "/faculty/exams",
        icon: ClipboardCheck,
        matchPattern: "/faculty/exams",
    }
];

export interface RootLayoutContext {
    infoBar?: ReactNode;
}

export function FacultyLayout() {
    const location = useLocation();
    const navigate = useNavigate();

    const isActiveRoute = (item: NavigationItem): boolean => {
        // If matchPattern is defined, check if current path starts with it
        if (item.matchPattern) {
            return location.pathname.startsWith(item.matchPattern);
        }
        // Otherwise, check for exact match
        return location.pathname === item.path;
    };

    const handleLogout = () => {
        logout(navigate);
    };

    const userData = getItemFromStorage({ key: "user" }) as {
        email: string;
        role: string;
    };

    const roleInitial = userData.role?.charAt(0).toUpperCase();

    return (
        <>
            <div className="flex h-screen bg-bgSecondary">
                {/* Sidebar */}
                <aside className="w-56 bg-whiteColor border-r border-borderLight flex flex-col shadow-xl">
                    <div className="h-16 flex items-center justify-center px-4 border-b border-borderLight flex-shrink-0">
                        <h1 className="font-bold text-xl text-center text-textPrimary">
                            XaminityIQ
                        </h1>
                    </div>

                    {/* Navigation Items - Scrollable */}
                    <nav className="flex-1 p-1.5 space-y-1.5 overflow-y-auto no-scrollbar">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = isActiveRoute(item);

                            return (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive
                                        ? "bg-primaryLighter text-primary"
                                        : "text-textSecondary hover:bg-bgTertiary"
                                        }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="py-2 border-t border-borderLight flex-shrink-0">
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-3 px-4 py-3 w-full text-textSecondary cursor-pointer transition-colors">
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    <header className="h-16 bg-whiteColor border-b border-borderLight flex items-center justify-end px-6 flex-shrink-0 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex flex-col text-right">
                                <span className="text-xs font-medium text-textSecondary">
                                    {userData.email}
                                </span>
                                <span className="text-xs text-textSecondary">
                                    {userData.role}
                                </span>
                            </div>

                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-whiteColor font-semibold">
                                {roleInitial}
                            </div>
                        </div>

                    </header>

                    {/* Main Content - Scrollable */}
                    <main className="flex-1 overflow-y-auto no-scrollbar">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}