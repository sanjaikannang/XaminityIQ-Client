import React from 'react';
import Modal from '../../../../common/ui/Modal';
import Button from '../../../../common/ui/Button';
import InputField from '../../../../common/ui/Input';

interface RejectReasonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    reason: string;
    onReasonChange: (value: string) => void;
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    reason,
    onReasonChange,
}) => {
    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose} title="Reject Join Request" size="sm">
                <div className="space-y-4">
                    <p className="text-sm text-textSecondary">
                        Please provide a reason for rejecting this request.
                    </p>

                    <InputField
                        type="text"
                        id="rejectReason"
                        name="rejectReason"
                        value={reason}
                        onChange={(e) => onReasonChange(e.target.value)}
                        placeholder="Enter rejection reason"
                    />

                    <div className="flex justify-end pt-2">                        
                        <Button
                            variant="danger"
                            onClick={onConfirm}
                            disabled={!reason.trim()}
                        >
                            Reject
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default RejectReasonModal;
