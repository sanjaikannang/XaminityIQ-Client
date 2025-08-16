import React from 'react';
import { Field } from 'formik';
import { CreateExamFormValues } from '../../../../../../Types/admin.types';


interface ScheduleStepProps {
    values: CreateExamFormValues;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
}


const ScheduleStep: React.FC<ScheduleStepProps> = ({ errors, touched }) => {

    return (
        <>
            <div className="bg-gray-50 border-b border-gray-300 p-4">
                <h3 className="text-lg font-semibold text-gray-800">Schedule & Timing</h3>
            </div>

            <div className="space-y-4 p-4">
                {/* Proctoring Mode Schedule */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Exam Date */}
                        <div>
                            <label htmlFor="scheduleDetails.examDate" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Exam Date<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="date"
                                name="scheduleDetails.examDate"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.scheduleDetails?.examDate && touched.scheduleDetails?.examDate
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                    }`}
                            />
                            {errors.scheduleDetails?.examDate && touched.scheduleDetails?.examDate && (
                                <p className="text-[12px] text-red-600">{errors.scheduleDetails.examDate}</p>
                            )}
                        </div>

                        {/* Start Time */}
                        <div>
                            <label htmlFor="scheduleDetails.startTime" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Start Time<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="time"
                                name="scheduleDetails.startTime"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.scheduleDetails?.startTime && touched.scheduleDetails?.startTime
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                    }`}
                            />
                            {errors.scheduleDetails?.startTime && touched.scheduleDetails?.startTime && (
                                <p className="text-[12px] text-red-600">{errors.scheduleDetails.startTime}</p>
                            )}
                        </div>

                        {/* End Time */}
                        <div>
                            <label htmlFor="scheduleDetails.endTime" className="block text-sm font-medium text-gray-700 mb-0.5">
                                End Time<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="time"
                                name="scheduleDetails.endTime"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.scheduleDetails?.endTime && touched.scheduleDetails?.endTime
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                    }`}
                            />
                            {errors.scheduleDetails?.endTime && touched.scheduleDetails?.endTime && (
                                <p className="text-[12px] text-red-600">{errors.scheduleDetails.endTime}</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Buffer Time */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Before Exam */}
                        <div>
                            <label htmlFor="scheduleDetails.bufferTime.beforeExam" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Before Exam (minutes)
                            </label>
                            <Field
                                type="number"
                                name="scheduleDetails.bufferTime.beforeExam"
                                min="0"
                                placeholder="0"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.scheduleDetails?.bufferTime?.beforeExam && touched.scheduleDetails?.bufferTime?.beforeExam
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                    }`}
                            />
                            {errors.scheduleDetails?.bufferTime?.beforeExam && touched.scheduleDetails?.bufferTime?.beforeExam && (
                                <p className="text-[12px] text-red-600">{errors.scheduleDetails.bufferTime.beforeExam}</p>
                            )}
                        </div>

                        {/* After Exam */}
                        <div>
                            <label htmlFor="scheduleDetails.bufferTime.afterExam" className="block text-sm font-medium text-gray-700 mb-0.5">
                                After Exam (minutes)
                            </label>
                            <Field
                                type="number"
                                name="scheduleDetails.bufferTime.afterExam"
                                min="0"
                                placeholder="0"
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.scheduleDetails?.bufferTime?.afterExam && touched.scheduleDetails?.bufferTime?.afterExam
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                    }`}
                            />
                            {errors.scheduleDetails?.bufferTime?.afterExam && touched.scheduleDetails?.bufferTime?.afterExam && (
                                <p className="text-[12px] text-red-600">{errors.scheduleDetails.bufferTime.afterExam}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ScheduleStep;