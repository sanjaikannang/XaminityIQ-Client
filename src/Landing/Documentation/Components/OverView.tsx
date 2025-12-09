import { docs } from "../docs/docs";
import { DocumentationData } from "../types";
import { Check, Circle } from "lucide-react";

const OverView = () => {
    const docData = docs as DocumentationData;

    return (
        <>
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
        </>
    )
}

export default OverView