import { ReactNode } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import { LogOut, Home, Users, Settings, type LucideIcon } from "lucide-react";

interface NavigationItem {
    id: string;
    label: string;
    path: string;
    icon: LucideIcon;
}

const navigationItems: NavigationItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/super-admin/dashboard",
        icon: Home,
    },
    {
        id: "users",
        label: "Users",
        path: "/super-admin/users",
        icon: Users,
    },
    {
        id: "settings",
        label: "Settings",
        path: "/super-admin/settings",
        icon: Settings,
    }
];

export interface RootLayoutContext {
    infoBar?: ReactNode;
}

export function RootLayout() {
    const location = useLocation();

    const isActiveRoute = (path: string): boolean => {
        return location.pathname === path;
    };

    return (
        <>
            <div className="flex h-screen bg-bgSecondary">
                {/* Sidebar */}
                <aside className="w-56 bg-whiteColor border-r border-borderLight flex flex-col shadow-xl">
                    {/* Sidebar Header */}
                    <div className="h-16 flex items-center justify-center px-4 border-b border-borderLight flex-shrink-0">
                        <h1 className="font-bold text-xl text-center text-textPrimary">
                            XaminityIQ
                        </h1>
                    </div>

                    {/* Navigation Items - Scrollable */}
                    <nav className="flex-1 p-1.5 space-y-1.5 overflow-y-auto no-scrollbar">
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = isActiveRoute(item.path);

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
                        <button className="flex items-center justify-center gap-3 px-4 py-3 w-full text-textSecondary cursor-pointer transition-colors hover:bg-bgTertiary">
                            <LogOut className="w-5 h-5" />
                            <span>Logout</span>
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Top Navbar */}
                    <header className="h-16 bg-whiteColor border-b border-borderLight flex items-center justify-end px-6 flex-shrink-0 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-whiteColor font-semibold">
                                    A
                                </div>
                                <span className="text-sm font-medium text-textSecondary">
                                    Admin User
                                </span>
                            </div>
                        </div>
                    </header>

                    {/* Main Content - Scrollable */}
                    <main className="flex-1 overflow-y-auto p-6 no-scrollbar">
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
}