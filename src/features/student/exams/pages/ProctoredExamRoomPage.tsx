import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Room, RoomEvent, RemoteParticipant, RemoteTrackPublication, Track } from "livekit-client";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import { QuestionType, SubmissionTrigger } from "../../../../utils/enum";
import { examMediaStore } from "../utils/examMediaStore";
import { useExamRecorder } from "../hooks/useExamRecorder";
import { useIntegrityMonitor } from "../hooks/useIntegrityMonitor";
import WrittenAnswerCapture from "../components/WrittenAnswerCapture";
import { ReportViolationResponse } from "../../../../types/student-exam-types";
import { encodeChatPayload, decodeChatPayload, LiveKitChatPayload } from "../../../../utils/liveKitDataMessage";
import {
    useGetAttemptQuery,
    useSaveAnswerMutation,
    useSubmitAttemptMutation,
} from "../../../../state/services/endpoints/student-exams";
import {
    useGetStudentLiveKitTokenMutation,
    useSendStudentChatMutation,
    useGetStudentChatHistoryQuery,
} from "../../../../state/services/endpoints/student-proctoring";

type LocalAnswer = { selectedOptionId?: string; selectedOptionIds?: string[] };

function formatTime(ms: number): string {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

const ProctoredExamRoomPage = () => {
    const navigate = useNavigate();
    const { attemptId } = useParams<{ examId: string; attemptId: string }>();
    const { data, isLoading } = useGetAttemptQuery(attemptId as string, { skip: !attemptId });
    const [saveAnswer] = useSaveAnswerMutation();
    const [submitAttempt, { isLoading: isSubmitting }] = useSubmitAttemptMutation();
    const [getLiveKitToken] = useGetStudentLiveKitTokenMutation();
    const [sendChat] = useSendStudentChatMutation();

    const [answers, setAnswers] = useState<Record<string, LocalAnswer>>({});
    const [visited, setVisited] = useState<Set<string>>(new Set());
    const [markedForReview, setMarkedForReview] = useState<Set<string>>(new Set());
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
    const [remainingMs, setRemainingMs] = useState<number | null>(null);
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
            const initial: Record<string, LocalAnswer> = {};
            data.data.answers.forEach((a) => {
                initial[a.questionId] = { selectedOptionId: a.selectedOptionId, selectedOptionIds: a.selectedOptionIds };
            });
            setAnswers(initial);
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
    const currentQuestion = questions[currentIndex];
    const securitySettings = data?.data?.securitySettings;

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

    useIntegrityMonitor({
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
                <div className="flex items-center gap-3">
                    <h1 className="font-semibold text-textPrimary">{data.data.examName}</h1>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${liveKitStatus === 'CONNECTED' ? 'bg-green-100 text-green-700' : liveKitStatus === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {liveKitStatus === 'CONNECTED' ? 'Proctoring Live' : liveKitStatus === 'FAILED' ? 'Proctoring Offline' : 'Connecting...'}
                    </span>
                </div>
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
                                <WrittenAnswerCapture
                                    key={currentQuestion._id}
                                    attemptId={attemptId as string}
                                    questionId={currentQuestion._id}
                                />
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
                                    disabled={currentIndex === 0 || !!securitySettings?.blockBackwardNavigation}
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

                <aside className="w-80 bg-whiteColor border-l border-borderLight p-4 flex-shrink-0 overflow-y-auto space-y-4">
                    <video ref={videoPreviewCallbackRef} autoPlay muted playsInline className="w-full rounded-md border border-borderLight" />

                    <div className="rounded-md border border-borderLight overflow-hidden bg-bgSecondary">
                        <p className="text-xs font-semibold text-textSecondary px-2 py-1 bg-bgTertiary">Invigilator</p>
                        <video ref={invigilatorVideoRef} autoPlay playsInline className="w-full aspect-video bg-black" />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-textPrimary mb-2">Question Palette</p>
                        <div className="grid grid-cols-5 gap-2">
                            {questions.map((q, index) => {
                                const isBlockedBackward = !!securitySettings?.blockBackwardNavigation && index < currentIndex;
                                return (
                                    <button
                                        key={q._id}
                                        type="button"
                                        disabled={isBlockedBackward}
                                        onClick={() => setCurrentIndex(index)}
                                        className={`h-8 w-8 rounded text-sm font-medium ${paletteColor[paletteStatus(q._id)]} ${currentIndex === index ? 'ring-2 ring-primary' : ''} ${isBlockedBackward ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="border border-borderLight rounded-md flex flex-col h-56">
                        <p className="text-xs font-semibold text-textSecondary px-2 py-1 bg-bgTertiary">Chat with Invigilator</p>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1 text-sm">
                            {chatMessages.map((m, i) => (
                                <div key={i} className={m.senderRole === 'STUDENT' ? 'text-right' : 'text-left'}>
                                    <span className={`inline-block px-2 py-1 rounded-md ${m.senderRole === 'STUDENT' ? 'bg-primaryLighter text-primary' : 'bg-bgSecondary text-textPrimary'}`}>
                                        {m.message}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <div className="flex border-t border-borderLight">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                placeholder="Type a message..."
                                className="flex-1 px-2 py-1 text-sm outline-none"
                            />
                            <button type="button" onClick={handleSendChat} className="px-3 text-sm font-medium text-primary">Send</button>
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

export default ProctoredExamRoomPage;
