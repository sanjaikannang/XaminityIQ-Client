import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import {
    useGetPendingJoinRequestsQuery,
    useApproveJoinRequestMutation,
    useRejectJoinRequestMutation,
    useRemoveStudentMutation,
} from "../../../../state/services/endpoints/exam";
import toast from "react-hot-toast";

const FacultyExamRoomContent = () => {
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
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
    const [broadcastMode, setBroadcastMode] = useState(true);
    const [showJoinRequests, setShowJoinRequests] = useState(false);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [studentToRemove, setStudentToRemove] = useState<{ id: string; name: string } | null>(null);
    const [removalReason, setRemovalReason] = useState("");
    const [timeRemaining, setTimeRemaining] = useState<string>("");
    const [isWarningShown, setIsWarningShown] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

    const { examName, roomId, authToken, totalStudents, examDate, endTime } = location.state || {};

    // Fetch pending join requests with polling
    const { data: joinRequestsData, refetch: refetchJoinRequests } = useGetPendingJoinRequestsQuery(
        examId!,
        {
            pollingInterval: 3000,
        }
    );

    const [approveRequest, { isLoading: isApproving }] = useApproveJoinRequestMutation();
    const [rejectRequest, { isLoading: isRejecting }] = useRejectJoinRequestMutation();
    const [removeStudent, { isLoading: isRemoving }] = useRemoveStudentMutation();

    const pendingRequests = joinRequestsData?.data || [];

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
                toast.success("Joined exam monitoring room");
            } catch (error) {
                console.error("Failed to join room:", error);
                toast.error("Failed to join exam room");
                navigate("/faculty/exams");
            }
        };

        joinRoom();

        return () => {
            hmsActions.leave();
        };
    }, [roomId, authToken]);

    // Monitor exam time and auto-disconnect
    useEffect(() => {
        const examEndTime = getExamEndTime();
        if (!examEndTime) return;

        const checkTime = () => {
            const now = new Date();
            const timeDiff = examEndTime.getTime() - now.getTime();

            const minutesRemaining = Math.floor(timeDiff / 60000);
            const secondsRemaining = Math.floor((timeDiff % 60000) / 1000);

            if (timeDiff <= 0) {
                toast.error("Exam time has ended. Disconnecting all participants...");
                handleEndExam();
                return;
            }

            if (minutesRemaining === 5 && !isWarningShown) {
                toast.error("5 minutes remaining in the exam!");
                setIsWarningShown(true);
            }

            if (minutesRemaining < 10) {
                setTimeRemaining(`${minutesRemaining}:${secondsRemaining.toString().padStart(2, '0')}`);
            }
        };

        const interval = setInterval(checkTime, 1000);
        checkTime();

        return () => clearInterval(interval);
    }, [examDate, endTime, isWarningShown]);

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

    // Show notification when new join request arrives
    useEffect(() => {
        if (pendingRequests.length > 0) {
            if (!showJoinRequests) {
                toast.error(`${pendingRequests.length} student(s) waiting to join`, {
                    duration: 3000,
                });
            }
        }
    }, [pendingRequests.length]);

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
                    toast.success("Message sent to all students");
                } else if (selectedStudent) {
                    await hmsActions.sendDirectMessage(messageInput, selectedStudent);
                    toast.success("Message sent to student");
                }
                setMessageInput("");
            } catch (error) {
                console.error("Failed to send message:", error);
                toast.error("Failed to send message");
            }
        }
    };

    const handleApproveRequest = async (requestId: string, studentName: string) => {
        try {
            await approveRequest({ requestId }).unwrap();
            toast.success(`Approved ${studentName}'s request to join`);
            refetchJoinRequests();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to approve request");
        }
    };

    const handleRejectRequest = async (requestId: string, studentName: string) => {
        const reason = window.prompt(`Enter reason for rejecting ${studentName}'s request:`);
        if (!reason) return;

        try {
            await rejectRequest({ requestId, reason }).unwrap();
            toast.success(`Rejected ${studentName}'s request`);
            refetchJoinRequests();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to reject request");
        }
    };

    const handleOpenRemoveModal = (studentId: string, studentName: string) => {
        setStudentToRemove({ id: studentId, name: studentName });
        setRemovalReason("");
        setShowRemoveModal(true);
    };

    const handleConfirmRemove = async () => {
        if (!studentToRemove || !removalReason.trim()) {
            toast.error("Please provide a reason for removal");
            return;
        }

        try {
            await removeStudent({
                examId: examId!,
                studentId: studentToRemove.id,
                reason: removalReason,
            }).unwrap();

            toast.success(`${studentToRemove.name} has been removed from the exam`);

            setShowRemoveModal(false);
            setStudentToRemove(null);
            setRemovalReason("");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to remove student");
        }
    };

    const handleEndExam = async () => {
        await hmsActions.leave();
        navigate("/faculty/exams");
    };

    const handleLeaveExam = async () => {
        if (window.confirm("Are you sure you want to leave the monitoring session?")) {
            await hmsActions.leave();
            toast.error("You have left the exam monitoring session");
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
                        {isConnected ? (
                            <>
                                Monitoring {studentPeers.length} / {totalStudents} students
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
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => setShowJoinRequests(!showJoinRequests)}
                        className="relative p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
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
                                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                            />
                        </svg>
                        {pendingRequests.length > 0 && (
                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                {pendingRequests.length}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={toggleAudio}
                        className={`p-2 rounded-lg ${isAudioMuted ? "bg-red-600" : "bg-gray-700"
                            } text-white hover:opacity-80 transition-opacity`}
                        title={isAudioMuted ? "Unmute" : "Mute"}
                    >
                        {isAudioMuted ? "Unmute" : "Mute"}
                    </button>
                    <button
                        onClick={toggleVideo}
                        className={`p-2 rounded-lg ${isVideoOff ? "bg-gray-700" : "bg-blue-600"
                            } text-white hover:opacity-80 transition-opacity`}
                        title={isVideoOff ? "Turn On Camera" : "Turn Off Camera"}
                    >
                        {isVideoOff ? "Camera Off" : "Camera On"}
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
                {/* Join Requests Panel */}
                {showJoinRequests && (
                    <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
                        <div className="p-4 border-b border-gray-700">
                            <h2 className="text-white font-semibold">Join Requests</h2>
                            <p className="text-gray-400 text-sm mt-1">
                                {pendingRequests.length} pending
                            </p>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-3">
                            {pendingRequests.length === 0 ? (
                                <div className="text-center text-gray-400 py-8">
                                    <p className="text-sm">No pending requests</p>
                                </div>
                            ) : (
                                pendingRequests.map((request) => (
                                    <div
                                        key={request.requestId}
                                        className="bg-gray-700 rounded-lg p-4"
                                    >
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                                <span className="text-white font-semibold">
                                                    {request.studentName.charAt(0).toUpperCase()}
                                                </span>
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-white font-medium">
                                                    {request.studentName}
                                                </p>
                                                <p className="text-gray-400 text-xs">
                                                    {request.isRejoin ? "Requesting to rejoin" : "Requesting to join"}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleApproveRequest(request.requestId, request.studentName)}
                                                disabled={isApproving}
                                                className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium disabled:opacity-50"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                onClick={() => handleRejectRequest(request.requestId, request.studentName)}
                                                disabled={isRejecting}
                                                className="flex-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* Student Grid */}
                <div className="flex-1 p-4 overflow-y-auto">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-white text-lg">Student Video Grid</h2>
                        <div className="flex gap-3 items-center">
                            <span className="text-gray-400 text-sm">
                                {studentPeers.length} / {totalStudents} students in room
                            </span>
                            <button
                                onClick={() => setShowChat(!showChat)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                            >
                                {showChat ? "Hide Chat" : "Show Chat"}
                            </button>
                        </div>
                    </div>

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
                                    : true;

                                const hasVideo = videoTrack &&
                                    typeof videoTrack === "object" &&
                                    "enabled" in videoTrack
                                    ? (videoTrack as { enabled: boolean }).enabled
                                    : false;

                                return (
                                    <div
                                        key={peer.id}
                                        className="relative bg-gray-800 rounded-lg overflow-hidden aspect-video group"
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

                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-white text-sm font-medium">
                                                    {peer.name}
                                                </span>
                                                <div className="flex gap-1">
                                                    {isAudioMuted && (
                                                        <span className="text-red-400" title="Microphone Off">
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

                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setSelectedStudent(peer.id);
                                                    setShowChat(true);
                                                    setBroadcastMode(false);
                                                }}
                                                className="p-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
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
                                            <button
                                                onClick={() => handleOpenRemoveModal(peer.id, peer.name || "Student")}
                                                className="p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                                title="Remove student"
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
                                                        d="M6 18L18 6M6 6l12 12"
                                                    />
                                                </svg>
                                            </button>
                                        </div>

                                        {(!hasVideo || isAudioMuted) && (
                                            <div className="absolute top-2 left-2">
                                                <div className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                                                    Warning
                                                </div>
                                            </div>
                                        )}
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

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setBroadcastMode(true);
                                        setSelectedStudent(null);
                                    }}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${broadcastMode
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                >
                                    Broadcast All
                                </button>
                                <button
                                    onClick={() => setBroadcastMode(false)}
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${!broadcastMode
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                        }`}
                                >
                                    Direct Message
                                </button>
                            </div>

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
                            {storeMessages.length === 0 ? (
                                <div className="text-center text-gray-400 text-sm mt-8">
                                    <p>No messages yet</p>
                                </div>
                            ) : (
                                storeMessages.map((msg: HMSMessage) => {
                                    const isSentByMe = msg.senderName === localPeer?.name;
                                    const recipient = msg.recipientPeer
                                        ? studentPeers.find((p) => p.id === msg.recipientPeer)?.name
                                        : null;

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
                                                <span className="text-blue-200 text-sm font-medium">
                                                    {isSentByMe
                                                        ? recipient
                                                            ? `You to ${recipient}`
                                                            : "You (Broadcast)"
                                                        : msg.senderName}
                                                </span>
                                                <span>

                                                </span>
                                            </div>
                                        </div>
                                    )
                                })
                            )
                            }
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

const FacultyExamRoomPage = () => {
    return (
        <HMSRoomProvider>
            <FacultyExamRoomContent />
        </HMSRoomProvider>
    )
}

export default FacultyExamRoomPage;