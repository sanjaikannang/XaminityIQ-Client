import React from 'react';
import Modal from '../../../../common/ui/Modal';
import Button from '../../../../common/ui/Button';
import InputField from '../../../../common/ui/Input';

interface EndExamModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    inputValue: string;
    onInputChange: (value: string) => void;
}

const EndExamModal: React.FC<EndExamModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    inputValue,
    onInputChange,
}) => {
    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="End Exam"
                size="sm"
            >
                <div className="space-y-4">
                    <p className="text-textSecondary text-sm">
                        Are you sure you want to end the exam for all students? This action cannot be undone.
                    </p>
                    <p className="text-textPrimary text-sm font-medium">
                        Please type <span className="font-bold text-danger">END</span> to confirm:
                    </p>
                    <InputField
                        type='text'
                        id='end'
                        name='end'
                        value={inputValue}
                        onChange={(e) => onInputChange(e.target.value)}
                        placeholder="Type END"
                    />
                    <div className="flex justify-end pt-2">
                        <Button
                            variant="danger"
                            size="md"
                            onClick={onConfirm}
                            disabled={inputValue !== 'END'}
                        >
                            End Exam
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default EndExamModal;