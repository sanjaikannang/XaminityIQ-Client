import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Container } from "../../../../common/ui/Container";
import {
    useGetExamDetailsQuery,
    useRequestJoinExamMutation,
    useCheckJoinRequestStatusQuery,
    useJoinExamRoomMutation,
} from "../../../../state/services/endpoints/exam";
import toast from "react-hot-toast";

const StudentEnvironmentCheckPage = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();

    const [hasCamera, setHasCamera] = useState(false);
    const [hasMicrophone, setHasMicrophone] = useState(false);
    const [permissionsDenied, setPermissionsDenied] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [requestId, setRequestId] = useState<string | null>(null);
    const [isPolling, setIsPolling] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const hasJoinedRef = useRef(false); // Prevent multiple join attempts

    const { data: examDetails, isLoading: loadingDetails } = useGetExamDetailsQuery(examId!);
    const [requestJoin, { isLoading: requesting }] = useRequestJoinExamMutation();
    const [joinRoom, { isLoading: joining }] = useJoinExamRoomMutation();

    // Poll for request status
    const { data: requestStatus } = useCheckJoinRequestStatusQuery(
        requestId!,
        {
            skip: !requestId || !isPolling,
            pollingInterval: isPolling ? 3000 : undefined,
        }
    );

    // Request camera and microphone permissions
    useEffect(() => {
        const requestMediaPermissions = async () => {
            try {
                const mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true,
                });

                setStream(mediaStream);
                setHasCamera(true);
                setHasMicrophone(true);

                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                }

                toast.success("Camera and microphone access granted");
            } catch (error) {
                console.error("Error accessing media devices:", error);
                setPermissionsDenied(true);
                toast.error("Please allow camera and microphone access to continue");
            }
        };

        requestMediaPermissions();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    // Handle request status changes
    useEffect(() => {
        if (requestStatus?.data && requestId && !hasJoinedRef.current) {
            const { status, rejectionReason } = requestStatus.data;

            if (status === "APPROVED") {
                setIsPolling(false);
                hasJoinedRef.current = true; // Mark as processing
                toast.success("Your request has been approved!");

                // Join room immediately
                handleJoinRoomAfterApproval();
            } else if (status === "REJECTED") {
                setIsPolling(false);
                toast.error(`Request rejected: ${rejectionReason || "No reason provided"}`);
                setRequestId(null);
                hasJoinedRef.current = false; // Reset for retry
            }
        }
    }, [requestStatus, requestId]);

    const handleJoinRoomAfterApproval = async () => {
        if (!requestId) {
            toast.error("No request ID found");
            return;
        }

        try {
            console.log("Joining room with requestId:", requestId);
            const response = await joinRoom({ requestId }).unwrap();

            console.log("Join room response:", response);

            // Stop the preview stream before joining
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }

            // Navigate to exam room
            navigate(`/student/exam-room/${examId}`, {
                state: {
                    roomId: response.data.roomId,
                    authToken: response.data.authToken,
                    examName: response.data.examName,
                    duration: response.data.duration,
                },
            });
        } catch (error: any) {
            console.error("Join room error:", error);
            toast.error(error?.data?.message || "Failed to join exam room");
            hasJoinedRef.current = false; // Reset on error
        }
    };

    const handleRequestJoin = async () => {
        if (!hasCamera || !hasMicrophone) {
            toast.error("Please enable camera and microphone before joining");
            return;
        }

        try {
            const response = await requestJoin(examId!).unwrap();
            toast.success(response.data.message);
            setRequestId(response.data.requestId);
            setIsPolling(true);
            hasJoinedRef.current = false; // Reset join flag
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to send join request");
        }
    };

    const handleBackToExams = () => {
        if (stream) {
            stream.getTracks().forEach((track) => track.stop());
        }
        navigate("/student/exams");
    };

    if (loadingDetails) {
        return (
            <Container>
                <div className="flex items-center justify-center h-screen">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading exam details...</p>
                    </div>
                </div>
            </Container>
        );
    }

    const exam = examDetails?.data;

    return (
        <Container>
            <div className="min-h-screen py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Environment Check
                        </h1>
                        <p className="text-gray-600">{exam?.examName}</p>
                    </div>

                    {/* Video Preview */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Camera & Microphone Test
                        </h2>
                        <div className="bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover mirror"
                                style={{ transform: "scaleX(-1)" }}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div
                                className={`p-4 rounded-lg border-2 ${hasCamera
                                    ? "border-green-500 bg-green-50"
                                    : "border-red-500 bg-red-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {hasCamera ? (
                                        <svg
                                            className="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-6 h-6 text-red-600"
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
                                    )}
                                    <span className="font-medium">
                                        {hasCamera ? "Camera Working" : "Camera Not Detected"}
                                    </span>
                                </div>
                            </div>

                            <div
                                className={`p-4 rounded-lg border-2 ${hasMicrophone
                                    ? "border-green-500 bg-green-50"
                                    : "border-red-500 bg-red-50"
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    {hasMicrophone ? (
                                        <svg
                                            className="w-6 h-6 text-green-600"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M5 13l4 4L19 7"
                                            />
                                        </svg>
                                    ) : (
                                        <svg
                                            className="w-6 h-6 text-red-600"
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
                                    )}
                                    <span className="font-medium">
                                        {hasMicrophone
                                            ? "Microphone Working"
                                            : "Microphone Not Detected"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {permissionsDenied && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-800">
                                    Please allow camera and microphone permissions in your browser
                                    settings to continue with the exam.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Exam Instructions */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 mb-4">
                            Exam Instructions
                        </h2>
                        <ul className="space-y-2">
                            {exam?.instructions.map((instruction, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <span className="text-blue-600 mt-1">•</span>
                                    <span className="text-gray-700">{instruction}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Action Buttons */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        {requestId && isPolling ? (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-700 font-medium">
                                    Waiting for faculty approval...
                                </p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Please wait while the proctor reviews your join request
                                </p>
                            </div>
                        ) : joining ? (
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                                <p className="text-gray-700 font-medium">
                                    Joining exam room...
                                </p>
                            </div>
                        ) : (
                            <div className="flex gap-4">
                                <button
                                    onClick={handleBackToExams}
                                    className="flex-1 py-3 px-6 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                                >
                                    Back to Exams
                                </button>
                                <button
                                    onClick={handleRequestJoin}
                                    disabled={
                                        !hasCamera ||
                                        !hasMicrophone ||
                                        requesting ||
                                        joining ||
                                        permissionsDenied
                                    }
                                    className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors ${hasCamera && hasMicrophone && !permissionsDenied
                                        ? "bg-blue-600 text-white hover:bg-blue-700"
                                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                >
                                    {requesting || joining
                                        ? "Processing..."
                                        : "Request to Join Exam"}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default StudentEnvironmentCheckPage;