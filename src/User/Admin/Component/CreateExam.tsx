import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

const CreateExam = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const steps = [
        { id: 1, title: 'Basic Info', description: 'Exam details' },
        { id: 2, title: 'Schedule', description: 'Add questions' },
        { id: 3, title: 'Grading', description: 'Configure exam' },
        { id: 4, title: 'Settings', description: 'Final review' },
        { id: 5, title: 'Proctoring', description: 'Exam details' },
        { id: 6, title: 'Security', description: 'Add questions' },
        { id: 7, title: 'Instructions', description: 'Configure exam' },
        { id: 8, title: 'Questions', description: 'Final review' }
    ];

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const goToStep = (stepId: any) => {
        setCurrentStep(stepId);
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
                        <h3 className="text-lg font-semibold text-gray-800">Schedule</h3>
                        <p className="text-gray-600">Set up exam timing and availability.</p>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Grading</h3>
                        <p className="text-gray-600">Configure grading criteria and scoring.</p>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Settings</h3>
                        <p className="text-gray-600">Adjust exam preferences and options.</p>
                    </div>
                );
            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Proctoring</h3>
                        <p className="text-gray-600">Configure monitoring and supervision settings.</p>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Security</h3>
                        <p className="text-gray-600">Set up security measures and restrictions.</p>
                    </div>
                );
            case 7:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Instructions</h3>
                        <p className="text-gray-600">Provide guidance and rules for exam takers.</p>
                    </div>
                );
            case 8:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
                        <p className="text-gray-600">Add and organize your exam questions.</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen bg-gray-50 p-4">
            <div className="max-w-9xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="bg-primary text-white p-4">
                        <h1 className="text-xl sm:text-2xl font-semibold">
                            Create Exam
                        </h1>
                    </div>

                    <div className="flex flex-row">
                        {/* Vertical Step Navigation */}
                        <div className="w-20 border-b border-r border-gray-200 bg-gray-50">
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
                                                className="flex items-center p-2 cursor-pointer transition-all duration-200"
                                                onClick={() => goToStep(step.id)}
                                            >
                                                {/* Step Circle */}
                                                <div
                                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 mr-3 transition-all duration-200 ${currentStep > step.id
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
                            <div className="flex-1 p-4">
                                {renderStepContent()}
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
                                        Previous
                                    </button>

                                    {currentStep === steps.length ? (
                                        <button
                                            type="submit"
                                            className="bg-green-600 text-white px-6 py-1.5 rounded-md hover:bg-green-700 transition-colors font-medium cursor-pointer"
                                        >
                                            Create Exam
                                        </button>
                                    ) : (
                                        <button
                                            onClick={nextStep}
                                            className="flex items-center justify-center bg-primary text-white px-4 py-1.5 rounded-md transition-colors font-medium cursor-pointer"
                                        >
                                            Next
                                            <ChevronRight size={20} className="ml-1" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default CreateExam;