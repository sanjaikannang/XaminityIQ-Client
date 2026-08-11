import React, { useMemo } from 'react';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import Button from '../../../../common/ui/Button';
import InputField from '../../../../common/ui/Input';
import { DepartmentInfo } from '../../../../types/academics-types';
import AsyncSelect, { type AsyncSelectOption } from '../../../../common/ui/AsyncSelect';
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

    // The parent already fetched the full (unpaginated) available-departments
    // list — loadOptions here just filters that in-memory array client-side.
    const mapOption = (dept: DepartmentInfo): AsyncSelectOption => ({
        value: dept._id,
        label: `${dept.deptCode} - ${dept.deptName}`,
    });

    const loadOptions = useMemo(() => async (search: string) => {
        const filtered = search
            ? availableDepartments.filter((dept) => mapOption(dept).label.toLowerCase().includes(search.toLowerCase()))
            : availableDepartments;
        return { options: filtered.map(mapOption), hasMore: false };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableDepartments]);

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
                            <AsyncSelect
                                id="deptId"
                                label="Select Department"
                                value={(() => {
                                    const dept = availableDepartments.find((d) => d._id === values.deptId);
                                    return dept ? mapOption(dept) : null;
                                })()}
                                loadOptions={loadOptions}
                                onChange={(option) => {
                                    setFieldValue('deptId', option?.value || '');
                                    setFieldTouched('deptId', true);
                                }}
                                placeholder={isLoadingDepartments ? 'Loading departments...' : 'Select a department'}
                                required
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