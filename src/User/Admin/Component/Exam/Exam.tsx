import React, { useState, useEffect } from "react";
import VideoTile from "./VideoTile";
import Students from "./Students";
import Chat from "./Chat";
import Alerts from "./Alerts";
import ExamHeader from "./ExamHeader";

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

const Exam: React.FC = () => {
    const [students, setStudents] = useState<Student[]>([]);
    const [activeTab, setActiveTab] = useState("alerts");
    const [selectedChatUser, setSelectedChatUser] = useState<Student | null>(
        null
    );
    const [alerts, setAlerts] = useState<Alert[]>([]);

    // Mock students data
    useEffect(() => {
        const mockStudents: Student[] = Array.from({ length: 20 }, (_, i) => ({
            id: `student-${i + 1}`,
            name: `Student ${(i + 1).toString().padStart(3, "0")}`,
            rollNumber: `CS${2024000 + i + 1}`,
            isVideoEnabled: Math.random() > 0.1,
            isAudioEnabled: false,
            connectionQuality: (["excellent", "good", "poor"] as const)[
                Math.floor(Math.random() * 3)
            ],
            warnings: Math.random() > 0.7 ? ["Tab switch detected"] : [],
            screenSharing: Math.random() > 0.2,
            lastActivity: new Date(Date.now() - Math.random() * 60000),
        }));
        setStudents(mockStudents);

        // Mock alerts
        const mockAlerts: Alert[] = [
            {
                id: "1",
                type: "warning",
                message: "Tab switch detected",
                studentId: "student-3",
                time: new Date(),
            },
            {
                id: "2",
                type: "error",
                message: "Connection lost",
                studentId: "student-7",
                time: new Date(Date.now() - 120000),
            },
            {
                id: "3",
                type: "info",
                message: "Student rejoined",
                studentId: "student-12",
                time: new Date(Date.now() - 300000),
            },
        ];
        setAlerts(mockAlerts);
    }, []);

    const renderTabContent = () => {
        if (selectedChatUser || activeTab === "chat") {
            return (
                <Chat
                    students={students}
                    selectedChatUser={selectedChatUser}
                    onSelectChatUser={setSelectedChatUser}
                />
            );
        }

        switch (activeTab) {
            case "alerts":
                return <Alerts alerts={alerts} students={students} />;
            case "students":
                return <Students students={students} />;
            default:
                return <Alerts alerts={alerts} students={students} />;
        }
    };

    return (
        <div className="h-screen flex flex-col overflow-hidden no-scrollbar border border-gray-300 rounded-md mt-6">
            {/* Header - Fixed at top */}
            <div className="flex-shrink-0">
                <ExamHeader
                    alertsCount={alerts.length}
                    studentsCount={students.length}
                    examTitle="Computer Science Examination"
                />
            </div>

            {/* Main Content Area - Scrollable */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-3">
                <div className="flex gap-3 h-full">
                    {/* Main Video Grid */}
                    <div className="flex-1">
                        <div className="bg-white rounded-md shadow-lg border border-gray-300 h-full flex flex-col">
                            <div className="border-b border-gray-300 p-3 flex-shrink-0">
                                <h2 className="text-lg font-semibold text-gray-800">
                                    Student Monitoring Grid ({students.length} students)
                                </h2>
                            </div>

                            {/* 5x4 Video Grid - Scrollable */}
                            <div className="flex-1 overflow-y-auto no-scrollbar p-3">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                                    {students.map((student, index) => (
                                        <VideoTile key={student.id} student={student} index={index} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar */}
                    <div className="w-[350px] bg-white rounded-md shadow-lg border border-gray-300 flex flex-col h-full">
                        {/* Tab Navigation - Hide when in chat view */}
                        {!selectedChatUser && (
                            <div className="flex items-center justify-around py-3.5 flex-shrink-0">
                                {["alerts", "students", "chat"].map((tab) => (
                                    <div
                                        key={tab}
                                        className={`cursor-pointer capitalize transition-colors ${activeTab === tab
                                            ? "font-semibold text-blue-600"
                                            : "text-gray-500 hover:text-gray-700"
                                            }`}
                                        onClick={() => setActiveTab(tab)}
                                    >
                                        {tab}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Tab Content - Scrollable */}
                        <div className="flex-1 overflow-y-auto no-scrollbar">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exam;