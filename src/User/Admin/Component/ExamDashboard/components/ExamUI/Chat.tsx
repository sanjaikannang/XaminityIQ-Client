import React, { useState } from "react";
import { User } from "lucide-react";

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

interface Message {
    id: string;
    text: string;
    sender: "faculty" | "student";
    timestamp: Date;
}

interface ChatProps {
    students: Student[];
    selectedChatUser: Student | null;
    onSelectChatUser: (student: Student | null) => void;
}

const Chat: React.FC<ChatProps> = ({
    students,
    selectedChatUser,
    onSelectChatUser,
}) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Hi! How can I help you?",
            sender: "faculty",
            timestamp: new Date(Date.now() - 300000),
        },
        {
            id: "2",
            text: "I have a doubt regarding the assignment.",
            sender: "student",
            timestamp: new Date(Date.now() - 120000),
        },
    ]);
    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;

        const message: Message = {
            id: Date.now().toString(),
            text: newMessage,
            sender: "faculty",
            timestamp: new Date(),
        };

        setMessages([...messages, message]);
        setNewMessage("");
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // Chat List View
    if (!selectedChatUser) {
        return (
            <>
                <div className="space-y-3 overflow-y-auto border-t border-gray-300 p-3">
                    {students.map((student) => (
                        <div
                            key={student.id}
                            className="flex items-center gap-3 p-2 rounded-md border border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100"
                            onClick={() => onSelectChatUser(student)}
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {student.name}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Roll No: {student.rollNumber}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }

    // Individual Chat View
    return (
        <>
            <div className="flex flex-col h-screen">
                {/* Chat Header */}
                <div className="flex items-center gap-1 border-b border-gray-300 pb-2 mb-3">
                    <button
                        onClick={() => onSelectChatUser(null)}
                        className="text-sm text-blue-500 cursor-pointer hover:text-blue-700 px-2 py-1"
                    >
                        ← Back
                    </button>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-900">
                            {selectedChatUser.name}
                        </p>
                        <p className="text-xs text-gray-500">
                            Roll No: {selectedChatUser.rollNumber}
                        </p>
                    </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-2 p-2 bg-gray-50 rounded-md mb-3">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${message.sender === "faculty" ? "justify-start" : "justify-end"
                                }`}
                        >
                            <div
                                className={`max-w-[70%] p-2 rounded-lg shadow-sm ${message.sender === "faculty"
                                    ? "bg-white border"
                                    : "bg-blue-100 border border-blue-200"
                                    }`}
                            >
                                <p className="text-sm">{message.text}</p>
                                <p className="text-xs text-gray-400 mt-1">
                                    {message.timestamp.toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Chat Input */}
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Type a message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <button
                        onClick={handleSendMessage}
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Send
                    </button>
                </div>
            </div>
        </>
    );
};

export default Chat;
