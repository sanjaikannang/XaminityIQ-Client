import React from 'react';
import Button from '../../../../common/ui/Button';
import { Mic, MicOff, LogOut, MessageCircle, Users } from 'lucide-react';

interface ExamRoomFooterProps {
    isAudioOn: boolean;
    onToggleAudio: () => void;
    onEndExamClick: () => void;
    onToggleSidebar: (content: 'requests' | 'chat') => void;
    sidebarOpen: boolean;
    sidebarContent: 'requests' | 'chat';
    pendingRequestsCount: number;
}

const ExamRoomFooter: React.FC<ExamRoomFooterProps> = ({
    isAudioOn,
    onToggleAudio,
    onEndExamClick,
    onToggleSidebar,
    sidebarOpen,
    sidebarContent,
    pendingRequestsCount,
}) => {
    return (
        <>
            <div className="h-16 bg-whiteColor border-t border-borderDefault px-6 flex items-center justify-between">
                {/* Left Side */}
                <div className="flex-1">
                    <div className="text-textPrimary font-medium">Exam Name</div>
                </div>

                {/* Center Controls */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={onToggleAudio}
                        variant='primary'
                        size='md'
                    >
                        {isAudioOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </Button>

                    <Button
                        onClick={onEndExamClick}
                        variant='danger'
                        size='md'
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>

                {/* Right Side Controls */}
                <div className="flex-1 flex items-center justify-end gap-3">
                    <Button
                        onClick={() => onToggleSidebar('chat')}
                        variant={sidebarOpen && sidebarContent === 'chat' ? 'primary' : 'outline'}
                        size='md'
                    >
                        <MessageCircle className="w-5 h-5" />
                    </Button>

                    <div className="relative">
                        <Button
                            onClick={() => onToggleSidebar('requests')}
                            variant={sidebarOpen && sidebarContent === 'requests' ? 'primary' : 'outline'}
                            size='md'
                        >
                            <Users className="w-5 h-5" />
                        </Button>
                        {pendingRequestsCount > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-danger text-whiteColor text-xs rounded-full flex items-center justify-center font-semibold">
                                {pendingRequestsCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamRoomFooter;