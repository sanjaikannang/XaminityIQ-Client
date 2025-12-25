import React from 'react';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import Button from '../../../../common/ui/Button';
import { CourseInfo } from '../../../../types/academics-types';
import Select, { SelectOption } from '../../../../common/ui/Select';
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

    // Convert CourseInfo[] to SelectOption[]
    const courseOptions: SelectOption[] = availableCourses.map((course) => ({
        value: course._id,
        label: `${course.courseCode} - ${course.courseName}`,
    }));

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
                            <Select
                                id="courseId"
                                name="courseId"
                                label="Select Course"
                                options={courseOptions}
                                value={values.courseId}
                                onChange={(value) => setFieldValue('courseId', value)}
                                onBlur={() => setFieldTouched('courseId', true)}
                                placeholder={isLoadingCourses ? 'Loading courses...' : 'Select a course'}
                                required
                                loading={isLoadingCourses}
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