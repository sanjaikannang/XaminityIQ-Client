import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Field, Form, Formik } from 'formik';
import Spinner from '../../../../../../Common/UI/Spinner';
import CommonSelect from '../../../../../../Common/UI/CustomSelect';
import { CreateSectionRequest } from '../../../../../../Types/admin.types';
import { createSectionSchema } from '../../../../FormikSchema/create-section.schema';
import { createSection, getAllBranches } from '../../../../../../Services/Admin/adminAPI';

interface SectionFormProps {
    onSuccess: () => void;
}

interface SectionFormData {
    name: string;
    branchId: string;
    capacity: number | '';
}

interface BranchOption {
    value: string;
    label: string;
}

const SectionForm = ({ onSuccess }: SectionFormProps) => {
    const [branches, setBranches] = useState<BranchOption[]>([]);
    const [branchesLoading, setBranchesLoading] = useState(false);

    const initialValues: SectionFormData = {
        name: '',
        branchId: '',
        capacity: ''
    };

    // Load all branches on component mount
    useEffect(() => {
        loadAllBranches();
    }, []);

    const loadAllBranches = async () => {
        setBranchesLoading(true);
        try {
            const response = await getAllBranches();
            if (response.success && response.data) {
                const branchOptions = response.data.map((branch: any) => ({
                    value: branch._id || branch.id,
                    label: branch.name
                }));
                setBranches(branchOptions);
            }
        } catch (error) {
            console.error('Error loading branches:', error);
            toast.error('Failed to load branches');
        } finally {
            setBranchesLoading(false);
        }
    };

    const handleSubmit = async (values: SectionFormData, { setSubmitting, setFieldError }: any) => {
        try {
            const sectionData: CreateSectionRequest = {
                name: values.name,
                branchId: values.branchId,
                capacity: Number(values.capacity)
            };

            const response = await createSection(sectionData);

            if (response.success) {
                toast.success('Section created successfully!');
                onSuccess();
            } else {
                toast.error(response.message || 'Error creating section');
            }
        } catch (error: any) {
            console.error('Error creating section:', error);
            const errorMessage = error.response?.data?.message || 'Error creating section';
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
                validationSchema={createSectionSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                    <Form className="space-y-4 px-2">
                        <div>
                            <CommonSelect
                                id="branchId"
                                label="Branch"
                                options={branches}
                                value={values.branchId}
                                onChange={(value) => setFieldValue('branchId', value)}
                                required
                                loading={branchesLoading}
                                error={touched.branchId && errors.branchId ? errors.branchId : undefined}
                                placeholder="Select a branch"
                            />
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Section Name<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="text"
                                name="name"
                                id="name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="A"
                            />
                            {errors.name && touched.name && (
                                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                                Capacity<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="number"
                                name="capacity"
                                id="capacity"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="60"
                            />
                            {errors.capacity && touched.capacity && (
                                <p className="text-xs text-red-600 mt-1">{errors.capacity}</p>
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

export default SectionForm;