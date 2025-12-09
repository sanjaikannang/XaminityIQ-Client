import { JSX } from "react";
import { FileNode } from "../types";
import { FileCode, Folder } from "lucide-react";

const FileStructure = () => {
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
            <>
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
            </>
        );
    };

    return (
        <>
        </>
    );
};

export default FileStructure;