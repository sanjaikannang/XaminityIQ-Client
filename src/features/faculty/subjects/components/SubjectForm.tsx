import React from 'react';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import Button from '../../../../common/ui/Button';
import InputField from '../../../../common/ui/Input';
import Select from '../../../../common/ui/Select';
import { SubjectType } from '../../../../utils/enum';
import { toEnumOptions } from '../../../../utils/utils';
import { subjectValidationSchema } from '../formik/subject.schema';

const subjectTypeOptions = toEnumOptions(SubjectType);

export interface SubjectFormValues {
    subjectCode: string;
    subjectName: string;
    semester: number | string;
    credits: number | string;
    subjectType: string;
    description: string;
}

interface SubjectFormProps {
    initialValues?: Partial<SubjectFormValues>;
    fixedSemester?: number;
    onSubmit: (values: SubjectFormValues) => Promise<void> | void;
    isLoading?: boolean;
}

const SubjectForm: React.FC<SubjectFormProps> = ({ initialValues, fixedSemester, onSubmit, isLoading = false }) => {
    const values: SubjectFormValues = {
        subjectCode: initialValues?.subjectCode || '',
        subjectName: initialValues?.subjectName || '',
        semester: fixedSemester ?? initialValues?.semester ?? '',
        credits: initialValues?.credits ?? '',
        subjectType: initialValues?.subjectType || '',
        description: initialValues?.description || '',
    };

    const handleSubmit = async (formValues: SubjectFormValues, { setSubmitting }: any) => {
        try {
            await onSubmit({
                ...formValues,
                semester: Number(formValues.semester),
                credits: Number(formValues.credits),
            });
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to save subject');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Formik
            initialValues={values}
            validationSchema={subjectValidationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ values, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting }) => (
                <Form>
                    <div className="space-y-4">
                        <InputField
                            id="subjectCode"
                            name="subjectCode"
                            label="Subject Code"
                            placeholder="e.g., CS301"
                            value={values.subjectCode}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.subjectCode}
                            touched={touched.subjectCode}
                            required
                            disabled={isSubmitting || isLoading}
                        />

                        <InputField
                            id="subjectName"
                            name="subjectName"
                            label="Subject Name"
                            placeholder="e.g., Data Structures"
                            value={values.subjectName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.subjectName}
                            touched={touched.subjectName}
                            required
                            disabled={isSubmitting || isLoading}
                        />

                        <InputField
                            id="semester"
                            name="semester"
                            type="number"
                            label="Semester"
                            placeholder="e.g., 3"
                            value={values.semester}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.semester}
                            touched={touched.semester}
                            required
                            disabled={isSubmitting || isLoading || fixedSemester !== undefined}
                        />

                        <InputField
                            id="credits"
                            name="credits"
                            type="number"
                            label="Credits"
                            placeholder="e.g., 4"
                            value={values.credits}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.credits}
                            touched={touched.credits}
                            required
                            disabled={isSubmitting || isLoading}
                        />

                        <Select
                            id="subjectType"
                            name="subjectType"
                            label="Subject Type"
                            options={subjectTypeOptions}
                            value={values.subjectType}
                            onChange={(value) => setFieldValue('subjectType', value)}
                            error={errors.subjectType}
                            touched={touched.subjectType}
                            required
                            disabled={isSubmitting || isLoading}
                        />

                        <InputField
                            id="description"
                            name="description"
                            label="Description (Optional)"
                            placeholder="Short description"
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.description}
                            touched={touched.description}
                            disabled={isSubmitting || isLoading}
                        />

                        <div className="flex justify-end pt-4">
                            <Button
                                type="submit"
                                variant="primary"
                                size="md"
                                loading={isSubmitting || isLoading}
                                disabled={isSubmitting || isLoading}
                            >
                                {isSubmitting || isLoading ? '' : 'Save'}
                            </Button>
                        </div>
                    </div>
                </Form>
            )}
        </Formik>
    );
};

export default SubjectForm;
