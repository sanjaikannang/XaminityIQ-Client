import React, { useState } from 'react';
import StepForm, { Step } from '../../../Common/UI/StepForm';

const CreateExam: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const steps: Step[] = [
        { id: 1, title: 'Exam Info', description: 'Basic Exam Information' },
        { id: 2, title: 'Exam Assignment', description: 'Target Audience & Assignment' },
        { id: 3, title: 'Schedule & Timing', description: 'Schedule & Timing' },
        { id: 4, title: 'Exam Structure & Sections', description: 'Exam Structure & Sections' },
        { id: 5, title: 'Questions & Answers', description: 'Questions & Answers' },
    ];

    const handleStepChange = (step: number) => {
        setCurrentStep(step);
    };

    const handleComplete = () => {
        console.log('Exam creation completed!');
        // Add your exam creation logic here
    };

    const handleNext = (currentStep: number) => {
        console.log(`Moving from step ${currentStep} to step ${currentStep + 1}`);
        // Add any validation or data saving logic before moving to next step
    };

    const handlePrevious = (currentStep: number) => {
        console.log(`Moving from step ${currentStep} to step ${currentStep - 1}`);
        // Add any data saving logic when going back
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
                        <p className="text-gray-600">Configure your exam's basic details and settings.</p>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Exam Assignment</h3>
                        <p className="text-gray-600">Target Audience & Assignment settings.</p>
                        {/* Add your form fields here */}
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Schedule & Timing</h3>
                        <p className="text-gray-600">Set up exam timing and availability.</p>
                        {/* Add your form fields here */}
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Exam Structure & Sections</h3>
                        <p className="text-gray-600">Configure exam structure and sections.</p>
                        {/* Add your form fields here */}
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Questions & Answers</h3>
                        <p className="text-gray-600">Add and configure exam questions.</p>
                        {/* Add your form fields here */}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <StepForm
                title="Create Exam"
                steps={steps}
                currentStep={currentStep}
                onStepChange={handleStepChange}
                onComplete={handleComplete}
                onNext={handleNext}
                onPrevious={handlePrevious}
                submitButtonText="Create Exam"
                allowStepNavigation={true}
            >
                {renderStepContent()}
            </StepForm>
        </>
    );
};

export default CreateExam;