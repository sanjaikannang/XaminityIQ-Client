import toast from "react-hot-toast";
import { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2, Circle, Video, Mic, MonitorUp, Maximize, Wifi, Monitor, ShieldCheck } from "lucide-react";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import ExamBrandHeader from "../components/ExamBrandHeader";
import { ExamMode } from "../../../../utils/enum";
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

const CHECK_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
    camera: Video,
    microphone: Mic,
    screen: MonitorUp,
    multiMonitor: Monitor,
    fullscreen: Maximize,
    connection: Wifi,
};

const INITIAL_CHECKS: CheckState[] = [
    { key: 'camera', label: 'Camera (Video)', status: 'PENDING' },
    { key: 'microphone', label: 'Microphone', status: 'PENDING' },
    { key: 'screen', label: 'Entire Screen Sharing', status: 'PENDING' },
    { key: 'multiMonitor', label: 'Single Monitor Only', status: 'PENDING' },
    { key: 'fullscreen', label: 'Full-Screen Mode', status: 'PENDING' },
    { key: 'connection', label: 'Stable Internet Connection', status: 'PENDING' },
];

// getScreenDetails() is the Window Management API (Chromium-based browsers,
// prompts for permission). window.screen.isExtended is a lighter no-prompt
// signal some browsers expose. Neither is universally supported — on a
// browser with neither, we can't detect this at all, so we pass rather than
// block a legitimate single-monitor student on an unsupported browser.
async function detectMultipleMonitors(): Promise<{ supported: boolean; multiple: boolean }> {
    const w = window as any;
    if (typeof w.getScreenDetails === 'function') {
        const details = await w.getScreenDetails();
        return { supported: true, multiple: (details.screens?.length ?? 1) > 1 };
    }
    if (typeof window.screen !== 'undefined' && 'isExtended' in window.screen) {
        return { supported: true, multiple: !!(window.screen as any).isExtended };
    }
    return { supported: false, multiple: false };
}

const PreFlightCheckPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { examId } = useParams<{ examId: string }>();
    const [startExam, { isLoading: isStarting }] = useStartExamMutation();
    const mode = (location.state as { mode?: ExamMode } | null)?.mode;

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

    const runMultiMonitor = async (): Promise<boolean> => {
        updateCheck('multiMonitor', { status: 'CHECKING' });
        try {
            const { supported, multiple } = await detectMultipleMonitors();
            if (multiple) {
                updateCheck('multiMonitor', {
                    status: 'FAILED',
                    message: 'Multiple monitors detected. Please disconnect any additional displays and use a single monitor for this exam, then retry.',
                });
                return false;
            }
            updateCheck('multiMonitor', {
                status: 'PASSED',
                message: supported ? undefined : 'Your browser cannot verify this automatically — proceeding on trust.',
            });
            return true;
        } catch {
            // Permission dismissed/denied — cannot verify, don't hard-block on an inconclusive check.
            updateCheck('multiMonitor', { status: 'PASSED', message: 'Could not verify — proceeding on trust.' });
            return true;
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
        multiMonitor: runMultiMonitor,
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

        if (mode === ExamMode.PROCTORING) {
            examMediaStore.set(streamsRef.current);
            navigate(`/student/exams/${examId}/lobby`, { replace: true });
            return;
        }

        try {
            const response = await startExam(examId).unwrap();
            if (!response.data) return;
            examMediaStore.set(streamsRef.current);
            navigate(`/student/exams/${examId}/room/${response.data.attemptId}`, { replace: true });
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to start the exam');
        }
    };

    const passedCount = checks.filter((c) => c.status === 'PASSED').length;
    const progressPct = Math.round((passedCount / checks.length) * 100);

    const statusIcon = (status: CheckStatus) => {
        if (status === 'PASSED') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
        if (status === 'FAILED') return <XCircle className="w-5 h-5 text-red-600" />;
        if (status === 'CHECKING') return <Loader2 className="w-5 h-5 text-primary animate-spin" />;
        return <Circle className="w-5 h-5 text-textTertiary" />;
    };

    return (
        <>
            <PageHeader>
                <div className="flex items-center gap-4">
                    <ExamBrandHeader />
                    <span className="text-textTertiary">|</span>
                    <span>Pre-Flight Checks</span>
                </div>
            </PageHeader>
            <Container>
                <div className="py-6 space-y-4">
                    <div className="bg-whiteColor rounded-xl border border-borderDefault p-5 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5">
                                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-textPrimary">System readiness check</p>
                                    <p className="text-xs text-textSecondary">
                                        We need to verify your camera, microphone, screen, and connection before you can start.
                                    </p>
                                </div>
                            </div>
                            <span className="text-sm font-semibold text-textPrimary shrink-0">{passedCount} / {checks.length}</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-bgSecondary overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-300 ${allPassed ? 'bg-green-600' : 'bg-primary'}`}
                                style={{ width: `${progressPct}%` }}
                            />
                        </div>
                        {allPassed && (
                            <p className="text-sm font-medium text-green-700 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" /> All checks passed — you're ready to begin.
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                            {checks.map((check, index) => {
                                const Icon = CHECK_ICONS[check.key];
                                return (
                                    <div
                                        key={check.key}
                                        className={`rounded-xl border p-4 bg-whiteColor transition-colors ${check.status === 'FAILED' ? 'border-red-200' : check.status === 'PASSED' ? 'border-green-200' : 'border-borderDefault'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2.5 min-w-0">
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${check.status === 'PASSED' ? 'bg-green-100' : check.status === 'FAILED' ? 'bg-red-100' : 'bg-bgSecondary'
                                                    }`}>
                                                    <Icon className="w-3.5 h-3.5 text-textSecondary" />
                                                </div>
                                                <span className="font-medium text-textPrimary truncate">{check.label}</span>
                                            </div>
                                            {statusIcon(check.status)}
                                        </div>
                                        {check.status === 'FAILED' && (
                                            <div className="mt-3 space-y-2">
                                                <p className="text-sm text-red-600">{check.message}</p>
                                                <Button variant="outline" size="sm" onClick={() => handleRetry(index)} disabled={isRunning}>
                                                    Retry
                                                </Button>
                                            </div>
                                        )}
                                        {check.status === 'PASSED' && check.message && (
                                            <p className="mt-2 text-xs text-textTertiary">{check.message}</p>
                                        )}
                                    </div>
                                );
                            })}

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
                                <p className="text-sm text-textSecondary text-center">All checks must pass before you can enter the exam.</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-borderDefault p-4 flex items-center justify-center bg-bgSecondary">
                            <div className="relative w-full max-w-sm">
                                <video ref={videoPreviewRef} autoPlay muted playsInline className="w-full rounded-lg border border-borderLight bg-black aspect-video object-cover" />
                                <span className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-whiteColor">Camera Preview</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default PreFlightCheckPage;
