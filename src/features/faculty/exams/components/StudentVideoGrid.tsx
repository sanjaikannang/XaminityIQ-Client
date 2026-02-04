import React from 'react';
import Button from '../../../../common/ui/Button';
import { Video, Monitor, Users } from 'lucide-react';

interface StudentStream {
    uid: string;
    cameraUser?: {
        videoTrack?: any;
    };
    screenUser?: {
        videoTrack?: any;
    };
}

interface StudentVideoGridProps {
    studentStreams: StudentStream[];
}

const StudentVideoGrid: React.FC<StudentVideoGridProps> = ({ studentStreams }) => {
    return (
        <>
            <div className="h-full bg-whiteColor rounded-xl border border-borderDefault p-4 overflow-y-auto">
                <div className="grid grid-cols-3 gap-4">
                    {studentStreams.map((stream) => (
                        <div key={stream.uid} className="space-y-2 border border-borderLight rounded-xl p-3 bg-bgPrimary">
                            <div className="flex items-center justify-center border-b border-borderDefault pb-2">
                                <h4 className="font-semibold text-sm text-textPrimary">Student - {stream.uid}</h4>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                {/* Camera Feed */}
                                <div className="aspect-video bg-bgSecondary rounded-lg border border-borderDefault relative overflow-hidden">
                                    <div id={`student-camera-${stream.uid}`} className="w-full h-full rounded-lg overflow-hidden" />
                                    <div className="absolute bottom-2 left-2 rounded text-xs flex items-center gap-1">
                                        <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded ${stream.cameraUser?.videoTrack ? 'bg-success/20 text-success' : 'bg-bgTertiary text-textSecondary'}`}>
                                            <Video className="w-3 h-3" />
                                            {stream.cameraUser?.videoTrack ? 'On' : 'Off'}
                                        </span>
                                    </div>
                                </div>

                                {/* Screen Share Feed */}
                                <div className="aspect-video bg-bgSecondary rounded-lg border border-borderDefault relative overflow-hidden">
                                    <div id={`student-screen-${stream.uid}`} className="w-full h-full rounded-lg overflow-hidden" />
                                    <div className="absolute bottom-2 left-2 rounded text-xs flex items-center gap-1">
                                        <span className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded ${stream.screenUser?.videoTrack ? 'bg-success/20 text-success' : 'bg-bgTertiary text-textSecondary'}`}>
                                            <Monitor className="w-3 h-3" />
                                            {stream.screenUser?.videoTrack ? 'On' : 'Off'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className='grid grid-cols-3 gap-2 pt-2'>
                                <Button
                                    variant="primary"
                                    size="sm"
                                >
                                    Talk
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                >
                                    Chat
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    ))}

                    {studentStreams.length === 0 && (
                        <div className="col-span-3 flex items-center justify-center py-20">
                            <div className="text-center">
                                <Users className="w-16 h-16 mx-auto text-borderDefault mb-4" />
                                <p className="text-textSecondary text-lg">No students connected yet</p>
                                <p className="text-textTertiary text-sm mt-2">Waiting for students to join the exam...</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentVideoGrid;