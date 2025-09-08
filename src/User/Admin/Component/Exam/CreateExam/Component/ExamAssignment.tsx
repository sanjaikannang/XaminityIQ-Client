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
import { Form, Formik } from "formik";
import { examAssignmentSchema } from "../../../../FormikSchema/create-exam.schema";

interface ExamAssignmentProps {
    examMode: ExamMode;
    onFormDataChange?: (values: FormData, isValid: boolean) => void;
}

interface FormData {
    batchId: string;
    courseId: string;
    branchId: string;
    sectionId: string;
    facultyId: string;
    examMode: ExamMode;
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

const ExamAssignment = ({ examMode, onFormDataChange }: ExamAssignmentProps) => {
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

    const initialValues: FormData = {
        batchId: '',
        courseId: '',
        branchId: '',
        sectionId: '',
        facultyId: '',
        examMode: examMode,
    };

    // Fetch batches and faculties on component mount
    useEffect(() => {
        fetchBatches();
        if (examMode === ExamMode.PROCTORING) {
            fetchFaculties();
        }
    }, [examMode]);

    const handleSubmit = (values: FormData) => {
        console.log('Form values:', values);
    };

    const handleFormChange = (values: FormData, isValid: boolean) => {
        // Send form data to parent component
        if (onFormDataChange) {
            onFormDataChange(values, isValid);
        }
    };


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
        } finally {
            setLoadingStates(prev => ({ ...prev, faculties: false }));
        }
    };

    return (
        <>
            <div className="p-4 space-y-4">

                <Formik
                    initialValues={initialValues}
                    validationSchema={examAssignmentSchema}
                    onSubmit={handleSubmit}
                    validateOnChange={true}
                    validateOnBlur={true}
                    validateOnMount={true}
                    enableReinitialize={true}
                >
                    {({ values, setFieldValue, isValid, errors, touched }) => {

                        // Send form data to parent whenever values change
                        useEffect(() => {
                            handleFormChange(values, isValid);
                        }, [values, isValid]);

                        // Handle dependent dropdowns
                        useEffect(() => {
                            if (values.batchId) {
                                fetchCourses(values.batchId);
                                // Reset dependent fields
                                setFieldValue('courseId', '');
                                setFieldValue('branchId', '');
                                setFieldValue('sectionId', '');
                                setOptions(prev => ({
                                    ...prev,
                                    courses: [],
                                    branches: [],
                                    sections: []
                                }));
                            }
                        }, [values.batchId]);

                        useEffect(() => {
                            if (values.courseId) {
                                fetchBranches(values.courseId);
                                // Reset dependent fields
                                setFieldValue('branchId', '');
                                setFieldValue('sectionId', '');
                                setOptions(prev => ({
                                    ...prev,
                                    branches: [],
                                    sections: []
                                }));
                            }
                        }, [values.courseId]);

                        useEffect(() => {
                            if (values.branchId) {
                                fetchSections(values.branchId);
                                // Reset dependent fields
                                setFieldValue('sectionId', '');
                                setOptions(prev => ({
                                    ...prev,
                                    sections: []
                                }));
                            }
                        }, [values.branchId]);

                        const handleSelectChange = (field: keyof FormData) => (value: string | number) => {
                            setFieldValue(field, value.toString());
                        };

                        return (
                            <Form>
                                <div className="border border-gray-300 rounded-md p-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

                                        {/* Batch Selection */}
                                        <CommonSelect
                                            id="batchId"
                                            label="Batch"
                                            options={options.batches}
                                            value={values.batchId}
                                            onChange={handleSelectChange('batchId')}
                                            required
                                            loading={loadingStates.batches}
                                            error={touched.batchId && errors.batchId ? errors.batchId : undefined}
                                        />

                                        {/* Course Selection */}
                                        <CommonSelect
                                            id="courseId"
                                            label="Course"
                                            options={options.courses}
                                            value={values.courseId}
                                            onChange={handleSelectChange('courseId')}
                                            required
                                            loading={loadingStates.courses}
                                            error={touched.courseId && errors.courseId ? errors.courseId : undefined}
                                            disabled={!values.batchId}
                                        />

                                        {/* Branch Selection */}
                                        <CommonSelect
                                            id="branchId"
                                            label="Branch"
                                            options={options.branches}
                                            value={values.branchId}
                                            onChange={handleSelectChange('branchId')}
                                            required
                                            loading={loadingStates.branches}
                                            error={touched.branchId && errors.branchId ? errors.branchId : undefined}
                                            disabled={!values.courseId}
                                        />

                                        {/* Section Selection */}
                                        <CommonSelect
                                            id="sectionId"
                                            label="Section"
                                            options={options.sections}
                                            value={values.sectionId}
                                            onChange={handleSelectChange('sectionId')}
                                            required
                                            loading={loadingStates.sections}
                                            error={touched.sectionId && errors.sectionId ? errors.sectionId : undefined}
                                            disabled={!values.branchId}
                                        />

                                        {/* Faculty Selection */}
                                        {examMode === ExamMode.PROCTORING && (
                                            <CommonSelect
                                                id="facultyId"
                                                label="Faculty"
                                                options={options.faculties}
                                                value={values.facultyId}
                                                onChange={handleSelectChange('facultyId')}
                                                required
                                                loading={loadingStates.faculties}
                                                error={touched.facultyId && errors.facultyId ? errors.facultyId : undefined}
                                            />
                                        )}

                                    </div>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </>
    );
};

export default ExamAssignment;