import ExamInfo from './ExamInfo';
import Schedule from './Schedule';
import Questions from './Questions';
import toast from 'react-hot-toast';
import { useState, useMemo } from 'react';
import ExamStructure from './ExamStructure';
import ExamAssignment from './ExamAssignment';
import { ExamMode } from '../../../../../../Utils/enum';
import { createExam } from '../../../../../../Services/Admin/adminAPI';
import StepForm, { StepConfig } from '../../../../../../Common/UI/StepForm';
import { ExamInfoFormData, FormValidationState, Section } from '../../../../../../Types/Exam/exam.types';


const CreateExam = () => {
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
    const formatExamData = () => {
        if (!examInfoData || !targetAudienceData || !scheduleData || !examStructureData || !questionsData) {
            throw new Error('Missing required form data');
        }

        const baseExamData = {
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
    const handleExamSubmission = async () => {
        if (!isAllFormsValid()) {
            toast.error('Please fill all required fields correctly before submitting.');
            return;
        }

        setIsSubmitting(true);

        try {
            const formattedExamData = formatExamData();
            console.log("Formatted Exam Data...", formattedExamData);

            // Call the API
            const response = await createExam(formattedExamData);

            console.log("API Response:", response);

        } catch (error) {
            console.error('Error submitting exam:', error);
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
                    initialData={examInfoData}
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
                    initialData={targetAudienceData}
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
                    initialData={scheduleData}
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
    ], [formValidation, currentExamMode, sections, examInfoData, targetAudienceData, scheduleData]);

    return (
        <div className="p-4 h-screen">
            <div className="h-full max-w-full mx-auto">
                <StepForm
                    steps={steps}
                    onStepChange={(stepIndex) => {
                        console.log('Step changed to:', stepIndex);
                    }}
                    onComplete={() => {
                        console.log('All steps completed');
                        // Handle completion if needed
                    }}
                    className="h-full"
                    sidebarWidth="w-12 md:w-16"
                    allowSkip={false}
                    showValidationIndicator={true}
                />
            </div>
        </div>
    );
};

export default CreateExam;