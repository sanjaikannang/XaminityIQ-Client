import React from 'react';
import { Field } from 'formik';
import { CreateExamFormValues } from '../../../../../../Types/admin.types';


interface ExamAssignmentStepProps {
    values: CreateExamFormValues;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
}


const ExamAssignmentStep: React.FC<ExamAssignmentStepProps> = ({ errors, touched }) => {
    // Mock data - Replace with actual API calls
    const mockBatches = [
        { _id: '507f1f77bcf86cd799439011', name: 'Batch 2024-A' },
        { _id: '507f1f77bcf86cd799439012', name: 'Batch 2024-B' },
    ];

    const mockCourses = [
        { _id: '507f1f77bcf86cd799439013', name: 'Computer Science Engineering' },
        { _id: '507f1f77bcf86cd799439014', name: 'Information Technology' },
    ];

    const mockBranches = [
        { _id: '507f1f77bcf86cd799439015', name: 'Main Campus' },
        { _id: '507f1f77bcf86cd799439016', name: 'North Campus' },
    ];

    return (
        <>
            <div className="bg-gray-50 border-b border-gray-300 p-4">
                <h3 className="text-lg font-semibold text-gray-800">Target Audience</h3>
            </div>

            <div className="space-y-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Batch */}
                    <div>
                        <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Batch<span className="text-red-500">*</span>
                        </label>
                        <Field
                            as="select"
                            name="batchId"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.batchId && touched.batchId
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        >
                            {mockBatches.map((batch) => (
                                <option key={batch._id} value={batch._id}>
                                    {batch.name}
                                </option>
                            ))}
                        </Field>
                        {errors.batchId && touched.batchId && (
                            <p className="text-[12px] text-red-600">{errors.batchId}</p>
                        )}
                    </div>

                    {/* Course */}
                    <div>
                        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Course<span className="text-red-500">*</span>
                        </label>
                        <Field
                            as="select"
                            name="courseId"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.courseId && touched.courseId
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        >
                            {mockCourses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.name}
                                </option>
                            ))}
                        </Field>
                        {errors.courseId && touched.courseId && (
                            <p className="text-[12px] text-red-600">{errors.courseId}</p>
                        )}
                    </div>

                    {/* Branch */}
                    <div>
                        <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Branch<span className="text-red-500">*</span>
                        </label>
                        <Field
                            as="select"
                            name="branchId"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.branchId && touched.branchId
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        >
                            {mockBranches.map((branch) => (
                                <option key={branch._id} value={branch._id}>
                                    {branch.name}
                                </option>
                            ))}
                        </Field>
                        {errors.branchId && touched.branchId && (
                            <p className="text-[12px] text-red-600">{errors.branchId}</p>
                        )}
                    </div>

                    {/* Section */}
                    <div>
                        <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Section<span className="text-red-500">*</span>
                        </label>
                        <Field
                            as="select"
                            name="sectionId"
                            className={`w-full px-3 py-2 border rounded-md focus:outline-none ${errors.sectionId && touched.sectionId
                                ? 'border-red-500'
                                : 'border-gray-300'
                                }`}
                        >
                        </Field>
                        {errors.sectionId && touched.sectionId && (
                            <p className="text-[12px] text-red-600">{errors.sectionId}</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamAssignmentStep;