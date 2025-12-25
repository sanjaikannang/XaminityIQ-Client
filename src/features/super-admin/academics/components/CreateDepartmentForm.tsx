import React from 'react';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import Button from '../../../../common/ui/Button';
import InputField from '../../../../common/ui/Input';
import { DepartmentInfo } from '../../../../types/academics-types';
import Select, { SelectOption } from '../../../../common/ui/Select';
import { createDepartmentValidationSchema } from '../formik/create-department.schema';

interface CreateDepartmentFormProps {
    availableDepartments: DepartmentInfo[];
    onSubmit: (values: CreateDepartmentFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
    isLoadingDepartments?: boolean;
}

export interface CreateDepartmentFormValues {
    deptId: string;
    totalSeats: number | string;
    sectionCapacity?: number | string;
}

const CreateDepartmentForm: React.FC<CreateDepartmentFormProps> = ({
    availableDepartments,
    onSubmit,
    isLoading = false,
    isLoadingDepartments = false,
}) => {
    const initialValues: CreateDepartmentFormValues = {
        deptId: '',
        totalSeats: '',
        sectionCapacity: '',
    };

    const handleSubmit = async (
        values: CreateDepartmentFormValues,
        { setSubmitting }: any
    ) => {
        try {
            // Convert string values to numbers before submitting
            const submitValues = {
                deptId: values.deptId,
                totalSeats: Number(values.totalSeats),
                ...(values.sectionCapacity && { sectionCapacity: Number(values.sectionCapacity) }),
            };
            await onSubmit(submitValues as any);
        } catch (error: any) {
            console.error('Add department error:', error);
            toast.error(error?.data?.message || 'Failed to add department');
        } finally {
            setSubmitting(false);
        }
    };

    // Convert DepartmentInfo[] to SelectOption[]
    const departmentOptions: SelectOption[] = availableDepartments.map((dept) => ({
        value: dept._id,
        label: `${dept.deptCode} - ${dept.deptName}`,
    }));

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={createDepartmentValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue, setFieldTouched, handleChange, handleBlur, isSubmitting }) => (
                    <Form>
                        <div className="space-y-4">
                            {/* Department Selection Dropdown */}
                            <Select
                                id="deptId"
                                name="deptId"
                                label="Select Department"
                                options={departmentOptions}
                                value={values.deptId}
                                onChange={(value) => setFieldValue('deptId', value)}
                                onBlur={() => setFieldTouched('deptId', true)}
                                placeholder={isLoadingDepartments ? 'Loading departments...' : 'Select a department'}
                                required
                                loading={isLoadingDepartments}
                                disabled={isSubmitting || isLoading || isLoadingDepartments}
                                error={errors.deptId}
                                touched={touched.deptId}
                            />

                            {/* Total Seats Input */}
                            <InputField
                                id="totalSeats"
                                name="totalSeats"
                                type="number"
                                label="Total Seats"
                                placeholder="e.g., 60"
                                value={values.totalSeats}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.totalSeats}
                                touched={touched.totalSeats}
                                required
                                disabled={isSubmitting || isLoading}
                            />

                            {/* Section Capacity Input */}
                            <InputField
                                id="sectionCapacity"
                                name="sectionCapacity"
                                type="number"
                                label="Section Capacity (Optional)"
                                placeholder="e.g., 30"
                                value={values.sectionCapacity}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                error={errors.sectionCapacity}
                                touched={touched.sectionCapacity}
                                disabled={isSubmitting || isLoading}
                            />

                            {/* Action Buttons */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    loading={isSubmitting || isLoading}
                                    disabled={isSubmitting || isLoading || isLoadingDepartments}
                                >
                                    {isSubmitting || isLoading ? '' : 'Add'}
                                </Button>
                            </div>
                        </div>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default CreateDepartmentForm;