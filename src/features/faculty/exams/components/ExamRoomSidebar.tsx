import React from 'react';
import { X } from 'lucide-react';
import ChatPanel from './Chatpanel';
import JoinRequestsList from './JoinRequestsList';

interface JoinRequest {
    requestId: string;
    studentName: string;
    studentRollNumber: string;
}

interface ExamRoomSidebarProps {
    isOpen: boolean;
    content: 'requests' | 'chat';
    onClose: () => void;
    joinRequests: JoinRequest[];
    onApproveRequest: (requestId: string) => void;
    onRejectRequest: (requestId: string) => void;
}

const ExamRoomSidebar: React.FC<ExamRoomSidebarProps> = ({
    isOpen,
    content,
    onClose,
    joinRequests,
    onApproveRequest,
    onRejectRequest,
}) => {
    return (
        <>
            <div className={`transition-all duration-300 ${isOpen ? 'w-80' : 'w-0'} overflow-hidden`}>
                <div className="w-80 h-full bg-whiteColor rounded-xl border border-borderDefault flex flex-col">
                    {/* Sidebar Header */}
                    <div className="flex items-center justify-between p-4 border-b border-borderDefault">
                        <h3 className="font-semibold text-textPrimary">
                            {content === 'requests' ? 'Join Requests' : 'Chat'}
                        </h3>
                        <button
                            onClick={onClose}
                            className="p-1 hover:bg-bgSecondary rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5 text-textSecondary" />
                        </button>
                    </div>

                    {/* Sidebar Content */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {content === 'requests' ? (
                            <JoinRequestsList
                                requests={joinRequests}
                                onApprove={onApproveRequest}
                                onReject={onRejectRequest}
                            />
                        ) : (
                            <ChatPanel />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamRoomSidebar;