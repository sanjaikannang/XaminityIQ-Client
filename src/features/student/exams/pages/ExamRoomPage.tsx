import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import { QuestionType, SubmissionTrigger } from "../../../../utils/enum";
import { examMediaStore } from "../utils/examMediaStore";
import { useExamRecorder } from "../hooks/useExamRecorder";
import {
    useGetAttemptQuery,
    useSaveAnswerMutation,
    useSubmitAttemptMutation,
} from "../../../../state/services/endpoints/student-exams";

type LocalAnswer = { selectedOptionId?: string; selectedOptionIds?: string[] };

function formatTime(ms: number): string {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const ExamRoomPage = () => {
    const navigate = useNavigate();
    const { attemptId } = useParams<{ examId: string; attemptId: string }>();
    const { data, isLoading } = useGetAttemptQuery(attemptId as string, { skip: !attemptId });
    const [saveAnswer] = useSaveAnswerMutation();
    const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();

    const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
    const [visited, setVisited] = useState<Set<string>>(new Set());
    const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [remainingMs, setRemainingMs] = useState<number | null>(null);
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
            const initial: Record<string, LocalAnswer> = {};
            data.data.answers.forEach((a) => {
                initial[a.questionId] = { selectedOptionId: a.selectedOptionId, selectedOptionIds: a.selectedOptionIds };
            });
            setAnswers(initial);
        }
    }, [data]);

    const questions = data?.data?.questions || [];
    const currentQuestion = questions[currentIndex];

    const handleSubmit = useCallback(async (trigger: SubmissionTrigger) => {
        if (!attemptId || hasSubmittedRef.current) return;
        hasSubmittedRef.current = true;
        try {
            const response = await submitAttempt({ attemptId, trigger }).unwrap();
            await stopAndFinalize();
            examMediaStore.clear();
            if (document.fullscreenElement) {
                await document.exitFullscreen().catch(() => { });
            }
            toast.success(
                response.totalScore !== undefined && response.totalScore !== null
                    ? `Exam submitted. Score: ${response.totalScore}`
                    : 'Exam submitted successfully',
            );
            navigate('/student/exams', { replace: true });
        } catch (error: any) {
            hasSubmittedRef.current = false;
            toast.error(error.data?.message || 'Failed to submit exam');
        }
    }, [attemptId, submitAttempt, stopAndFinalize, navigate]);

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
        }
    }, [currentQuestion]);

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

    const paletteStatus = (questionId: string): 'not-visited' | 'not-answered' | 'answered' | 'marked' => {
        if (markedForReview.has(questionId)) return 'marked';
        const answer = answers[questionId];
        const isAnswered = !!(answer?.selectedOptionId || (answer?.selectedOptionIds && answer.selectedOptionIds.length > 0));
        if (isAnswered) return 'answered';
        if (visited.has(questionId)) return 'not-answered';
        return 'not-visited';
    };

    const paletteColor: Record<string, string> = {
        'not-visited': 'bg-bgSecondary text-textPrimary',
        'not-answered': 'bg-red-100 text-red-700',
        'answered': 'bg-green-100 text-green-700',
        'marked': 'bg-purple-100 text-purple-700',
    };

    const answeredCount = questions.filter((q) => {
        const a = answers[q._id];
        return !!(a?.selectedOptionId || (a?.selectedOptionIds && a.selectedOptionIds.length > 0));
    }).length;

    if (isLoading || !data?.data) {
        return <div className="h-screen flex items-center justify-center text-textSecondary">Loading exam...</div>;
    }

    return (
        <div className="h-screen flex flex-col bg-bgSecondary">
            <header className="h-16 bg-whiteColor border-b border-borderLight flex items-center justify-between px-6 shadow-sm flex-shrink-0">
                <h1 className="font-semibold text-textPrimary">{data.data.examName}</h1>
                <div className="text-xl font-bold text-primary">{formatTime(remainingMs ?? 0)}</div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    {currentQuestion && (
                        <div className="bg-whiteColor rounded-lg border border-borderLight p-6 space-y-4">
                            <p className="text-sm text-textSecondary">
                                Question {currentIndex + 1} of {questions.length} • {currentQuestion.marks} marks
                            </p>
                            <p className="text-lg text-textPrimary">{currentQuestion.text}</p>

                            {currentQuestion.type === QuestionType.WRITTEN && (
                                <div className="rounded-md border border-dashed border-borderLight p-6 text-center text-textSecondary">
                                    Written-answer capture (QR/mobile upload) is available in a future update.
                                </div>
                            )}

                            {currentQuestion.type === QuestionType.MCQ && currentQuestion.options?.map((option) => (
                                <label key={option.optionId} className="flex items-center gap-3 p-2 rounded-md hover:bg-bgSecondary cursor-pointer">
                                    <input
                                        type="radio"
                                        name={`q-${currentQuestion._id}`}
                                        checked={answers[currentQuestion._id]?.selectedOptionId === option.optionId}
                                        onChange={() => handleSelectMcq(currentQuestion._id, option.optionId)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-textPrimary">{option.text}</span>
                                </label>
                            ))}

                            {currentQuestion.type === QuestionType.MSQ && currentQuestion.options?.map((option) => (
                                <label key={option.optionId} className="flex items-center gap-3 p-2 rounded-md hover:bg-bgSecondary cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={(answers[currentQuestion._id]?.selectedOptionIds || []).includes(option.optionId)}
                                        onChange={() => handleToggleMsq(currentQuestion._id, option.optionId)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-textPrimary">{option.text}</span>
                                </label>
                            ))}

                            <div className="flex justify-between pt-4 border-t border-borderLight">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentIndex === 0}
                                    onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMarkedForReview((prev) => {
                                        const next = new Set(prev);
                                        if (next.has(currentQuestion._id)) next.delete(currentQuestion._id);
                                        else next.add(currentQuestion._id);
                                        return next;
                                    })}
                                >
                                    {markedForReview.has(currentQuestion._id) ? 'Unmark Review' : 'Mark for Review'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentIndex === questions.length - 1}
                                    onClick={() => setCurrentIndex((i) => Math.min(questions.length - 1, i + 1))}
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    )}
                </main>

                <aside className="w-72 bg-whiteColor border-l border-borderLight p-4 flex-shrink-0 overflow-y-auto space-y-4">
                    <video ref={videoPreviewCallbackRef} autoPlay muted playsInline className="w-full rounded-md border border-borderLight" />

                    <div>
                        <p className="text-sm font-semibold text-textPrimary mb-2">Question Palette</p>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, index) => (
                                <button
                                    key={q._id}
                                    type="button"
                                    onClick={() => setCurrentIndex(index)}
                                    className={`h-8 w-8 rounded text-sm font-medium ${paletteColor[paletteStatus(q._id)]} ${currentIndex === index ? 'ring-2 ring-primary' : ''}`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                        </div>
                    </div>

                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => setIsSubmitModalOpen(true)}
                        disabled={isSubmitting}
                    >
                        Submit Exam
                    </Button>
                </aside>
            </div>

            <Modal
                isOpen={isSubmitModalOpen}
                onClose={() => setIsSubmitModalOpen(false)}
                title="Submit Exam"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-textPrimary">
                        {answeredCount} of {questions.length} questions answered. Submit anyway?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsSubmitModalOpen(false)}>Cancel</Button>
                        <Button
                            variant="primary"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            onClick={() => handleSubmit(SubmissionTrigger.MANUAL)}
                        >
                            {isSubmitting ? '' : 'Submit'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ExamRoomPage;
