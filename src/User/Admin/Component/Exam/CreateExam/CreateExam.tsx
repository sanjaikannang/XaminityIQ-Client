import { useState, useMemo } from 'react';
import { FilePen, Upload } from 'lucide-react';
import ExamInfo from './Component/ExamInfo';
import { ExamMode, ExamStatus } from '../../../../../Utils/enum';
import ExamAssignment from './Component/ExamAssignment';
import Schedule from './Component/Schedule';
import ExamStructure from './Component/ExamStructure';
import Questions from './Component/Questions';
import toast from 'react-hot-toast';
import { createExam } from '../../../../../Services/Admin/adminAPI';
import { StepConfig } from '../../../../../Common/UI/StepForm';
import StepForm from '../../../../../Common/UI/StepForm';

interface Section {
    id: string;
    name: string;
    order: string;
    marks: string;
    questionType: string;
    totalQuestions: string;
    timeLimit: string;
    isOptional: boolean;
    instructions: string[];
    isExpanded: boolean;
}

interface ExamInfoFormData {
    examMode: ExamMode;
    examTitle: string;
    subject: string;
    totalMarks: number | '';
    passingMarks: number | '';
    duration: number | '';
    examDescription: string;
    generalInstructions: string[];
}

interface FormValidationState {
    examInfo: boolean;
    targetAudience: boolean;
    schedule: boolean;
    examStructure: boolean;
    questions: boolean;
}

const CreateExam = () => {
    const [status, setStatus] = useState(ExamStatus.DRAFT);
    const [currentExamMode, setCurrentExamMode] = useState<ExamMode>(ExamMode.AUTO);
    const [sections, setSections] = useState<Section[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form data state
    const [examInfoData, setExamInfoData] = useState<ExamInfoFormData | null>(null);
    const [targetAudienceData, setTargetAudienceData] = useState<any>(null);
    const [scheduleData, setScheduleData] = useState<any>(null);
    const [examStructureData, setExamStructureData] = useState<any>(null);
    const [questionsData, setQuestionsData] = useState<any>(null);

    // Form validation state
    const [formValidation, setFormValidation] = useState<FormValidationState>({
        examInfo: false,
        targetAudience: false,
        schedule: false,
        examStructure: false,
        questions: false
    });

    console.log("set exam info form values....", formValidation.examInfo);

    const handleExamModeChange = (mode: ExamMode) => {
        setCurrentExamMode(mode);
    };

    // Form data handlers
    const handleExamInfoDataChange = (values: ExamInfoFormData, isValid: boolean) => {
        setExamInfoData(values);
        setFormValidation(prev => ({ ...prev, examInfo: isValid }));
    };

    const handleTargetAudienceDataChange = (values: any, isValid: boolean) => {
        console.log("parent component form values....", values)
        setTargetAudienceData(values);
        setFormValidation(prev => ({ ...prev, targetAudience: isValid }));
    };

    const handleScheduleDataChange = (values: any, isValid: boolean) => {
        console.log("parent component form values....", values)
        setScheduleData(values);
        setFormValidation(prev => ({ ...prev, schedule: isValid }));
    };

    const handleExamStructureDataChange = (values: any, isValid: boolean) => {
        console.log("parent component form values....", values)
        setExamStructureData(values);
        setFormValidation(prev => ({ ...prev, examStructure: isValid }));
    };

    const handleQuestionsDataChange = (values: any, isValid: boolean) => {
        console.log("parent component form values....", values)
        setQuestionsData(values);
        setFormValidation(prev => ({ ...prev, questions: isValid }));
    };

    // sections update from ExamStructure
    const handleSectionsUpdate = (updatedSections: Section[]) => {
        setSections(updatedSections);
    };

    // Check if all forms are valid
    const isAllFormsValid = () => {
        return Object.values(formValidation).every(isValid => isValid);
    };

    // Format exam data based on exam mode
    const formatExamData = (examStatus: ExamStatus) => {
        if (!examInfoData || !targetAudienceData || !scheduleData || !examStructureData || !questionsData) {
            throw new Error('Missing required form data');
        }

        const baseExamData = {
            examStatus: examStatus,
            examTitle: examInfoData.examTitle,
            examDescription: examInfoData.examDescription,
            subject: examInfoData.subject,
            totalMarks: Number(examInfoData.totalMarks),
            passingMarks: Number(examInfoData.passingMarks),
            duration: Number(examInfoData.duration),
            examMode: currentExamMode,
            generalInstructions: examInfoData.generalInstructions,
            batchId: targetAudienceData.batchId,
            courseId: targetAudienceData.courseId,
            branchId: targetAudienceData.branchId,
            sectionIds: targetAudienceData.sectionIds,
            examSections: questionsData.examSections || []
        };

        if (currentExamMode === ExamMode.AUTO) {
            // AUTO mode - uses date range
            return {
                ...baseExamData,
                scheduleDetails: {
                    startDate: scheduleData.startDate,
                    endDate: scheduleData.endDate,
                    bufferTime: {
                        beforeExam: Number(scheduleData.bufferTime?.beforeExam || 0),
                        afterExam: Number(scheduleData.bufferTime?.afterExam || 0)
                    }
                }
            };
        } else {
            // PROCTORING mode - uses specific date and time with assigned faculty
            return {
                ...baseExamData,
                scheduleDetails: {
                    examDate: scheduleData.examDate,
                    startTime: scheduleData.startTime,
                    endTime: scheduleData.endTime,
                    bufferTime: {
                        beforeExam: Number(scheduleData.bufferTime?.beforeExam || 0),
                        afterExam: Number(scheduleData.bufferTime?.afterExam || 0)
                    }
                },
                assignedFacultyIds: scheduleData.assignedFacultyIds || []
            };
        }
    };

    // Handle exam submission
    const handleExamSubmission = async (examStatus: ExamStatus) => {
        if (!isAllFormsValid()) {
            toast.error('Please fill all required fields correctly before submitting.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formattedExamData = formatExamData(examStatus);
            console.log("Formatted Exam Data...", formattedExamData);

            // Call the API
            const response = await createExam(formattedExamData);

            console.log("API Response:", response);

            // Update status on successful submission
            setStatus(examStatus);

            // Show success message
            const actionText = examStatus === ExamStatus.DRAFT ? 'saved as draft' : 'published';
            toast.success(`Exam ${actionText} successfully!`);

        } catch (error) {
            console.error('Error submitting exam:', error);

            const actionText = examStatus === ExamStatus.DRAFT ? 'saving' : 'publishing';
            toast.error(`Error ${actionText} exam. Please try again.`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Configure steps for the StepForm component
    const steps: StepConfig[] = useMemo(() => [
        {
            id: 'exam-info',
            title: 'Exam Information',
            description: 'Configure basic exam details and settings',
            isValid: formValidation.examInfo,
            component: (
                <ExamInfo
                    onExamModeChange={handleExamModeChange}
                    onFormDataChange={handleExamInfoDataChange}
                />
            )
        },
        {
            id: 'target-audience',
            title: 'Target Audience',
            description: 'Select batches, courses, and sections',
            isValid: formValidation.targetAudience,
            component: (
                <ExamAssignment
                    examMode={currentExamMode}
                    onFormDataChange={handleTargetAudienceDataChange}
                />
            )
        },
        {
            id: 'schedule',
            title: 'Schedule',
            description: 'Set exam dates, times, and buffer periods',
            isValid: formValidation.schedule,
            component: (
                <Schedule
                    examMode={currentExamMode}
                    onFormDataChange={handleScheduleDataChange}
                />
            )
        },
        {
            id: 'exam-structure',
            title: 'Exam Structure',
            description: 'Define sections and exam structure',
            isValid: formValidation.examStructure,
            component: (
                <ExamStructure
                    onSectionsUpdate={handleSectionsUpdate}
                    onFormDataChange={handleExamStructureDataChange}
                />
            )
        },
        {
            id: 'questions',
            title: 'Questions',
            description: 'Add and manage exam questions',
            isValid: formValidation.questions,
            component: (
                <Questions
                    onFormDataChange={handleQuestionsDataChange}
                    sections={sections}
                />
            )
        }
    ], [formValidation, currentExamMode, sections]);

    // Header content for the step form
    const headerContent = (
        <div>
            <h1 className="text-xl font-semibold text-gray-800 mb-1">Create Exam</h1>
        </div>
    );

    // Footer actions (Save Draft / Publish buttons)
    const footerActions = (
        <div className="flex items-center space-x-2">
            <button
                className={`flex items-center px-3 py-1.5 transition-all duration-300 ease-in-out cursor-pointer ${status === 'DRAFT'
                    ? 'bg-gray-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } rounded-lg font-medium text-sm ${(!isAllFormsValid() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                onClick={() => handleExamSubmission(ExamStatus.DRAFT)}
                disabled={!isAllFormsValid() || isSubmitting}
                title={!isAllFormsValid() ? 'Please fill all required fields' : 'Save as draft'}
            >
                <FilePen size={14} className="mr-1" />
                {isSubmitting && status === ExamStatus.DRAFT ? 'Saving...' : 'Save Draft'}
            </button>

            <button
                className={`flex items-center px-3 py-1.5 transition-all duration-300 ease-in-out cursor-pointer ${status === 'PUBLISH'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'bg-primary text-white hover:bg-primary/90'
                    } rounded-lg font-medium text-sm ${(!isAllFormsValid() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                onClick={() => handleExamSubmission(ExamStatus.PUBLISH)}
                disabled={!isAllFormsValid() || isSubmitting}
                title={!isAllFormsValid() ? 'Please fill all required fields' : 'Publish exam'}
            >
                <Upload size={14} className="mr-1" />
                {isSubmitting && status === ExamStatus.PUBLISH ? 'Publishing...' : 'Publish'}
            </button>
        </div>
    );

    return (
        <div className="p-4 h-screen">
            <div className="h-full max-w-full mx-auto">
                <StepForm
                    steps={steps}
                    headerContent={headerContent}
                    footerActions={footerActions}
                    onStepChange={(stepIndex) => {
                        console.log('Step changed to:', stepIndex);
                    }}
                    onComplete={() => {
                        console.log('All steps completed');
                        // Handle completion if needed
                    }}
                    className="h-full"
                    sidebarWidth="w-12 md:w-16"
                    allowSkip={true}
                    showValidationIndicator={true}
                />
            </div>
        </div>
    );
};

export default CreateExam;