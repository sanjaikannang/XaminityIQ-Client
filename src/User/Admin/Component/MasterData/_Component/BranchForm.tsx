import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Field, Form, Formik } from 'formik';
import Spinner from '../../../../../Common/UI/Spinner';
import CommonSelect from '../../../../../Common/UI/CustomSelect';
import { CreateBranchRequest } from '../../../../../Types/admin.types';
import { createBranchSchema } from '../../../FormikSchema/create-branch.schema';
import { createBranch, getAllCourses } from '../../../../../Services/Admin/adminAPI';

interface BranchFormProps {
    onSuccess: () => void;
}

interface BranchFormData {
    name: string;
    code: string;
    courseId: string;
}

interface CourseOption {
    value: string;
    label: string;
}

const BranchForm = ({ onSuccess }: BranchFormProps) => {
    const [courses, setCourses] = useState<CourseOption[]>([]);
    const [coursesLoading, setCoursesLoading] = useState(false);

    const initialValues: BranchFormData = {
        name: '',
        code: '',
        courseId: ''
    };

    // Load all courses on component mount
    useEffect(() => {
        loadAllCourses();
    }, []);

    const loadAllCourses = async () => {
        setCoursesLoading(true);
        try {
            const response = await getAllCourses();
            if (response.success && response.data) {
                const courseOptions = response.data.map((course: any) => ({
                    value: course._id || course.id,
                    label: course.name
                }));
                setCourses(courseOptions);
            }
        } catch (error) {
            console.error('Error loading courses:', error);
            toast.error('Failed to load courses');
        } finally {
            setCoursesLoading(false);
        }
    };

    const handleSubmit = async (values: BranchFormData, { setSubmitting, setFieldError }: any) => {
        try {
            const branchData: CreateBranchRequest = {
                name: values.name,
                code: values.code,
                courseId: values.courseId
            };

            const response = await createBranch(branchData);

            if (response.success) {
                toast.success('Branch created successfully!');
                onSuccess();
            } else {
                toast.error(response.message || 'Error creating branch');
            }
        } catch (error: any) {
            console.error('Error creating branch:', error);
            const errorMessage = error.response?.data?.message || 'Error creating branch';
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
                validationSchema={createBranchSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                    <Form className="space-y-4 px-2">
                        <div>
                            <CommonSelect
                                id="courseId"
                                label="Course"
                                options={courses}
                                value={values.courseId}
                                onChange={(value) => setFieldValue('courseId', value)}
                                required
                                loading={coursesLoading}
                                error={touched.courseId && errors.courseId ? errors.courseId : undefined}
                                placeholder="Select a course"
                            />
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Branch Name<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="text"
                                name="name"
                                id="name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="Computer Science"
                            />
                            {errors.name && touched.name && (
                                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                                Branch Code<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="text"
                                name="code"
                                id="code"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="CS"
                            />
                            {errors.code && touched.code && (
                                <p className="text-xs text-red-600 mt-1">{errors.code}</p>
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

export default BranchForm;