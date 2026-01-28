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
    useEndExamMutation
} from '../../../../state/services/endpoints/exam';
import { useFacultyExamRoom } from '../hooks/useFacultyExamRoom';
import { Mic, MicOff, LogOut, Video, Monitor } from 'lucide-react';

const FacultyExamRoomPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const facultyId = '6953d4593c9ee327e1b69fc9'; // Get from auth

    const [activeTab, setActiveTab] = useState<'requests' | 'chat'>('requests');
    const [facultyJoin] = useFacultyJoinExamMutation();
    const { data: joinRequests } = useGetPendingJoinRequestsQuery(examId!, {
        pollingInterval: 3000,
    });
    const [approveRequest] = useApproveJoinRequestMutation();
    const [rejectRequest] = useRejectJoinRequestMutation();
    const [endExam] = useEndExamMutation();

    const [tokens, setTokens] = useState<any>(null);
    const { studentStreams, talkToAll, stopTalking } = useFacultyExamRoom({
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

    console.log('Student Streams:', studentStreams);

    return (
        <>
            <PageHeader>Exam Monitoring</PageHeader>
            <Container>
                <div className="flex gap-4 h-screen mb-4">
                    {/* Main Video Grid */}
                    <div className="flex-1 bg-whiteColor rounded-xl border border-borderDefault p-4 overflow-y-auto">
                        <div className="grid grid-cols-2 gap-4">
                            {studentStreams.map((stream) => (
                                <div key={stream.uid} className="space-y-2 border border-borderLight rounded-xl p-2">
                                    <div className="flex items-center justify-center border-b border-borderDefault">
                                        <h4 className="font-semibold text-sm mb-2">Student {stream.uid}</h4>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Camera Feed */}
                                        <div className="aspect-video bg-bgSecondary rounded border border-borderDefault relative">
                                            <div id={`student-camera-${stream.uid}`} className="w-full h-full rounded overflow-hidden" />
                                            <div className="absolute bottom-1 left-1 rounded text-xs flex items-center gap-1">
                                                <span className={`flex items-center gap-1 text-[10px] px-1 py-0.5 rounded-[2px] ${stream.cameraUser?.videoTrack ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Video className="w-3 h-3" />
                                                    {stream.cameraUser?.videoTrack ? 'On' : 'Off'}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Screen Share Feed */}
                                        <div className="aspect-video bg-bgSecondary rounded border border-borderDefault relative">
                                            <div id={`student-screen-${stream.uid}`} className="w-full h-full rounded overflow-hidden" />
                                            <div className="absolute bottom-1 left-1 rounded text-xs flex items-center gap-1">
                                                <span className={`flex items-center gap-1 text-[10px] px-1 py-0.5 rounded-[2px] ${stream.screenUser?.videoTrack ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                                                    <Monitor className="w-3 h-3" />
                                                    {stream.screenUser?.videoTrack ? 'On' : 'Off'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='grid grid-cols-3 gap-2'>
                                        <Button
                                            variant="primary"
                                        >
                                            Talk
                                        </Button>
                                        <Button
                                            variant="primary"
                                        >
                                            Chat
                                        </Button>
                                        <Button
                                            variant="primary"
                                        >
                                            Remove
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            {studentStreams.length === 0 && (
                                <div className="col-span-2 text-center py-12 text-textSecondary">
                                    No students connected yet
                                </div>
                            )}
                        </div>

                        {/* Faculty Controls */}
                        <div className="mt-4 flex gap-2 border-t border-borderDefault pt-4">
                            <Button variant="primary" onClick={talkToAll}>
                                <Mic className="w-4 h-4" />
                            </Button>
                            <Button variant="secondary" onClick={stopTalking}>
                                <MicOff className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="danger"
                                onClick={async () => {
                                    if (confirm('Are you sure you want to end the exam for all students?')) {
                                        await endExam(examId!).unwrap();
                                    }
                                }}
                            >
                                <LogOut className="w-4 h-4" />
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
                                {joinRequests?.data?.length === 0 && (
                                    <p className="text-sm text-textSecondary text-center py-4">
                                        No pending requests
                                    </p>
                                )}
                            </div>
                        ) : (
                            <div>
                                <div className="mb-4">
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