import React from 'react';
import { FormikProps } from 'formik';
import { CreateExamFormValues } from '../../../../FormikSchema/create-exam.schema';
import { ExamMode } from '../../../../../../Utils/enum';

interface ExamInfoProps {
    formik: FormikProps<CreateExamFormValues>;
}

const ExamInfo: React.FC<ExamInfoProps> = ({ formik }) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

    // Handle array field changes for general instructions
    const handleInstructionChange = (index: number, value: string) => {
        const updatedInstructions = [...(values.generalInstructions || [])];
        updatedInstructions[index] = value;
        setFieldValue('generalInstructions', updatedInstructions);
    };

    const addInstruction = () => {
        const updatedInstructions = [...(values.generalInstructions || []), ''];
        setFieldValue('generalInstructions', updatedInstructions);
    };

    const removeInstruction = (index: number) => {
        const updatedInstructions = (values.generalInstructions || []).filter((_, i) => i !== index);
        setFieldValue('generalInstructions', updatedInstructions);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Exam Title */}
                <div>
                    <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Title *
                    </label>
                    <input
                        type="text"
                        id="examTitle"
                        name="examTitle"
                        value={values.examTitle}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.examTitle && touched.examTitle ? 'border-red-500' : ''
                            }`}
                        placeholder="Enter exam title"
                    />
                    {errors.examTitle && touched.examTitle && (
                        <p className="mt-1 text-sm text-red-600">{errors.examTitle}</p>
                    )}
                </div>

                {/* Subject */}
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                        Subject *
                    </label>
                    <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={values.subject}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.subject && touched.subject ? 'border-red-500' : ''
                            }`}
                        placeholder="Enter subject name"
                    />
                    {errors.subject && touched.subject && (
                        <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                    )}
                </div>

                {/* Total Marks */}
                <div>
                    <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-2">
                        Total Marks *
                    </label>
                    <input
                        type="number"
                        id="totalMarks"
                        name="totalMarks"
                        value={values.totalMarks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.totalMarks && touched.totalMarks ? 'border-red-500' : ''
                            }`}
                        placeholder="Enter total marks"
                    />
                    {errors.totalMarks && touched.totalMarks && (
                        <p className="mt-1 text-sm text-red-600">{errors.totalMarks}</p>
                    )}
                </div>

                {/* Passing Marks */}
                <div>
                    <label htmlFor="passingMarks" className="block text-sm font-medium text-gray-700 mb-2">
                        Passing Marks *
                    </label>
                    <input
                        type="number"
                        id="passingMarks"
                        name="passingMarks"
                        value={values.passingMarks}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.passingMarks && touched.passingMarks ? 'border-red-500' : ''
                            }`}
                        placeholder="Enter passing marks"
                    />
                    {errors.passingMarks && touched.passingMarks && (
                        <p className="mt-1 text-sm text-red-600">{errors.passingMarks}</p>
                    )}
                </div>

                {/* Duration */}
                <div>
                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
                        Duration (minutes) *
                    </label>
                    <input
                        type="number"
                        id="duration"
                        name="duration"
                        value={values.duration}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.duration && touched.duration ? 'border-red-500' : ''
                            }`}
                        placeholder="Enter duration in minutes"
                    />
                    {errors.duration && touched.duration && (
                        <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                    )}
                </div>

                {/* Exam Mode */}
                <div>
                    <label htmlFor="examMode" className="block text-sm font-medium text-gray-700 mb-2">
                        Exam Mode *
                    </label>
                    <select
                        name="examMode"
                        value={formik.values.examMode}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        {Object.values(ExamMode).map((mode) => (
                            <option key={mode} value={mode}>
                                {mode}
                            </option>
                        ))}
                    </select>

                    {errors.examMode && touched.examMode && (
                        <p className="mt-1 text-sm text-red-600">{errors.examMode}</p>
                    )}
                </div>
            </div>

            {/* Exam Description */}
            <div>
                <label htmlFor="examDescription" className="block text-sm font-medium text-gray-700 mb-2">
                    Exam Description
                </label>
                <textarea
                    id="examDescription"
                    name="examDescription"
                    value={values.examDescription}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows={4}
                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.examDescription && touched.examDescription ? 'border-red-500' : ''
                        }`}
                    placeholder="Enter exam description"
                />
                {errors.examDescription && touched.examDescription && (
                    <p className="mt-1 text-sm text-red-600">{errors.examDescription}</p>
                )}
            </div>

            {/* General Instructions */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        General Instructions
                    </label>
                    <button
                        type="button"
                        onClick={addInstruction}
                        className="px-3 py-1 text-xs bg-primary text-white rounded-md hover:bg-primary-dark"
                    >
                        Add Instruction
                    </button>
                </div>

                {(values.generalInstructions || []).map((instruction, index) => (
                    <div key={index} className="flex items-center space-x-2 mb-2">
                        <input
                            type="text"
                            value={instruction}
                            onChange={(e) => handleInstructionChange(index, e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                            placeholder={`Instruction ${index + 1}`}
                        />
                        <button
                            type="button"
                            onClick={() => removeInstruction(index)}
                            className="px-2 py-1 text-xs bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                            Remove
                        </button>
                    </div>
                ))}

                {(values.generalInstructions || []).length === 0 && (
                    <p className="text-sm text-gray-500 italic">No instructions added yet.</p>
                )}
            </div>
        </div>
    );
};

export default ExamInfo;