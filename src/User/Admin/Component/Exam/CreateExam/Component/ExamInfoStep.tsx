import React from 'react';
import { Field } from 'formik';
import { CreateExamFormValues } from '../../../../../../Types/admin.types';
import { ExamMode, ExamStatus } from '../../../../../../Utils/enum';


interface ExamInfoStepProps {
    values: CreateExamFormValues;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
}


const ExamInfoStep: React.FC<ExamInfoStepProps> = ({ errors, touched }) => {
    return (
        <>
            <div className="bg-gray-50 border-b border-gray-300 p-4">
                <h3 className="text-lg font-semibold text-gray-800">Exam Information</h3>
            </div>

            <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Exam Status */}
                    <div>
                        <label htmlFor="examStatus" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Exam Status<span className="text-red-500">*</span>
                        </label>
                        <Field
                            as="select"
                            name="examStatus"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.examStatus && touched.examStatus
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        >
                            {Object.values(ExamStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status.replace('_', ' ')}
                                </option>
                            ))}
                        </Field>
                        {errors.examStatus && touched.examStatus && (
                            <p className="text-[12px] text-red-600">{errors.examStatus}</p>
                        )}
                    </div>

                    {/* Exam Mode */}
                    <div>
                        <label htmlFor="examMode" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Exam Mode<span className="text-red-500">*</span>
                        </label>
                        <Field
                            as="select"
                            name="examMode"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.examMode && touched.examMode
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        >
                            {Object.values(ExamMode).map((mode) => (
                                <option key={mode} value={mode}>
                                    {mode}
                                </option>
                            ))}
                        </Field>
                        {errors.examMode && touched.examMode && (
                            <p className="text-[12px] text-red-600">{errors.examMode}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Exam Title */}
                    <div>
                        <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Exam Title<span className="text-red-500">*</span>
                        </label>
                        <Field
                            type="text"
                            name="examTitle"
                            placeholder="Enter exam title"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.examTitle && touched.examTitle
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {errors.examTitle && touched.examTitle && (
                            <p className="text-[12px] text-red-600">{errors.examTitle}</p>
                        )}
                    </div>

                    {/* Subject */}
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Subject<span className="text-red-500">*</span>
                        </label>
                        <Field
                            type="text"
                            name="subject"
                            placeholder="Enter subject"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.subject && touched.subject
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {errors.subject && touched.subject && (
                            <p className="text-[12px] text-red-600">{errors.subject}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Marks */}
                    <div>
                        <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Total Marks<span className="text-red-500">*</span>
                        </label>
                        <Field
                            type="number"
                            name="totalMarks"
                            min="1"
                            placeholder="0"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.totalMarks && touched.totalMarks
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {errors.totalMarks && touched.totalMarks && (
                            <p className="text-[12px] text-red-600">{errors.totalMarks}</p>
                        )}
                    </div>

                    {/* Passing Marks */}
                    <div>
                        <label htmlFor="passingMarks" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Passing Marks<span className="text-red-500">*</span>
                        </label>
                        <Field
                            type="number"
                            name="passingMarks"
                            min="0"
                            placeholder="0"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.passingMarks && touched.passingMarks
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {errors.passingMarks && touched.passingMarks && (
                            <p className="text-[12px] text-red-600">{errors.passingMarks}</p>
                        )}
                    </div>

                    {/* Duration */}
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Duration (min)<span className="text-red-500">*</span>
                        </label>
                        <Field
                            type="number"
                            name="duration"
                            min="1"
                            placeholder="0"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.duration && touched.duration
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {errors.duration && touched.duration && (
                            <p className="text-[12px] text-red-600">{errors.duration}</p>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {/* Exam Description */}
                    <div>
                        <label htmlFor="examDescription" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Exam Description<span className="text-red-500">*</span>
                        </label>
                        <Field
                            as="textarea"
                            name="examDescription"
                            rows={3}
                            placeholder="Enter exam description"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.examDescription && touched.examDescription
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        />
                        {errors.examDescription && touched.examDescription && (
                            <p className="text-[12px] text-red-600">{errors.examDescription}</p>
                        )}
                    </div>
                </div>

                {/* General Instructions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                        General Instructions<span className="text-red-500">*</span>
                    </label>
                    <Field
                        as="textarea"
                        name="examDescription"
                        rows={3}
                        placeholder="Enter exam description"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.examDescription && touched.examDescription
                            ? 'border-red-500'
                            : 'border-gray-300'
                            }`}
                    />
                    {errors.examDescription && touched.examDescription && (
                        <p className="text-[12px] text-red-600">{errors.examDescription}</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default ExamInfoStep;