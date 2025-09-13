import toast from 'react-hot-toast';
import { Field, Form, Formik } from 'formik';
import Spinner from '../../../../../../Common/UI/Spinner';
import { createBatch } from '../../../../../../Services/Admin/adminAPI';
import { CreateBatchRequest } from '../../../../../../Types/admin.types';
import { createBatchSchema } from '../../../../FormikSchema/create-batch.schema';

interface BatchFormProps {
    onSuccess: () => void;
}

interface BatchFormData {
    startYear: number | '';
    endYear: number | '';
}

const BatchForm = ({ onSuccess }: BatchFormProps) => {
    const initialValues: BatchFormData = {
        startYear: '',
        endYear: ''
    };

    const handleSubmit = async (values: BatchFormData, { setSubmitting, setFieldError }: any) => {
        try {
            const batchData: CreateBatchRequest = {
                startYear: Number(values.startYear),
                endYear: Number(values.endYear)
            };
            const response = await createBatch(batchData);

            if (response.success) {
                toast.success('Batch created successfully!');
                onSuccess();
            } else {
                toast.error(response.message || 'Error creating batch');
            }
        } catch (error: any) {
            console.error('Error creating batch:', error);
            const errorMessage = error.response?.data?.message || 'Error creating batch';
            toast.error(errorMessage);

            // If there are specific field errors from the API
            if (error.response?.data?.errors) {
                Object.keys(error.response.data.errors).forEach(field => {
                    setFieldError(field, error.response.data.errors[field]);
                });
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={createBatchSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched }) => (
                    <Form className="space-y-4 px-2">
                        <div>
                            <label htmlFor="startYear" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Year<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="number"
                                name="startYear"
                                id="startYear"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="2024"
                            />
                            {errors.startYear && touched.startYear && (
                                <p className="text-xs text-red-600 mt-1">{errors.startYear}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="endYear" className="block text-sm font-medium text-gray-700 mb-1">
                                End Year<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="number"
                                name="endYear"
                                id="endYear"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="2027"
                            />
                            {errors.endYear && touched.endYear && (
                                <p className="text-xs text-red-600 mt-1">{errors.endYear}</p>
                            )}
                        </div>

                        <div className="flex justify-end space-x-3 pt-4">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-4 py-2 bg-primary text-white rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isSubmitting ? <Spinner /> : 'Create'}
                            </button>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default BatchForm;