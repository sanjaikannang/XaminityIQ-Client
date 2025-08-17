import { useState } from 'react';
import { useFormik } from 'formik';
import { useDispatch } from 'react-redux';
import { ChevronDown, Save, Send } from 'lucide-react';
import ExamInfo from './Component/ExamInfo';
import ExamAssignment from './Component/ExamAssignment';
import Schedule from './Component/Schedule';
import ExamStructure from './Component/ExamStructure';
import Questions from './Component/Questions';
import { CreateExamFormValues, createExamSchema } from '../../../FormikSchema/create-exam.schema';
import { ExamMode, ExamStatus } from '../../../../../Utils/enum';
import { setLoading } from '../../../../../State/Slices/adminSlice';
import { CreateExamRequest } from '../../../../../Types/admin.types';
import { createExam } from '../../../../../Services/Admin/adminAPI';
import toast from 'react-hot-toast';


const CreateExam = () => {
    const dispatch = useDispatch();
    const [isExamInfoOpen, setIsExamInfoOpen] = useState(true);
    const [isTargetAudienceOpen, setIsTargetAudienceOpen] = useState(true);
    const [isScheduleOpen, setIsScheduleOpen] = useState(true);
    const [isExamStructureOpen, setIsExamStructureOpen] = useState(true);
    const [isQuestionsOpen, setIsQuestionsOpen] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Initial values for the form
    const initialValues: CreateExamFormValues = {
        examStatus: ExamStatus.DRAFT,
        examTitle: '',
        examDescription: '',
        subject: '',
        totalMarks: 0,
        passingMarks: 0,
        duration: 0,
        examMode: ExamMode.AUTO,
        generalInstructions: [],
        batchId: '',
        courseId: '',
        branchId: '',
        sectionIds: [],
        scheduleDetails: {
            examDate: undefined,
            startTime: '',
            endTime: '',
            startDate: undefined,
            endDate: undefined,
            bufferTime: {
                beforeExam: 0,
                afterExam: 0,
            },
        },
        assignedFacultyIds: [],
        examSections: [],
    };

    // Formik setup
    const formik = useFormik<CreateExamFormValues>({
        initialValues,
        validationSchema: createExamSchema,
        onSubmit: async (values) => {
            await handleSubmit(values, ExamStatus.PUBLISH);
        },
    });

    // Handle form submission
    const handleSubmit = async (values: CreateExamFormValues, status: ExamStatus) => {
        try {
            setIsSubmitting(true);
            dispatch(setLoading(true));

            const examData: CreateExamRequest = {
                ...values,
                examStatus: status,
                generalInstructions: values.generalInstructions?.filter(
                    (instruction): instruction is string => typeof instruction === 'string' && instruction.trim() !== ''
                ),
                scheduleDetails: {
                    ...values.scheduleDetails,
                    examDate: values.scheduleDetails.examDate?.toISOString(),
                    startDate: values.scheduleDetails.startDate?.toISOString(),
                    endDate: values.scheduleDetails.endDate?.toISOString(),
                },
            };

            const response = await createExam(examData);

            if (response.success) {
                // dispatch(addExam(response.data));
                toast.success(response.message || 'Exam created successfully');

                // Reset form after successful submission
                formik.resetForm();

                // Close all sections
                setIsExamInfoOpen(false);
                setIsTargetAudienceOpen(false);
                setIsScheduleOpen(false);
                setIsExamStructureOpen(false);
                setIsQuestionsOpen(false);
            } else {
                toast.error(response.message || 'Failed to create exam');
            }
        } catch (error: any) {
            console.error('Error creating exam:', error);
            toast.error(error.response?.data?.message || 'Failed to create exam');
        } finally {
            setIsSubmitting(false);
            dispatch(setLoading(false));
        }
    };

    // Handle save as draft
    const handleSaveAsDraft = async () => {
        const values = formik.values;
        await handleSubmit(values, ExamStatus.DRAFT);
    };

    // Toggle functions
    const toggleExamInfo = () => setIsExamInfoOpen(!isExamInfoOpen);
    const toggleTargetAudience = () => setIsTargetAudienceOpen(!isTargetAudienceOpen);
    const toggleSchedule = () => setIsScheduleOpen(!isScheduleOpen);
    const toggleExamStructure = () => setIsExamStructureOpen(!isExamStructureOpen);
    const toggleQuestions = () => setIsQuestionsOpen(!isQuestionsOpen);

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-9xl mx-auto">
                    <form onSubmit={formik.handleSubmit}>
                        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                            <div className="bg-primary text-whiteColor p-4 flex items-center justify-between">
                                <h1 className="text-2xl font-semibold">Create Exam</h1>

                                {/* Action buttons */}
                                <div className="flex space-x-4">
                                    <button
                                        type="button"
                                        onClick={handleSaveAsDraft}
                                        disabled={isSubmitting}
                                        className="flex items-center space-x-2 px-4 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>Save as Draft</span>
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center space-x-2 px-4 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Send className="w-4 h-4" />
                                        <span>{isSubmitting ? 'Publishing...' : 'Publish Exam'}</span>
                                    </button>
                                </div>
                            </div>

                            {/* Exam Info Section */}
                            <div>
                                <div
                                    className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                    onClick={toggleExamInfo}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">Exam Info</h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isExamInfoOpen ? 'rotate-180' : 'rotate-0'
                                            }`}
                                    />
                                </div>

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExamInfoOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <ExamInfo formik={formik} />
                                </div>
                            </div>

                            {/* Target Audience Section */}
                            <div>
                                <div
                                    className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                    onClick={toggleTargetAudience}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">Target Audience</h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isTargetAudienceOpen ? 'rotate-180' : 'rotate-0'
                                            }`}
                                    />
                                </div>

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isTargetAudienceOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <ExamAssignment formik={formik} />
                                </div>
                            </div>

                            {/* Schedule Section */}
                            <div>
                                <div
                                    className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                    onClick={toggleSchedule}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">Schedule</h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isScheduleOpen ? 'rotate-180' : 'rotate-0'
                                            }`}
                                    />
                                </div>

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isScheduleOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <Schedule formik={formik} />
                                </div>
                            </div>

                            {/* Exam Structure Section */}
                            <div>
                                <div
                                    className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                    onClick={toggleExamStructure}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">Exam Structure</h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isExamStructureOpen ? 'rotate-180' : 'rotate-0'
                                            }`}
                                    />
                                </div>

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExamStructureOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <ExamStructure formik={formik} />
                                </div>
                            </div>

                            {/* Questions Section */}
                            <div>
                                <div
                                    className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                    onClick={toggleQuestions}
                                >
                                    <h3 className="text-lg font-semibold text-gray-800">Questions</h3>
                                    <ChevronDown
                                        className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isQuestionsOpen ? 'rotate-180' : 'rotate-0'
                                            }`}
                                    />
                                </div>

                                <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isQuestionsOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                                    }`}>
                                    <Questions formik={formik} />
                                </div>
                            </div>

                            {/* Form validation errors summary */}
                            {Object.keys(formik.errors).length > 0 && formik.touched && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4 m-4">
                                    <div className="text-red-700">
                                        <h3 className="font-medium">Please fix the following errors:</h3>
                                        <ul className="mt-2 text-sm list-disc list-inside">
                                            {Object.entries(formik.errors).map(([field, error]) => (
                                                <li key={field}>
                                                    {typeof error === 'string' ? error : `${field}: Please check this field`}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default CreateExam;