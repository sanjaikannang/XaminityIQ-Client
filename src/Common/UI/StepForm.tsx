import React, { useState, ReactNode } from 'react';
import { CheckCircle, ChevronLeft, ChevronRight, XCircle } from 'lucide-react';

export interface StepConfig {
    id: string;
    title: string;
    description?: string;
    isValid: boolean;
    component: ReactNode;
}

interface StepFormProps {
    steps: StepConfig[];
    onStepChange?: (currentStep: number) => void;
    onComplete?: () => void;
    headerContent?: ReactNode;
    footerActions?: ReactNode;
    className?: string;
    sidebarWidth?: string;
    allowSkip?: boolean;
    showValidationIndicator?: boolean;
}

const StepForm: React.FC<StepFormProps> = ({
    steps,
    onStepChange,
    onComplete,
    className = "",
    sidebarWidth = "w-20",
    allowSkip = false,
}) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleStepChange = (stepIndex: number) => {
        if (allowSkip || stepIndex <= currentStep || steps[currentStep].isValid) {
            setCurrentStep(stepIndex);
            onStepChange?.(stepIndex);
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            if (steps[currentStep].isValid || allowSkip) {
                const newStep = currentStep + 1;
                setCurrentStep(newStep);
                onStepChange?.(newStep);
            }
        } else if (currentStep === steps.length - 1) {
            onComplete?.();
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            const newStep = currentStep - 1;
            setCurrentStep(newStep);
            onStepChange?.(newStep);
        }
    };

    const isCurrentStepValid = () => {
        return steps[currentStep]?.isValid || allowSkip;
    };

    const isAllStepsValid = () => {
        return steps.every(step => step.isValid);
    };

    return (
        <>
            <div className={`flex bg-white rounded-md shadow-sm border border-gray-300 overflow-hidden ${className}`}>
                {/* Left Sidebar - Steps */}
                <div className={`${sidebarWidth} bg-gray-50 border-r border-gray-200 flex flex-col`}>
                    {/* Steps Navigation */}
                    <div className="flex-1 p-2 md:p-4">
                        <div className="space-y-4">
                            {steps.map((step, index) => (
                                <div key={step.id} className="relative">
                                    {/* Step Item */}
                                    <div
                                        className={`flex items-start cursor-pointer group transition-all duration-200 ${index === currentStep
                                            ? 'text-primary'
                                            : index < currentStep
                                                ? 'text-green-600'
                                                : 'text-gray-400'
                                            } ${(allowSkip || index <= currentStep || steps[currentStep].isValid)
                                                ? 'hover:text-primary'
                                                : 'cursor-not-allowed'
                                            }`}
                                        onClick={() => handleStepChange(index)}
                                    >
                                        {/* Step Indicator */}
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all duration-200 ${index === currentStep
                                            ? 'bg-primary text-white border-primary shadow-md'
                                            : index < currentStep
                                                ? step.isValid
                                                    ? 'bg-green-500 text-white border-green-500'
                                                    : 'bg-red-500 text-white border-red-500'
                                                : 'bg-white text-gray-400 border-gray-300 group-hover:border-primary'
                                            }`}>
                                            {index < currentStep ? (
                                                step.isValid ? (
                                                    <CheckCircle size={16} />
                                                ) : (
                                                    <XCircle size={16} />
                                                )
                                            ) : (
                                                index + 1
                                            )}
                                        </div>
                                    </div>

                                    {/* Connector Line */}
                                    {index < steps.length - 1 && (
                                        <div className={`absolute left-4 top-8 w-0.5 h-6 transition-colors duration-200 ${index < currentStep ? 'bg-primary' : 'bg-gray-300'
                                            }`}></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Content Area */}
                <div className="flex-1 flex flex-col">
                    {/* Content Header */}
                    <div className="bg-gray-50 p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {steps[currentStep]?.title}
                                </h2>
                            </div>
                            <div className="text-sm text-gray-500">
                                Step {currentStep + 1} of {steps.length}
                            </div>
                        </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 overflow-auto">
                        {steps[currentStep]?.component}
                    </div>

                    {/* Footer Navigation */}
                    <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            {/* Previous Button */}
                            <button
                                onClick={prevStep}
                                disabled={currentStep === 0}
                                className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer ${currentStep === 0
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-300'
                                    }`}
                            >
                                <ChevronLeft size={16} className="mr-1" />
                                Previous
                            </button>

                            {/* Next Button */}
                            <button
                                onClick={nextStep}
                                disabled={currentStep === steps.length - 1 ? !isAllStepsValid() : !isCurrentStepValid()}
                                className={`flex items-center px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 cursor-pointer ${currentStep === steps.length - 1
                                    ? isAllStepsValid()
                                        ? 'bg-green-600 text-white hover:bg-green-700'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : isCurrentStepValid()
                                        ? 'bg-primary text-white hover:bg-primary/90'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
                                <ChevronRight size={16} className="ml-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StepForm;