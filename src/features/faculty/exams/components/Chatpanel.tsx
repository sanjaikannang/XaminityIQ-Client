import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatPanel: React.FC = () => {
    return (
        <>
            <div className="text-center py-12">
                <MessageCircle className="w-12 h-12 mx-auto text-borderDefault mb-3" />
                <p className="text-sm text-textSecondary">Chat feature coming soon</p>
            </div>
        </>
    );
};

export default ChatPanel;