import React, { useMemo } from 'react';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import Button from '../../../../common/ui/Button';
import { CourseInfo } from '../../../../types/academics-types';
import AsyncSelect, { type AsyncSelectOption } from '../../../../common/ui/AsyncSelect';
import { createCourseValidationSchema } from '../formik/create-course.schema';

interface CreateCourseFormProps {
    availableCourses: CourseInfo[];
    onSubmit: (values: CreateCourseFormValues) => void;
    onCancel: () => void;
    isLoading?: boolean;
    isLoadingCourses?: boolean;
}

export interface CreateCourseFormValues {
    courseId: string;
}

const CreateCourseForm: React.FC<CreateCourseFormProps> = ({
    availableCourses,
    onSubmit,
    isLoading = false,
    isLoadingCourses = false,
}) => {
    const initialValues: CreateCourseFormValues = {
        courseId: '',
    };

    const handleSubmit = async (
        values: CreateCourseFormValues,
        { setSubmitting }: any
    ) => {
        try {
            await onSubmit(values);
        } catch (error: any) {
            console.error('Map course error:', error);
            toast.error(error?.data?.message || 'Failed to add course');
        } finally {
            setSubmitting(false);
        }
    };

    // The parent already fetched the full (unpaginated) available-courses
    // list — loadOptions here just filters that in-memory array client-side.
    const mapOption = (course: CourseInfo): AsyncSelectOption => ({
        value: course._id,
        label: `${course.courseCode} - ${course.courseName}`,
    });

    const loadOptions = useMemo(() => async (search: string) => {
        const filtered = search
            ? availableCourses.filter((course) => mapOption(course).label.toLowerCase().includes(search.toLowerCase()))
            : availableCourses;
        return { options: filtered.map(mapOption), hasMore: false };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [availableCourses]);

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={createCourseValidationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, errors, touched, setFieldValue, setFieldTouched, isSubmitting }) => (
                    <Form>
                        <div className="space-y-4">
                            {/* Course Selection Dropdown */}
                            <AsyncSelect
                                id="courseId"
                                label="Select Course"
                                value={(() => {
                                    const course = availableCourses.find((c) => c._id === values.courseId);
                                    return course ? mapOption(course) : null;
                                })()}
                                loadOptions={loadOptions}
                                onChange={(option) => {
                                    setFieldValue('courseId', option?.value || '');
                                    setFieldTouched('courseId', true);
                                }}
                                placeholder={isLoadingCourses ? 'Loading courses...' : 'Select a course'}
                                required
                                disabled={isSubmitting || isLoading || isLoadingCourses}
                                error={errors.courseId}
                                touched={touched.courseId}
                            />

                            {/* Action Buttons */}
                            <div className="flex justify-end pt-4">
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="md"
                                    loading={isSubmitting || isLoading}
                                    disabled={isSubmitting || isLoading || isLoadingCourses}
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

export default CreateCourseForm;