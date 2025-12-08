import { JSX, SetStateAction, useState } from "react";
import { docs } from "./docs/docs";
import {
    Book,
    Code,
    Users,
    Lock,
    Grid,
    ChevronRight,
    ChevronDown,
    Copy,
    Check,
    FileCode,
    Folder,
    Shield,
    AlertCircle,
    Layers,
    Package,
    Terminal,
    Search,
    Circle,
    LucideIcon,
} from "lucide-react";

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

interface ProjectInfo {
    name: string;
    version: string;
    lastUpdated: string;
    description: string;
}

interface TechStack {
    frontend: string[];
    backend: string[];
    authentication: string[];
}

interface OverviewSection {
    title: string;
    description: string;
    techStack: TechStack;
    features: string[];
}

interface ArchitectureLayer {
    name: string;
    description: string;
    components: string[];
}

interface Architecture {
    title: string;
    type: string;
    layers: ArchitectureLayer[];
}

interface FileNode {
    name: string;
    type: "file" | "directory";
    description?: string;
    children?: FileNode[];
    files?: string[];
}

interface FileStructure {
    backend: {
        root: string;
        structure: FileNode[];
    };
    frontend: {
        root: string;
        structure: FileNode[];
    };
}

interface RoleInfo {
    name: string;
    key: string;
    description: string;
    permissions: string[];
    accessibleModules?: string[];
}

interface ErrorResponse {
    status: number;
    body: Record<string, any>;
}

interface EndpointResponse {
    status: number;
    body: Record<string, any>;
    headers?: Record<string, string>;
}

interface Endpoint {
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    path: string;
    description: string;
    accessRoles: string[];
    requestBody?: Record<string, any> | null;
    queryParams?: Record<string, string>;
    pathParams?: Record<string, string>;
    requestCookies?: Record<string, string>;
    responseSuccess: EndpointResponse;
    responseError?: ErrorResponse[];
}

interface ApiModule {
    id: string;
    name: string;
    description: string;
    icon: string;
    endpoints: Endpoint[];
    flowDiagram?: string;
    sequenceDiagram?: string;
}

interface ErrorCode {
    code: number;
    name: string;
    description: string;
}

interface DocumentationData {
    project: ProjectInfo;
    overview: OverviewSection;
    architecture: Architecture;
    fileStructure: FileStructure;
    roles: RoleInfo[];
    apiModules: ApiModule[];
    errorCodes: ErrorCode[];
}

type SectionType =
    | "overview"
    | "architecture"
    | "file-structure"
    | "roles"
    | "apis"
    | "error-codes";

interface MenuItem {
    id: SectionType;
    label: string;
    icon: LucideIcon;
}

const Documentation = () => {
    const docData = docs as DocumentationData;
    const [activeSection, setActiveSection] = useState<SectionType>("overview");
    const [expandedEndpoints, setExpandedEndpoints] = useState<
        Record<string, boolean>
    >({});
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [selectedModule, setSelectedModule] = useState<ApiModule | null>(null);

    const toggleEndpoint = (id: string) => {
        setExpandedEndpoints((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const copyToClipboard = (text: string, id: SetStateAction<string | null>) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const getMethodColor = (method: string): string => {
        const colors: Record<string, string> = {
            GET: "bg-blue-500 text-white",
            POST: "bg-green-500 text-white",
            PUT: "bg-yellow-500 text-white",
            DELETE: "bg-red-500 text-white",
            PATCH: "bg-purple-500 text-white",
        };
        return colors[method] || "bg-gray-500 text-white";
    };

    const getStatusColor = (status: number): string => {
        if (status >= 200 && status < 300) return "text-green-600 bg-green-50";
        if (status >= 400 && status < 500) return "text-orange-600 bg-orange-50";
        if (status >= 500) return "text-red-600 bg-red-50";
        return "text-gray-600 bg-gray-50";
    };

    // OVERVIEW SECTION
    const renderOverview = () => (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    {docData.project.name}
                </h1>
                <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                        v{docData.project.version}
                    </span>
                    <span>Last Updated: {docData.project.lastUpdated}</span>
                </div>
                <p className="text-lg text-slate-600">{docData.project.description}</p>
            </div>

            <div className="border-t border-slate-200 pt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    {docData.overview.title}
                </h2>
                <p className="text-slate-600 mb-6">{docData.overview.description}</p>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    {[
                        { name: "Frontend", items: docData.overview.techStack.frontend },
                        { name: "Backend", items: docData.overview.techStack.backend },
                        {
                            name: "Authentication",
                            items: docData.overview.techStack.authentication,
                        },
                    ].map((section, index) => (
                        <div
                            key={index}
                            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm"
                        >
                            <h3 className="font-semibold text-slate-900 mb-3">{section.name}</h3>
                            <div className="space-y-2">
                                {section.items.map((tech, idx) => (
                                    <div key={idx} className="flex items-center gap-2">
                                        <Circle className="w-2 h-2 fill-blue-500 text-blue-500" />
                                        <span className="text-sm text-slate-700">{tech}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <h3 className="text-xl font-semibold text-slate-900 mb-4">Key Features</h3>
                <div className="grid grid-cols-2 gap-4">
                    {docData.overview.features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="flex items-start gap-3 p-4 bg-white rounded-lg border border-slate-200 shadow-sm"
                        >
                            <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700">{feature}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // ARCHITECTURE SECTION
    const renderArchitecture = () => (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    System Architecture
                </h1>
                <p className="text-lg text-slate-600">
                    Understanding the system design and layer organization
                </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <Layers className="w-6 h-6 text-blue-500" />
                    <h2 className="text-2xl font-bold text-slate-900">Architecture Type</h2>
                </div>
                <p className="text-slate-600 mb-6">
                    This system follows a{" "}
                    <span className="font-semibold text-slate-900">
                        {docData.architecture.type}
                    </span>{" "}
                    architecture pattern.
                </p>

                <div className="space-y-6">
                    {docData.architecture.layers.map((layer, idx) => (
                        <div
                            key={idx}
                            className="border border-slate-200 rounded-lg overflow-hidden"
                        >
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 border-b border-slate-200">
                                <h3 className="text-lg font-bold text-slate-900">{layer.name}</h3>
                                <p className="text-sm text-slate-600 mt-1">{layer.description}</p>
                            </div>
                            <div className="p-4 bg-white">
                                <h4 className="text-sm font-semibold text-slate-900 mb-3">
                                    Components
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {layer.components.map((component, cidx) => (
                                        <span
                                            key={cidx}
                                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md text-sm font-medium"
                                        >
                                            {component}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    // FILE STRUCTURE SECTION
    const renderFileStructure = () => {
        const renderTree = (
            node: FileNode,
            level: number = 0
        ): JSX.Element | null => {
            if (node.type === "file") {
                return (
                    <div
                        key={node.name}
                        className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded"
                    >
                        <FileCode className="w-4 h-4 text-slate-400" />
                        <span className="text-sm text-slate-700 font-mono">{node.name}</span>
                        {node.description && (
                            <span className="text-xs text-slate-500 ml-2">- {node.description}</span>
                        )}
                    </div>
                );
            }

            return (
                <div key={node.name} className="space-y-1">
                    <div className="flex items-center gap-2 py-1 px-2 font-medium">
                        <Folder className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-slate-900 font-mono">{node.name}</span>
                        {node.description && (
                            <span className="text-xs text-slate-500 ml-2">- {node.description}</span>
                        )}
                    </div>
                    <div className="ml-6 border-l-2 border-slate-200 pl-4">
                        {node.children?.map((child) => renderTree(child, level + 1))}
                        {node.files?.map((file) => (
                            <div
                                key={file}
                                className="flex items-center gap-2 py-1 px-2 hover:bg-slate-50 rounded"
                            >
                                <FileCode className="w-4 h-4 text-slate-400" />
                                <span className="text-sm text-slate-700 font-mono">{file}</span>
                            </div>
                        ))}
                    </div>
                </div>
            );
        };

        return (
            <div className="space-y-8">
                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-2">File Structure</h1>
                    <p className="text-lg text-slate-600">
                        Project organization and directory layout
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Terminal className="w-6 h-6 text-green-500" />
                            <h2 className="text-xl font-bold text-slate-900">Backend Structure</h2>
                        </div>
                        <div className="space-y-1 font-mono text-sm">
                            {docData.fileStructure.backend.structure.map((node) => renderTree(node))}
                        </div>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <Package className="w-6 h-6 text-blue-500" />
                            <h2 className="text-xl font-bold text-slate-900">Frontend Structure</h2>
                        </div>
                        <div className="space-y-1 font-mono text-sm">
                            {docData.fileStructure.frontend.structure.map((node) =>
                                renderTree(node)
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // ROLES SECTION
    const renderRoles = () => (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">
                    User Roles & Permissions
                </h1>
                <p className="text-lg text-slate-600">
                    Role-based access control defining user capabilities
                </p>
            </div>

            <div className="space-y-6">
                {docData.roles.map((role, idx) => (
                    <div
                        key={idx}
                        className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm"
                    >
                        <div className="bg-gradient-to-r from-slate-50 to-slate-100 p-6 border-b border-slate-200">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{role.name}</h3>
                                    <span className="text-sm text-slate-600 font-mono">{role.key}</span>
                                </div>
                            </div>
                            <p className="text-slate-600">{role.description}</p>
                        </div>

                        <div className="p-6">
                            <h4 className="font-semibold text-slate-900 mb-3">Permissions</h4>
                            <div className="space-y-2">
                                {role.permissions.map((permission, pidx) => (
                                    <div key={pidx} className="flex items-start gap-2">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                        <span className="text-slate-700">{permission}</span>
                                    </div>
                                ))}
                            </div>

                            {role.accessibleModules && (
                                <div className="mt-6">
                                    <h4 className="font-semibold text-slate-900 mb-3">
                                        Accessible Modules
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {role.accessibleModules.map((module, midx) => (
                                            <span
                                                key={midx}
                                                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md text-sm font-medium"
                                            >
                                                {module.replace(/_/g, " ")}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    // ENHANCED API SECTION (Like the image)
    const renderAPIs = () => {
        const filteredModules = docData.apiModules.filter((module) =>
            module.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        return (
            <div className="flex gap-6 h-full">
                {/* Left Sidebar - API Modules List */}
                <div className="w-80 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-slate-200">
                        <h2 className="text-xl font-bold text-slate-900 mb-4">API Modules</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search APIs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    <div
                        className="overflow-y-auto"
                        style={{ maxHeight: "calc(100vh - 250px)" }}
                    >
                        <div className="p-2">
                            {filteredModules.map((module) => (
                                <div key={module.id} className="mb-2">
                                    <button
                                        onClick={() => setSelectedModule(module)}
                                        className={`w-full text-left p-3 rounded-lg transition-colors ${selectedModule?.id === module.id
                                                ? "bg-blue-50 text-blue-700 font-medium"
                                                : "hover:bg-slate-50 text-slate-700"
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <Lock className="w-5 h-5" />
                                            <div className="flex-1">
                                                <div className="font-medium">{module.name}</div>
                                                <div className="text-xs text-slate-500 mt-1">
                                                    {module.endpoints.length} endpoints
                                                </div>
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content - API Details */}
                <div className="flex-1 overflow-y-auto">
                    {!selectedModule ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <Code className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-slate-600 mb-2">
                                    Select an API module
                                </h3>
                                <p className="text-slate-500">
                                    Choose a module from the left to view its endpoints
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Module Header */}
                            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-slate-900">
                                            {selectedModule.name}
                                        </h1>
                                        <p className="text-slate-600 mt-1">{selectedModule.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Endpoints List */}
                            <div className="space-y-4">
                                {selectedModule.endpoints.map((endpoint, idx) => {
                                    const endpointId = `${selectedModule.id}-${idx}`;
                                    const isExpanded = expandedEndpoints[endpointId];

                                    return (
                                        <div
                                            key={endpointId}
                                            className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm"
                                        >
                                            {/* Endpoint Header */}
                                            <div
                                                className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors"
                                                onClick={() => toggleEndpoint(endpointId)}
                                            >
                                                {isExpanded ? (
                                                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0" />
                                                )}

                                                <span
                                                    className={`px-3 py-1 rounded-md font-bold text-xs ${getMethodColor(
                                                        endpoint.method
                                                    )}`}
                                                >
                                                    {endpoint.method}
                                                </span>

                                                <code className="text-sm font-mono text-slate-700 flex-1">
                                                    {endpoint.path}
                                                </code>

                                                <div className="flex gap-2 flex-shrink-0">
                                                    {endpoint.accessRoles.map((role) => (
                                                        <span
                                                            key={role}
                                                            className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded font-medium"
                                                        >
                                                            {role}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Expanded Content */}
                                            {isExpanded && (
                                                <div className="border-t border-slate-200 bg-slate-50">
                                                    <div className="p-6 space-y-6">
                                                        {/* Description */}
                                                        <div>
                                                            <p className="text-slate-600">{endpoint.description}</p>
                                                        </div>

                                                        {/* Security */}
                                                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                                                            <div className="flex items-center gap-2 mb-3">
                                                                <Shield className="w-5 h-5 text-slate-700" />
                                                                <h4 className="font-semibold text-slate-900">Security</h4>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-slate-600">API Key</span>
                                                                </div>
                                                                <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded border border-slate-200">
                                                                    Header parameter name:{" "}
                                                                    <code className="text-slate-700 font-mono">api_token</code>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Path Parameters */}
                                                        {endpoint.pathParams && (
                                                            <div className="bg-white rounded-lg p-4 border border-slate-200">
                                                                <h4 className="font-semibold text-slate-900 mb-3">
                                                                    Path Parameters
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {Object.entries(endpoint.pathParams).map(([key, value]) => (
                                                                        <div
                                                                            key={key}
                                                                            className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0"
                                                                        >
                                                                            <div>
                                                                                <code className="text-sm font-mono text-slate-700">
                                                                                    {key}
                                                                                </code>
                                                                                <div className="text-xs text-slate-500 mt-1">{value}</div>
                                                                            </div>
                                                                            <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded font-medium">
                                                                                Required
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Query Parameters */}
                                                        {endpoint.queryParams && (
                                                            <div className="bg-white rounded-lg p-4 border border-slate-200">
                                                                <h4 className="font-semibold text-slate-900 mb-3">
                                                                    Query Parameters
                                                                </h4>
                                                                <div className="space-y-2">
                                                                    {Object.entries(endpoint.queryParams).map(([key, value]) => (
                                                                        <div
                                                                            key={key}
                                                                            className="flex items-start justify-between py-2 border-b border-slate-100 last:border-0"
                                                                        >
                                                                            <div>
                                                                                <code className="text-sm font-mono text-slate-700">
                                                                                    {key}
                                                                                </code>
                                                                                <div className="text-xs text-slate-500 mt-1">{value}</div>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Request Body */}
                                                        {endpoint.requestBody && (
                                                            <div className="bg-white rounded-lg p-4 border border-slate-200">
                                                                <h4 className="font-semibold text-slate-900 mb-3">
                                                                    Request Body
                                                                </h4>
                                                                <div className="bg-slate-900 rounded-lg p-4 relative">
                                                                    <button
                                                                        onClick={() =>
                                                                            copyToClipboard(
                                                                                JSON.stringify(endpoint.requestBody, null, 2),
                                                                                `req-${endpointId}`
                                                                            )
                                                                        }
                                                                        className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded transition-colors"
                                                                    >
                                                                        {copiedCode === `req-${endpointId}` ? (
                                                                            <Check className="w-4 h-4 text-green-400" />
                                                                        ) : (
                                                                            <Copy className="w-4 h-4 text-slate-400" />
                                                                        )}
                                                                    </button>
                                                                    <pre className="text-sm text-green-400 overflow-x-auto">
                                                                        {JSON.stringify(endpoint.requestBody, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            </div>
                                                        )}

                                                        {/* Responses */}
                                                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                                                            <h4 className="font-semibold text-slate-900 mb-4">Responses</h4>

                                                            {/* Success Response */}
                                                            <div className="mb-4">
                                                                <div className="flex items-center gap-2 mb-2">
                                                                    <Circle className={`w-3 h-3 fill-green-500 text-green-500`} />
                                                                    <span
                                                                        className={`px-3 py-1 rounded-md font-mono text-sm font-bold ${getStatusColor(
                                                                            endpoint.responseSuccess.status
                                                                        )}`}
                                                                    >
                                                                        {endpoint.responseSuccess.status}
                                                                    </span>
                                                                    <span className="text-slate-600">Success</span>
                                                                </div>
                                                                <div className="bg-slate-900 rounded-lg p-4 relative mt-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            copyToClipboard(
                                                                                JSON.stringify(endpoint.responseSuccess.body, null, 2),
                                                                                `res-${endpointId}`
                                                                            )
                                                                        }
                                                                        className="absolute top-2 right-2 p-2 hover:bg-slate-800 rounded transition-colors"
                                                                    >
                                                                        {copiedCode === `res-${endpointId}` ? (
                                                                            <Check className="w-4 h-4 text-green-400" />
                                                                        ) : (
                                                                            <Copy className="w-4 h-4 text-slate-400" />
                                                                        )}
                                                                    </button>
                                                                    <pre className="text-sm text-blue-400 overflow-x-auto">
                                                                        {JSON.stringify(endpoint.responseSuccess.body, null, 2)}
                                                                    </pre>
                                                                </div>
                                                            </div>

                                                            {/* Error Responses */}
                                                            {endpoint.responseError &&
                                                                endpoint.responseError.map((err, eidx) => (
                                                                    <div key={eidx} className="mb-4">
                                                                        <div className="flex items-center gap-2 mb-2">
                                                                            <Circle className={`w-3 h-3 fill-red-500 text-red-500`} />
                                                                            <span
                                                                                className={`px-3 py-1 rounded-md font-mono text-sm font-bold ${getStatusColor(
                                                                                    err.status
                                                                                )}`}
                                                                            >
                                                                                {err.status}
                                                                            </span>
                                                                            <span className="text-slate-600">
                                                                                {err.body.error || "Error"}
                                                                            </span>
                                                                        </div>
                                                                        <div className="bg-slate-900 rounded-lg p-4">
                                                                            <pre className="text-sm text-red-400 overflow-x-auto">
                                                                                {JSON.stringify(err.body, null, 2)}
                                                                            </pre>
                                                                        </div>
                                                                    </div>
                                                                ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // ERROR CODES SECTION
    const renderErrorCodes = () => (
        <div className="space-y-6">
            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-2">Error Codes</h1>
                <p className="text-lg text-slate-600">
                    Standard HTTP error codes and their meanings
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {docData.errorCodes.map((error, idx) => (
                    <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm"
                    >
                        <div className="flex items-center gap-3 mb-3">
                            <AlertCircle className="w-6 h-6 text-red-500" />
                            <div>
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`px-3 py-1 rounded-md font-mono text-sm font-bold ${getStatusColor(
                                            error.code
                                        )}`}
                                    >
                                        {error.code}
                                    </span>
                                    <h3 className="font-bold text-slate-900">{error.name}</h3>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-600">{error.description}</p>
                    </div>
                ))}
            </div>
        </div>
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
            case "error-codes":
                return renderErrorCodes();
            default:
                return renderOverview();
        }
    };

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
                <div className="p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                            <Book className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-slate-900">Documentation</h1>
                            <p className="text-xs text-slate-500">v{docData.project.version}</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4">
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
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${activeSection === item.id
                                            ? "bg-blue-50 text-blue-700 font-medium"
                                            : "text-slate-700 hover:bg-slate-100"
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
                    Last updated: {docData.project.lastUpdated}
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto">
                <div className="w-full mx-auto p-8">{renderContent()}</div>
            </div>
        </div>
    );
};

export default Documentation;