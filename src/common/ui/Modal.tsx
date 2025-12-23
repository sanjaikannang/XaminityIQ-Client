import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    size = 'md'
}) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl'
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <>
            <div
                className="fixed inset-0 z-50 overflow-y-auto"
                onClick={handleBackdropClick}
            >
                {/* Backdrop */}
                <div className="fixed inset-0 bg-opacity-25 backdrop-blur-md transition-all" />

                {/* Modal */}
                <div className="flex min-h-full items-center justify-center px-4">
                    <div
                        className={`relative transform overflow-hidden rounded-lg bg-bgPrimary text-left shadow-xl transition-all w-full border border-borderLight ${sizeClasses[size]}`}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-3 border-b border-borderLight">
                            <h3 className="text-lg font-semibold text-textPrimary">
                                {title}
                            </h3>
                            <button
                                onClick={onClose}
                                className="rounded-md p-2 hover:bg-bgTertiary focus:outline-none cursor-pointer"
                            >
                                <X className="h-4 w-4 text-textSecondary" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="px-3 py-6 text-textPrimary">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Modal;