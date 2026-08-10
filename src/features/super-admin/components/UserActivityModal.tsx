import Modal from "../../../common/ui/Modal";
import { LogIn, LogOut } from "lucide-react";
import { UserActivityRecord } from "../../../types/activity-types";
import { formatDateTime } from "../../../utils/date";

interface UserActivityModalProps {
    isOpen: boolean;
    onClose: () => void;
    isLoading: boolean;
    records: UserActivityRecord[];
    title?: string;
}

function formatUserAgent(userAgent?: string) {
    if (!userAgent) return "Unknown device";
    return userAgent.length > 60 ? `${userAgent.slice(0, 60)}...` : userAgent;
}

const UserActivityModal = ({ isOpen, onClose, isLoading, records, title = "Login / Logout Activity" }: UserActivityModalProps) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="lg"
        >
            <div className="max-h-96 overflow-y-auto space-y-3">
                {isLoading ? (
                    <div className="space-y-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-14 rounded-lg bg-borderLight animate-pulse" />
                        ))}
                    </div>
                ) : records.length === 0 ? (
                    <p className="text-sm text-textSecondary text-center py-8">No activity yet.</p>
                ) : (
                    records.map((record, index) => {
                        const isLogin = record.action === 'LOGIN';
                        return (
                            <div
                                key={index}
                                className="flex items-start gap-3 p-3 border border-borderLight rounded-lg"
                            >
                                <div className={`p-2 rounded-full ${isLogin ? 'bg-green-100' : 'bg-bgSecondary'}`}>
                                    {isLogin ? (
                                        <LogIn className="h-4 w-4 text-green-600" />
                                    ) : (
                                        <LogOut className="h-4 w-4 text-textSecondary" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <span className={`text-sm font-semibold ${isLogin ? 'text-green-700' : 'text-textPrimary'}`}>
                                            {record.action}
                                        </span>
                                        <span className="text-xs text-textTertiary">{formatDateTime(record.createdAt)}</span>
                                    </div>
                                    <p className="text-xs text-textSecondary mt-1">
                                        IP: {record.ipAddress || "Unknown"}
                                    </p>
                                    <p className="text-xs text-textTertiary mt-0.5">
                                        {formatUserAgent(record.userAgent)}
                                    </p>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </Modal>
    );
};

export default UserActivityModal;
