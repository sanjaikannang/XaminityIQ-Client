import {
    useFacultyJoinExamMutation,
    useGetPendingJoinRequestsQuery,
    useApproveJoinRequestMutation,
    useRejectJoinRequestMutation,
    useEndExamMutation
} from '../../../../state/services/endpoints/exam';
import React, { useState, useEffect } from 'react';
import EndExamModal from '../components/EndExamModal';
import ExamRoomFooter from '../components/ExamRoomFooter';
import { useParams, useNavigate } from 'react-router-dom';
import ExamRoomSidebar from '../components/ExamRoomSidebar';
import StudentVideoGrid from '../components/StudentVideoGrid';
import { useFacultyExamRoom } from '../hooks/useFacultyExamRoom';
import RejectReasonModal from '../components/RejectReasonModal';

const FacultyExamRoomPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();

    // Sidebar state
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [sidebarContent, setSidebarContent] = useState<'requests' | 'chat'>('requests');

    // Audio state
    const [isAudioOn, setIsAudioOn] = useState(false);

    // End exam modal state
    const [isEndExamModalOpen, setIsEndExamModalOpen] = useState(false);
    const [endExamInput, setEndExamInput] = useState('');

    // API hooks
    const [facultyJoin] = useFacultyJoinExamMutation();
    const { data: joinRequests } = useGetPendingJoinRequestsQuery(examId!, {
        pollingInterval: 3000,
    });
    const [approveRequest] = useApproveJoinRequestMutation();
    const [rejectRequest] = useRejectJoinRequestMutation();
    const [endExam] = useEndExamMutation();

    // Room state
    const [tokens, setTokens] = useState<any>(null);
    const { studentStreams, talkToAll, stopTalking } = useFacultyExamRoom({
        tokens,
        examId: examId!,
    });

    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

    // open modal instead of direct reject
    const handleRejectClick = (requestId: string) => {
        setSelectedRequestId(requestId);
        setRejectReason('');
        setIsRejectModalOpen(true);
    };

    const handleRejectConfirm = async () => {
        if (!selectedRequestId) return;
        try {
            await rejectRequest({
                examId: examId!,
                requestId: selectedRequestId,
                reason: rejectReason,
            }).unwrap();
            setIsRejectModalOpen(false);
            setSelectedRequestId(null);
            setRejectReason('');
        } catch (error) {
            console.error('Reject failed:', error);
        }
    };

    // Join exam room on mount
    useEffect(() => {
        const join = async () => {
            try {
                const result = await facultyJoin({ examId: examId! }).unwrap();
                setTokens(result.data);
            } catch (error) {
                console.error('Failed to join:', error);
            }
        };
        join();
    }, [examId, facultyJoin]);

    // Handlers
    const handleApprove = async (requestId: string) => {
        try {
            await approveRequest({ examId: examId!, requestId }).unwrap();
        } catch (error) {
            console.error('Approve failed:', error);
        }
    };

    const toggleSidebar = (content: 'requests' | 'chat') => {
        if (sidebarOpen && sidebarContent === content) {
            setSidebarOpen(false);
        } else {
            setSidebarContent(content);
            setSidebarOpen(true);
        }
    };

    const toggleAudio = () => {
        if (isAudioOn) {
            stopTalking();
            setIsAudioOn(false);
        } else {
            talkToAll();
            setIsAudioOn(true);
        }
    };

    const handleEndExamClick = () => {
        setIsEndExamModalOpen(true);
        setEndExamInput('');
    };

    const handleEndExamConfirm = async () => {
        if (endExamInput === 'END') {
            try {
                await endExam(examId!).unwrap();
                setIsEndExamModalOpen(false);
                setEndExamInput('');
                // Navigate to faculty exams page
                navigate('/faculty/exams');
            } catch (error) {
                console.error('Failed to end exam:', error);
            }
        }
    };

    const pendingCount = joinRequests?.data?.length || 0;

    return (
        <>
            <div className="h-screen flex flex-col bg-bgSecondary">
                <div className="flex-1 flex overflow-hidden p-2 gap-2">
                    {/* Video Grid Area */}
                    <div className="flex-1">
                        <StudentVideoGrid studentStreams={studentStreams} />
                    </div>

                    {/* Right Sidebar */}
                    <ExamRoomSidebar
                        isOpen={sidebarOpen}
                        content={sidebarContent}
                        onClose={() => setSidebarOpen(false)}
                        joinRequests={joinRequests?.data || []}
                        onApproveRequest={handleApprove}
                        onRejectRequest={handleRejectClick}
                    />
                </div>

                {/* Footer Control Bar */}
                <ExamRoomFooter
                    isAudioOn={isAudioOn}
                    onToggleAudio={toggleAudio}
                    onEndExamClick={handleEndExamClick}
                    onToggleSidebar={toggleSidebar}
                    sidebarOpen={sidebarOpen}
                    sidebarContent={sidebarContent}
                    pendingRequestsCount={pendingCount}
                />

                <RejectReasonModal
                    isOpen={isRejectModalOpen}
                    onClose={() => setIsRejectModalOpen(false)}
                    onConfirm={handleRejectConfirm}
                    reason={rejectReason}
                    onReasonChange={setRejectReason}
                />

                {/* End Exam Modal */}
                <EndExamModal
                    isOpen={isEndExamModalOpen}
                    onClose={() => setIsEndExamModalOpen(false)}
                    onConfirm={handleEndExamConfirm}
                    inputValue={endExamInput}
                    onInputChange={setEndExamInput}
                />
            </div>
        </>
    );
};

export default FacultyExamRoomPage;