import { docs } from "../docs/docs";
import { Layers } from "lucide-react";
import { DocumentationData } from "../types";

const Architecture = () => {
    const docData = docs as DocumentationData;

    return (
        <>
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
        </>
    )
}

export default Architecture