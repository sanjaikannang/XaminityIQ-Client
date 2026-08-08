import toast from "react-hot-toast";
import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { examMediaStore } from "../utils/examMediaStore";
import { runNetworkProbe, MIN_REQUIRED_MBPS } from "../utils/networkProbe";
import { useStartExamMutation } from "../../../../state/services/endpoints/student-exams";

type CheckStatus = 'PENDING' | 'CHECKING' | 'PASSED' | 'FAILED';

interface CheckState {
    key: string;
    label: string;
    status: CheckStatus;
    message?: string;
}

const INITIAL_CHECKS: CheckState[] = [
    { key: 'camera', label: 'Camera (Video)', status: 'PENDING' },
    { key: 'microphone', label: 'Microphone', status: 'PENDING' },
    { key: 'screen', label: 'Entire Screen Sharing', status: 'PENDING' },
    { key: 'fullscreen', label: 'Full-Screen Mode', status: 'PENDING' },
    { key: 'connection', label: 'Stable Internet Connection', status: 'PENDING' },
];

const PreFlightCheckPage = () => {
    const navigate = useNavigate();
    const { examId } = useParams<{ examId: string }>();
    const [startExam, { isLoading: isStarting }] = useStartExamMutation();

    const [checks, setChecks] = useState<CheckState[]>(INITIAL_CHECKS);
    const [isRunning, setIsRunning] = useState(false);

    const videoPreviewRef = useRef<HTMLVideoElement>(null);
    const streamsRef = useRef<{ video: MediaStream | null; audio: MediaStream | null; screen: MediaStream | null }>({
        video: null, audio: null, screen: null,
    });

    const updateCheck = (key: string, patch: Partial<CheckState>) => {
        setChecks((prev) => prev.map((c) => (c.key === key ? { ...c, ...patch } : c)));
    };

    const runCamera = async (): Promise<boolean> => {
        updateCheck('camera', { status: 'CHECKING' });
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamsRef.current.video = stream;
            if (videoPreviewRef.current) {
                videoPreviewRef.current.srcObject = stream;
            }
            updateCheck('camera', { status: 'PASSED' });
            return true;
        } catch {
            updateCheck('camera', { status: 'FAILED', message: 'Camera permission denied or unavailable. Please allow camera access and retry.' });
            return false;
        }
    };

    const runMicrophone = async (): Promise<boolean> => {
        updateCheck('microphone', { status: 'CHECKING' });
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            streamsRef.current.audio = stream;
            updateCheck('microphone', { status: 'PASSED' });
            return true;
        } catch {
            updateCheck('microphone', { status: 'FAILED', message: 'Microphone permission denied or unavailable. Please allow microphone access and retry.' });
            return false;
        }
    };

    const runScreenShare = async (): Promise<boolean> => {
        updateCheck('screen', { status: 'CHECKING' });
        try {
            const stream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const track = stream.getVideoTracks()[0];
            const settings = track.getSettings() as MediaTrackSettings & { displaySurface?: string };
            if (settings.displaySurface && settings.displaySurface !== 'monitor') {
                stream.getTracks().forEach((t) => t.stop());
                updateCheck('screen', { status: 'FAILED', message: 'Please share your Entire Screen, not a single window or tab, and retry.' });
                return false;
            }
            streamsRef.current.screen = stream;
            updateCheck('screen', { status: 'PASSED' });
            return true;
        } catch {
            updateCheck('screen', { status: 'FAILED', message: 'Screen sharing was cancelled or denied. Please retry and choose Entire Screen.' });
            return false;
        }
    };

    const runFullscreen = async (): Promise<boolean> => {
        updateCheck('fullscreen', { status: 'CHECKING' });
        try {
            await document.documentElement.requestFullscreen();
            updateCheck('fullscreen', { status: 'PASSED' });
            return true;
        } catch {
            updateCheck('fullscreen', { status: 'FAILED', message: 'Could not enter full-screen mode. Please retry.' });
            return false;
        }
    };

    const runConnection = async (): Promise<boolean> => {
        updateCheck('connection', { status: 'CHECKING' });
        try {
            const { downloadMbps, uploadMbps } = await runNetworkProbe();
            if (downloadMbps < MIN_REQUIRED_MBPS || uploadMbps < MIN_REQUIRED_MBPS) {
                updateCheck('connection', {
                    status: 'FAILED',
                    message: `Connection too slow (down ${downloadMbps.toFixed(1)} Mbps, up ${uploadMbps.toFixed(1)} Mbps). Minimum ${MIN_REQUIRED_MBPS} Mbps required.`,
                });
                return false;
            }
            updateCheck('connection', { status: 'PASSED' });
            return true;
        } catch {
            updateCheck('connection', { status: 'FAILED', message: 'Could not measure connection speed. Please retry.' });
            return false;
        }
    };

    const CHECK_RUNNERS: Record<string, () => Promise<boolean>> = {
        camera: runCamera,
        microphone: runMicrophone,
        screen: runScreenShare,
        fullscreen: runFullscreen,
        connection: runConnection,
    };

    const runFrom = useCallback(async (startIndex: number) => {
        setIsRunning(true);
        for (let i = startIndex; i < INITIAL_CHECKS.length; i++) {
            const key = INITIAL_CHECKS[i].key;
            const passed = await CHECK_RUNNERS[key]();
            if (!passed) {
                setIsRunning(false);
                return;
            }
        }
        setIsRunning(false);
    }, []);

    useEffect(() => {
        runFrom(0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const allPassed = checks.every((c) => c.status === 'PASSED');
    const hasFailed = checks.some((c) => c.status === 'FAILED');

    const handleRetry = (index: number) => {
        runFrom(index);
    };

    const handleEnterExam = async () => {
        if (!examId) return;
        try {
            const response = await startExam(examId).unwrap();
            if (!response.data) return;
            examMediaStore.set(streamsRef.current);
            navigate(`/student/exams/${examId}/room/${response.data.attemptId}`, { replace: true });
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to start the exam');
        }
    };

    const statusColor = (status: CheckStatus) => {
        if (status === 'PASSED') return 'text-green-600';
        if (status === 'FAILED') return 'text-red-600';
        if (status === 'CHECKING') return 'text-blue-600';
        return 'text-textSecondary';
    };

    return (
        <>
            <PageHeader>Pre-Flight Checks</PageHeader>
            <Container>
                <div className="py-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        {checks.map((check, index) => (
                            <div key={check.key} className="rounded-lg border border-borderLight p-4">
                                <div className="flex items-center justify-between">
                                    <span className="font-medium text-textPrimary">{check.label}</span>
                                    <span className={`text-sm font-semibold ${statusColor(check.status)}`}>{check.status}</span>
                                </div>
                                {check.status === 'FAILED' && (
                                    <div className="mt-2 space-y-2">
                                        <p className="text-sm text-red-600">{check.message}</p>
                                        <Button variant="outline" size="sm" onClick={() => handleRetry(index)} disabled={isRunning}>
                                            Retry
                                        </Button>
                                    </div>
                                )}
                            </div>
                        ))}

                        <Button
                            variant="primary"
                            fullWidth
                            disabled={!allPassed || isStarting}
                            loading={isStarting}
                            onClick={handleEnterExam}
                        >
                            {isStarting ? '' : 'Enter Exam'}
                        </Button>
                        {hasFailed && (
                            <p className="text-sm text-textSecondary">All checks must pass before you can enter the exam.</p>
                        )}
                    </div>

                    <div className="rounded-lg border border-borderLight p-4 flex items-center justify-center bg-bgSecondary">
                        <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full max-w-sm rounded-md" />
                    </div>
                </div>
            </Container>
        </>
    );
};

export default PreFlightCheckPage;
