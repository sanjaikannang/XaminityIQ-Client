import { useState } from "react";
import {
    Code,
    Users,
    Grid,
    Folder,
    AlertCircle,
    Layers,
    LucideIcon,
} from "lucide-react";
import OverView from "./Components/OverView";
import Architecture from "./Components/Architecture";
import FileStructure from "./Components/FileStructure";
import UserRole from "./Components/UserRole";
import Api from "./Components/Api";

type SectionType =
    | "overview"
    | "architecture"
    | "file-structure"
    | "roles"
    | "apis"
    | "error-codes";

export interface MenuItem {
    id: SectionType;
    label: string;
    icon: LucideIcon;
}

const Documentation = () => {
    const [activeSection, setActiveSection] = useState<SectionType>("overview");

    // OVERVIEW SECTION
    const renderOverview = () => (
        <>
            <OverView />
        </>
    );

    // ARCHITECTURE SECTION
    const renderArchitecture = () => (
        <>
            <Architecture />
        </>
    );

    // FILE STRUCTURE SECTION
    const renderFileStructure = () => (
        <>
            <FileStructure />
        </>
    );

    // ROLES SECTION
    const renderRoles = () => (
        <>
            <UserRole />
        </>
    );

    // ENHANCED API SECTION (Like the image)
    const renderAPIs = () => (
        <>
            <Api />
        </>
    );

    const renderContent = () => {
        switch (activeSection) {
            case "overview":
                return renderOverview();
            case "architecture":
                return renderArchitecture();
            case "file-structure":
                return renderFileStructure();
            case "roles":
                return renderRoles();
            case "apis":
                return renderAPIs();
            default:
                return renderOverview();
        }
    };

    return (
        <>
            <div className="flex h-screen bg-whiteColor">
                {/* Sidebar */}
                <div className="w-56 bg-whiteColor flex flex-col shadow-2xl">
                    <div className="p-6 border-b border-lightGrayColor">
                        <div className="flex items-center justify-center gap-3">
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">XaminityIQ</h1>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 overflow-y-auto p-2">
                        <div className="space-y-1">
                            {(
                                [
                                    { id: "overview", label: "Overview", icon: Grid },
                                    { id: "architecture", label: "Architecture", icon: Layers },
                                    { id: "file-structure", label: "File Structure", icon: Folder },
                                    { id: "roles", label: "User Roles", icon: Users },
                                    { id: "apis", label: "API Reference", icon: Code },
                                    { id: "error-codes", label: "Error Codes", icon: AlertCircle },
                                ] as MenuItem[]
                            ).map((item) => {
                                const Icon = item.icon;
                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => setActiveSection(item.id)}
                                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all cursor-pointer ${activeSection === item.id
                                            ? "bg-tertiary text-primary font-medium"
                                            : "text-slate-700 hover:bg-lightGrayColor"
                                            }`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </nav>

                    <div className="p-4 border-t border-slate-200 text-xs text-slate-500 text-center">
                        Version: 1.1.1
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="w-full mx-auto p-8">{renderContent()}</div>
                </div>
            </div>
        </>
    );
};

export default Documentation;