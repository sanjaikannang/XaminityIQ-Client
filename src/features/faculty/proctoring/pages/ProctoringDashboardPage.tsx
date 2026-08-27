import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Room, RoomEvent, RemoteTrack, RemoteTrackPublication, RemoteParticipant, Track } from "livekit-client";
import { PanelRightClose, PanelRightOpen, Send } from "lucide-react";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import { CountdownTimer } from "../../../../common/ui/CountdownTimer";
import { ChatRecipientType, RoomAssignmentStatus } from "../../../../utils/enum";
import { encodeChatPayload, decodeChatPayload, LiveKitChatPayload } from "../../../../utils/liveKitDataMessage";
import { RoomAssignmentData } from "../../../../types/proctoring-types";
import StudentMonitorCard, { type TileTracks } from "../components/StudentMonitorCard";
import {
    useGetExamRoomDetailQuery,
    useGetFacultyLiveKitTokenMutation,
    useAdmitStudentMutation,
    useRejectStudentMutation,
    useRemoveStudentMutation,
    useSetStudentMicMutation,
    useSendFacultyChatMutation,
    useGetFacultyChatHistoryQuery,
} from "../../../../state/services/endpoints/faculty-proctoring";

const ProctoringDashboardPage = () => {
    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();
    const { data: roomDetail } = useGetExamRoomDetailQuery(roomId as string, { skip: !roomId, pollingInterval: 3000 });
    const [getLiveKitToken] = useGetFacultyLiveKitTokenMutation();
    const [admitStudent, { isLoading: isAdmitting }] = useAdmitStudentMutation();
    const [rejectStudent, { isLoading: isRejecting }] = useRejectStudentMutation();
    const [removeStudent, { isLoading: isRemoving }] = useRemoveStudentMutation();
    const [setStudentMic] = useSetStudentMicMutation();
    const [sendFacultyChat] = useSendFacultyChatMutation();

    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [liveKitStatus, setLiveKitStatus] = useState<'CONNECTING' | 'CONNECTED' | 'FAILED'>('CONNECTING');
    const [tiles, setTiles] = useState<Record<string, TileTracks>>({});
    const [mutingIdentity, setMutingIdentity] = useState<string | null>(null);
    const roomRef = useRef<Room | null>(null);
    const myIdentityRef = useRef<string | null>(null);
    const trackMapRef = useRef<Record<string, TileTracks>>({});
    const videoElsRef = useRef<Record<string, HTMLVideoElement | null>>({});
    const screenElsRef = useRef<Record<string, HTMLVideoElement | null>>({});

    const [rejectTarget, setRejectTarget] = useState<RoomAssignmentData | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const [removeTarget, setRemoveTarget] = useState<RoomAssignmentData | null>(null);
    const [removeReason, setRemoveReason] = useState('');

    const [chatRecipient, setChatRecipient] = useState<{ type: ChatRecipientType; studentId?: string; identity?: string; label: string }>({
        type: ChatRecipientType.BROADCAST_ROOM,
        label: 'All Students',
    });
    const [chatMessages, setChatMessages] = useState<LiveKitChatPayload[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [now, setNow] = useState(() => Date.now());

    const { data: chatHistory } = useGetFacultyChatHistoryQuery(roomId as string, { skip: !roomId });

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

    useEffect(() => {
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, []);

    const assignments = useMemo(() => roomDetail?.data?.assignments || [], [roomDetail]);
    const waiting = assignments.filter((a) => a.status === RoomAssignmentStatus.WAITING);
    const active = assignments.filter((a) => a.status === RoomAssignmentStatus.ADMITTED || a.status === RoomAssignmentStatus.IN_PROGRESS);
    // Grace-period-exceeded LiveKit dropout (not a faculty removal) — informational
    // only, the student rejoins on their own via the lobby, landing back in Waiting.
    const disconnected = assignments.filter((a) => a.status === RoomAssignmentStatus.DISCONNECTED);
    const endDateTime = roomDetail?.data?.endDateTime;
    const remainingMs = endDateTime ? new Date(endDateTime).getTime() - now : null;

    const identityForStudent = (studentId: string) => `student-${studentId}`;
    const assignmentForIdentity = (identity: string) => assignments.find((a) => identityForStudent(a.studentId) === identity);

    const videoRefFor = (identity: string) => (node: HTMLVideoElement | null) => {
        videoElsRef.current[identity] = node;
        if (node && trackMapRef.current[identity]?.video) {
            trackMapRef.current[identity].video!.attach(node);
        }
    };
    const screenRefFor = (identity: string) => (node: HTMLVideoElement | null) => {
        screenElsRef.current[identity] = node;
        if (node && trackMapRef.current[identity]?.screen) {
            trackMapRef.current[identity].screen!.attach(node);
        }
    };

    useEffect(() => {
        if (!roomId) return;
        let cancelled = false;

        (async () => {
            try {
                const response = await getLiveKitToken(roomId).unwrap();
                if (cancelled || !response.data) return;

                const { token, liveKitUrl, identity } = response.data;
                myIdentityRef.current = identity;

                const room = new Room();
                roomRef.current = room;

                room.on(RoomEvent.TrackSubscribed, (track: RemoteTrack, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
                    if (!participant.identity.startsWith('student-')) return;
                    const entry = trackMapRef.current[participant.identity] || {};
                    if (publication.source === Track.Source.Camera) entry.video = track;
                    if (publication.source === Track.Source.ScreenShare) entry.screen = track;
                    if (publication.source === Track.Source.Microphone) {
                        entry.hasAudio = true;
                        entry.micMuted = publication.isMuted;
                    }
                    trackMapRef.current[participant.identity] = entry;
                    setTiles({ ...trackMapRef.current });

                    if (publication.source === Track.Source.Camera) {
                        const el = videoElsRef.current[participant.identity];
                        if (el) track.attach(el);
                    }
                    if (publication.source === Track.Source.ScreenShare) {
                        const el = screenElsRef.current[participant.identity];
                        if (el) track.attach(el);
                    }
                });

                room.on(RoomEvent.TrackUnsubscribed, (_track, publication, participant) => {
                    const entry = trackMapRef.current[participant.identity];
                    if (!entry) return;
                    if (publication.source === Track.Source.Camera) delete entry.video;
                    if (publication.source === Track.Source.ScreenShare) delete entry.screen;
                    if (publication.source === Track.Source.Microphone) entry.hasAudio = false;
                    setTiles({ ...trackMapRef.current });
                });

                room.on(RoomEvent.TrackMuted, (publication, participant) => {
                    if (publication.source !== Track.Source.Microphone) return;
                    const entry = trackMapRef.current[participant.identity];
                    if (!entry) return;
                    entry.micMuted = true;
                    setTiles({ ...trackMapRef.current });
                });
                room.on(RoomEvent.TrackUnmuted, (publication, participant) => {
                    if (publication.source !== Track.Source.Microphone) return;
                    const entry = trackMapRef.current[participant.identity];
                    if (!entry) return;
                    entry.micMuted = false;
                    setTiles({ ...trackMapRef.current });
                });

                room.on(RoomEvent.DataReceived, (payload) => {
                    const parsed = decodeChatPayload(payload);
                    if (parsed) setChatMessages((prev) => [...prev, parsed]);
                });

                await room.connect(liveKitUrl, token);
                if (cancelled) {
                    await room.disconnect();
                    return;
                }
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
    }, [roomId]);

    const handleAdmit = async (assignment: RoomAssignmentData) => {
        if (!roomId) return;
        try {
            await admitStudent({ roomId, assignmentId: assignment.assignmentId }).unwrap();
            toast.success('Student admitted');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to admit student');
        }
    };

    const handleReject = async () => {
        if (!roomId || !rejectTarget || !rejectReason.trim()) return;
        try {
            await rejectStudent({ roomId, assignmentId: rejectTarget.assignmentId, data: { reason: rejectReason.trim() } }).unwrap();
            toast.success('Student rejected');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to reject student');
        } finally {
            setRejectTarget(null);
            setRejectReason('');
        }
    };

    const handleRemove = async () => {
        if (!roomId || !removeTarget || !removeReason.trim()) return;
        try {
            await removeStudent({ roomId, assignmentId: removeTarget.assignmentId, data: { reason: removeReason.trim() } }).unwrap();
            toast.success('Student removed');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to remove student');
        } finally {
            setRemoveTarget(null);
            setRemoveReason('');
        }
    };

    const handleToggleMic = async (assignment: RoomAssignmentData) => {
        if (!roomId) return;
        const identity = identityForStudent(assignment.studentId);
        const currentlyMuted = !!tiles[identity]?.micMuted;
        setMutingIdentity(identity);
        try {
            const response = await setStudentMic({ roomId, assignmentId: assignment.assignmentId, data: { muted: !currentlyMuted } }).unwrap();
            if (response.data?.muted === null) {
                toast.error("Student hasn't enabled their mic yet");
            } else {
                toast.success(currentlyMuted ? 'Student mic unmuted' : 'Student mic muted');
            }
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to update mic');
        } finally {
            setMutingIdentity(null);
        }
    };

    const openChatWith = (assignment: RoomAssignmentData) => {
        setSidebarOpen(true);
        setChatRecipient({
            type: ChatRecipientType.INDIVIDUAL,
            studentId: assignment.studentId,
            identity: identityForStudent(assignment.studentId),
            label: assignment.studentName || assignment.studentCode,
        });
    };

    const handleSendChat = () => {
        const message = chatInput.trim();
        if (!message || !roomId) return;
        setChatInput('');

        const payload: LiveKitChatPayload = {
            type: 'chat',
            message,
            senderRole: 'FACULTY',
            senderIdentity: myIdentityRef.current || 'faculty',
            sentAt: new Date().toISOString(),
        };
        setChatMessages((prev) => [...prev, payload]);

        if (roomRef.current) {
            roomRef.current.localParticipant.publishData(encodeChatPayload(payload), {
                reliable: true,
                ...(chatRecipient.type === ChatRecipientType.INDIVIDUAL && chatRecipient.identity
                    ? { destinationIdentities: [chatRecipient.identity] }
                    : {}),
            }).catch(() => { });
        }

        sendFacultyChat({
            roomId,
            data: {
                message,
                recipientType: chatRecipient.type,
                ...(chatRecipient.studentId ? { recipientStudentId: chatRecipient.studentId } : {}),
            },
        }).unwrap().catch(() => toast.error('Message may not have been saved'));
    };

    if (!roomDetail?.data) {
        return <div className="h-screen flex items-center justify-center text-textSecondary">Loading room...</div>;
    }

    const room = roomDetail.data;

    return (
        <div className="h-screen flex flex-col bg-bgSecondary">
            <header className="h-16 bg-whiteColor border-b border-borderLight flex items-center justify-between px-4 sm:px-6 shadow-sm flex-shrink-0 gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <h1 className="font-semibold text-textPrimary truncate max-w-[280px] sm:max-w-md" title={room.exams.map((e) => e.examName).join(', ')}>
                        {room.exams.map((e) => e.examName).join(', ')}
                    </h1>
                    <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${liveKitStatus === 'CONNECTED' ? 'bg-green-100 text-green-700' : liveKitStatus === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {liveKitStatus === 'CONNECTED' ? 'Live' : liveKitStatus === 'FAILED' ? 'Offline' : 'Connecting...'}
                    </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    {remainingMs !== null && <CountdownTimer remainingMs={remainingMs} />}
                    <button
                        type="button"
                        onClick={() => setSidebarOpen((v) => !v)}
                        title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
                        className="p-2 rounded-lg border border-borderLight text-textSecondary hover:bg-bgSecondary hover:text-textPrimary transition-colors cursor-pointer"
                    >
                        {sidebarOpen ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
                    </button>
                    <Button variant="outline" size="sm" onClick={() => navigate('/faculty/proctoring')}>Back</Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 md:p-6">
                    <p className="text-sm font-semibold text-textPrimary mb-3">Admitted Students ({active.length})</p>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${!sidebarOpen ? 'xl:grid-cols-3' : ''} gap-4`}>
                        {active.map((a) => {
                            const identity = identityForStudent(a.studentId);
                            return (
                                <StudentMonitorCard
                                    key={a.assignmentId}
                                    assignment={a}
                                    tile={tiles[identity]}
                                    showExamName={room.exams.length > 1}
                                    videoRef={videoRefFor(identity)}
                                    screenRef={screenRefFor(identity)}
                                    onChat={() => openChatWith(a)}
                                    onToggleMic={() => handleToggleMic(a)}
                                    isMutingMic={mutingIdentity === identity}
                                    onRemove={() => setRemoveTarget(a)}
                                />
                            );
                        })}
                    </div>
                    {active.length === 0 && (
                        <div className="rounded-xl border border-dashed border-borderDefault py-16 text-center text-sm text-textSecondary">
                            No students admitted yet — admit someone from the Waiting Queue.
                        </div>
                    )}
                </main>

                {sidebarOpen && (
                    <aside className="w-full sm:w-96 bg-whiteColor border-l border-borderLight flex flex-col flex-shrink-0 min-h-0">
                        <div className="border-b border-borderLight flex flex-col min-h-0 max-h-[45%]">
                            <p className="text-sm font-semibold text-textPrimary px-4 pt-4 pb-2 shrink-0">Waiting Queue ({waiting.length})</p>
                            <div className="overflow-y-auto px-4 pb-4 space-y-2">
                                {waiting.map((a) => (
                                    <div key={a.assignmentId} className="rounded-md border border-borderLight p-3">
                                        <p className="text-sm font-medium text-textPrimary truncate">{a.studentName || a.studentCode}</p>
                                        <p className="text-xs text-textSecondary truncate">{a.studentEmail}</p>
                                        <p className="text-xs text-textTertiary truncate">Roll: {a.studentCode}</p>
                                        {room.exams.length > 1 && (
                                            <p className="text-[10px] text-textTertiary truncate mt-0.5" title={a.examName}>{a.examName}</p>
                                        )}
                                        <div className="flex gap-2 mt-2">
                                            <Button variant="primary" size="sm" className="flex-1" loading={isAdmitting} onClick={() => handleAdmit(a)}>Admit</Button>
                                            <Button variant="outline" size="sm" className="flex-1" onClick={() => setRejectTarget(a)}>Reject</Button>
                                        </div>
                                    </div>
                                ))}
                                {waiting.length === 0 && <p className="text-xs text-textSecondary">No students waiting.</p>}
                            </div>
                        </div>

                        {disconnected.length > 0 && (
                            <div className="border-b border-borderLight flex flex-col min-h-0 max-h-[25%]">
                                <p className="text-sm font-semibold text-yellow-700 px-4 pt-3 pb-2 shrink-0">Disconnected ({disconnected.length})</p>
                                <div className="overflow-y-auto px-4 pb-3 space-y-2">
                                    {disconnected.map((a) => (
                                        <div key={a.assignmentId} className="rounded-md border border-yellow-200 bg-yellow-50 p-2.5">
                                            <p className="text-sm font-medium text-textPrimary truncate">{a.studentName || a.studentCode}</p>
                                            <p className="text-xs text-yellow-700">Lost connection — waiting for them to rejoin</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
                            <div className="p-3 border-b border-borderLight shrink-0">
                                <p className="text-sm font-semibold text-textPrimary mb-2">Chat</p>
                                <select
                                    className="w-full text-sm border border-borderLight rounded-md px-2 py-1.5 bg-whiteColor text-textPrimary"
                                    value={chatRecipient.type === ChatRecipientType.BROADCAST_ROOM ? 'ALL' : chatRecipient.studentId}
                                    onChange={(e) => {
                                        if (e.target.value === 'ALL') {
                                            setChatRecipient({ type: ChatRecipientType.BROADCAST_ROOM, label: 'All Students' });
                                        } else {
                                            const a = assignments.find((x) => x.studentId === e.target.value);
                                            if (a) {
                                                setChatRecipient({
                                                    type: ChatRecipientType.INDIVIDUAL,
                                                    studentId: a.studentId,
                                                    identity: identityForStudent(a.studentId),
                                                    label: a.studentName || a.studentCode,
                                                });
                                            }
                                        }
                                    }}
                                >
                                    <option value="ALL">All Students (Broadcast)</option>
                                    {active.map((a) => (
                                        <option key={a.studentId} value={a.studentId}>{a.studentName || a.studentCode}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-1.5 text-sm min-h-0">
                                {chatMessages.map((m, i) => {
                                    const senderAssignment = m.senderRole === 'STUDENT' ? assignmentForIdentity(m.senderIdentity) : undefined;
                                    return (
                                        <div key={i} className={m.senderRole === 'FACULTY' ? 'text-right' : 'text-left'}>
                                            <span className={`inline-block px-2.5 py-1.5 rounded-md max-w-[85%] break-words ${m.senderRole === 'FACULTY' ? 'bg-primaryLighter text-primary' : 'bg-bgSecondary text-textPrimary'}`}>
                                                {m.senderRole === 'STUDENT' && senderAssignment ? `${senderAssignment.studentName || senderAssignment.studentCode}: ` : ''}{m.message}
                                            </span>
                                        </div>
                                    );
                                })}
                                {chatMessages.length === 0 && <p className="text-xs text-textSecondary text-center py-6">No messages yet.</p>}
                            </div>
                            <div className="flex items-center border-t border-borderLight shrink-0">
                                <input
                                    type="text"
                                    value={chatInput}
                                    onChange={(e) => setChatInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                    placeholder={`Message ${chatRecipient.label}...`}
                                    className="flex-1 px-3 py-2.5 text-sm outline-none bg-transparent text-textPrimary placeholder:text-textPlaceholder min-w-0"
                                />
                                <button type="button" onClick={handleSendChat} className="px-3 text-primary hover:text-primary/80 cursor-pointer shrink-0" title="Send">
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </aside>
                )}
            </div>

            <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Student" size="sm">
                <div className="space-y-4">
                    <p className="text-textPrimary">Reason for rejecting {rejectTarget?.studentName || rejectTarget?.studentCode}:</p>
                    <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        className="w-full border border-borderLight rounded-md p-2 text-sm"
                        rows={3}
                    />
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
                        <Button variant="primary" loading={isRejecting} disabled={!rejectReason.trim() || isRejecting} onClick={handleReject}>
                            {isRejecting ? '' : 'Reject'}
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal isOpen={!!removeTarget} onClose={() => setRemoveTarget(null)} title="Remove Student" size="sm">
                <div className="space-y-4">
                    <p className="text-textPrimary">Remove {removeTarget?.studentName || removeTarget?.studentCode} from the exam? Their attempt will be finalized immediately.</p>
                    <textarea
                        value={removeReason}
                        onChange={(e) => setRemoveReason(e.target.value)}
                        placeholder="Reason (required)"
                        className="w-full border border-borderLight rounded-md p-2 text-sm"
                        rows={3}
                    />
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setRemoveTarget(null)}>Cancel</Button>
                        <Button variant="primary" loading={isRemoving} disabled={isRemoving || !removeReason.trim()} onClick={handleRemove}>
                            {isRemoving ? '' : 'Remove'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProctoringDashboardPage;
