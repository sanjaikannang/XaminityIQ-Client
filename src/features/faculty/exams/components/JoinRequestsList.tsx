import React from 'react';
import { User, Users } from 'lucide-react';
import Button from '../../../../common/ui/Button';

interface JoinRequest {
    requestId: string;
    studentName: string;
    studentRollNumber: string;
}

interface JoinRequestsListProps {
    requests: JoinRequest[];
    onApprove: (requestId: string) => void;
    onReject: (requestId: string) => void;
}

const JoinRequestsList: React.FC<JoinRequestsListProps> = ({
    requests,
    onApprove,
    onReject,
}) => {
    return (
        <>
            <div className="space-y-3">
                {requests.map((req) => (
                    <div
                        key={req.requestId}
                        className="border border-borderLight rounded-xl p-3 bg-bgPrimary hover:bg-bgSecondary transition-colors"
                    >
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-primaryLighter">
                                <User className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-sm text-textPrimary">
                                    {req.studentName}
                                </p>
                                <p className="text-xs text-textSecondary">
                                    Roll No: {req.studentRollNumber}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                            <Button
                                variant="primary"
                                size="sm"
                                className="flex-1"
                                onClick={() => onApprove(req.requestId)}
                            >
                                Approve
                            </Button>

                            <Button
                                variant="danger"
                                size="sm"
                                className="flex-1"
                                onClick={() => onReject(req.requestId)}
                            >
                                Reject
                            </Button>
                        </div>
                    </div>
                ))}
                {requests.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 mx-auto text-borderDefault mb-3" />
                        <p className="text-sm text-textSecondary">No pending requests</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default JoinRequestsList;