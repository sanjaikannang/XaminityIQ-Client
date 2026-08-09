import toast from "react-hot-toast";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Room, RoomEvent, RemoteTrack, RemoteTrackPublication, RemoteParticipant, Track } from "livekit-client";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import { ChatRecipientType, RoomAssignmentStatus } from "../../../../utils/enum";
import { encodeChatPayload, decodeChatPayload, LiveKitChatPayload } from "../../../../utils/liveKitDataMessage";
import { RoomAssignmentData } from "../../../../types/proctoring-types";
import {
    useGetExamRoomDetailQuery,
    useGetFacultyLiveKitTokenMutation,
    useAdmitStudentMutation,
    useRejectStudentMutation,
    useRemoveStudentMutation,
    useSendFacultyChatMutation,
    useGetFacultyChatHistoryQuery,
} from "../../../../state/services/endpoints/faculty-proctoring";

interface TileTracks {
    video?: RemoteTrack;
    screen?: RemoteTrack;
    hasAudio?: boolean;
}

const ProctoringDashboardPage = () => {
    const navigate = useNavigate();
    const { roomId } = useParams<{ roomId: string }>();
    const { data: roomDetail } = useGetExamRoomDetailQuery(roomId as string, { skip: !roomId, pollingInterval: 3000 });
    const [getLiveKitToken] = useGetFacultyLiveKitTokenMutation();
    const [admitStudent, { isLoading: isAdmitting }] = useAdmitStudentMutation();
    const [rejectStudent, { isLoading: isRejecting }] = useRejectStudentMutation();
    const [removeStudent, { isLoading: isRemoving }] = useRemoveStudentMutation();
    const [sendFacultyChat] = useSendFacultyChatMutation();

    const [liveKitStatus, setLiveKitStatus] = useState<'CONNECTING' | 'CONNECTED' | 'FAILED'>('CONNECTING');
    const [tiles, setTiles] = useState<Record<string, TileTracks>>({});
    const roomRef = useRef<Room | null>(null);
    const myIdentityRef = useRef<string | null>(null);
    const trackMapRef = useRef<Record<string, TileTracks>>({});
    const videoElsRef = useRef<Record<string, HTMLVideoElement | null>>({});

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

    const assignments = useMemo(() => roomDetail?.data?.assignments || [], [roomDetail]);
    const waiting = assignments.filter((a) => a.status === RoomAssignmentStatus.WAITING);
    const active = assignments.filter((a) => a.status === RoomAssignmentStatus.ADMITTED || a.status === RoomAssignmentStatus.IN_PROGRESS);

    const identityForStudent = (studentId: string) => `student-${studentId}`;
    const assignmentForIdentity = (identity: string) => assignments.find((a) => identityForStudent(a.studentId) === identity);

    const videoRefFor = (identity: string) => (node: HTMLVideoElement | null) => {
        videoElsRef.current[identity] = node;
        if (node && trackMapRef.current[identity]?.video) {
            trackMapRef.current[identity].video!.attach(node);
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
                    if (publication.source === Track.Source.Microphone) entry.hasAudio = true;
                    trackMapRef.current[participant.identity] = entry;
                    setTiles({ ...trackMapRef.current });

                    const el = videoElsRef.current[participant.identity];
                    if (el && publication.source === Track.Source.Camera) track.attach(el);
                });

                room.on(RoomEvent.TrackUnsubscribed, (_track, publication, participant) => {
                    const entry = trackMapRef.current[participant.identity];
                    if (!entry) return;
                    if (publication.source === Track.Source.Camera) delete entry.video;
                    if (publication.source === Track.Source.ScreenShare) delete entry.screen;
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
        if (!roomId || !removeTarget) return;
        try {
            await removeStudent({ roomId, assignmentId: removeTarget.assignmentId, data: { reason: removeReason.trim() || undefined } }).unwrap();
            toast.success('Student removed');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to remove student');
        } finally {
            setRemoveTarget(null);
            setRemoveReason('');
        }
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
            <header className="h-16 bg-whiteColor border-b border-borderLight flex items-center justify-between px-6 shadow-sm flex-shrink-0">
                <div className="flex items-center gap-3">
                    <h1 className="font-semibold text-textPrimary">{room.exams.map((e) => e.examName).join(', ')}</h1>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${liveKitStatus === 'CONNECTED' ? 'bg-green-100 text-green-700' : liveKitStatus === 'FAILED' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {liveKitStatus === 'CONNECTED' ? 'Live' : liveKitStatus === 'FAILED' ? 'Offline' : 'Connecting...'}
                    </span>
                </div>
                <Button variant="outline" size="sm" onClick={() => navigate('/faculty/proctoring')}>Back</Button>
            </header>

            <div className="flex-1 flex overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4">
                    <p className="text-sm font-semibold text-textPrimary mb-2">Admitted Students ({active.length})</p>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                        {active.map((a) => {
                            const identity = identityForStudent(a.studentId);
                            const tile = tiles[identity];
                            return (
                                <div key={a.assignmentId} className="rounded-lg border border-borderLight bg-whiteColor overflow-hidden">
                                    <div className="relative bg-black aspect-video">
                                        <video ref={videoRefFor(identity)} autoPlay playsInline className="w-full h-full object-cover" />
                                        {!tile?.video && (
                                            <div className="absolute inset-0 flex items-center justify-center text-whiteColor text-xs">No video</div>
                                        )}
                                    </div>
                                    <div className="px-2 py-1.5">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5 text-xs text-textPrimary min-w-0">
                                                <span className="flex-shrink-0">{a.studentCode}</span>
                                                {tile?.hasAudio && <span title="Mic active">🎤</span>}
                                                {tile?.screen && <span title="Screen sharing">🖥️</span>}
                                            </div>
                                            <button
                                                type="button"
                                                className="text-xs font-medium text-red-600 flex-shrink-0"
                                                onClick={() => setRemoveTarget(a)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                        {room.exams.length > 1 && (
                                            <p className="text-[10px] text-textSecondary truncate mt-0.5" title={a.examName}>
                                                {a.examName}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {active.length === 0 && (
                            <p className="text-sm text-textSecondary col-span-full py-6 text-center">No students admitted yet.</p>
                        )}
                    </div>
                </main>

                <aside className="w-96 bg-whiteColor border-l border-borderLight flex flex-col flex-shrink-0">
                    <div className="p-4 border-b border-borderLight overflow-y-auto max-h-64">
                        <p className="text-sm font-semibold text-textPrimary mb-2">Waiting Queue ({waiting.length})</p>
                        <div className="space-y-2">
                            {waiting.map((a) => (
                                <div key={a.assignmentId} className="rounded-md border border-borderLight px-3 py-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-textPrimary">{a.studentCode}</span>
                                        <div className="flex gap-2 flex-shrink-0">
                                            <Button variant="primary" size="sm" loading={isAdmitting} onClick={() => handleAdmit(a)}>Admit</Button>
                                            <Button variant="outline" size="sm" onClick={() => setRejectTarget(a)}>Reject</Button>
                                        </div>
                                    </div>
                                    {room.exams.length > 1 && (
                                        <p className="text-[10px] text-textSecondary truncate mt-0.5" title={a.examName}>
                                            {a.examName}
                                        </p>
                                    )}
                                </div>
                            ))}
                            {waiting.length === 0 && <p className="text-xs text-textSecondary">No students waiting.</p>}
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col overflow-hidden">
                        <div className="p-3 border-b border-borderLight">
                            <p className="text-sm font-semibold text-textPrimary mb-2">Chat</p>
                            <select
                                className="w-full text-sm border border-borderLight rounded-md px-2 py-1"
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
                                                label: a.studentCode,
                                            });
                                        }
                                    }
                                }}
                            >
                                <option value="ALL">All Students (Broadcast)</option>
                                {active.map((a) => (
                                    <option key={a.studentId} value={a.studentId}>{a.studentCode}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 text-sm">
                            {chatMessages.map((m, i) => {
                                const senderAssignment = m.senderRole === 'STUDENT' ? assignmentForIdentity(m.senderIdentity) : undefined;
                                return (
                                    <div key={i} className={m.senderRole === 'FACULTY' ? 'text-right' : 'text-left'}>
                                        <span className={`inline-block px-2 py-1 rounded-md ${m.senderRole === 'FACULTY' ? 'bg-primaryLighter text-primary' : 'bg-bgSecondary text-textPrimary'}`}>
                                            {m.senderRole === 'STUDENT' && senderAssignment ? `${senderAssignment.studentCode}: ` : ''}{m.message}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex border-t border-borderLight">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                                placeholder={`Message ${chatRecipient.label}...`}
                                className="flex-1 px-3 py-2 text-sm outline-none"
                            />
                            <button type="button" onClick={handleSendChat} className="px-4 text-sm font-medium text-primary">Send</button>
                        </div>
                    </div>
                </aside>
            </div>

            <Modal isOpen={!!rejectTarget} onClose={() => setRejectTarget(null)} title="Reject Student" size="sm">
                <div className="space-y-4">
                    <p className="text-textPrimary">Reason for rejecting {rejectTarget?.studentCode}:</p>
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
                    <p className="text-textPrimary">Remove {removeTarget?.studentCode} from the exam? Their attempt will be finalized immediately.</p>
                    <textarea
                        value={removeReason}
                        onChange={(e) => setRemoveReason(e.target.value)}
                        placeholder="Reason (optional)"
                        className="w-full border border-borderLight rounded-md p-2 text-sm"
                        rows={3}
                    />
                    <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setRemoveTarget(null)}>Cancel</Button>
                        <Button variant="primary" loading={isRemoving} disabled={isRemoving} onClick={handleRemove}>
                            {isRemoving ? '' : 'Remove'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ProctoringDashboardPage;
