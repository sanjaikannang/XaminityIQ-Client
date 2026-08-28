import { ReactNode, useState } from "react";
import { UserRole } from "../../utils/enum";
import { useLogout } from "../../features/auth/logout/useLogout";
import { getItemFromStorage } from "../../utils/storage";
import { Outlet, useLocation, Link } from "react-router-dom";
import { LogOut, Home, type LucideIcon, GraduationCap, Users, UserCog, ClipboardCheck, BookOpen, Video, ClipboardList, User, PanelLeftClose, PanelLeftOpen } from "lucide-react";

const SIDEBAR_COLLAPSED_STORAGE_KEY = "sidebarCollapsed";

interface NavigationItem {
    id: string;
    label: string;
    path: string;
    icon: LucideIcon;
    matchPattern?: string;
}

const adminNavItems: NavigationItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/super-admin/dashboard",
        icon: Home,
    },
    {
        id: "academics",
        label: "Academics",
        path: "/super-admin/academics/batches",
        icon: GraduationCap,
        matchPattern: "/super-admin/academics",
    },
    {
        id: "students",
        label: "Students",
        path: "/super-admin/students",
        icon: Users,
        matchPattern: "/super-admin/students",
    },
    {
        id: "faculties",
        label: "Faculties",
        path: "/super-admin/faculties",
        icon: UserCog,
        matchPattern: "/super-admin/faculties",
    },
    {
        id: "exams",
        label: "Exams",
        path: "/super-admin/exams",
        icon: ClipboardCheck,
        matchPattern: "/super-admin/exams",
    }
];

const facultyNavItems: NavigationItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/faculty/dashboard",
        icon: Home,
    },
    {
        id: "subjects",
        label: "Subjects",
        path: "/faculty/subjects",
        icon: BookOpen,
        matchPattern: "/faculty/subjects",
    },
    {
        id: "proctoring",
        label: "Proctoring",
        path: "/faculty/proctoring",
        icon: Video,
        matchPattern: "/faculty/proctoring",
    },
    {
        id: "evaluation",
        label: "Evaluation",
        path: "/faculty/evaluation",
        icon: ClipboardList,
        matchPattern: "/faculty/evaluation",
    },
    {
        id: "profile",
        label: "Profile",
        path: "/faculty/profile",
        icon: User,
    },
];

const studentNavItems: NavigationItem[] = [
    {
        id: "dashboard",
        label: "Dashboard",
        path: "/student/dashboard",
        icon: Home,
    },
    {
        id: "subjects",
        label: "Subjects",
        path: "/student/subjects",
        icon: BookOpen,
        matchPattern: "/student/subjects",
    },
    {
        id: "exams",
        label: "My Exams",
        path: "/student/exams",
        icon: ClipboardCheck,
        matchPattern: "/student/exams",
    },
    {
        id: "profile",
        label: "Profile",
        path: "/student/profile",
        icon: User,
    },
];

const navigationItemsByRole: Record<string, NavigationItem[]> = {
    [UserRole.ADMIN]: adminNavItems,
    [UserRole.FACULTY]: facultyNavItems,
    [UserRole.STUDENT]: studentNavItems,
};

export interface RootLayoutContext {
    infoBar?: ReactNode;
}

export function RootLayout() {
    const location = useLocation();
    const { logout } = useLogout();
    const [isCollapsed, setIsCollapsed] = useState(() => {
        try {
            return localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "true";
        } catch {
            return false;
        }
    });

    const toggleSidebar = () => {
        setIsCollapsed((prev) => {
            const next = !prev;
            try {
                localStorage.setItem(SIDEBAR_COLLAPSED_STORAGE_KEY, String(next));
            } catch {
                // ignore
            }
            return next;
        });
    };

    const isActiveRoute = (item: NavigationItem): boolean => {
        // If matchPattern is defined, check if current path starts with it
        if (item.matchPattern) {
            return location.pathname.startsWith(item.matchPattern);
        }
        // Otherwise, check for exact match
        return location.pathname === item.path;
    };

    const handleLogout = () => {
        logout();
    };

    const userData = getItemFromStorage({ key: "user" }) as {
        email: string;
        role: string;
    };

    const roleInitial = userData.role?.charAt(0).toUpperCase();
    const navigationItems = navigationItemsByRole[userData.role] || [];

    return (
        <>
            <div className="flex h-screen bg-bgSecondary">
                {/* Sidebar */}
                <aside className={`${isCollapsed ? "w-16" : "w-56"} bg-whiteColor border-r border-borderLight flex flex-col shadow-xl transition-all duration-200 flex-shrink-0`}>
                    <div className={`h-16 flex items-center border-b border-borderLight flex-shrink-0 ${isCollapsed ? "justify-center px-2" : "justify-between px-4"}`}>
                        {!isCollapsed && (
                            <h1 className="font-bold text-xl text-textPrimary truncate">
                                XaminityIQ
                            </h1>
                        )}
                        <button
                            onClick={toggleSidebar}
                            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                            className="flex items-center justify-center w-8 h-8 rounded-lg text-textSecondary hover:bg-bgTertiary transition-colors flex-shrink-0 cursor-pointer"
                        >
                            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
                        </button>
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
                                    title={isCollapsed ? item.label : undefined}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isCollapsed ? "justify-center px-0" : ""} ${isActive
                                        ? "bg-primaryLighter text-primary"
                                        : "text-textSecondary hover:bg-bgTertiary"
                                        }`}
                                >
                                    <Icon className="w-5 h-5 flex-shrink-0" />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="py-2 border-t border-borderLight flex-shrink-0">
                        <button
                            onClick={handleLogout}
                            title={isCollapsed ? "Logout" : undefined}
                            className="flex items-center justify-center gap-3 px-4 py-3 w-full text-textSecondary cursor-pointer transition-colors">
                            <LogOut className="w-5 h-5 flex-shrink-0" />
                            {!isCollapsed && <span>Logout</span>}
                        </button>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col min-w-0">
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