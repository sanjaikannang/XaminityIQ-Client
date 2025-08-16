import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export interface Step {
    id: number;
    title: string;
    description: string;
}

export interface StepFormProps {
    title: string;
    steps: Step[];
    currentStep?: number;
    onStepChange?: (step: number) => void;
    onComplete?: () => void;
    onPrevious?: (currentStep: number) => void;
    onNext?: (currentStep: number) => void;
    children: React.ReactNode;
    submitButtonText?: string;
    nextButtonText?: string;
    previousButtonText?: string;
    allowStepNavigation?: boolean;
    className?: string;
}

const StepForm: React.FC<StepFormProps> = ({
    title,
    steps,
    currentStep: controlledCurrentStep,
    onStepChange,
    onComplete,
    onPrevious,
    onNext,
    children,
    submitButtonText = "Complete",
    nextButtonText = "Next",
    previousButtonText = "Previous",
    allowStepNavigation = true,
    className = ""
}) => {
    const [internalCurrentStep, setInternalCurrentStep] = useState(1);

    // Use controlled or uncontrolled step management
    const currentStep = controlledCurrentStep !== undefined ? controlledCurrentStep : internalCurrentStep;

    const updateCurrentStep = (step: number) => {
        if (controlledCurrentStep === undefined) {
            setInternalCurrentStep(step);
        }
        onStepChange?.(step);
    };

    const nextStep = () => {
        if (currentStep < steps.length) {
            const nextStepValue = currentStep + 1;
            updateCurrentStep(nextStepValue);
            onNext?.(currentStep);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            const prevStepValue = currentStep - 1;
            updateCurrentStep(prevStepValue);
            onPrevious?.(currentStep);
        }
    };

    const goToStep = (stepId: number) => {
        if (allowStepNavigation) {
            updateCurrentStep(stepId);
            onStepChange?.(stepId);
        }
    };

    const handleComplete = () => {
        onComplete?.();
    };

    return (
        <>
            <div className={`min-h-screen bg-gray-50 p-4 ${className}`}>
                <div className="max-w-9xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="bg-primary text-white p-4">
                            <h1 className="text-xl sm:text-2xl font-semibold">
                                {title}
                            </h1>
                        </div>

                        <div className="flex flex-row">
                            {/* Vertical Step Navigation */}
                            <div className="border-b border-r border-gray-200 bg-gray-50 w-20 flex items-center justify-center">
                                <div className="p-1">
                                    <div className="space-y-1">
                                        {steps.map((step, index) => (
                                            <div key={step.id} className="relative">
                                                {/* Vertical connecting line */}
                                                {index < steps.length - 1 && (
                                                    <div
                                                        className={`absolute left-7 top-12 w-0.5 h-8 ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300'
                                                            }`}
                                                    />
                                                )}

                                                {/* Step item */}
                                                <div
                                                    className={`flex items-center p-2 transition-all duration-200 ${allowStepNavigation ? 'cursor-pointer' : 'cursor-default'
                                                        }`}
                                                    onClick={() => goToStep(step.id)}
                                                >
                                                    {/* Step Circle */}
                                                    <div
                                                        className={`flex items-center justify-center w-10 h-10 rounded-full border transition-all duration-200 ${currentStep > step.id
                                                            ? 'bg-green-500 border-green-500 text-white'
                                                            : currentStep === step.id
                                                                ? 'bg-primary text-white'
                                                                : 'bg-white border-gray-200 text-gray-500'
                                                            }`}
                                                    >
                                                        {currentStep > step.id ? (
                                                            <Check size={18} />
                                                        ) : (
                                                            <span className="text-sm font-semibold">{step.id}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Main Content Area */}
                            <div className="flex-1 flex flex-col">
                                {/* Step Content */}
                                <div className="flex-1">
                                    {children}
                                </div>

                                {/* Navigation Buttons */}
                                <div className="p-4 bg-gray-50 border-t border-gray-200">
                                    <div className="flex flex-col sm:flex-row justify-between gap-3">
                                        <button
                                            onClick={prevStep}
                                            disabled={currentStep === 1}
                                            className={`flex items-center justify-center px-4 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${currentStep === 1
                                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                : 'bg-gray-600 text-white hover:bg-gray-700'
                                                }`}
                                        >
                                            <ChevronLeft size={20} className="mr-1" />
                                            {previousButtonText}
                                        </button>

                                        {currentStep === steps.length ? (
                                            <button
                                                onClick={handleComplete}
                                                className="bg-green-600 text-white px-6 py-1.5 rounded-md hover:bg-green-700 transition-colors font-medium cursor-pointer"
                                            >
                                                {submitButtonText}
                                            </button>
                                        ) : (
                                            <button
                                                onClick={nextStep}
                                                className="flex items-center justify-center bg-primary text-white px-4 py-1.5 rounded-md transition-colors font-medium cursor-pointer"
                                            >
                                                {nextButtonText}
                                                <ChevronRight size={20} className="ml-1" />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StepForm;