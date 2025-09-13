import React from "react";
import { Clock, Users, AlertTriangle } from "lucide-react";

interface HeaderProps {
    alertsCount: number;
    studentsCount: number;
    examTitle?: string;
}

const ExamHeader: React.FC<HeaderProps> = ({
    alertsCount,
    studentsCount,
    examTitle = "Computer Science",
}) => {
    return (
        <>
            <div className="bg-white py-4 px-3 rounded-t-md mb-3 border-b border-gray-300">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">
                            {examTitle}
                        </h1>
                        <div className="flex items-center space-x-6 text-sm text-gray-600">
                            <div className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>Time Remaining</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4" />
                                <span>Total Students: {studentsCount}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span>Active Alerts: {alertsCount}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamHeader;
