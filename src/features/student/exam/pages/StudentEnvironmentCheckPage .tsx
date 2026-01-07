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
import { PageHeader } from "../../../../common/ui/PageHeader";
import { Camera, CheckCircle, Mic, XCircle } from "lucide-react";
import Button from "../../../../common/ui/Button";

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
        const requestMedia = async () => {
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

        requestMedia();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    // Handle request status changes
    useEffect(() => {
        if (!requestStatus?.data || !requestId || hasJoinedRef.current) return;

        const { status, rejectionReason } = requestStatus.data;

        if (status === "APPROVED") {
            setIsPolling(false);
            hasJoinedRef.current = true;
            toast.success("Request approved");
            handleJoinRoom();
        }

        if (status === "REJECTED") {
            setIsPolling(false);
            toast.error(rejectionReason || "Request rejected");
            setRequestId(null);
            hasJoinedRef.current = false;
        }
    }, [requestStatus, requestId]);

    const handleJoinRoom = async () => {
        if (!requestId) return;

        try {
            const response = await joinRoom({ requestId }).unwrap();
            stream?.getTracks().forEach(track => track.stop());

            navigate(`/student/exam-room/${examId}`, {
                state: response.data,
            });
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to join exam room");
            hasJoinedRef.current = false;
        }
    };

    const handleRequestJoin = async () => {
        if (!hasCamera || !hasMicrophone) {
            toast.error("Camera and microphone required");
            return;
        }

        try {
            const response = await requestJoin(examId!).unwrap();
            setRequestId(response.data.requestId);
            setIsPolling(true);
            toast.success(response.data.message);
        } catch (err: any) {
            toast.error(err?.data?.message || "Failed to send request");
        }
    };

    const handleBack = () => {
        stream?.getTracks().forEach(track => track.stop());
        navigate("/student/exams");
    };

    if (loadingDetails) {
        return (
            <>
                <Container>
                    <div className="min-h-screen py-8 animate-pulse space-y-6 max-w-4xl mx-auto">
                        <div className="h-20 bg-bgTertiary rounded-lg" />
                        <div className="h-64 bg-bgTertiary rounded-lg" />
                        <div className="h-40 bg-bgTertiary rounded-lg" />
                    </div>
                </Container>
            </>
        );
    }

    const exam = examDetails?.data;

    return (
        <>
            <PageHeader>Environment Check</PageHeader>
            <Container>
                <div className="min-h-screen py-4">
                    <div className="max-w-full mx-auto">

                        {/* Video Preview */}
                        <div className="bg-bgPrimary p-6 rounded-lg border border-borderLight">
                            <h2 className="text-xl font-semibold text-textPrimary mb-4">
                                Camera & Microphone Test
                            </h2>

                            <div className="bg-black rounded-lg overflow-hidden aspect-video mb-6">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    muted
                                    playsInline
                                    className="w-full h-full object-cover"
                                    style={{ transform: "scaleX(-1)" }}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {/* Camera */}
                                <StatusCard
                                    active={hasCamera}
                                    label="Camera"
                                    icon={Camera}
                                />

                                {/* Mic */}
                                <StatusCard
                                    active={hasMicrophone}
                                    label="Microphone"
                                    icon={Mic}
                                />
                            </div>

                            {permissionsDenied && (
                                <div className="mt-4 p-4 border border-error bg-bgSecondary rounded-lg text-error">
                                    Please enable camera & microphone permissions
                                </div>
                            )}
                        </div>

                        {/* Exam Instructions */}
                        <div className="bg-bgPrimary p-6 rounded-lg border border-borderLight">
                            <h2 className="text-xl font-semibold text-textPrimary mb-4">
                                Exam Instructions
                            </h2>
                            <ul className="space-y-2">
                                {exam?.instructions.map((item: string, i: number) => (
                                    <li key={i} className="text-textSecondary">
                                        • {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Action Buttons */}
                        <div className="bg-bgPrimary p-6 rounded-lg border border-borderLight">
                            {requestId && isPolling ? (
                                <div className="animate-pulse text-center space-y-3">
                                    <div className="h-10 w-10 bg-bgTertiary rounded-full mx-auto" />
                                    <div className="h-4 bg-bgTertiary rounded w-1/2 mx-auto" />
                                </div>
                            ) : (
                                <div className="flex gap-4">
                                    <Button
                                        variant="secondary"
                                        fullWidth
                                        onClick={handleBack}
                                    >
                                        Back to Exams
                                    </Button>

                                    <Button
                                        variant="primary"
                                        fullWidth
                                        loading={requesting || joining}
                                        disabled={!hasCamera || !hasMicrophone || permissionsDenied}
                                        onClick={handleRequestJoin}
                                    >
                                        Request to Join Exam
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

const StatusCard = ({
    active,
    label,
    icon: Icon,
}: {
    active: boolean;
    label: string;
    icon: any;
}) => (
    <div
        className={`p-4 rounded-lg border-2 flex items-center gap-3 ${active
            ? "border-success bg-primaryLighter"
            : "border-error bg-bgSecondary"
            }`}
    >
        {active ? (
            <CheckCircle className="text-success" />
        ) : (
            <XCircle className="text-error" />
        )}
        <Icon className="text-textPrimary" />
        <span className="font-medium text-textPrimary">
            {label} {active ? "Working" : "Not Detected"}
        </span>
    </div>
);

export default StudentEnvironmentCheckPage;