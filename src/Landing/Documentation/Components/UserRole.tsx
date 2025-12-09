import { docs } from "../docs/docs";
import { Check, Users } from "lucide-react"
import { DocumentationData } from "../types";

const UserRole = () => {
    const docData = docs as DocumentationData;

    return (
        <>
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
        </>
    )
}

export default UserRole