import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import Button from "../../../../common/ui/Button";
import { CountdownTimer } from "../../../../common/ui/CountdownTimer";
import { SubmissionTrigger } from "../../../../utils/enum";
import { examMediaStore } from "../utils/examMediaStore";
import { useExamRecorder } from "../hooks/useExamRecorder";
import { useIntegrityMonitor } from "../hooks/useIntegrityMonitor";
import QuestionCard from "../components/QuestionCard";
import QuestionPalette, { type PaletteStatus } from "../components/QuestionPalette";
import SectionTabs from "../components/SectionTabs";
import SubmitExamModal from "../components/SubmitExamModal";
import { ReportViolationResponse } from "../../../../types/student-exam-types";
import {
    useGetAttemptQuery,
    useSaveAnswerMutation,
    useSubmitAttemptMutation,
    useViewQuestionMutation,
} from "../../../../state/services/endpoints/student-exams";

type LocalAnswer = { selectedOptionId?: string; selectedOptionIds?: string[]; answerText?: string };

const ExamRoomPage = () => {
    const navigate = useNavigate();
    const { attemptId } = useParams<{ examId: string; attemptId: string }>();
    const { data, isLoading } = useGetAttemptQuery(attemptId as string, { skip: !attemptId });
    const [saveAnswer] = useSaveAnswerMutation();
    const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();
    const [viewQuestion] = useViewQuestionMutation();

    const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
    const [visited, setVisited] = useState<Set<string>>(new Set());
    const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [remainingMs, setRemainingMs] = useState<number | null>(null);
    const [startedAtMs, setStartedAtMs] = useState<number | null>(null);
    const [firstViewedAt, setFirstViewedAt] = useState<Record<string, number>>({});
    const [nowTick, setNowTick] = useState(Date.now());
    const hasSubmittedRef = useRef(false);

    const streams = useMemo(() => examMediaStore.get(), []);

    const { stopAndFinalize } = useExamRecorder({
        attemptId: attemptId as string,
        videoStream: streams.video,
        audioStream: streams.audio,
        screenStream: streams.screen,
    });

    // A callback ref (not useRef+useEffect) so the stream attaches whenever the
    // <video> element actually mounts — including after the loading-state gate
    // below unmounts/remounts it once the attempt data arrives.
    const videoPreviewCallbackRef = useCallback((node: HTMLVideoElement | null) => {
        if (node && streams.video) {
            node.srcObject = streams.video;
        }
    }, [streams.video]);

    useEffect(() => {
        if (data?.data) {
            setRemainingMs(data.data.remainingMs);
            setStartedAtMs(new Date(data.data.startedAt).getTime());
            const initial: Record<string, LocalAnswer> = {};
            const initialViewed: Record<string, number> = {};
            data.data.answers.forEach((a) => {
                initial[a.questionId] = { selectedOptionId: a.selectedOptionId, selectedOptionIds: a.selectedOptionIds, answerText: a.answerText };
                if (a.firstViewedAt) initialViewed[a.questionId] = new Date(a.firstViewedAt).getTime();
            });
            setAnswers(initial);
            setFirstViewedAt(initialViewed);
        }
    }, [data]);

    const questions = data?.data?.questions || [];
    const examSections = data?.data?.examSections || [];
    const currentQuestion = questions[currentIndex];
    const securitySettings = data?.data?.securitySettings;
    const minTimePerQuestionSeconds = securitySettings?.minTimePerQuestionSeconds || 0;
    const minTimePerExamMinutes = securitySettings?.minTimePerExamMinutes || 0;

    // Stops recording, exits fullscreen, and redirects — shared by a normal
    // submit and an integrity-violation auto-submit (the server has already
    // finalized the attempt by the time either path calls this)
    const finishAndRedirect = useCallback(async (totalScore?: number | null, message?: string) => {
        await stopAndFinalize();
        examMediaStore.clear();
        if (document.fullscreenElement) {
            await document.exitFullscreen().catch(() => { });
        }
        toast.success(
            message || (totalScore !== undefined && totalScore !== null
                ? `Exam submitted. Score: ${totalScore}`
                : 'Exam submitted successfully'),
        );
        navigate('/student/exams', { replace: true });
    }, [stopAndFinalize, navigate]);

    const handleSubmit = useCallback(async (trigger: SubmissionTrigger) => {
        if (!attemptId || hasSubmittedRef.current) return;
        hasSubmittedRef.current = true;
        try {
            const response = await submitAttempt({ attemptId, trigger }).unwrap();
            await finishAndRedirect(response.totalScore);
        } catch (error: any) {
            hasSubmittedRef.current = false;
            toast.error(error.data?.message || 'Failed to submit exam');
        }
    }, [attemptId, submitAttempt, finishAndRedirect]);

    const handleIntegrityTermination = useCallback((response: ReportViolationResponse) => {
        if (hasSubmittedRef.current) return;
        hasSubmittedRef.current = true;
        finishAndRedirect(response.totalScore, 'Your attempt was auto-submitted due to repeated policy violations.');
    }, [finishAndRedirect]);

    const { violationCount } = useIntegrityMonitor({
        attemptId: attemptId as string,
        securitySettings,
        onTerminated: handleIntegrityTermination,
    });

    // Countdown timer, resynced from the server's remainingMs on load
    useEffect(() => {
        if (remainingMs === null) return;
        const interval = setInterval(() => {
            setRemainingMs((prev) => {
                if (prev === null) return prev;
                const next = prev - 1000;
                if (next <= 0) {
                    clearInterval(interval);
                    handleSubmit(SubmissionTrigger.TIMER_EXPIRY);
                    return 0;
                }
                return next;
            });
        }, 1000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [remainingMs === null]);

    // Warn before closing/refreshing mid-exam
    useEffect(() => {
        const handler = (e: BeforeUnloadEvent) => {
            e.preventDefault();
            e.returnValue = '';
        };
        window.addEventListener('beforeunload', handler);
        return () => window.removeEventListener('beforeunload', handler);
    }, []);

    useEffect(() => {
        if (currentQuestion) {
            setVisited((prev) => new Set(prev).add(currentQuestion._id));

            if (minTimePerQuestionSeconds > 0 && firstViewedAt[currentQuestion._id] === undefined) {
                viewQuestion({ attemptId: attemptId as string, questionId: currentQuestion._id })
                    .unwrap()
                    .then((response) => {
                        const viewedAt = response.data?.firstViewedAt ? new Date(response.data.firstViewedAt).getTime() : Date.now();
                        setFirstViewedAt((prev) => ({ ...prev, [currentQuestion._id]: viewedAt }));
                    })
                    .catch(() => { });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentQuestion]);

    // Ticks once a second so the "wait Xs" min-time-per-question countdown updates live
    useEffect(() => {
        if (minTimePerQuestionSeconds <= 0) return;
        const interval = setInterval(() => setNowTick(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [minTimePerQuestionSeconds]);

    const handleSelectMcq = (questionId: string, optionId: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: { selectedOptionId: optionId } }));
        saveAnswer({ attemptId: attemptId as string, questionId, data: { selectedOptionId: optionId } })
            .unwrap()
            .catch(() => toast.error('Failed to save answer — check your connection'));
    };

    const handleToggleMsq = (questionId: string, optionId: string) => {
        const current = answers[questionId]?.selectedOptionIds || [];
        const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
        setAnswers((prev) => ({ ...prev, [questionId]: { selectedOptionIds: next } }));
        saveAnswer({ attemptId: attemptId as string, questionId, data: { selectedOptionIds: next } })
            .unwrap()
            .catch(() => toast.error('Failed to save answer — check your connection'));
    };

    const handleChangeText = (questionId: string, text: string) => {
        setAnswers((prev) => ({ ...prev, [questionId]: { answerText: text } }));
        saveAnswer({ attemptId: attemptId as string, questionId, data: { answerText: text } })
            .unwrap()
            .catch(() => toast.error('Failed to save answer — check your connection'));
    };

    const paletteStatus = (questionId: string): PaletteStatus => {
        if (markedForReview.has(questionId)) return 'marked';
        const answer = answers[questionId];
        const isAnswered = !!(answer?.selectedOptionId || (answer?.selectedOptionIds && answer.selectedOptionIds.length > 0) || (answer?.answerText && answer.answerText.trim().length > 0));
        if (isAnswered) return 'answered';
        if (visited.has(questionId)) return 'not-answered';
        return 'not-visited';
    };

    const answeredCount = questions.filter((q) => {
        const a = answers[q._id];
        return !!(a?.selectedOptionId || (a?.selectedOptionIds && a.selectedOptionIds.length > 0) || (a?.answerText && a.answerText.trim().length > 0));
    }).length;

    // Per-question min-time gate — how much longer until "Next" unblocks
    const questionMinTimeRemainingMs = (() => {
        if (minTimePerQuestionSeconds <= 0 || !currentQuestion) return 0;
        const viewedAt = firstViewedAt[currentQuestion._id];
        if (viewedAt === undefined) return minTimePerQuestionSeconds * 1000; // ping hasn't resolved yet
        return Math.max(0, minTimePerQuestionSeconds * 1000 - (nowTick - viewedAt));
    })();

    // Per-exam min-time gate — how much longer until Submit unblocks
    const examMinTimeRemainingMs = (() => {
        if (minTimePerExamMinutes <= 0 || startedAtMs === null) return 0;
        return Math.max(0, minTimePerExamMinutes * 60000 - (nowTick - startedAtMs));
    })();

    // examMinTimeRemainingMs depends on nowTick, which only ticks when a
    // per-question minimum is configured — also tick every second whenever a
    // per-exam minimum is active on its own.
    useEffect(() => {
        if (minTimePerExamMinutes <= 0 || minTimePerQuestionSeconds > 0) return;
        const interval = setInterval(() => setNowTick(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [minTimePerExamMinutes, minTimePerQuestionSeconds]);

    if (isLoading || !data?.data) {
        return <div className="h-screen flex items-center justify-center text-textSecondary">Loading exam...</div>;
    }

    return (
        <div className="h-screen flex flex-col bg-bgSecondary">
            <header className="h-16 bg-whiteColor border-b border-borderLight flex items-center justify-between px-4 sm:px-6 shadow-sm flex-shrink-0 gap-3">
                <h1 className="font-semibold text-textPrimary truncate">{data.data.examName}</h1>
                <div className="flex items-center gap-3 shrink-0">
                    {violationCount > 0 && (
                        <span className="hidden sm:inline-flex items-center gap-1 text-xs font-medium text-yellow-800 bg-yellow-50 border border-yellow-200 px-2 py-1 rounded-full">
                            <AlertTriangle className="w-3.5 h-3.5" /> {violationCount} warning{violationCount !== 1 ? 's' : ''}
                        </span>
                    )}
                    <CountdownTimer remainingMs={remainingMs ?? 0} />
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
                    {examSections.length > 0 && (
                        <div className="max-w-3xl mx-auto">
                            <SectionTabs
                                examSections={examSections}
                                questions={questions}
                                currentQuestionId={currentQuestion?._id}
                                onSelectSection={setCurrentIndex}
                            />
                        </div>
                    )}
                    {currentQuestion && (
                        <div className="max-w-3xl mx-auto">
                            <QuestionCard
                                question={currentQuestion}
                                index={currentIndex}
                                total={questions.length}
                                attemptId={attemptId as string}
                                answer={answers[currentQuestion._id]}
                                answerText={answers[currentQuestion._id]?.answerText}
                                onSelectMcq={(optionId) => handleSelectMcq(currentQuestion._id, optionId)}
                                onToggleMsq={(optionId) => handleToggleMsq(currentQuestion._id, optionId)}
                                onChangeText={(text) => handleChangeText(currentQuestion._id, text)}
                                isMarked={markedForReview.has(currentQuestion._id)}
                                onToggleMark={() => setMarkedForReview((prev) => {
                                    const next = new Set(prev);
                                    if (next.has(currentQuestion._id)) next.delete(currentQuestion._id);
                                    else next.add(currentQuestion._id);
                                    return next;
                                })}
                                onPrev={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                                onNext={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                                canGoPrev={currentIndex > 0 && !securitySettings?.blockBackwardNavigation}
                                canGoNext={currentIndex < questions.length - 1 && questionMinTimeRemainingMs <= 0}
                                nextBlockedReason={questionMinTimeRemainingMs > 0 ? `You can proceed in ${Math.ceil(questionMinTimeRemainingMs / 1000)}s` : undefined}
                            />
                        </div>
                    )}
                </main>

                <aside className="w-72 bg-whiteColor border-l border-borderLight p-4 flex-shrink-0 overflow-y-auto space-y-5">
                    <div className="relative rounded-lg border border-borderLight overflow-hidden bg-black aspect-video">
                        <video ref={videoPreviewCallbackRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                        <span className="absolute bottom-1.5 left-1.5 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-whiteColor">You</span>
                    </div>

                    <QuestionPalette
                        questionIds={questions.map((q) => q._id)}
                        currentIndex={currentIndex}
                        statusFor={paletteStatus}
                        blockBackwardNavigation={securitySettings?.blockBackwardNavigation}
                        onNavigate={setCurrentIndex}
                    />

                    <div className="space-y-1">
                        <Button
                            variant="primary"
                            fullWidth
                            onClick={() => setIsSubmitModalOpen(true)}
                            disabled={isSubmitting || examMinTimeRemainingMs > 0}
                        >
                            Submit Exam
                        </Button>
                        {examMinTimeRemainingMs > 0 && (
                            <p className="text-xs text-textTertiary text-center">
                                You can submit in {Math.ceil(examMinTimeRemainingMs / 1000)}s
                            </p>
                        )}
                    </div>
                </aside>
            </div>

            <SubmitExamModal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                answeredCount={answeredCount}
                totalCount={questions.length}
                isSubmitting={isSubmitting}
                onConfirm={() => handleSubmit(SubmissionTrigger.MANUAL)}
            />
        </div>
    );
};

export default ExamRoomPage;
