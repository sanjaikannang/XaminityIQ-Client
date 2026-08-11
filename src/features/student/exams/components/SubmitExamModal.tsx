import { CheckCircle2, Circle } from "lucide-react";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";

interface SubmitExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    answeredCount: number;
    totalCount: number;
    isSubmitting: boolean;
    onConfirm: () => void;
}

const SubmitExamModal = ({ isOpen, onClose, answeredCount, totalCount, isSubmitting, onConfirm }: SubmitExamModalProps) => {
    const unanswered = totalCount - answeredCount;
    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Submit Exam" size="sm">
            <div className="space-y-4">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-sm text-green-700">
                        <CheckCircle2 className="w-4 h-4" /> {answeredCount} answered
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-textSecondary">
                        <Circle className="w-4 h-4" /> {unanswered} unanswered
                    </div>
                </div>
                <p className="text-textPrimary">
                    {unanswered > 0
                        ? `You still have ${unanswered} unanswered question${unanswered !== 1 ? "s" : ""}. Once submitted, you won't be able to make further changes.`
                        : "All questions answered. Once submitted, you won't be able to make further changes."}
                </p>
                <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={onClose}>Keep Working</Button>
                    <Button variant="primary" loading={isSubmitting} disabled={isSubmitting} onClick={onConfirm}>
                        {isSubmitting ? '' : 'Submit Exam'}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default SubmitExamModal;
