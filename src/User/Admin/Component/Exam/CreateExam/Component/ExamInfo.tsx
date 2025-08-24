import { Trash2 } from 'lucide-react';
import { ExamMode } from '../../../../../../Utils/enum';
import { useEffect, useState } from 'react';
import { Field, Form, Formik, FieldArray, ErrorMessage } from 'formik';
import { examInfoSchema } from '../../../../FormikSchema/create-exam.schema';

interface ExamInfoProps {
    onExamModeChange: (mode: ExamMode) => void;
    onFormDataChange: (values: FormValues, isValid: boolean) => void;
}

interface FormValues {
    examMode: ExamMode;
    examTitle: string;
    subject: string;
    totalMarks: number | '';
    passingMarks: number | '';
    duration: number | '';
    examDescription: string;
    generalInstructions: string[];
}

const ExamInfo = ({ onExamModeChange, onFormDataChange }: ExamInfoProps) => {
    const [examMode, setExamMode] = useState<ExamMode>(ExamMode.AUTO);

    useEffect(() => {
        onExamModeChange(examMode);
    }, [examMode, onExamModeChange]);

    const initialValues: FormValues = {
        examMode: ExamMode.AUTO,
        examTitle: '',
        subject: '',
        totalMarks: '',
        passingMarks: '',
        duration: '',
        examDescription: '',
        generalInstructions: ['']
    };

    const handleSubmit = (values: FormValues) => {
        // This won't be called since we're not submitting from here
        console.log('Form values:', values);
    };

    const handleFormChange = (values: FormValues, isValid: boolean) => {
        // Send form data to parent component
        onFormDataChange(values, isValid);
    };

    return (
        <div className="p-4 space-y-4">
            <Formik
                initialValues={initialValues}
                validationSchema={examInfoSchema}
                onSubmit={handleSubmit}
                validateOnChange={true}
                validateOnBlur={true}
                enableReinitialize={true}
            >
                {({ values, setFieldValue, isValid }) => {
                    // Send form data to parent whenever values change
                    useEffect(() => {
                        handleFormChange(values, isValid);
                    }, [values, isValid]);

                    return (
                        <Form>
                            <div className="p-4 border border-gray-300 rounded-md">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Exam Mode */}
                                    <div>
                                        <label htmlFor="examMode" className="block text-sm font-medium text-gray-700 mb-0.5">
                                            Exam Mode<span className="text-red-500">*</span>
                                        </label>
                                        <Field
                                            as="select"
                                            name="examMode"
                                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                                                const newMode = e.target.value as ExamMode;
                                                setFieldValue('examMode', newMode);
                                                setExamMode(newMode);
                                            }}
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 border-gray-300"
                                        >
                                            {Object.values(ExamMode).map((mode) => (
                                                <option key={mode} value={mode}>
                                                    {mode}
                                                </option>
                                            ))}
                                        </Field>
                                        <ErrorMessage name="examMode" component="p" className="text-xs text-red-600" />
                                    </div>

                                    {/* Exam Title */}
                                    <div>
                                        <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-0.5">
                                            Exam Title<span className="text-red-500">*</span>
                                        </label>
                                        <Field
                                            type="text"
                                            name="examTitle"
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 border-gray-300"
                                            placeholder="Enter exam title"
                                        />
                                        <ErrorMessage name="examTitle" component="p" className="text-xs text-red-600" />
                                    </div>

                                    {/* Subject */}
                                    <div>
                                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-0.5">
                                            Subject<span className="text-red-500">*</span>
                                        </label>
                                        <Field
                                            type="text"
                                            name="subject"
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 border-gray-300"
                                            placeholder="Enter subject name"
                                        />
                                        <ErrorMessage name="subject" component="p" className="text-xs text-red-600" />
                                    </div>

                                    {/* Total Marks */}
                                    <div>
                                        <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-0.5">
                                            Total Marks<span className="text-red-500">*</span>
                                        </label>
                                        <Field
                                            type="number"
                                            name="totalMarks"
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 border-gray-300"
                                            placeholder="Enter total marks"
                                        />
                                        <ErrorMessage name="totalMarks" component="p" className="text-xs text-red-600" />
                                    </div>

                                    {/* Passing Marks */}
                                    <div>
                                        <label htmlFor="passingMarks" className="block text-sm font-medium text-gray-700 mb-0.5">
                                            Passing Marks<span className="text-red-500">*</span>
                                        </label>
                                        <Field
                                            type="number"
                                            name="passingMarks"
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 border-gray-300 "
                                            placeholder="Enter passing marks"
                                        />
                                        <ErrorMessage name="passingMarks" component="p" className="text-xs text-red-600" />
                                    </div>

                                    {/* Duration */}
                                    <div>
                                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-0.5">
                                            Duration (minutes)<span className="text-red-500">*</span>
                                        </label>
                                        <Field
                                            type="number"
                                            name="duration"
                                            className="w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 border-gray-300 "
                                            placeholder="Enter duration in minutes"
                                        />
                                        <ErrorMessage name="duration" component="p" className="text-xs text-red-600" />
                                    </div>
                                </div>

                                {/* Exam Description */}
                                <div className="mt-4">
                                    <label htmlFor="examDescription" className="block text-sm font-medium text-gray-700 mb-0.5">
                                        Exam Description<span className="text-red-500">*</span>
                                    </label>
                                    <Field
                                        as="textarea"
                                        name="examDescription"
                                        rows={4}
                                        className="w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 border-gray-300 "
                                        placeholder="Enter exam description"
                                    />
                                    <ErrorMessage name="examDescription" component="p" className="text-xs text-red-600" />
                                </div>

                                {/* General Instructions */}
                                <div className="p-4 rounded-md border border-gray-300 mt-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            General Instructions<span className="text-red-500">*</span>
                                        </label>
                                        <FieldArray name="generalInstructions">
                                            {({ push }) => (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        if (values.generalInstructions.length < 10) {
                                                            push('');
                                                        }
                                                    }}
                                                    disabled={values.generalInstructions.length >= 10}
                                                    className={`px-3 py-2 text-sm rounded-md cursor-pointer ${values.generalInstructions.length >= 10
                                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                                        : 'bg-primary text-white hover:bg-primary/90'
                                                        }`}
                                                >
                                                    Add Instruction
                                                </button>
                                            )}
                                        </FieldArray>
                                    </div>

                                    <FieldArray name="generalInstructions">
                                        {({ remove }) => (
                                            <>
                                                {values.generalInstructions.map((_instruction, index) => (
                                                    <div key={index} className="flex items-start space-x-2 mb-3">
                                                        <span className="text-gray-700 mt-2 text-sm">{index + 1}.</span>

                                                        <div className="flex-1">
                                                            <Field
                                                                name={`generalInstructions.${index}`}
                                                                type="text"
                                                                className="w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 border-gray-300 "
                                                                placeholder={`Instruction ${index + 1}`}
                                                            />
                                                            <ErrorMessage
                                                                name={`generalInstructions.${index}`}
                                                                component="p"
                                                                className="text-xs text-red-600"
                                                            />
                                                        </div>

                                                        <button
                                                            type="button"
                                                            className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer mt-0"
                                                            onClick={() => remove(index)}
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </FieldArray>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </div>
    );
};

export default ExamInfo;