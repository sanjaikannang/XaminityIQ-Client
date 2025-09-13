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

interface Alert {
    id: string;
    type: "warning" | "error" | "info";
    message: string;
    studentId: string;
    time: Date;
}

interface AlertsProps {
    alerts: Alert[];
    students: Student[];
}

const Alerts: React.FC<AlertsProps> = ({ alerts, students }) => {
    return (
        <>
            <div className="overflow-y-auto px-3 border-t border-gray-300">
                <div className="space-y-3 mt-4">
                    {alerts.map((alert) => (
                        <div
                            key={alert.id}
                            className={`p-2 rounded-md border ${alert.type === "error"
                                ? "bg-red-50 border-red-500"
                                : alert.type === "warning"
                                    ? "bg-yellow-50 border-yellow-500"
                                    : "bg-blue-50 border-blue-500"
                                }`}
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-900">
                                        {alert.message}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Student:{" "}
                                        {students.find((s) => s.id === alert.studentId)?.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {alert.time.toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    {alerts.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                            No alerts at the moment
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Alerts;
