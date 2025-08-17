import React from 'react';
import { FormikProps } from 'formik';
import { CreateExamFormValues } from '../../../../FormikSchema/create-exam.schema';

interface ScheduleProps {
    formik: FormikProps<CreateExamFormValues>;
}

const Schedule: React.FC<ScheduleProps> = ({ formik }) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

    // Handle date changes
    const handleDateChange = (field: string, value: string) => {
        setFieldValue(field, value ? new Date(value) : undefined);
    };

    // Format date for input (YYYY-MM-DD)
    const formatDateForInput = (date: Date | undefined | string) => {
        if (!date) return '';
        const d = date instanceof Date ? date : new Date(date);
        return d.toISOString().split('T')[0];
    };

    return (
        <>
            <div className="p-6 space-y-6">
                {/* Mode-specific scheduling */}
                {values.examMode === 'PROCTORING' ? (
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-blue-900 mb-4">Proctoring Mode Schedule</h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Exam Date */}
                            <div>
                                <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Exam Date *
                                </label>
                                <input
                                    type="date"
                                    id="examDate"
                                    name="examDate"
                                    value={formatDateForInput(values.scheduleDetails.examDate)}
                                    onChange={(e) => handleDateChange('scheduleDetails.examDate', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.scheduleDetails?.examDate && touched.scheduleDetails?.examDate ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.scheduleDetails?.examDate && touched.scheduleDetails?.examDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.scheduleDetails.examDate}</p>
                                )}
                            </div>

                            {/* Start Time */}
                            <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time *
                                </label>
                                <input
                                    type="time"
                                    id="startTime"
                                    name="scheduleDetails.startTime"
                                    value={values.scheduleDetails.startTime || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.scheduleDetails?.startTime && touched.scheduleDetails?.startTime ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.scheduleDetails?.startTime && touched.scheduleDetails?.startTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.scheduleDetails.startTime}</p>
                                )}
                            </div>

                            {/* End Time */}
                            <div>
                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                                    End Time *
                                </label>
                                <input
                                    type="time"
                                    id="endTime"
                                    name="scheduleDetails.endTime"
                                    value={values.scheduleDetails.endTime || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.scheduleDetails?.endTime && touched.scheduleDetails?.endTime ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.scheduleDetails?.endTime && touched.scheduleDetails?.endTime && (
                                    <p className="mt-1 text-sm text-red-600">{errors.scheduleDetails.endTime}</p>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-green-50 p-4 rounded-lg">
                        <h3 className="text-lg font-medium text-green-900 mb-4">Auto Mode Schedule</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Date */}
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date *
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={formatDateForInput(values.scheduleDetails.startDate)}
                                    onChange={(e) => handleDateChange('scheduleDetails.startDate', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.scheduleDetails?.startDate && touched.scheduleDetails?.startDate ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.scheduleDetails?.startDate && touched.scheduleDetails?.startDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.scheduleDetails.startDate}</p>
                                )}
                            </div>

                            {/* End Date */}
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                                    End Date *
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={formatDateForInput(values.scheduleDetails.endDate)}
                                    onChange={(e) => handleDateChange('scheduleDetails.endDate', e.target.value)}
                                    className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.scheduleDetails?.endDate && touched.scheduleDetails?.endDate ? 'border-red-500' : ''
                                        }`}
                                />
                                {errors.scheduleDetails?.endDate && touched.scheduleDetails?.endDate && (
                                    <p className="mt-1 text-sm text-red-600">{errors.scheduleDetails.endDate}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Buffer Time Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Buffer Time Settings</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Before Exam Buffer */}
                        <div>
                            <label htmlFor="beforeExam" className="block text-sm font-medium text-gray-700 mb-2">
                                Before Exam (minutes)
                            </label>
                            <input
                                type="number"
                                id="beforeExam"
                                name="scheduleDetails.bufferTime.beforeExam"
                                value={values.scheduleDetails.bufferTime?.beforeExam || 0}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="Enter buffer time before exam"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Time students can join before the exam starts
                            </p>
                        </div>

                        {/* After Exam Buffer */}
                        <div>
                            <label htmlFor="afterExam" className="block text-sm font-medium text-gray-700 mb-2">
                                After Exam (minutes)
                            </label>
                            <input
                                type="number"
                                id="afterExam"
                                name="scheduleDetails.bufferTime.afterExam"
                                value={values.scheduleDetails.bufferTime?.afterExam || 0}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary"
                                placeholder="Enter buffer time after exam"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Extra time allowed after the exam duration
                            </p>
                        </div>
                    </div>
                </div>               

                {/* Validation Messages */}
                {errors.scheduleDetails && typeof errors.scheduleDetails === 'string' && (
                    <div className="bg-red-50 border-l-4 border-red-400 p-4">
                        <p className="text-red-700">{errors.scheduleDetails}</p>
                    </div>
                )}
            </div>
        </>
    );
};

export default Schedule;