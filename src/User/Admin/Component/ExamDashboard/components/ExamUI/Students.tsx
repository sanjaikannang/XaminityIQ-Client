import React from "react";

interface Student {
    id: string;
    name: string;
    rollNumber: string;
    stream?: any;
    isVideoEnabled: boolean;
    isAudioEnabled: boolean;
    connectionQuality: "excellent" | "good" | "poor" | "disconnected";
    warnings: string[];
    screenSharing: boolean;
    lastActivity: Date;
}

interface StudentsProps {
    students: Student[];
}

const Students: React.FC<StudentsProps> = ({ students }) => {
    const getConnectionBadge = (quality: Student["connectionQuality"]) => {
        const badges = {
            excellent: "bg-green-100 text-green-800",
            good: "bg-blue-100 text-blue-800",
            poor: "bg-yellow-100 text-yellow-800",
            disconnected: "bg-red-100 text-red-800",
        };
        return badges[quality] || badges.poor;
    };

    return (
        <>
            <div className="space-y-3 overflow-y-auto p-3 border-t border-gray-300">
                {students.map((student) => (
                    <div 
                        key={student.id}
                        className="p-3 rounded-md border border-gray-300 bg-gray-50"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {student.name}
                                </p>
                                <p className="text-xs text-gray-500 mb-2">
                                    Roll: {student.rollNumber}
                                </p>
                                <div className="flex items-center space-x-2">
                                    <span
                                        className={`px-2 py-1 text-xs rounded-full ${getConnectionBadge(
                                            student.connectionQuality
                                        )}`}
                                    >
                                        {student.connectionQuality}
                                    </span>
                                    {student.warnings.length > 0 && (
                                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                                            {student.warnings.length} warning(s)
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col items-end space-y-1">
                                <div className="flex space-x-1">
                                    <span
                                        className={`w-3 h-3 rounded-full ${student.isVideoEnabled ? "bg-green-500" : "bg-red-500"
                                            }`}
                                        title="Video"
                                    ></span>
                                    <span
                                        className={`w-3 h-3 rounded-full ${student.isAudioEnabled ? "bg-green-500" : "bg-red-500"
                                            }`}
                                        title="Audio"
                                    ></span>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Last active:{" "}
                                    {Math.floor(
                                        (Date.now() - student.lastActivity.getTime()) / 1000
                                    )}
                                    s ago
                                </p>
                            </div>
                        </div>
                        {student.warnings.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-gray-200">
                                {student.warnings.map((warning, index) => (
                                    <p key={index} className="text-xs text-red-600">
                                        • {warning}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};

export default Students;
