import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    selectPeers,
    selectIsConnectedToRoom,
    selectLocalPeer,
    selectHMSMessages,
} from "@100mslive/hms-video-store";
import {
    HMSRoomProvider,
    useHMSActions,
    useHMSStore,
} from "@100mslive/react-sdk";
import type { HMSMessage } from "@100mslive/hms-video-store";

const FacultyExamRoomContent = () => {
    const hmsActions = useHMSActions();
    const location = useLocation();
    const navigate = useNavigate();

    const localPeer = useHMSStore(selectLocalPeer);
    const peers = useHMSStore(selectPeers);
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const storeMessages = useHMSStore(selectHMSMessages) as HMSMessage[];

    const [messageInput, setMessageInput] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [broadcastMode, setBroadcastMode] = useState(true);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

    const { examName, roomId, authToken, totalStudents } = location.state || {};

    // Join room on mount
    useEffect(() => {
        if (!roomId || !authToken) {
            alert("Invalid exam session");
            navigate("/faculty/exams");
            return;
        }

        const joinRoom = async () => {
            try {
                await hmsActions.join({
                    userName: "Faculty",
                    authToken: authToken,
                    settings: {
                        isAudioMuted: false,
                        isVideoMuted: true,
                    },
                });
            } catch (error) {
                console.error("Failed to join room:", error);
                alert("Failed to join exam room");
                navigate("/faculty/exams");
            }
        };

        joinRoom();

        return () => {
            hmsActions.leave();
        };
    }, [roomId, authToken, hmsActions, navigate]);

    // Attach videos for all student peers
    useEffect(() => {
        studentPeers.forEach((peer) => {
            const videoElement = videoRefs.current[peer.id];
            if (videoElement && peer.videoTrack) {
                const videoTrack = peer.videoTrack;
                if (typeof videoTrack === "object" && "id" in videoTrack) {
                    hmsActions.attachVideo(videoTrack.id, videoElement);
                }
            }
        });
    }, [peers, hmsActions]);

    // Auto scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [storeMessages]);

    const toggleAudio = async () => {
        const audioTrack = localPeer?.audioTrack;
        const currentState = audioTrack && typeof audioTrack === "object" && "enabled" in audioTrack
            ? (audioTrack as { enabled: boolean }).enabled
            : false;
        await hmsActions.setLocalAudioEnabled(!currentState);
    };

    const toggleVideo = async () => {
        const videoTrack = localPeer?.videoTrack;
        const currentState = videoTrack && typeof videoTrack === "object" && "enabled" in videoTrack
            ? (videoTrack as { enabled: boolean }).enabled
            : false;
        await hmsActions.setLocalVideoEnabled(!currentState);
    };

    const sendMessage = async () => {
        if (messageInput.trim()) {
            try {
                if (broadcastMode) {
                    await hmsActions.sendBroadcastMessage(messageInput);
                } else if (selectedStudent) {
                    await hmsActions.sendDirectMessage(messageInput, selectedStudent);
                }
                setMessageInput("");
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }
    };

    const handleLeaveExam = async () => {
        if (window.confirm("Are you sure you want to leave the monitoring session?")) {
            await hmsActions.leave();
            navigate("/faculty/exams");
        }
    };

    const studentPeers = peers.filter((peer) => peer.roleName?.toLowerCase() === "student");

    const isAudioMuted = (() => {
        const audioTrack = localPeer?.audioTrack;
        if (!audioTrack || typeof audioTrack !== "object" || !("enabled" in audioTrack)) return true;
        return !(audioTrack as { enabled: boolean }).enabled;
    })();

    const isVideoOff = (() => {
        const videoTrack = localPeer?.videoTrack;
        if (!videoTrack || typeof videoTrack !== "object" || !("enabled" in videoTrack)) return true;
        return !(videoTrack as { enabled: boolean }).enabled;
    })();

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-white text-xl font-semibold">
                        {examName} - Proctor View
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isConnected
                            ? `Monitoring ${studentPeers.length} / ${totalStudents} students`
                            : "Connecting..."}
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={toggleAudio}
                        className={`p-2 rounded-lg ${
                            isAudioMuted ? "bg-red-600" : "bg-gray-700"
                        } text-white hover:opacity-80 transition-opacity`}
                    >
                        {isAudioMuted ? "Unmute" : "Mute"}
                    </button>
                    <button
                        onClick={toggleVideo}
                        className={`p-2 rounded-lg ${
                            isVideoOff ? "bg-gray-700" : "bg-blue-600"
                        } text-white hover:opacity-80 transition-opacity`}
                    >
                        {isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
                    </button>
                    <button
                        onClick={handleLeaveExam}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Leave
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Student Grid */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <h2 className="text-white text-lg mb-4">Student Video Grid</h2>

                    {studentPeers.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <div className="text-center">
                                <svg
                                    className="mx-auto h-12 w-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                    />
                                </svg>
                                <h3 className="mt-2 text-lg font-medium text-white">
                                    No students joined yet
                                </h3>
                                <p className="mt-1 text-gray-400">
                                    Waiting for students to join the exam...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-4 gap-4">
                            {studentPeers.map((peer) => {
                                const videoTrack = peer.videoTrack;
                                const audioTrack = peer.audioTrack;
                                
                                const isAudioMuted = audioTrack && 
                                    typeof audioTrack === "object" && 
                                    "enabled" in audioTrack
                                        ? !(audioTrack as { enabled: boolean }).enabled
                                        : false;

                                const hasVideo = videoTrack &&
                                    typeof videoTrack === "object" &&
                                    "enabled" in videoTrack
                                        ? (videoTrack as { enabled: boolean }).enabled
                                        : false;

                                return (
                                    <div
                                        key={peer.id}
                                        className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video"
                                    >
                                        {hasVideo ? (
                                            <video
                                                ref={(ref) => {
                                                    videoRefs.current[peer.id] = ref;
                                                }}
                                                autoPlay
                                                playsInline
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-700">
                                                <div className="text-center">
                                                    <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-2">
                                                        <span className="text-2xl text-white font-semibold">
                                                            {peer.name?.charAt(0).toUpperCase() || "S"}
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-400 text-sm">Camera Off</p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Student Info Overlay */}
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white text-sm font-medium">
                                                    {peer.name}
                                                </span>
                                                <div className="flex gap-1">
                                                    {isAudioMuted && (
                                                        <span className="text-red-400">
                                                            <svg
                                                                className="w-4 h-4"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
                                                                />
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={2}
                                                                    d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
                                                                />
                                                            </svg>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="absolute top-2 right-2 flex gap-1">
                                            <button
                                                onClick={() => {
                                                    setSelectedStudent(peer.id);
                                                    setShowChat(true);
                                                    setBroadcastMode(false);
                                                }}
                                                className="p-1 bg-blue-600 rounded hover:bg-blue-700 transition-colors"
                                                title="Chat with student"
                                            >
                                                <svg
                                                    className="w-4 h-4 text-white"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Chat Panel */}
                {showChat && (
                    <div className="w-96 bg-gray-800 border-l border-gray-700 flex flex-col">
                        <div className="p-4 border-b border-gray-700">
                            <div className="flex justify-between items-center mb-3">
                                <h2 className="text-white font-semibold">Communication</h2>
                                <button
                                    onClick={() => setShowChat(false)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>

                            {/* Mode Toggle */}
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setBroadcastMode(true);
                                        setSelectedStudent(null);
                                    }}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        broadcastMode
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                >
                                    Broadcast All
                                </button>
                                <button
                                    onClick={() => setBroadcastMode(false)}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                        !broadcastMode
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                                >
                                    Direct Message
                                </button>
                            </div>

                            {/* Student Selector */}
                            {!broadcastMode && (
                                <select
                                    value={selectedStudent || ""}
                                    onChange={(e) => setSelectedStudent(e.target.value)}
                                    className="w-full mt-3 px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Select a student</option>
                                    {studentPeers.map((peer) => (
                                        <option key={peer.id} value={peer.id}>
                                            {peer.name}
                                        </option>
                                    ))}
                                </select>
                            )}
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {storeMessages.map((msg: HMSMessage) => {
                                const isSentByMe = msg.senderName === localPeer?.name;
                                const recipient = msg.recipientPeer
                                    ? studentPeers.find((p) => p.id === msg.recipientPeer)?.name
                                    : null;

                                return (
                                    <div key={msg.id} className="bg-gray-700 rounded-lg p-3">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="text-blue-400 text-sm font-medium">
                                                {isSentByMe
                                                    ? recipient
                                                        ? `You to ${recipient}`
                                                        : "You (Broadcast)"
                                                    : msg.senderName}
                                            </span>
                                            <span className="text-gray-500 text-xs">
                                                {msg.time.toLocaleTimeString()}
                                            </span>
                                        </div>
                                        <p className="text-white text-sm">{msg.message}</p>
                                    </div>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder={
                                        broadcastMode
                                            ? "Message all students..."
                                            : selectedStudent
                                            ? "Message student..."
                                            : "Select a student first..."
                                    }
                                    disabled={!broadcastMode && !selectedStudent}
                                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!broadcastMode && !selectedStudent}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Chat Toggle Button */}
            {!showChat && (
                <button
                    onClick={() => setShowChat(true)}
                    className="fixed bottom-6 right-6 p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors"
                >
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                    </svg>
                </button>
            )}
        </div>
    );
};

const FacultyExamRoomPage = () => {
    return (
        <HMSRoomProvider>
            <FacultyExamRoomContent />
        </HMSRoomProvider>
    );
};

export default FacultyExamRoomPage;