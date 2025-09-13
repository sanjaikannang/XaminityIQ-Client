import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Field, Form, Formik } from 'formik';
import Spinner from '../../../../../../Common/UI/Spinner';
import { CourseType } from '../../../../../../Utils/enum';
import CommonSelect from '../../../../../../Common/UI/CustomSelect';
import { CreateCourseRequest } from '../../../../../../Types/admin.types';
import { createCourseSchema } from '../../../../FormikSchema/create-course.schema';
import { createCourse, getAllBatch } from '../../../../../../Services/Admin/adminAPI';


interface CourseFormProps {
    onSuccess: () => void;
}

interface CourseFormData {
    batchId: string;
    name: string;
    fullName: string;
    totalSemesters: number | '';
    durationYears: number | '';
    courseType: string;
}

interface BatchOption {
    value: string;
    label: string;
}

const CourseForm = ({ onSuccess }: CourseFormProps) => {
    const [batches, setBatches] = useState<BatchOption[]>([]);
    const [batchesLoading, setBatchesLoading] = useState(false);

    const courseTypeOptions = [
        { value: CourseType.UG, label: 'Undergraduate' },
        { value: CourseType.PG, label: 'Postgraduate' },
        { value: CourseType.DIPLOMA, label: 'Diploma' },
        { value: CourseType.PHD, label: 'Ph.D.' },
        { value: CourseType.MPhil, label: 'M.Phil' }
    ];

    const initialValues: CourseFormData = {
        batchId: '',
        name: '',
        fullName: '',
        totalSemesters: '',
        durationYears: '',
        courseType: ''
    };

    // Load all batches on component mount
    useEffect(() => {
        loadAllBatches();
    }, []);

    const loadAllBatches = async () => {
        setBatchesLoading(true);
        try {
            const response = await getAllBatch();
            if (response.success && response.data) {
                const batchOptions = response.data.map((batch: any) => ({
                    value: batch._id,
                    label: batch.name
                }));
                setBatches(batchOptions);
            }
        } catch (error) {
            console.error('Error loading batches:', error);
            toast.error('Failed to load batches');
        } finally {
            setBatchesLoading(false);
        }
    };

    const handleSubmit = async (values: CourseFormData, { setSubmitting, setFieldError }: any) => {
        try {
            const courseData: CreateCourseRequest = {
                name: values.name,
                fullName: values.fullName,
                batchId: values.batchId,
                totalSemesters: Number(values.totalSemesters),
                durationYears: Number(values.durationYears),
                courseType: values.courseType as CourseType
            };

            const response = await createCourse(courseData);

            if (response.success) {
                toast.success('Course created successfully!');
                onSuccess();
            } else {
                toast.error(response.message || 'Error creating course');
            }
        } catch (error: any) {
            console.error('Error creating course:', error);
            const errorMessage = error.response?.data?.message || 'Error creating course';
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
                validationSchema={createCourseSchema}
                onSubmit={handleSubmit}
            >
                {({ isSubmitting, errors, touched, values, setFieldValue }) => (
                    <Form className="space-y-4 px-2">
                        <div>
                            <CommonSelect
                                id="batchId"
                                label="Batch"
                                options={batches}
                                value={values.batchId}
                                onChange={(value) => setFieldValue('batchId', value)}
                                required
                                loading={batchesLoading}
                                error={touched.batchId && errors.batchId ? errors.batchId : undefined}
                                placeholder="Select a batch"
                            />
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Course Name<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="text"
                                name="name"
                                id="name"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="B.Sc"
                            />
                            {errors.name && touched.name && (
                                <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name<span className="text-red-500">*</span>
                            </label>
                            <Field
                                type="text"
                                name="fullName"
                                id="fullName"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                placeholder="Bachelor of Science"
                            />
                            {errors.fullName && touched.fullName && (
                                <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="totalSemesters" className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Semesters<span className="text-red-500">*</span>
                                </label>
                                <Field
                                    type="number"
                                    name="totalSemesters"
                                    id="totalSemesters"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    placeholder="6"
                                />
                                {errors.totalSemesters && touched.totalSemesters && (
                                    <p className="text-xs text-red-600 mt-1">{errors.totalSemesters}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="durationYears" className="block text-sm font-medium text-gray-700 mb-1">
                                    Duration (Years)<span className="text-red-500">*</span>
                                </label>
                                <Field
                                    type="number"
                                    name="durationYears"
                                    id="durationYears"
                                    step="0.5"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                    placeholder="3"
                                />
                                {errors.durationYears && touched.durationYears && (
                                    <p className="text-xs text-red-600 mt-1">{errors.durationYears}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <CommonSelect
                                id="courseType"
                                label="Course Type"
                                options={courseTypeOptions}
                                value={values.courseType}
                                onChange={(value) => setFieldValue('courseType', value)}
                                required
                                error={touched.courseType && errors.courseType ? errors.courseType : undefined}
                                placeholder="Select course type"
                            />
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

export default CourseForm;