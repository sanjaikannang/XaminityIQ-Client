import { ErrorMessage, Field, Form, Formik } from "formik";
import { ExamMode } from "../../../../../../Utils/enum";
import { scheduleSchema } from "../../../../FormikSchema/create-exam.schema";
import { useEffect } from "react";

interface ExamScheduleProps {
    examMode: ExamMode;
    onFormDataChange?: (values: FormData, isValid: boolean) => void;
}

interface FormData {
    examMode: ExamMode;
    // For PROCTORING mode
    examDate: string;
    startTime: string;
    endTime: string;
    // For AUTO mode
    startDate: string;
    endDate: string;
    // Buffer times
    beforeExam: number | '';
    afterExam: number | '';
}

const Schedule = ({ examMode, onFormDataChange }: ExamScheduleProps) => {

    const initialValues: FormData = {
        examMode: examMode,
        examDate: '',
        startTime: '',
        endTime: '',
        startDate: '',
        endDate: '',
        beforeExam: '',
        afterExam: ''
    };

    const handleSubmit = (values: FormData) => {
        console.log('Schedule form values:', values);
    };

    const handleFormChange = (values: FormData, isValid: boolean) => {
        // Send form data to parent component
        if (onFormDataChange) {
            onFormDataChange(values, isValid);
        }
    };

    return (
        <>
            <div className="p-4 space-y-4">

                <Formik
                    initialValues={initialValues}
                    validationSchema={scheduleSchema}
                    onSubmit={handleSubmit}
                    validateOnChange={true}
                    validateOnBlur={true}
                    enableReinitialize={true}
                >
                    {({ values, isValid }) => {
                        // Check if form is actually valid (has required data)
                        const isFormActuallyValid = examMode === ExamMode.PROCTORING
                            ? isValid &&
                            values.examDate.trim() !== '' &&
                            values.startTime.trim() !== '' &&
                            values.endTime.trim() !== '' &&
                            values.beforeExam !== '' &&
                            values.afterExam !== ''
                            : isValid &&
                            values.startDate.trim() !== '' &&
                            values.endDate.trim() !== '' &&
                            values.beforeExam !== '' &&
                            values.afterExam !== '';

                        // Send form data to parent whenever values change
                        useEffect(() => {
                            handleFormChange(values, isFormActuallyValid);
                        }, [values, isFormActuallyValid]);

                        return (
                            <Form>
                                {examMode === ExamMode.PROCTORING && (
                                    <div className="p-4 border border-gray-300 rounded-md">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {/* Exam Date */}
                                            <div>
                                                <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-0.5">
                                                    Exam Date<span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    type="date"
                                                    id="examDate"
                                                    name="examDate"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                />
                                                <ErrorMessage name="examDate" component="p" className="text-xs text-red-600" />
                                            </div>

                                            {/* Start Time */}
                                            <div>
                                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-0.5">
                                                    Start Time<span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    type="time"
                                                    id="startTime"
                                                    name="startTime"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                />
                                                <ErrorMessage name="startTime" component="p" className="text-xs text-red-600" />
                                            </div>

                                            {/* End Time */}
                                            <div>
                                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-0.5">
                                                    End Time<span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    type="time"
                                                    id="endTime"
                                                    name="endTime"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                />
                                                <ErrorMessage name="endTime" component="p" className="text-xs text-red-600" />
                                            </div>
                                        </div>
                                    </div>
                                )}


                                {examMode === ExamMode.AUTO && (
                                    <div className="p-4 border border-gray-300 rounded-md">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {/* Start Date */}
                                            <div>
                                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-0.5">
                                                    Start Date<span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    type="date"
                                                    id="startDate"
                                                    name="startDate"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                />
                                                <ErrorMessage name="startDate" component="p" className="text-xs text-red-600" />
                                            </div>

                                            {/* End Date */}
                                            <div>
                                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-0.5">
                                                    End Date<span className="text-red-500">*</span>
                                                </label>
                                                <Field
                                                    type="date"
                                                    id="endDate"
                                                    name="endDate"
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                />
                                                <ErrorMessage name="endDate" component="p" className="text-xs text-red-600" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Buffer Time Settings */}
                                <div className="p-4 rounded-md border border-gray-300 mt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Before Exam Buffer */}
                                        <div>
                                            <label htmlFor="beforeExam" className="block text-sm font-medium text-gray-700 mb-0.5">
                                                Before Exam (minutes)<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="beforeExam"
                                                name="beforeExam"
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                placeholder="Enter buffer time before exam"
                                            />
                                            <ErrorMessage name="beforeExam" component="p" className="text-xs text-red-600" />
                                        </div>

                                        {/* After Exam Buffer */}
                                        <div>
                                            <label htmlFor="afterExam" className="block text-sm font-medium text-gray-700 mb-0.5">
                                                After Exam (minutes)<span className="text-red-500">*</span>
                                            </label>
                                            <Field
                                                type="number"
                                                id="afterExam"
                                                name="afterExam"
                                                min="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                placeholder="Enter buffer time after exam"
                                            />
                                            <ErrorMessage name="afterExam" component="p" className="text-xs text-red-600" />
                                        </div>
                                    </div>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </>
    );
};

export default Schedule;