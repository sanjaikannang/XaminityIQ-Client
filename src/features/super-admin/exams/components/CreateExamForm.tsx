import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import Button from '../../../../common/ui/Button';
import Select from '../../../../common/ui/Select';
import { ExamMode } from '../../../../utils/enum';
import React, { useState, useEffect } from 'react';
import InputField from '../../../../common/ui/Input';
import { createExamValidationSchema } from '../formik/create-exam.schema';

interface CreateExamFormProps {
    onSubmit: (values: CreateExamFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export interface CreateExamFormValues {
    examMode: ExamMode;
    examName: string;
    duration: number;
    examDate?: string;
    startTime?: string;
    endTime?: string;
    examStartDate?: string;
    examEndDate?: string;
    facultyId?: string;
    studentIds?: string[];
}

const CreateExamForm: React.FC<CreateExamFormProps> = ({
    onSubmit,
    onCancel,
    isLoading = false,
}) => {
    const [selectedMode, setSelectedMode] = useState<ExamMode>(ExamMode.PROCTORING);

    const initialValues: CreateExamFormValues = {
        examMode: ExamMode.PROCTORING,
        examName: '',
        duration: 120,
        examDate: '',
        startTime: '',
        endTime: '',
        examStartDate: '',
        examEndDate: '',
        facultyId: '',
        studentIds: [],
    };

    const examModeOptions = [
        { value: ExamMode.PROCTORING, label: 'Proctoring Mode' },
        { value: ExamMode.AUTO, label: 'Auto Mode' },
    ];

    const handleSubmit = async (
        values: CreateExamFormValues,
        { setSubmitting }: any
    ) => {
        try {
            await onSubmit(values);
        } catch (error: any) {
            console.error('Create exam error:', error);
            toast.error(error?.data?.message || 'Failed to create exam');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={createExamValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
                    useEffect(() => {
                        setSelectedMode(values.examMode);
                    }, [values.examMode]);

                    // Helper function to convert comma-separated string to array
                    const handleStudentIdsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                        const inputValue = e.target.value;
                        const studentIdsArray = inputValue
                            .split(',')
                            .map(id => id.trim())
                            .filter(id => id !== '');

                        setFieldValue('studentIds', studentIdsArray);
                    };

                    // Helper function to convert array to comma-separated string for display
                    const studentIdsDisplay = values.studentIds?.join(', ') || '';

                    return (
                        <Form>
                            <div className="space-y-6">

                                <div className="grid grid-cols-3 gap-4">
                                    {/* Exam Mode */}
                                    <Select
                                        id="examMode"
                                        name="examMode"
                                        label="Exam Mode"
                                        options={examModeOptions}
                                        value={values.examMode}
                                        onChange={(value) => {
                                            setFieldValue('examMode', value);
                                            // Reset mode-specific fields
                                            if (value === ExamMode.PROCTORING) {
                                                setFieldValue('examStartDate', '');
                                                setFieldValue('examEndDate', '');
                                            } else {
                                                setFieldValue('examDate', '');
                                                setFieldValue('startTime', '');
                                                setFieldValue('endTime', '');
                                                setFieldValue('facultyId', '');
                                            }
                                            setFieldValue('studentIds', []);
                                        }}
                                        onBlur={handleBlur}
                                        error={errors.examMode}
                                        touched={touched.examMode}
                                        required
                                        disabled={isSubmitting || isLoading}
                                    />

                                    {/* Exam Name */}
                                    <InputField
                                        id="examName"
                                        name="examName"
                                        type="text"
                                        label="Exam Name"
                                        placeholder="e.g., Mathematics Final Exam"
                                        value={values.examName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.examName}
                                        touched={touched.examName}
                                        required
                                        disabled={isSubmitting || isLoading}
                                    />

                                    {/* Duration */}
                                    <InputField
                                        id="duration"
                                        name="duration"
                                        type="number"
                                        label="Duration (minutes)"
                                        placeholder="e.g., 120"
                                        value={values.duration}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.duration}
                                        touched={touched.duration}
                                        required
                                        disabled={isSubmitting || isLoading}
                                        min={1}
                                        max={480}
                                    />
                                </div>

                                {/* PROCTORING MODE FIELDS */}
                                {selectedMode === ExamMode.PROCTORING && (
                                    <>
                                        <div className="grid grid-cols-3 gap-4">
                                            <InputField
                                                id="examDate"
                                                name="examDate"
                                                type="date"
                                                label="Exam Date"
                                                value={values.examDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.examDate}
                                                touched={touched.examDate}
                                                required
                                                disabled={isSubmitting || isLoading}
                                            />
                                            <InputField
                                                id="startTime"
                                                name="startTime"
                                                type="time"
                                                label="Start Time"
                                                value={values.startTime}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.startTime}
                                                touched={touched.startTime}
                                                required
                                                disabled={isSubmitting || isLoading}
                                            />

                                            <InputField
                                                id="endTime"
                                                name="endTime"
                                                type="time"
                                                label="End Time"
                                                value={values.endTime}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.endTime}
                                                touched={touched.endTime}
                                                required
                                                disabled={isSubmitting || isLoading}
                                            />
                                        </div>

                                        <InputField
                                            id="facultyId"
                                            name="facultyId"
                                            type="text"
                                            label="Faculty ID"
                                            placeholder="e.g., 6953d4593c9ee327e1b69fc9"
                                            value={values.facultyId}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.facultyId}
                                            touched={touched.facultyId}
                                            required
                                            disabled={isSubmitting || isLoading}
                                        />

                                        <div>
                                            <label className="block text-sm font-medium text-textTertiary mb-2">
                                                Student IDs (comma-separated, exactly 5 required) <span className="text-red-600 ml-1">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., id1, id2, id3, id4, id5"
                                                value={studentIdsDisplay}
                                                onChange={handleStudentIdsChange}
                                                onBlur={handleBlur('studentIds')}
                                                disabled={isSubmitting || isLoading}
                                                className="block w-full pl-3 pr-3 py-2 border border-borderLight rounded-lg focus:outline-none duration-200 text-textTertiary placeholder-borderLight disabled:bg-borderLight disabled:cursor-not-allowed"
                                            />
                                            <p className="text-xs text-textSecondary mt-1">
                                                Enter exactly 5 student IDs separated by commas (Current: {values.studentIds?.length || 0}/5)
                                            </p>
                                            {errors.studentIds && touched.studentIds && (
                                                <p className="text-xs text-red-600 mt-1">
                                                    {errors.studentIds}
                                                </p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {/* AUTO MODE FIELDS */}
                                {selectedMode === ExamMode.AUTO && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <InputField
                                                id="examStartDate"
                                                name="examStartDate"
                                                type="date"
                                                label="Exam Start Date"
                                                value={values.examStartDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.examStartDate}
                                                touched={touched.examStartDate}
                                                required
                                                disabled={isSubmitting || isLoading}
                                            />

                                            <InputField
                                                id="examEndDate"
                                                name="examEndDate"
                                                type="date"
                                                label="Exam End Date"
                                                value={values.examEndDate}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.examEndDate}
                                                touched={touched.examEndDate}
                                                required
                                                disabled={isSubmitting || isLoading}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-textTertiary mb-2">
                                                Student IDs (comma-separated, optional)
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="e.g., id1, id2, id3"
                                                value={studentIdsDisplay}
                                                onChange={handleStudentIdsChange}
                                                onBlur={handleBlur('studentIds')}
                                                disabled={isSubmitting || isLoading}
                                                className="block w-full pl-3 pr-3 py-2 border border-borderLight rounded-lg focus:outline-none duration-200 text-textTertiary placeholder-borderLight disabled:bg-borderLight disabled:cursor-not-allowed"
                                            />
                                            <p className="text-xs text-textSecondary mt-1">
                                                Leave empty to include all students (Current: {values.studentIds?.length || 0} students)
                                            </p>
                                        </div>
                                    </>
                                )}

                                {/* Form Actions */}
                                <div className="flex justify-end gap-3 pt-4">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        size="md"
                                        onClick={onCancel}
                                        disabled={isSubmitting || isLoading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        size="md"
                                        loading={isSubmitting || isLoading}
                                        disabled={isSubmitting || isLoading}
                                    >
                                        {isSubmitting || isLoading ? '' : 'Create Exam'}
                                    </Button>
                                </div>
                            </div>
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};

export default CreateExamForm;