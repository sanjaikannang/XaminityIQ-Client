import React, { useEffect, useState } from 'react';
import { FormikProps } from 'formik';
import { CreateExamFormValues } from '../../../../FormikSchema/create-exam.schema';

interface ExamAssignmentProps {
    formik: FormikProps<CreateExamFormValues>;
}

// These would typically come from your API or Redux store
interface DropdownOption {
    id: string;
    name: string;
}

const ExamAssignment: React.FC<ExamAssignmentProps> = ({ formik }) => {
    const { values, errors, touched, handleChange, handleBlur, setFieldValue } = formik;

    // State for dropdown options - you would fetch these from your API
    const [batches, setBatches] = useState<DropdownOption[]>([]);
    const [courses, setCourses] = useState<DropdownOption[]>([]);
    const [branches, setBranches] = useState<DropdownOption[]>([]);
    const [sections, setSections] = useState<DropdownOption[]>([]);
    const [faculty, setFaculty] = useState<DropdownOption[]>([]);

    // Mock data - replace with actual API calls
    useEffect(() => {
        // Fetch options from API
        setBatches([
            { id: '507f1f77bcf86cd799439011', name: 'Batch 2024-A' },
            { id: '507f1f77bcf86cd799439012', name: 'Batch 2024-B' },
        ]);

        setCourses([
            { id: '507f1f77bcf86cd799439021', name: 'Computer Science' },
            { id: '507f1f77bcf86cd799439022', name: 'Mathematics' },
        ]);

        setBranches([
            { id: '507f1f77bcf86cd799439031', name: 'Main Branch' },
            { id: '507f1f77bcf86cd799439032', name: 'Secondary Branch' },
        ]);

        setSections([
            { id: '507f1f77bcf86cd799439041', name: 'Section A' },
            { id: '507f1f77bcf86cd799439042', name: 'Section B' },
        ]);

        setFaculty([
            { id: '507f1f77bcf86cd799439051', name: 'Dr. John Smith' },
            { id: '507f1f77bcf86cd799439052', name: 'Dr. Jane Doe' },
        ]);
    }, []);

    // Handle section selection
    const handleSectionChange = (sectionId: string, isChecked: boolean) => {
        const currentSections = values.sectionIds || [];
        let updatedSections;

        if (isChecked) {
            updatedSections = [...currentSections, sectionId];
        } else {
            updatedSections = currentSections.filter(id => id !== sectionId);
        }

        setFieldValue('sectionIds', updatedSections);
    };

    // Handle faculty assignment
    const handleFacultyChange = (facultyId: string, isChecked: boolean) => {
        const currentFaculty = values.assignedFacultyIds || [];
        let updatedFaculty;

        if (isChecked) {
            updatedFaculty = [...currentFaculty, facultyId];
        } else {
            updatedFaculty = currentFaculty.filter(id => id !== facultyId);
        }

        setFieldValue('assignedFacultyIds', updatedFaculty);
    };

    return (
        <>
            <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Batch Selection */}
                    <div>
                        <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-2">
                            Batch *
                        </label>
                        <select
                            id="batchId"
                            name="batchId"
                            value={values.batchId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.batchId && touched.batchId ? 'border-red-500' : ''
                                }`}
                        >
                            <option value="">Select Batch</option>
                            {batches.map(batch => (
                                <option key={batch.id} value={batch.id}>
                                    {batch.name}
                                </option>
                            ))}
                        </select>
                        {errors.batchId && touched.batchId && (
                            <p className="mt-1 text-sm text-red-600">{errors.batchId}</p>
                        )}
                    </div>

                    {/* Course Selection */}
                    <div>
                        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-2">
                            Course *
                        </label>
                        <select
                            id="courseId"
                            name="courseId"
                            value={values.courseId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.courseId && touched.courseId ? 'border-red-500' : ''
                                }`}
                        >
                            <option value="">Select Course</option>
                            {courses.map(course => (
                                <option key={course.id} value={course.id}>
                                    {course.name}
                                </option>
                            ))}
                        </select>
                        {errors.courseId && touched.courseId && (
                            <p className="mt-1 text-sm text-red-600">{errors.courseId}</p>
                        )}
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-2">
                            Branch *
                        </label>
                        <select
                            id="branchId"
                            name="branchId"
                            value={values.branchId}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary focus:border-primary ${errors.branchId && touched.branchId ? 'border-red-500' : ''
                                }`}
                        >
                            <option value="">Select Branch</option>
                            {branches.map(branch => (
                                <option key={branch.id} value={branch.id}>
                                    {branch.name}
                                </option>
                            ))}
                        </select>
                        {errors.branchId && touched.branchId && (
                            <p className="mt-1 text-sm text-red-600">{errors.branchId}</p>
                        )}
                    </div>
                </div>

                {/* Section Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sections (Optional)
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {sections.map(section => (
                            <div key={section.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`section-${section.id}`}
                                    checked={(values.sectionIds || []).includes(section.id)}
                                    onChange={(e) => handleSectionChange(section.id, e.target.checked)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label htmlFor={`section-${section.id}`} className="ml-2 text-sm text-gray-700">
                                    {section.name}
                                </label>
                            </div>
                        ))}
                    </div>
                    {errors.sectionIds && touched.sectionIds && (
                        <p className="mt-1 text-sm text-red-600">{errors.sectionIds}</p>
                    )}
                </div>

                {/* Faculty Assignment - Only show for PROCTORING mode */}
                {values.examMode === 'PROCTORING' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Assigned Faculty *
                        </label>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {faculty.map(facultyMember => (
                                <div key={facultyMember.id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={`faculty-${facultyMember.id}`}
                                        checked={(values.assignedFacultyIds || []).includes(facultyMember.id)}
                                        onChange={(e) => handleFacultyChange(facultyMember.id, e.target.checked)}
                                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                    />
                                    <label htmlFor={`faculty-${facultyMember.id}`} className="ml-2 text-sm text-gray-700">
                                        {facultyMember.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.assignedFacultyIds && touched.assignedFacultyIds && (
                            <p className="mt-1 text-sm text-red-600">{errors.assignedFacultyIds}</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
};

export default ExamAssignment;