import { useState, useEffect } from "react";
import CommonSelect, { SelectOption } from "../../../../../../Common/UI/CustomSelect";
import { ExamMode } from "../../../../../../Utils/enum";
import {
    getAllBatch,
    getCoursesByBatch,
    getBranchesByCourse,
    getSectionsByBranch,
    getAllFaculty,
} from "../../../../../../Services/Admin/adminAPI";

interface ExamAssignmentProps {
    examMode: ExamMode;
}

interface FormData {
    batchId: string;
    courseId: string;
    branchId: string;
    sectionId: string;
    facultyId: string;
}

interface LoadingStates {
    batches: boolean;
    courses: boolean;
    branches: boolean;
    sections: boolean;
    faculties: boolean;
}

interface OptionsState {
    batches: SelectOption[];
    courses: SelectOption[];
    branches: SelectOption[];
    sections: SelectOption[];
    faculties: SelectOption[];
}

const ExamAssignment = ({ examMode }: ExamAssignmentProps) => {
    const [formData, setFormData] = useState<FormData>({
        batchId: '',
        courseId: '',
        branchId: '',
        sectionId: '',
        facultyId: '',
    });

    const [options, setOptions] = useState<OptionsState>({
        batches: [],
        courses: [],
        branches: [],
        sections: [],
        faculties: [],
    });

    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
        batches: false,
        courses: false,
        branches: false,
        sections: false,
        faculties: false,
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});

    // Fetch batches and faculties on component mount
    useEffect(() => {
        fetchBatches();
        if (examMode === ExamMode.PROCTORING) {
            fetchFaculties();
        }
    }, [examMode]);

    // Fetch courses when batch changes
    useEffect(() => {
        if (formData.batchId) {
            fetchCourses(formData.batchId);
            // Reset dependent fields
            setFormData(prev => ({
                ...prev,
                courseId: '',
                branchId: '',
                sectionId: ''
            }));
            setOptions(prev => ({
                ...prev,
                courses: [],
                branches: [],
                sections: []
            }));
        }
    }, [formData.batchId]);

    // Fetch branches when course changes
    useEffect(() => {
        if (formData.courseId) {
            fetchBranches(formData.courseId);
            // Reset dependent fields
            setFormData(prev => ({
                ...prev,
                branchId: '',
                sectionId: ''
            }));
            setOptions(prev => ({
                ...prev,
                branches: [],
                sections: []
            }));
        }
    }, [formData.courseId]);

    // Fetch sections when branch changes
    useEffect(() => {
        if (formData.branchId) {
            fetchSections(formData.branchId);
            // Reset dependent fields
            setFormData(prev => ({
                ...prev,
                sectionId: ''
            }));
            setOptions(prev => ({
                ...prev,
                sections: []
            }));
        }
    }, [formData.branchId]);


    // Get All Batch
    const fetchBatches = async () => {
        setLoadingStates(prev => ({ ...prev, batches: true }));
        try {
            const response = await getAllBatch();
            if (response.success && response.data) {
                const batchOptions: SelectOption[] = response.data.map((batch: { _id: any; name: any; }) => ({
                    value: batch._id,
                    label: batch.name,
                }));
                setOptions(prev => ({ ...prev, batches: batchOptions }));
            }
        } catch (error) {
            console.error('Error fetching batches:', error);
            setErrors(prev => ({ ...prev, batchId: 'Failed to load batches' }));
        } finally {
            setLoadingStates(prev => ({ ...prev, batches: false }));
        }
    };


    // Get Course
    const fetchCourses = async (batchId: string) => {
        setLoadingStates(prev => ({ ...prev, courses: true }));
        try {
            const response = await getCoursesByBatch(batchId);
            if (response.success && response.data) {
                const courseOptions: SelectOption[] = response.data.map((course: { _id: any; fullName: any; name: any; }) => ({
                    value: course._id,
                    label: course.fullName || course.name,
                }));
                setOptions(prev => ({ ...prev, courses: courseOptions }));
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            setErrors(prev => ({ ...prev, courseId: 'Failed to load courses' }));
        } finally {
            setLoadingStates(prev => ({ ...prev, courses: false }));
        }
    };


    // Get Branch
    const fetchBranches = async (courseId: string) => {
        setLoadingStates(prev => ({ ...prev, branches: true }));
        try {
            const response = await getBranchesByCourse(courseId);
            if (response.success && response.data) {
                const branchOptions: SelectOption[] = response.data.map((branch: { _id: any; name: any; code: any; }) => ({
                    value: branch._id,
                    label: `${branch.name} (${branch.code})`,
                }));
                setOptions(prev => ({ ...prev, branches: branchOptions }));
            }
        } catch (error) {
            console.error('Error fetching branches:', error);
            setErrors(prev => ({ ...prev, branchId: 'Failed to load branches' }));
        } finally {
            setLoadingStates(prev => ({ ...prev, branches: false }));
        }
    };


    // Get Section
    const fetchSections = async (branchId: string) => {
        setLoadingStates(prev => ({ ...prev, sections: true }));
        try {
            const response = await getSectionsByBranch(branchId);
            if (response.success && response.data) {
                const sectionOptions: SelectOption[] = response.data.map((section: { _id: any; name: any; }) => ({
                    value: section._id,
                    label: section.name,
                }));
                setOptions(prev => ({ ...prev, sections: sectionOptions }));
            }
        } catch (error) {
            console.error('Error fetching sections:', error);
            setErrors(prev => ({ ...prev, sectionId: 'Failed to load sections' }));
        } finally {
            setLoadingStates(prev => ({ ...prev, sections: false }));
        }
    };


    // Get All Faculty
    const fetchFaculties = async () => {
        setLoadingStates(prev => ({ ...prev, faculties: true }));
        try {
            const response = await getAllFaculty();
            if (response.success && response.data && response.data.faculty) {
                const facultyOptions: SelectOption[] = response.data.faculty.map((faculty: {
                    userId: { _id: any; email: any; };
                    personalInfo: { firstName: any; lastName: any; };
                }) => ({
                    value: faculty.userId._id,
                    label: `${faculty.personalInfo.firstName} ${faculty.personalInfo.lastName}`,
                }));
                setOptions(prev => ({ ...prev, faculties: facultyOptions }));
            }
        } catch (error) {
            console.error('Error fetching faculties:', error);
            setErrors(prev => ({ ...prev, facultyId: 'Failed to load faculties' }));
        } finally {
            setLoadingStates(prev => ({ ...prev, faculties: false }));
        }
    };



    const handleSelectChange = (field: keyof FormData) => (value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value.toString() }));
        // Clear error when user makes a selection
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <>
            <div className="p-4 space-y-4">
                <div className="border border-gray-300 rounded-md p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                        {/* Batch Selection */}
                        <CommonSelect
                            id="batchId"
                            label="Batch"
                            options={options.batches}
                            value={formData.batchId}
                            onChange={handleSelectChange('batchId')}
                            required
                            loading={loadingStates.batches}
                            error={errors.batchId}
                        />

                        {/* Course Selection */}
                        <CommonSelect
                            id="courseId"
                            label="Course"
                            options={options.courses}
                            value={formData.courseId}
                            onChange={handleSelectChange('courseId')}
                            required
                            loading={loadingStates.courses}
                            error={errors.courseId}
                            disabled={!formData.batchId}
                        />

                        {/* Branch Selection */}
                        <CommonSelect
                            id="branchId"
                            label="Branch"
                            options={options.branches}
                            value={formData.branchId}
                            onChange={handleSelectChange('branchId')}
                            required
                            loading={loadingStates.branches}
                            error={errors.branchId}
                            disabled={!formData.courseId}
                        />

                        {/* Section Selection */}
                        <CommonSelect
                            id="sectionId"
                            label="Section"
                            options={options.sections}
                            value={formData.sectionId}
                            onChange={handleSelectChange('sectionId')}
                            required
                            loading={loadingStates.sections}
                            error={errors.sectionId}
                            disabled={!formData.branchId}
                        />

                        {/* Faculty Selection */}
                        {examMode === ExamMode.PROCTORING && (
                            <CommonSelect
                                id="facultyId"
                                label="Faculty"
                                options={options.faculties}
                                value={formData.facultyId}
                                onChange={handleSelectChange('facultyId')}
                                required
                                loading={loadingStates.faculties}
                                error={errors.facultyId}
                            />
                        )}

                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamAssignment;