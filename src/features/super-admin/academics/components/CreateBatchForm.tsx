import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import React, { useEffect } from 'react';
import Button from '../../../../common/ui/Button';
import InputField from '../../../../common/ui/Input';
import { createBatchValidationSchema } from '../formik/create-batch.schema';

interface CreateBatchFormProps {
    onSubmit: (values: CreateBatchFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export interface CreateBatchFormValues {
    batchName: string;
    startYear: string;
    endYear: string;
}

const CreateBatchForm: React.FC<CreateBatchFormProps> = ({
    onSubmit,
    isLoading = false,
}) => {
    const initialValues: CreateBatchFormValues = {
        batchName: '',
        startYear: '',
        endYear: '',
    };

    const handleSubmit = async (
        values: CreateBatchFormValues,
        { setSubmitting }: any
    ) => {
        try {
            await onSubmit(values);
        } catch (error: any) {
            console.error('Create batch error:', error);
            toast.error(error?.data?.message || 'Failed to create batch');
        } finally {
            setSubmitting(false);
        }

    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={createBatchValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => {
                    // Auto-generate batch name when both years are filled
                    useEffect(() => {
                        if (values.startYear && values.endYear) {
                            const generatedBatchName = `${values.startYear}-${values.endYear}`;
                            if (values.batchName !== generatedBatchName) {
                                setFieldValue('batchName', generatedBatchName);
                            }
                        }
                    }, [values.startYear, values.endYear, values.batchName, setFieldValue]);

                    return (
                        <>
                            <Form>
                                <div className="space-y-4">
                                    <InputField
                                        id="startYear"
                                        name="startYear"
                                        type="text"
                                        label="Start Year"
                                        placeholder="e.g., 2020"
                                        value={values.startYear}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.startYear}
                                        touched={touched.startYear}
                                        required
                                        disabled={isSubmitting || isLoading}
                                    />

                                    <InputField
                                        id="endYear"
                                        name="endYear"
                                        type="text"
                                        label="End Year"
                                        placeholder="e.g., 2024"
                                        value={values.endYear}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.endYear}
                                        touched={touched.endYear}
                                        required
                                        disabled={isSubmitting || isLoading}
                                    />

                                    <InputField
                                        id="batchName"
                                        name="batchName"
                                        type="text"
                                        label="Batch Name"
                                        placeholder="Auto-generated (e.g., 2020-2024)"
                                        value={values.batchName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.batchName}
                                        touched={touched.batchName}
                                        required
                                        disabled={true}
                                    />

                                    <div className="flex justify-end pt-4">
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="md"
                                            loading={isSubmitting || isLoading}
                                            disabled={isSubmitting || isLoading}
                                        >
                                            {isSubmitting || isLoading ? '' : 'Create'}
                                        </Button>
                                    </div>
                                </div>
                            </Form>
                        </>
                    );
                }}
            </Formik>
        </>
    );
};

export default CreateBatchForm;