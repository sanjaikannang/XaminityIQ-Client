import Button from '../../../../common/ui/Button';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container } from '../../../../common/ui/Container';
import { useEnvironmentCheck } from '../hooks/useEnvironmentCheck.ts';
import { Camera, Mic, Monitor, Maximize, CheckCircle, XCircle } from 'lucide-react';
import { useStudentJoinRequestMutation } from '../../../../state/services/endpoints/exam';

const StudentEnvironmentCheckPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const navigate = useNavigate();

    const {
        testCamera,
        testMicrophone,
        testScreenShare,
        checkFullscreen,
        enableFullscreen,
        cleanup,
    } = useEnvironmentCheck();

    const [deviceStatus, setDeviceStatus] = useState({
        camera: false,
        microphone: false,
        screenShare: false,
        fullscreen: false,
    });

    const [joinRequest] = useStudentJoinRequestMutation();

    useEffect(() => {
        return () => cleanup();
    }, []);

    const handleTestCamera = async () => {
        const result = await testCamera();
        setDeviceStatus(prev => ({ ...prev, camera: result }));
    };

    const handleTestMicrophone = async () => {
        const result = await testMicrophone();
        setDeviceStatus(prev => ({ ...prev, microphone: result }));
    };

    const handleTestScreenShare = async () => {
        const result = await testScreenShare();
        setDeviceStatus(prev => ({ ...prev, screenShare: result }));
    };

    const handleEnableFullscreen = async () => {
        await enableFullscreen();
        const result = checkFullscreen();
        setDeviceStatus(prev => ({ ...prev, fullscreen: result }));
    };

    const handleJoinExam = async () => {
        try {
            const result = await joinRequest({
                examId: examId!,
                // deviceStatus,
            }).unwrap();

            navigate(`/student/exams/${examId}/waiting`, {
                state: { requestId: result.data?.requestId }
            });
        } catch (error) {
            console.error('Join request failed:', error);
        }
    };

    const allTestsPassed = Object.values(deviceStatus).every(status => status);

    return (
        <>
            <Container>
                <div>
                    <div className="bg-whiteColor rounded-xl border border-borderDefault p-4 mb-6 mt-6">
                        <h2 className="text-xl font-bold text-textPrimary mb-4">
                            Test Your Devices
                        </h2>
                        <p className="text-textSecondary mb-6">
                            Please test all devices before joining the exam. All tests must pass to continue.
                        </p>

                        {/* Camera Test */}
                        <div className="border border-borderDefault rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Camera className="w-6 h-6 text-primary" />
                                    <div>
                                        <h3 className="font-semibold">Camera</h3>
                                        <p className="text-sm text-textSecondary">Test your webcam</p>
                                    </div>
                                </div>
                                <div>
                                    {deviceStatus.camera ? (
                                        <CheckCircle className="w-6 h-6 text-success" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-borderDark" />
                                    )}
                                </div>
                            </div>
                            <div id="camera-preview-div" className="w-full h-48 bg-bgSecondary rounded-xl mb-3" />
                            <Button onClick={handleTestCamera} size="sm" variant="primary">
                                Test Camera
                            </Button>
                        </div>

                        {/* Microphone Test */}
                        <div className="border border-borderDefault rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Mic className="w-6 h-6 text-primary" />
                                    <div>
                                        <h3 className="font-semibold">Microphone</h3>
                                        <p className="text-sm text-textSecondary">Test your microphone</p>
                                    </div>
                                </div>
                                <div>
                                    {deviceStatus.microphone ? (
                                        <CheckCircle className="w-6 h-6 text-success" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-borderDark" />
                                    )}
                                </div>
                            </div>
                            <Button onClick={handleTestMicrophone} size="sm" variant="primary">
                                Test Microphone
                            </Button>
                        </div>

                        {/* Screen Share Test */}
                        <div className="border border-borderDefault rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Monitor className="w-6 h-6 text-primary" />
                                    <div>
                                        <h3 className="font-semibold">Screen Share</h3>
                                        <p className="text-sm text-textSecondary">Test screen sharing</p>
                                    </div>
                                </div>
                                <div>
                                    {deviceStatus.screenShare ? (
                                        <CheckCircle className="w-6 h-6 text-success" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-borderDark" />
                                    )}
                                </div>
                            </div>
                            <div id="screen-preview-div" className="w-full h-48 bg-bgSecondary rounded-xl mb-3" />
                            <Button onClick={handleTestScreenShare} size="sm" variant="primary">
                                Test Screen Share
                            </Button>
                        </div>

                        {/* Fullscreen Test */}
                        <div className="border border-borderDefault rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <Maximize className="w-6 h-6 text-primary" />
                                    <div>
                                        <h3 className="font-semibold">Fullscreen</h3>
                                        <p className="text-sm text-textSecondary">Enable fullscreen mode</p>
                                    </div>
                                </div>
                                <div>
                                    {deviceStatus.fullscreen ? (
                                        <CheckCircle className="w-6 h-6 text-success" />
                                    ) : (
                                        <XCircle className="w-6 h-6 text-borderDark" />
                                    )}
                                </div>
                            </div>
                            <Button onClick={handleEnableFullscreen} size="sm" variant="primary">
                                Enable Fullscreen
                            </Button>
                        </div>

                        {/* Join Button */}
                        <div className="mt-6">
                            <Button
                                variant="primary"
                                fullWidth
                                disabled={!allTestsPassed}
                                onClick={handleJoinExam}
                            >
                                {allTestsPassed ? 'Request to Join Exam' : 'Complete All Tests First'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default StudentEnvironmentCheckPage;