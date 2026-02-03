import {
    useFinishExamMutation
} from '../../../../state/services/endpoints/exam';
import React, { useState } from 'react';
import Button from '../../../../common/ui/Button';
import { useParams, useLocation } from 'react-router-dom';
import { Container } from '../../../../common/ui/Container';
import { useStudentExamRoom } from '../hooks/useStudentExamRoom';
import { Mic, MicOff, Video, VideoOff, LogOut } from 'lucide-react';

const StudentExamRoomPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const location = useLocation();
    const studentId = "6953d8163bfb64f64c0e7df7"; // Get from auth
    const tokens = location.state?.tokens;
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [finishExam] = useFinishExamMutation();

    const {
        toggleAudio,
        toggleVideo,
        leaveExamRoom
    } = useStudentExamRoom({ tokens, examId: examId! });

    const handleToggleAudio = async () => {
        await toggleAudio(!audioEnabled);
        setAudioEnabled(!audioEnabled);
    };

    const handleToggleVideo = async () => {
        await toggleVideo(!videoEnabled);
        setVideoEnabled(!videoEnabled);
    };

    const handleFinishExam = async () => {
        if (confirm('Are you sure you want to finish and submit your exam?')) {
            try {
                await finishExam({ examId: examId!, studentId }).unwrap();
                await leaveExamRoom();
                window.location.href = '/student/exams';
            } catch (error) {
                console.error('Finish exam failed:', error);
            }
        }
    };

    return (
        <>
            <Container>
                <div className="flex gap-4 h-screen">
                    {/* Main Area - Your Video */}
                    <div className="flex-1 bg-whiteColor rounded-xl border border-borderDefault p-2">
                        <div className="mb-4">
                            <div className="w-60 h-40 bg-bgSecondary rounded-xl border border-borderDefault relative overflow-hidden">
                                <div
                                    id="local-video-preview"
                                    className="w-full h-full"
                                />
                            </div>
                        </div>


                        {/* Controls */}
                        <div className="flex gap-2 justify-start">
                            <Button
                                variant={audioEnabled ? 'primary' : 'danger'}
                                onClick={handleToggleAudio}
                            >
                                {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                            </Button>

                            <Button
                                variant={videoEnabled ? 'primary' : 'danger'}
                                onClick={handleToggleVideo}
                            >
                                {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                            </Button>

                            <Button variant="danger" onClick={handleFinishExam}>
                                <LogOut className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Sidebar - Chat */}
                    <div className="w-80 bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <h3 className="text-lg font-semibold">Chat</h3>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default StudentExamRoomPage;