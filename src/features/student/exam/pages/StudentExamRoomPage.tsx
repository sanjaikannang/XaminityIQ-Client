import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { selectLocalPeer, selectPeers, selectIsConnectedToRoom } from "@100mslive/hms-video-store";
import { HMSRoomProvider, useHMSActions, useHMSStore } from "@100mslive/react-sdk";

const StudentExamRoomContent = () => {
    const hmsActions = useHMSActions();
    const location = useLocation();
    const navigate = useNavigate();

    const localPeer = useHMSStore(selectLocalPeer);
    const peers = useHMSStore(selectPeers);
    const isConnected = useHMSStore(selectIsConnectedToRoom);

    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [messages, setMessages] = useState<Array<{ sender: string; message: string; timestamp: Date }>>([]);
    const [messageInput, setMessageInput] = useState("");
    const [showChat, setShowChat] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const { examName, roomCode, authToken } = location.state || {};

    useEffect(() => {
        if (!roomCode || !authToken) {
            alert("Invalid exam session");
            navigate("/student/exams");
            return;
        }

        const joinRoom = async () => {
            try {
                await hmsActions.join({
                    userName: localPeer?.name || "Student",
                    authToken: authToken,
                    settings: {
                        isAudioMuted: false,
                        isVideoMuted: false,
                    },
                });
            } catch (error) {
                console.error("Failed to join room:", error);
                alert("Failed to join exam room");
                navigate("/student/exams");
            }
        };

        joinRoom();

        return () => {
            hmsActions.leave();
        };
    }, []);

    useEffect(() => {
        if (localPeer?.videoTrack && videoRef.current) {
            hmsActions.attachVideo(localPeer.videoTrack.id, videoRef.current);
        }
    }, [localPeer?.videoTrack]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const toggleAudio = async () => {
        await hmsActions.setLocalAudioEnabled(isMuted);
        setIsMuted(!isMuted);
    };

    const toggleVideo = async () => {
        await hmsActions.setLocalVideoEnabled(isVideoOff);
        setIsVideoOff(!isVideoOff);
    };

    const sendMessage = () => {
        if (messageInput.trim()) {
            // Send message to faculty only
            hmsActions.sendBroadcastMessage(messageInput, ["faculty"]);

            setMessages([
                ...messages,
                {
                    sender: "You",
                    message: messageInput,
                    timestamp: new Date(),
                },
            ]);
            setMessageInput("");
        }
    };

    const handleLeaveExam = async () => {
        if (window.confirm("Are you sure you want to leave the exam?")) {
            await hmsActions.leave();
            navigate("/student/exams");
        }
    };

    const facultyPeers = peers.filter((peer) => peer.roleName?.toLowerCase() === "faculty");

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-white text-xl font-semibold">{examName}</h1>
                    <p className="text-gray-400 text-sm">
                        {isConnected ? "Connected" : "Connecting..."}
                    </p>
                </div>
                <button
                    onClick={handleLeaveExam}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Leave Exam
                </button>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex overflow-hidden">
                {/* Video Section */}
                <div className="flex-1 p-4 flex flex-col">
                    {/* Your Video */}
                    <div className="mb-4">
                        <h2 className="text-white text-lg mb-2">Your Video</h2>
                        <div className="relative bg-gray-800 rounded-lg overflow-hidden" style={{ height: "300px" }}>
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                                <button
                                    onClick={toggleAudio}
                                    className={`p-3 rounded-full ${isMuted ? "bg-red-600" : "bg-gray-700"
                                        } text-white hover:opacity-80 transition-opacity`}
                                >
                                    {isMuted ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                        </svg>
                                    )}
                                </button>
                                <button
                                    onClick={toggleVideo}
                                    className={`p-3 rounded-full ${isVideoOff ? "bg-red-600" : "bg-gray-700"
                                        } text-white hover:opacity-80 transition-opacity`}
                                >
                                    {isVideoOff ? (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" />
                                        </svg>
                                    ) : (
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Faculty Instructions/Messages */}
                    <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto">
                        <h2 className="text-white text-lg mb-2">Proctor Feed</h2>
                        <div className="text-gray-400 text-sm">
                            {facultyPeers.length > 0 ? (
                                <p>{facultyPeers.length} proctor(s) monitoring this exam</p>
                            ) : (
                                <p>Waiting for proctor to join...</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Chat Panel */}
                {showChat && (
                    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h2 className="text-white font-semibold">Chat with Proctor</h2>
                            <button
                                onClick={() => setShowChat(false)}
                                className="text-gray-400 hover:text-white"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {messages.map((msg, idx) => (
                                <div key={idx} className="bg-gray-700 rounded-lg p-3">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-blue-400 text-sm font-medium">{msg.sender}</span>
                                        <span className="text-gray-500 text-xs">
                                            {msg.timestamp.toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <p className="text-white text-sm">{msg.message}</p>
                                </div>
                            ))}
                            <div ref={chatEndRef} />
                        </div>

                        <div className="p-4 border-t border-gray-700">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </button>
            )}
        </div>
    );
};

const StudentExamRoomPage = () => {
    return (
        <HMSRoomProvider>
            <StudentExamRoomContent />
        </HMSRoomProvider>
    );
};

export default StudentExamRoomPage;