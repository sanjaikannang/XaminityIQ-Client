import { useState } from 'react';
import { CheckCircle, ChevronDown, FilePen, Upload, XCircle } from 'lucide-react';
import ExamInfo from './Component/ExamInfo';
import { ExamMode, ExamStatus } from '../../../../../Utils/enum';
import ExamAssignment from './Component/ExamAssignment';
import Schedule from './Component/Schedule';
import ExamStructure from './Component/ExamStructure';
import Questions from './Component/Questions';
import toast from 'react-hot-toast';
import { createExam } from '../../../../../Services/Admin/adminAPI';

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

    const [isExamInfoOpen, setIsExamInfoOpen] = useState(true);
    const [isTargetAudienceOpen, setIsTargetAudienceOpen] = useState(true);
    const [isScheduleOpen, setIsScheduleOpen] = useState(true);
    const [isExamStructureOpen, setIsExamStructureOpen] = useState(true);
    const [isQuestionsOpen, setIsQuestionsOpen] = useState(true);

    // Toggle functions
    const toggleExamInfo = () => setIsExamInfoOpen(!isExamInfoOpen);
    const toggleTargetAudience = () => setIsTargetAudienceOpen(!isTargetAudienceOpen);
    const toggleSchedule = () => setIsScheduleOpen(!isScheduleOpen);
    const toggleExamStructure = () => setIsExamStructureOpen(!isExamStructureOpen);
    const toggleQuestions = () => setIsQuestionsOpen(!isQuestionsOpen);

    const handleExamModeChange = (mode: ExamMode) => {
        setCurrentExamMode(mode);
    };

    // Form data handlers
    const handleExamInfoDataChange = (values: ExamInfoFormData, isValid: boolean) => {
        // console.log("parent component form values....", values)
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

    return (
        <>
            <div className="p-4">
                <div className="max-w-9xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-primary text-whiteColor p-4 flex items-center justify-between">
                            <h1 className="text-2xl font-semibold">Create Exam</h1>

                            <div className="bg-primary p-0.5 rounded-full border border-white shadow-lg">
                                <div className="flex rounded-full overflow-hidden">
                                    <button
                                        className={`flex items-center px-3 py-1 transition-all duration-300 ease-in-out cursor-pointer ${status === 'DRAFT'
                                            ? 'bg-white text-primary shadow-md scale-105'
                                            : 'bg-transparent text-white hover:bg-white/10'
                                            } rounded-full font-medium text-sm ${(!isAllFormsValid() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleExamSubmission(ExamStatus.DRAFT)}
                                        disabled={!isAllFormsValid() || isSubmitting}
                                        title={!isAllFormsValid() ? 'Please fill all required fields' : 'Save as draft'}
                                    >
                                        <FilePen size={14} />
                                        {isSubmitting && status === ExamStatus.DRAFT && (
                                            <span className="ml-1">Saving...</span>
                                        )}
                                    </button>

                                    <button
                                        className={`flex items-center px-3 py-1 transition-all duration-300 ease-in-out cursor-pointer ${status === 'PUBLISH'
                                            ? 'bg-white text-primary shadow-md scale-105'
                                            : 'bg-transparent text-white hover:bg-white/10'
                                            } rounded-full font-medium text-sm ${(!isAllFormsValid() || isSubmitting) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleExamSubmission(ExamStatus.PUBLISH)}
                                        disabled={!isAllFormsValid() || isSubmitting}
                                        title={!isAllFormsValid() ? 'Please fill all required fields' : 'Publish exam'}
                                    >
                                        <Upload size={14} />
                                        {isSubmitting && status === ExamStatus.PUBLISH && (
                                            <span className="ml-1">Publishing...</span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Validation Status Indicator */}
                        <div className="bg-gray-100 p-1.5 border-b border-gray-300">
                            <div className="flex items-center space-x-4 text-sm">
                                <span className={`flex items-center gap-1 px-1 py-0.5 text-[10px] ${formValidation.examInfo ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {formValidation.examInfo ? (<CheckCircle size={10} />) : (<XCircle size={10} />)}Exam Info
                                </span>
                                <span className={`flex items-center gap-1 px-1 py-0.5 text-[10px] ${formValidation.targetAudience ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {formValidation.targetAudience ? (<CheckCircle size={10} />) : (<XCircle size={10} />)}Target Audience
                                </span>
                                <span className={`flex items-center gap-1 px-1 py-0.5 text-[10px] ${formValidation.schedule ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {formValidation.schedule ? (<CheckCircle size={10} />) : (<XCircle size={10} />)}Schedule
                                </span>
                                <span className={`flex items-center gap-1 px-1 py-0.5 text-[10px] ${formValidation.examStructure ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {formValidation.examStructure ? (<CheckCircle size={10} />) : (<XCircle size={10} />)}Structure
                                </span>
                                <span className={`flex items-center gap-1 px-1 py-0.5 text-[10px] ${formValidation.questions ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {formValidation.questions ? (<CheckCircle size={10} />) : (<XCircle size={10} />)}Questions
                                </span>
                            </div>
                        </div>

                        {/* Exam Info Section */}
                        <div>
                            <div
                                className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                onClick={toggleExamInfo}
                            >
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-lg font-semibold text-gray-800">1. Exam Info</h3>
                                    <div className={`w-1.5 h-1.5 rounded-full ${formValidation.examInfo ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isExamInfoOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExamInfoOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <ExamInfo
                                    onExamModeChange={handleExamModeChange}
                                    onFormDataChange={handleExamInfoDataChange}
                                />
                            </div>
                        </div>

                        {/* Target Audience Section */}
                        <div>
                            <div
                                className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                onClick={toggleTargetAudience}
                            >
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-lg font-semibold text-gray-800">2. Target Audience</h3>
                                    <div className={`w-1.5 h-1.5 rounded-full ${formValidation.targetAudience ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isTargetAudienceOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isTargetAudienceOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <ExamAssignment
                                    examMode={currentExamMode}
                                    onFormDataChange={handleTargetAudienceDataChange}
                                />
                            </div>
                        </div>

                        {/* Schedule Section */}
                        <div>
                            <div
                                className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                onClick={toggleSchedule}
                            >
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-lg font-semibold text-gray-800">3. Schedule</h3>
                                    <div className={`w-1.5 h-1.5 rounded-full ${formValidation.schedule ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isScheduleOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isScheduleOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <Schedule
                                    examMode={currentExamMode}
                                    onFormDataChange={handleScheduleDataChange}
                                />
                            </div>
                        </div>

                        {/* Exam Structure Section */}
                        <div>
                            <div
                                className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                onClick={toggleExamStructure}
                            >
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-lg font-semibold text-gray-800">4. Exam Structure</h3>
                                    <div className={`w-1.5 h-1.5 rounded-full ${formValidation.examStructure ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isExamStructureOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExamStructureOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <ExamStructure
                                    onSectionsUpdate={handleSectionsUpdate}
                                    onFormDataChange={handleExamStructureDataChange}
                                />
                            </div>
                        </div>

                        {/* Questions Section */}
                        <div>
                            <div
                                className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                onClick={toggleQuestions}
                            >
                                <div className="flex items-center space-x-2">
                                    <h3 className="text-lg font-semibold text-gray-800">5. Questions</h3>
                                    <div className={`w-1.5 h-1.5 rounded-full ${formValidation.questions ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                </div>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isQuestionsOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isQuestionsOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <Questions
                                    onFormDataChange={handleQuestionsDataChange}
                                    sections={sections} />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default CreateExam;
