import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Room, RoomEvent, RemoteParticipant, RemoteTrackPublication, Track } from "livekit-client";
import { AlertTriangle, Send } from "lucide-react";
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
import { encodeChatPayload, decodeChatPayload, LiveKitChatPayload } from "../../../../utils/liveKitDataMessage";
import {
    useGetAttemptQuery,
    useSaveAnswerMutation,
    useSubmitAttemptMutation,
    useViewQuestionMutation,
} from "../../../../state/services/endpoints/student-exams";
import {
    useGetStudentLiveKitTokenMutation,
    useSendStudentChatMutation,
    useGetStudentChatHistoryQuery,
} from "../../../../state/services/endpoints/student-proctoring";

type LocalAnswer = { selectedOptionId?: string; selectedOptionIds?: string[]; answerText?: string };

const LIVEKIT_STATUS_STYLES: Record<'CONNECTING' | 'CONNECTED' | 'FAILED', string> = {
    CONNECTED: 'bg-green-100 text-green-700',
    FAILED: 'bg-red-100 text-red-700',
    CONNECTING: 'bg-yellow-100 text-yellow-700',
};

const ProctoredExamRoomPage = () => {
    const navigate = useNavigate();
    const { attemptId } = useParams<{ examId: string; attemptId: string }>();
    const { data, isLoading } = useGetAttemptQuery(attemptId as string, { skip: !attemptId });
    const [saveAnswer] = useSaveAnswerMutation();
    const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();
    const [getLiveKitToken] = useGetStudentLiveKitTokenMutation();
    const [sendChat] = useSendStudentChatMutation();
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

    const [roomId, setRoomId] = useState<string | null>(null);
    const [liveKitStatus, setLiveKitStatus] = useState<'CONNECTING' | 'CONNECTED' | 'FAILED'>('CONNECTING');
    const [chatMessages, setChatMessages] = useState<LiveKitChatPayload[]>([]);
    const [chatInput, setChatInput] = useState('');
    const roomRef = useRef<Room | null>(null);
    const facultyIdentityRef = useRef<string | null>(null);
    const invigilatorVideoRef = useRef<HTMLVideoElement>(null);

    const streams = useMemo(() => examMediaStore.get(), []);

    const { stopAndFinalize } = useExamRecorder({
        attemptId: attemptId as string,
        videoStream: streams.video,
        audioStream: streams.audio,
        screenStream: streams.screen,
    });

    const { data: chatHistory } = useGetStudentChatHistoryQuery(roomId as string, { skip: !roomId });

    useEffect(() => {
        if (chatHistory?.data) {
            setChatMessages(chatHistory.data.map((m) => ({
                type: 'chat',
                message: m.message,
                senderRole: m.senderRole as 'STUDENT' | 'FACULTY',
                senderIdentity: m.senderId,
                sentAt: m.sentAt,
            })));
        }
    }, [chatHistory]);

    // A callback ref so the stream attaches whenever the <video> element mounts,
    // regardless of prior render-gating (see ExamRoomPage.tsx for the same pattern).
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

    // Connect to LiveKit, publish local tracks, and restrict subscription to the
    // room's faculty only — the SFU itself never forwards our tracks to other students.
    useEffect(() => {
        if (!attemptId) return;
        let cancelled = false;

        (async () => {
            try {
                const response = await getLiveKitToken(attemptId).unwrap();
                if (cancelled || !response.data) return;

                const { token, liveKitUrl, roomId: dbRoomId, facultyIdentity } = response.data;
                facultyIdentityRef.current = facultyIdentity;
                setRoomId(dbRoomId);

                const room = new Room();
                roomRef.current = room;

                room.on(RoomEvent.DataReceived, (payload) => {
                    const parsed = decodeChatPayload(payload);
                    if (parsed) setChatMessages((prev) => [...prev, parsed]);
                });

                room.on(RoomEvent.TrackSubscribed, (_track, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
                    if (participant.identity === facultyIdentity && publication.kind === Track.Kind.Video && invigilatorVideoRef.current) {
                        publication.track?.attach(invigilatorVideoRef.current);
                    }
                });

                room.on(RoomEvent.Disconnected, () => {
                    if (!hasSubmittedRef.current) {
                        toast.error('Disconnected from the proctoring session');
                    }
                });

                await room.connect(liveKitUrl, token);
                if (cancelled) {
                    await room.disconnect();
                    return;
                }

                if (streams.video) await room.localParticipant.publishTrack(streams.video.getVideoTracks()[0], { source: Track.Source.Camera });
                if (streams.audio) await room.localParticipant.publishTrack(streams.audio.getAudioTracks()[0], { source: Track.Source.Microphone });
                if (streams.screen) await room.localParticipant.publishTrack(streams.screen.getVideoTracks()[0], { source: Track.Source.ScreenShare });

                room.localParticipant.setTrackSubscriptionPermissions(false, [
                    { participantIdentity: facultyIdentity, allowAll: true },
                ]);

                setLiveKitStatus('CONNECTED');
            } catch (error) {
                console.error('LiveKit connection failed', error);
                setLiveKitStatus('FAILED');
            }
        })();

        return () => {
            cancelled = true;
            roomRef.current?.disconnect();
            roomRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attemptId]);

    const questions = data?.data?.questions || [];
    const examSections = data?.data?.examSections || [];
    const currentQuestion = questions[currentIndex];
    const securitySettings = data?.data?.securitySettings;
    const minTimePerQuestionSeconds = securitySettings?.minTimePerQuestionSeconds || 0;
    const minTimePerExamMinutes = securitySettings?.minTimePerExamMinutes || 0;

    // Stops recording, disconnects LiveKit, exits fullscreen, and redirects —
    // shared by a normal submit and an integrity-violation auto-submit (the
    // server has already finalized the attempt by the time either path calls this)
    const finishAndRedirect = useCallback(async (totalScore?: number | null, message?: string) => {
        await stopAndFinalize();
        await roomRef.current?.disconnect();
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

    const handleSendChat = () => {
        const message = chatInput.trim();
        if (!message || !roomId) return;
        setChatInput('');

        const payload: LiveKitChatPayload = {
            type: 'chat',
            message,
            senderRole: 'STUDENT',
            senderIdentity: roomRef.current?.localParticipant.identity || 'me',
            sentAt: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, payload]);

        if (roomRef.current && facultyIdentityRef.current) {
            roomRef.current.localParticipant.publishData(encodeChatPayload(payload), {
                reliable: true,
                destinationIdentities: [facultyIdentityRef.current],
            }).catch(() => { });
        }

        sendChat({ roomId, message }).unwrap().catch(() => toast.error('Message may not have been saved'));
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
        if (viewedAt === undefined) return minTimePerQuestionSeconds * 1000;
        return Math.max(0, minTimePerQuestionSeconds * 1000 - (nowTick - viewedAt));
    })();

    // Per-exam min-time gate — how much longer until Submit unblocks
    const examMinTimeRemainingMs = (() => {
        if (minTimePerExamMinutes <= 0 || startedAtMs === null) return 0;
        return Math.max(0, minTimePerExamMinutes * 60000 - (nowTick - startedAtMs));
    })();

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
                <div className="flex items-center gap-3 min-w-0">
                    <h1 className="font-semibold text-textPrimary truncate">{data.data.examName}</h1>
                    <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${LIVEKIT_STATUS_STYLES[liveKitStatus]}`}>
                        {liveKitStatus === 'CONNECTED' ? 'Proctoring Live' : liveKitStatus === 'FAILED' ? 'Proctoring Offline' : 'Connecting...'}
                    </span>
                </div>
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

                <aside className="w-80 bg-whiteColor border-l border-borderLight p-4 flex-shrink-0 overflow-y-auto space-y-5">
                    <div className="grid grid-cols-2 gap-2">
                        <div className="relative rounded-lg border border-borderLight overflow-hidden bg-black aspect-video">
                            <video ref={videoPreviewCallbackRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 text-[9px] px-1 py-0.5 rounded bg-black/60 text-whiteColor">You</span>
                        </div>
                        <div className="relative rounded-lg border border-borderLight overflow-hidden bg-black aspect-video">
                            <video ref={invigilatorVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                            <span className="absolute bottom-1 left-1 text-[9px] px-1 py-0.5 rounded bg-black/60 text-whiteColor">Invigilator</span>
                        </div>
                    </div>

                    <QuestionPalette
                        questionIds={questions.map((q) => q._id)}
                        currentIndex={currentIndex}
                        statusFor={paletteStatus}
                        blockBackwardNavigation={securitySettings?.blockBackwardNavigation}
                        onNavigate={setCurrentIndex}
                    />

                    <div className="border border-borderLight rounded-lg flex flex-col h-56 overflow-hidden">
                        <p className="text-xs font-semibold text-textSecondary px-3 py-2 bg-bgSecondary border-b border-borderLight">Chat with Invigilator</p>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1.5 text-sm">
                            {chatMessages.map((m, i) => (
                                <div key={i} className={m.senderRole === 'STUDENT' ? 'text-right' : 'text-left'}>
                                    <span className={`inline-block px-2.5 py-1.5 rounded-md max-w-[85%] break-words ${m.senderRole === 'STUDENT' ? 'bg-primaryLighter text-primary' : 'bg-bgSecondary text-textPrimary'}`}>
                                        {m.message}
                                    </span>
                                </div>
                            ))}
                            {chatMessages.length === 0 && <p className="text-xs text-textSecondary text-center py-4">No messages yet.</p>}
                        </div>
                        <div className="flex items-center border-t border-borderLight">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                placeholder="Type a message..."
                                className="flex-1 px-3 py-2 text-sm outline-none bg-transparent min-w-0"
                            />
                            <button type="button" onClick={handleSendChat} className="px-3 text-primary hover:text-primary/80 cursor-pointer shrink-0" title="Send">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

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

export default ProctoredExamRoomPage;
