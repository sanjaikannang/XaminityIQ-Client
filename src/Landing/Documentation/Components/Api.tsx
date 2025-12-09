import { docs } from "../docs/docs";
import { Check, ChevronDown, ChevronRight, Circle, Code, Copy, Lock, Search, Shield } from "lucide-react"
import { ApiModule, DocumentationData } from "../types";
import { SetStateAction, useState } from "react";

const Api = () => {

    const [searchQuery, setSearchQuery] = useState<string>("");
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const [expandedEndpoints, setExpandedEndpoints] = useState<
        Record<string, boolean>
    >({});
    const [selectedModule, setSelectedModule] = useState<ApiModule | null>(null);

    const toggleEndpoint = (id: string) => {
        setExpandedEndpoints((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const docData = docs as DocumentationData;

    const filteredModules = docData.apiModules.filter((module) =>
        module.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

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

    const copyToClipboard = (text: string, id: SetStateAction<string | null>) => {
        navigator.clipboard.writeText(text);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <>
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
        </>
    )
}

export default Api