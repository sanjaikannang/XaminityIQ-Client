import {
    useFinishExamMutation
} from '../../../../state/services/endpoints/exam';
import React, { useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container } from '../../../../common/ui/Container';
import { PageHeader } from '../../../../common/ui/PageHeader';
import Button from '../../../../common/ui/Button';
import { useStudentExamRoom } from '../hooks/useStudentExamRoom';
import { Mic, MicOff, Video, VideoOff, MessageSquare, LogOut } from 'lucide-react';
import { useEnvironmentCheck } from '../hooks/useEnvironmentCheck.ts';

const StudentExamRoomPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const location = useLocation();
    const studentId = "6953d8163bfb64f64c0e7df7"; // Get from auth
    const tokens = location.state?.tokens;
    const [audioEnabled, setAudioEnabled] = useState(true);
    const [videoEnabled, setVideoEnabled] = useState(true);
    const [finishExam] = useFinishExamMutation();
    const {
        testScreenShare
    } = useEnvironmentCheck();

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

    const handleTestScreenShare = async () => {
        const result = await testScreenShare();
        console.log('Screen share test result:', result);
    };

    return (
        <>
            <PageHeader>Exam Room</PageHeader>
            <Container>
                <div className="flex gap-4 h-[calc(100vh-200px)]">
                    {/* Main Area - Your Video */}
                    <div className="flex-1 bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-textPrimary mb-2">Your Video</h3>
                            <div className="aspect-video bg-bgSecondary rounded-xl border border-borderDefault relative">
                                <div id="local-video-preview" className="w-full h-full" />
                                <div className="absolute bottom-4 left-4 bg-blackColor/70 text-whiteColor px-3 py-2 rounded-xl text-sm">
                                    You
                                </div>
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex gap-2 justify-center">
                            <Button
                                variant={audioEnabled ? 'primary' : 'danger'}
                                onClick={handleToggleAudio}
                            >
                                {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                                {audioEnabled ? 'Mute' : 'Unmute'}
                            </Button>

                            <Button
                                variant={videoEnabled ? 'primary' : 'danger'}
                                onClick={handleToggleVideo}
                            >
                                {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                                {videoEnabled ? 'Stop Video' : 'Start Video'}
                            </Button>

                            <Button variant="danger" onClick={handleFinishExam}>
                                <LogOut className="w-4 h-4" /> Finish Exam
                            </Button>

                            <Button onClick={handleTestScreenShare} size="sm" variant="primary">
                                Test Screen Share
                            </Button>
                        </div>

                        {/* Instructions */}
                        <div className="mt-6 bg-primaryLighter rounded-xl p-4 border border-primary/20">
                            <h4 className="font-semibold text-primary mb-2">Instructions:</h4>
                            <ul className="text-sm text-textSecondary space-y-1">
                                <li>• Keep your camera and microphone on at all times</li>
                                <li>• Keep your screen sharing active</li>
                                <li>• Do not leave fullscreen mode</li>
                                <li>• Click "Finish Exam" when you are done</li>
                            </ul>
                        </div>
                    </div>

                    {/* Sidebar - Chat */}
                    <div className="w-80 bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="flex items-center gap-2 mb-4">
                            <MessageSquare className="w-5 h-5 text-primary" />
                            <h3 className="text-lg font-semibold">Chat with Faculty</h3>
                        </div>

                        {/* Message Input */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Type message..."
                                className="flex-1 px-3 py-2 border border-borderDefault rounded-xl text-sm"
                            />
                            <Button size="sm">Send</Button>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default StudentExamRoomPage;