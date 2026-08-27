import React from 'react';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import Button from '../../../../common/ui/Button';
import InputField from '../../../../common/ui/Input';
import Select from '../../../../common/ui/Select';
import { QuestionType } from '../../../../utils/enum';
import { toEnumOptions } from '../../../../utils/utils';
import { ExamSectionData } from '../../../../types/exams-types';
import { questionValidationSchema } from '../formik/question.schema';

const questionTypeOptions = toEnumOptions(QuestionType);

export interface QuestionFormValues {
    type: string;
    text: string;
    marks: number | string;
    examSectionId?: string;
    options: { text: string; isCorrect: boolean }[];
}

interface QuestionFormProps {
    initialValues?: Partial<QuestionFormValues>;
    examSections?: ExamSectionData[];
    onSubmit: (values: QuestionFormValues) => Promise<void> | void;
    isLoading?: boolean;
}

const emptyOptions = () => Array.from({ length: 4 }, () => ({ text: '', isCorrect: false }));

const isSubjectiveType = (type: string) => type === QuestionType.WRITTEN || type === QuestionType.TYPING;

const QuestionForm: React.FC<QuestionFormProps> = ({ initialValues, examSections = [], onSubmit, isLoading = false }) => {
    const values: QuestionFormValues = {
        type: initialValues?.type || '',
        text: initialValues?.text || '',
        marks: initialValues?.marks ?? '',
        examSectionId: initialValues?.examSectionId || '',
        options: initialValues?.options && initialValues.options.length === 4 ? initialValues.options : emptyOptions(),
    };

    const sectionOptions = [
        { value: '', label: 'No section' },
        ...[...examSections].sort((a, b) => a.order - b.order).map((s) => ({ value: s._id, label: s.label })),
    ];

    const handleSubmit = async (formValues: QuestionFormValues, { setSubmitting }: any) => {
        try {
            await onSubmit({
                ...formValues,
                marks: Number(formValues.marks),
                examSectionId: formValues.examSectionId || undefined,
            });
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to save question');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={values}
            validationSchema={questionValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => {
                const isWritten = isSubjectiveType(values.type);
                const isMcq = values.type === QuestionType.MCQ;

                const handleCorrectToggle = (index: number, checked: boolean) => {
                    if (isMcq) {
                        const updated = values.options.map((opt, i) => ({ ...opt, isCorrect: i === index ? checked : false }));
                        setFieldValue('options', updated);
                    } else {
                        setFieldValue(`options.${index}.isCorrect`, checked);
                    }
                };

                return (
                    <Form>
                        <div className="space-y-4">
                            <Select
                                id="type"
                                name="type"
                                label="Question Type"
                                options={questionTypeOptions}
                                value={values.type}
                                onChange={(value) => setFieldValue('type', value)}
                                error={errors.type}
                                touched={touched.type}
                                required
                                disabled={isSubmitting || isLoading}
                            />

                            {examSections.length > 0 && (
                                <Select
                                    id="examSectionId"
                                    name="examSectionId"
                                    label="Section (optional)"
                                    options={sectionOptions}
                                    value={values.examSectionId || ''}
                                    onChange={(value) => setFieldValue('examSectionId', value)}
                                    disabled={isSubmitting || isLoading}
                                />
                            )}

                            <InputField
                                id="text"
                                name="text"
                                label="Question Text"
                                placeholder="Enter the question"
                                value={values.text}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.text}
                                touched={touched.text}
                                required
                                disabled={isSubmitting || isLoading}
                            />

                            <InputField
                                id="marks"
                                name="marks"
                                type="number"
                                label={isWritten ? 'Marks (2-20, hand-graded)' : 'Marks'}
                                placeholder="e.g., 5"
                                value={values.marks}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.marks as string}
                                touched={touched.marks}
                                required
                                disabled={isSubmitting || isLoading}
                            />

                            {!isWritten && values.type && (
                                <div className="space-y-3">
                                    <label className="block text-sm font-medium text-textSecondary">
                                        Options ({isMcq ? 'select the 1 correct option' : 'select 1 or more correct options'})
                                    </label>
                                    {values.options.map((option, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <input
                                                type={isMcq ? 'radio' : 'checkbox'}
                                                name="correctOption"
                                                checked={option.isCorrect}
                                                onChange={(e) => handleCorrectToggle(index, e.target.checked)}
                                                disabled={isSubmitting || isLoading}
                                                className="h-4 w-4"
                                            />
                                            <InputField
                                                id={`options.${index}.text`}
                                                name={`options.${index}.text`}
                                                placeholder={`Option ${index + 1}`}
                                                value={option.text}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                disabled={isSubmitting || isLoading}
                                                className="flex-1"
                                            />
                                        </div>
                                    ))}
                                    {typeof errors.options === 'string' && (
                                        <p className="text-xs text-red-600">{errors.options}</p>
                                    )}
                                </div>
                            )}

                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    loading={isSubmitting || isLoading}
                                    disabled={isSubmitting || isLoading}
                                >
                                    {isSubmitting || isLoading ? '' : 'Save Question'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                );
            }}
        </Formik>
    );
};

export default QuestionForm;
