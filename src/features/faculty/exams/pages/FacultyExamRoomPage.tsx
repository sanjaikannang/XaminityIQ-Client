import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container } from '../../../../common/ui/Container';
import { PageHeader } from '../../../../common/ui/PageHeader';
import Button from '../../../../common/ui/Button';
import {
    useFacultyJoinExamMutation,
    useGetPendingJoinRequestsQuery,
    useApproveJoinRequestMutation,
    useRejectJoinRequestMutation,
    useSendMessageMutation,
    // useRemoveStudentMutation,
    useEndExamMutation
} from '../../../../state/services/endpoints/exam';
import { useFacultyExamRoom } from '../hooks/useFacultyExamRoom';
import { Mic, MicOff, LogOut } from 'lucide-react';
import { MessageType } from '../../../../utils/enum';

const FacultyExamRoomPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const facultyId = '6953d4593c9ee327e1b69fc9'; // Get from auth

    const [activeTab, setActiveTab] = useState<'requests' | 'chat'>('requests');
    const [message, setMessage] = useState('');
    const [broadcastMode, setBroadcastMode] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

    const [facultyJoin] = useFacultyJoinExamMutation();
    const { data: joinRequests } = useGetPendingJoinRequestsQuery(examId!, {
        pollingInterval: 3000,
    });
    const [approveRequest] = useApproveJoinRequestMutation();
    const [rejectRequest] = useRejectJoinRequestMutation();
    const [sendMsg] = useSendMessageMutation();
    // const [removeStudent] = useRemoveStudentMutation();
    const [endExam] = useEndExamMutation();

    const [tokens, setTokens] = useState<any>(null);
    const { remoteUsers, talkToAll, stopTalking, listenToStudent } = useFacultyExamRoom({
        tokens,
        examId: examId!,
    });

    useEffect(() => {
        const join = async () => {
            try {
                const result = await facultyJoin({ examId: examId!, facultyId }).unwrap();
                setTokens(result.data);
            } catch (error) {
                console.error('Failed to join:', error);
            }
        };
        join();
    }, []);

    const handleApprove = async (requestId: string) => {
        try {
            await approveRequest({ examId: examId!, requestId }).unwrap();
        } catch (error) {
            console.error('Approve failed:', error);
        }
    };

    const handleReject = async (requestId: string) => {
        try {
            await rejectRequest({ examId: examId!, requestId, reason: 'Denied by faculty' }).unwrap();
        } catch (error) {
            console.error('Reject failed:', error);
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        try {
            await sendMsg({
                examId: examId!,
                senderId: facultyId,
                message,
                type: broadcastMode ? MessageType.BROADCAST : MessageType.DIRECT,
                recipientId: selectedStudent || undefined,
            }).unwrap();
            setMessage('');
        } catch (error) {
            console.error('Send message failed:', error);
        }
    };

    return (
        <>
            <PageHeader>Exam Monitoring</PageHeader>
            <Container>
                <div className="flex gap-4 h-[calc(100vh-200px)]">
                    {/* Main Video Grid */}
                    <div className="flex-1 bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="grid grid-cols-4 gap-4">
                            {remoteUsers.map((user: any) => (
                                <div
                                    key={user.uid}
                                    className="aspect-video bg-bgSecondary rounded-xl border border-borderDefault relative"
                                >
                                    <div id={`student-video-${user.uid}`} className="w-full h-full" />
                                    <div className="absolute bottom-2 left-2 bg-blackColor/70 text-whiteColor px-2 py-1 rounded text-xs">
                                        Student {user.uid}
                                    </div>
                                    <div className="absolute top-2 right-2 flex gap-1">
                                        <button
                                            onClick={() => listenToStudent(user.uid)}
                                            className="bg-primary text-whiteColor p-1 rounded"
                                        >
                                            <Mic className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Faculty Controls */}
                        <div className="mt-4 flex gap-2">
                            <Button variant="primary" onClick={talkToAll}>
                                <Mic className="w-4 h-4" /> Talk to All
                            </Button>
                            <Button variant="secondary" onClick={stopTalking}>
                                <MicOff className="w-4 h-4" /> Stop Talking
                            </Button>
                            <Button
                                variant="danger"
                                onClick={async () => {
                                    await endExam(examId!).unwrap();
                                }}
                            >
                                <LogOut className="w-4 h-4" /> End Exam
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="w-80 bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="flex gap-2 mb-4">
                            <Button
                                variant={activeTab === 'requests' ? 'primary' : 'outline'}
                                size="sm"
                                fullWidth
                                onClick={() => setActiveTab('requests')}
                            >
                                Join Requests ({joinRequests?.data?.length || 0})
                            </Button>
                            <Button
                                variant={activeTab === 'chat' ? 'primary' : 'outline'}
                                size="sm"
                                fullWidth
                                onClick={() => setActiveTab('chat')}
                            >
                                Chat
                            </Button>
                        </div>

                        {activeTab === 'requests' ? (
                            <div className="space-y-2">
                                {joinRequests?.data?.map((req) => (
                                    <div
                                        key={req.requestId}
                                        className="border border-borderDefault rounded-xl p-3"
                                    >
                                        <p className="font-semibold text-sm">{req.studentName}</p>
                                        <div className="flex gap-2 mt-2">
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => handleApprove(req.requestId)}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => handleReject(req.requestId)}
                                            >
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div>
                                <div className="mb-4">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={broadcastMode}
                                            onChange={(e) => setBroadcastMode(e.target.checked)}
                                        />
                                        <span className="text-sm">Broadcast to all</span>
                                    </label>
                                </div>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type message..."
                                        className="flex-1 px-3 py-2 border border-borderDefault rounded-xl"
                                    />
                                    <Button onClick={handleSendMessage}>Send</Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Container>
        </>
    );
};

export default FacultyExamRoomPage;