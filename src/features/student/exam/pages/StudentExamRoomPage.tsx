import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
    selectLocalPeer,
    selectPeers,
    selectIsConnectedToRoom,
    selectHMSMessages,
} from "@100mslive/hms-video-store";
import {
    HMSRoomProvider,
    useHMSActions,
    useHMSStore,
} from "@100mslive/react-sdk";
import type { HMSMessage } from "@100mslive/hms-video-store";
import { useUpdateStudentLeftStatusMutation } from "../../../../state/services/endpoints/exam";
import toast from "react-hot-toast";

const StudentExamRoomContent = () => {
    const hmsActions = useHMSActions();
    const location = useLocation();
    const navigate = useNavigate();
    const { examId } = useParams<{ examId: string }>();

    const localPeer = useHMSStore(selectLocalPeer);
    const peers = useHMSStore(selectPeers);
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const storeMessages = useHMSStore(selectHMSMessages) as HMSMessage[];

    const [messageInput, setMessageInput] = useState("");
    const [showChat, setShowChat] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [isWarningShown, setIsWarningShown] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const hasLeftRef = useRef(false);

    const [updateLeftStatus] = useUpdateStudentLeftStatusMutation();

    const { examName, roomId, authToken, examDate, endTime } = location.state || {};

    // Calculate exam end time
    const getExamEndTime = () => {
        if (!examDate || !endTime) return null;

        const examDateObj = new Date(examDate);
        const [endHour, endMin] = endTime.split(':').map(Number);
        examDateObj.setHours(endHour, endMin, 0, 0);
        return examDateObj;
    };

    // Join room on mount
    useEffect(() => {
        if (!roomId || !authToken) {
            toast.error("Invalid exam session");
            navigate("/student/exams");
            return;
        }

        const joinRoom = async () => {
            try {
                await hmsActions.join({
                    userName: "Student",
                    authToken: authToken,
                    settings: {
                        isAudioMuted: false,
                        isVideoMuted: false,
                    },
                });
                toast.success("Joined exam room successfully");
            } catch (error) {
                console.error("Failed to join room:", error);
                toast.error("Failed to join exam room");
                navigate("/student/exams");
            }
        };

        joinRoom();

        return () => {
            if (isConnected && !hasLeftRef.current) {
                handleLeaveExam(false);
            }
        };
    }, [roomId, authToken]);

    // Monitor exam time and auto-disconnect
    useEffect(() => {
        const examEndTime = getExamEndTime();
        if (!examEndTime) return;

        const checkTime = () => {
            const now = new Date();
            const timeDiff = examEndTime.getTime() - now.getTime();

            // Calculate time remaining
            const minutesRemaining = Math.floor(timeDiff / 60000);
            const secondsRemaining = Math.floor((timeDiff % 60000) / 1000);

            if (timeDiff <= 0) {
                // Exam time has ended
                toast.error("Exam time has ended. Disconnecting...");
                handleLeaveExam(true);
                return;
            }

            // Show warning at 5 minutes
            if (minutesRemaining === 5 && !isWarningShown) {
                toast.error("5 minutes remaining in the exam!");
                setIsWarningShown(true);
            }

            // Show warning at 1 minute
            if (minutesRemaining === 1 && secondsRemaining === 0) {
                toast.error("1 minute remaining in the exam!");
            }

            // Update display
            if (minutesRemaining < 10) {
                setTimeRemaining(`${minutesRemaining}:${secondsRemaining.toString().padStart(2, '0')}`);
            }
        };

        const interval = setInterval(checkTime, 1000);
        checkTime(); // Initial check

        return () => clearInterval(interval);
    }, [examDate, endTime, isWarningShown]);

    // Attach local video
    useEffect(() => {
        if (localPeer?.videoTrack && videoRef.current) {
            const videoTrack = localPeer.videoTrack;
            if (typeof videoTrack === "object" && "id" in videoTrack) {
                hmsActions.attachVideo(videoTrack.id, videoRef.current);
            }
        }
    }, [localPeer?.videoTrack, hmsActions]);

    // Handle connection state changes (detect disconnection)
    useEffect(() => {
        if (!isConnected && hasLeftRef.current === false && localPeer) {
            // Student got disconnected unexpectedly
            toast.error("Connection lost. You need to request to rejoin.");
            handleDisconnection();
        }
    }, [isConnected]);

    const handleDisconnection = async () => {
        hasLeftRef.current = true;

        try {
            await updateLeftStatus(examId!).unwrap();
        } catch (error) {
            console.error("Error updating left status:", error);
        }

        // Check if still within exam time
        const examEndTime = getExamEndTime();
        if (examEndTime && new Date() < examEndTime) {
            toast.error("You can request to rejoin the exam");
            navigate(`/student/exam/${examId}/environment-check`);
        } else {
            toast.error("Exam time has ended. Cannot rejoin.");
            navigate("/student/exams");
        }
    };

    // Auto scroll chat
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [storeMessages]);

    const sendMessage = async () => {
        if (messageInput.trim()) {
            try {
                await hmsActions.sendBroadcastMessage(messageInput);
                setMessageInput("");
                toast.success("Message sent to proctor");
            } catch (error) {
                console.error("Failed to send message:", error);
                toast.error("Failed to send message");
            }
        }
    };

    const handleLeaveExam = async (autoDisconnect: boolean = false) => {
        if (!autoDisconnect) {
            const confirmed = window.confirm(
                "Are you sure you want to leave the exam? You will need faculty approval to rejoin."
            );
            if (!confirmed) return;
        }

        hasLeftRef.current = true;

        try {
            await hmsActions.leave();
            await updateLeftStatus(examId!).unwrap();

            if (autoDisconnect) {
                toast.error("Exam session ended");
            } else {
                toast.error("You have left the exam");
            }
        } catch (error) {
            console.error("Error leaving exam:", error);
        }

        navigate("/student/exams");
    };

    const facultyPeers = peers.filter(
        (peer) =>
            peer.roleName?.toLowerCase() === "proctor" ||
            peer.roleName?.toLowerCase() === "faculty"
    );

    // Check if audio/video are enabled (for display purposes)
    const isAudioEnabled = localPeer?.audioTrack &&
        typeof localPeer.audioTrack === "object" &&
        "enabled" in localPeer.audioTrack
        ? (localPeer.audioTrack as { enabled: boolean }).enabled
        : false;

    const isVideoEnabled = localPeer?.videoTrack &&
        typeof localPeer.videoTrack === "object" &&
        "enabled" in localPeer.videoTrack
        ? (localPeer.videoTrack as { enabled: boolean }).enabled
        : false;

    return (
        <div className="h-screen bg-gray-900 flex flex-col">
            {/* Header */}
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-white text-xl font-semibold">{examName}</h1>
                    <p className="text-gray-400 text-sm">
                        {isConnected ? (
                            <>
                                Connected
                                {timeRemaining && (
                                    <span className="ml-3 text-yellow-400">
                                        Time Remaining: {timeRemaining}
                                    </span>
                                )}
                            </>
                        ) : (
                            "Connecting..."
                        )}
                    </p>
                </div>
                <button
                    onClick={() => handleLeaveExam(false)}
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
                        <div
                            className="relative bg-gray-800 rounded-lg overflow-hidden"
                            style={{ height: "300px" }}
                        >
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover mirror"
                                style={{ transform: "scaleX(-1)" }}
                            />

                            {/* Status Indicators */}
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <div
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${isAudioEnabled
                                        ? "bg-green-600 text-white"
                                        : "bg-red-600 text-white"
                                        }`}
                                >
                                    {isAudioEnabled ? "Mic On" : "Mic Off"}
                                </div>
                                <div
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${isVideoEnabled
                                        ? "bg-green-600 text-white"
                                        : "bg-red-600 text-white"
                                        }`}
                                >
                                    {isVideoEnabled ? "Camera On" : "Camera Off"}
                                </div>
                            </div>

                            {/* Warning message */}
                            {(!isAudioEnabled || !isVideoEnabled) && (
                                <div className="absolute top-4 left-4 right-4 bg-red-500 text-white p-3 rounded-lg">
                                    <p className="text-sm font-medium">
                                        Warning: Your camera and microphone must remain on during the exam!
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Proctor Status */}
                    <div className="flex-1 bg-gray-800 rounded-lg p-4 overflow-y-auto">
                        <h2 className="text-white text-lg mb-3">Proctor Information</h2>
                        <div className="space-y-3">
                            {facultyPeers.length > 0 ? (
                                <>
                                    <div className="flex items-center gap-2 text-green-400">
                                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                        <span className="text-sm font-medium">
                                            {facultyPeers.length} proctor(s) monitoring
                                        </span>
                                    </div>
                                    {facultyPeers.map((proctor) => (
                                        <div
                                            key={proctor.id}
                                            className="bg-gray-700 rounded-lg p-3"
                                        >
                                            <p className="text-white font-medium">{proctor.name}</p>
                                            <p className="text-gray-400 text-xs">Monitoring</p>
                                        </div>
                                    ))}
                                </>
                            ) : (
                                <div className="text-gray-400 text-sm">
                                    <p>Waiting for proctor to join...</p>
                                    <p className="text-xs mt-2">
                                        The exam will be monitored by faculty members
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Exam Guidelines Reminder */}
                        <div className="mt-6 border-t border-gray-700 pt-4">
                            <h3 className="text-white font-medium mb-2">Exam Guidelines</h3>
                            <ul className="text-gray-400 text-sm space-y-2">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Keep your camera and microphone on at all times</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Stay visible in the camera frame</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Do not switch tabs or windows</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400 mt-1">•</span>
                                    <span>Contact proctor via chat for any issues</span>
                                </li>
                            </ul>
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

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {storeMessages.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm mt-8">
                                    <p>No messages yet</p>
                                    <p className="text-xs mt-2">
                                        Send a message to the proctor if you need help
                                    </p>
                                </div>
                            ) : (
                                storeMessages.map((msg: HMSMessage) => {
                                    const isSentByMe = msg.senderName === localPeer?.name;
                                    return (
                                        <div
                                            key={msg.id}
                                            className={`rounded-lg p-3 ${isSentByMe
                                                ? "bg-blue-600 ml-auto"
                                                : "bg-gray-700"
                                                }`}
                                            style={{ maxWidth: "85%" }}
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-blue-200 text-xs font-medium">
                                                    {isSentByMe ? "You" : msg.senderName}
                                                </span>
                                                <span className="text-gray-400 text-xs ml-2">
                                                    {msg.time.toLocaleTimeString()}
                                                </span>
                                            </div>
                                            <p className="text-white text-sm">{msg.message}</p>
                                        </div>
                                    );
                                })
                            )}
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
                                    disabled={!messageInput.trim()}
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

const StudentExamRoomPage = () => {
    return (
        <HMSRoomProvider>
            <StudentExamRoomContent />
        </HMSRoomProvider>
    );
};

export default StudentExamRoomPage;