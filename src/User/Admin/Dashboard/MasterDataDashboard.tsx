import { useState, useEffect } from 'react';
import { LayoutList, CalendarRange, GraduationCap, Layers3 } from 'lucide-react';
import Modal from '../../../Common/UI/Modal';
import { createBatch, createBranch, createCourse, createSection, getBranchesByCourse, getCoursesByBatch, getSectionsByBranch } from '../../../Services/Admin/adminAPI';
import { CreateBatchRequest, CreateBranchRequest, CreateCourseRequest, CreateSectionRequest } from '../../../Types/admin.types';
import Spinner from '../../../Common/UI/Spinner';

interface FormData {
    batch: {
        startYear: string;
        endYear: string;
    };
    course: {
        name: string;
        fullName: string;
        batchId: string;
        totalSemesters: string;
        durationYears: string;
        courseType: string;
    };
    branch: {
        name: string;
        code: string;
        courseId: string;
    };
    section: {
        name: string;
        branchId: string;
        capacity: string;
    };
}

interface LoadingStates {
    batch: boolean;
    course: boolean;
    branch: boolean;
    section: boolean;
    courses: boolean;
    branches: boolean;
    sections: boolean;
}

interface Options {
    batches: Array<{ value: string; label: string }>;
    courses: Array<{ value: string; label: string }>;
    branches: Array<{ value: string; label: string }>;
    sections: Array<{ value: string; label: string }>;
}

interface Errors {
    [key: string]: string;
}

interface Touched {
    [key: string]: boolean;
}

const MasterDataDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeEntityKey, setActiveEntityKey] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        batch: {
            startYear: '',
            endYear: ''
        },
        course: {
            name: '',
            fullName: '',
            batchId: '',
            totalSemesters: '',
            durationYears: '',
            courseType: ''
        },
        branch: {
            name: '',
            code: '',
            courseId: ''
        },
        section: {
            name: '',
            branchId: '',
            capacity: ''
        }
    });

    const [loadingStates, setLoadingStates] = useState<LoadingStates>({
        batch: false,
        course: false,
        branch: false,
        section: false,
        courses: false,
        branches: false,
        sections: false
    });

    const [options, setOptions] = useState<Options>({
        batches: [],
        courses: [],
        branches: [],
        sections: []
    });

    const [errors, setErrors] = useState<Errors>({});
    const [touched, setTouched] = useState<Touched>({});

    const entities = [
        { key: 'batch', title: 'Batch', total: 10, icon: CalendarRange },
        { key: 'course', title: 'Course', total: 14, icon: GraduationCap },
        { key: 'branch', title: 'Branch', total: 20, icon: Layers3 },
        { key: 'section', title: 'Section', total: 16, icon: LayoutList }
    ];

    const courseTypeOptions = [
        { value: 'UNDERGRADUATE', label: 'Undergraduate' },
        { value: 'POSTGRADUATE', label: 'Postgraduate' },
        { value: 'DIPLOMA', label: 'Diploma' },
        { value: 'CERTIFICATE', label: 'Certificate' }
    ];

    // Load courses when batch is selected
    useEffect(() => {
        if (formData.course.batchId) {
            loadCoursesByBatch(formData.course.batchId);
        }
    }, [formData.course.batchId]);

    // Load branches when course is selected
    useEffect(() => {
        if (formData.branch.courseId) {
            loadBranchesByCourse(formData.branch.courseId);
        }
    }, [formData.branch.courseId]);

    // Load sections when branch is selected
    useEffect(() => {
        if (formData.section.branchId) {
            loadSectionsByBranch(formData.section.branchId);
        }
    }, [formData.section.branchId]);

    const loadCoursesByBatch = async (batchId: string) => {
        setLoadingStates(prev => ({ ...prev, courses: true }));
        try {
            const response = await getCoursesByBatch(batchId);
            setOptions(prev => ({
                ...prev,
                courses: response.data.map((course: any) => ({
                    value: course._id,
                    label: `${course.name} - ${course.fullName}`
                }))
            }));
        } catch (error) {
            console.error('Error loading courses:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, courses: false }));
        }
    };

    const loadBranchesByCourse = async (courseId: string) => {
        setLoadingStates(prev => ({ ...prev, branches: true }));
        try {
            const response = await getBranchesByCourse(courseId);
            setOptions(prev => ({
                ...prev,
                branches: response.data.map((branch: any) => ({
                    value: branch._id,
                    label: `${branch.name} (${branch.code})`
                }))
            }));
        } catch (error) {
            console.error('Error loading branches:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, branches: false }));
        }
    };

    const loadSectionsByBranch = async (branchId: string) => {
        setLoadingStates(prev => ({ ...prev, sections: true }));
        try {
            const response = await getSectionsByBranch(branchId);
            setOptions(prev => ({
                ...prev,
                sections: response.data.map((section: any) => ({
                    value: section._id,
                    label: section.name
                }))
            }));
        } catch (error) {
            console.error('Error loading sections:', error);
        } finally {
            setLoadingStates(prev => ({ ...prev, sections: false }));
        }
    };

    const handleInputChange = (entityKey: string, field: string) => (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setFormData(prev => ({
            ...prev,
            [entityKey]: {
                ...prev[entityKey as keyof FormData],
                [field]: e.target.value
            }
        }));
        setTouched(prev => ({ ...prev, [`${entityKey}.${field}`]: true }));
    };

    const handleSelectChange = (entityKey: string, field: string) => (
        value: string
    ) => {
        setFormData(prev => ({
            ...prev,
            [entityKey]: {
                ...prev[entityKey as keyof FormData],
                [field]: value
            }
        }));
        setTouched(prev => ({ ...prev, [`${entityKey}.${field}`]: true }));
    };

    const resetForm = () => {
        setFormData({
            batch: { startYear: '', endYear: '' },
            course: { name: '', fullName: '', batchId: '', totalSemesters: '', durationYears: '', courseType: '' },
            branch: { name: '', code: '', courseId: '' },
            section: { name: '', branchId: '', capacity: '' }
        });
        setErrors({});
        setTouched({});
        setOptions(prev => ({ ...prev, courses: [], branches: [], sections: [] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeEntityKey) return;

        const entityKey = activeEntityKey as keyof FormData;
        setLoadingStates(prev => ({ ...prev, [entityKey]: true }));

        try {
            let response;

            switch (activeEntityKey) {
                case 'batch':
                    const batchData: CreateBatchRequest = {
                        startYear: parseInt(formData.batch.startYear),
                        endYear: parseInt(formData.batch.endYear)
                    };
                    response = await createBatch(batchData);
                    break;

                case 'course':
                    const courseData: CreateCourseRequest = {
                        name: formData.course.name,
                        fullName: formData.course.fullName,
                        batchId: formData.course.batchId,
                        totalSemesters: parseInt(formData.course.totalSemesters),
                        durationYears: parseInt(formData.course.durationYears),
                        courseType: formData.course.courseType
                    };
                    response = await createCourse(courseData);
                    break;

                case 'branch':
                    const branchData: CreateBranchRequest = {
                        name: formData.branch.name,
                        code: formData.branch.code,
                        courseId: formData.branch.courseId
                    };
                    response = await createBranch(branchData);
                    break;

                case 'section':
                    const sectionData: CreateSectionRequest = {
                        name: formData.section.name,
                        branchId: formData.section.branchId,
                        capacity: formData.section.capacity ? parseInt(formData.section.capacity) : undefined
                    };
                    response = await createSection(sectionData);
                    break;

                default:
                    throw new Error('Invalid entity type');
            }

            if (response.success) {
                alert(`${activeEntityKey} created successfully!`);
                resetForm();
                setIsModalOpen(false);
                setActiveEntityKey(null);
            } else {
                setErrors({ general: response.message });
            }
        } catch (error: any) {
            console.error(`Error creating ${activeEntityKey}:`, error);
            setErrors({ general: error.response?.data?.message || `Error creating ${activeEntityKey}` });
        } finally {
            setLoadingStates(prev => ({ ...prev, [entityKey]: false }));
        }
    };

    const renderBatchForm = () => (
        <>
            <form onSubmit={handleSubmit} className="space-y-4 px-2">
                <div>
                    <label htmlFor="startYear" className="block text-sm font-medium text-gray-700 mb-1">
                        Start Year<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="startYear"
                        value={formData.batch.startYear}
                        onChange={handleInputChange('batch', 'startYear')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="2024"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="endYear" className="block text-sm font-medium text-gray-700 mb-1">
                        End Year<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="endYear"
                        value={formData.batch.endYear}
                        onChange={handleInputChange('batch', 'endYear')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="2027"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="submit"
                        disabled={loadingStates.batch}
                        className="px-4 py-1 bg-primary text-white rounded-md cursor-pointer"
                    >
                        {loadingStates.batch ? <Spinner /> : 'Create'}
                    </button>
                </div>
            </form>
        </>
    );

    const renderCourseForm = () => (
        <>
            <form onSubmit={handleSubmit} className="space-y-4 px-2">
                <div>
                    <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-1">
                        Batch
                    </label>
                    {/* <CommonSelect
                        id="batchId"
                        label=""
                        options={options.batches}
                        value={formData.course.batchId}
                        onChange={handleSelectChange('course', 'batchId')}
                        required
                        loading={loadingStates.courses}
                        error={touched['course.batchId'] && errors['course.batchId'] ? errors['course.batchId'] : undefined}
                    /> */}
                </div>
                <div>
                    <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="courseName"
                        value={formData.course.name}
                        onChange={handleInputChange('course', 'name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="B.Sc"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="courseFullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="courseFullName"
                        value={formData.course.fullName}
                        onChange={handleInputChange('course', 'fullName')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="Bachelor of Science"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="totalSemesters" className="block text-sm font-medium text-gray-700 mb-1">
                        Total Semesters<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="totalSemesters"
                        value={formData.course.totalSemesters}
                        onChange={handleInputChange('course', 'totalSemesters')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="6"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="durationYears" className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (Years)<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="durationYears"
                        value={formData.course.durationYears}
                        onChange={handleInputChange('course', 'durationYears')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="3"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="courseType" className="block text-sm font-medium text-gray-700 mb-1">
                        Course Type
                    </label>
                    {/* <CommonSelect
                        id="courseType"
                        label=""
                        options={courseTypeOptions}
                        value={formData.course.courseType}
                        onChange={handleSelectChange('course', 'courseType')}
                        required
                        error={touched['course.courseType'] && errors['course.courseType'] ? errors['course.courseType'] : undefined}
                    /> */}
                </div>
                {errors.general && (
                    <div className="text-red-600 text-sm">{errors.general}</div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="submit"
                        disabled={loadingStates.course}
                        className="px-4 py-1 bg-primary text-white rounded-md cursor-pointer"
                    >
                        {loadingStates.course ? <Spinner /> : 'Create'}
                    </button>
                </div>
            </form>
        </>
    );

    const renderBranchForm = () => (
        <>
            <form onSubmit={handleSubmit} className="space-y-4 px-2">
                <div>
                    <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-1">
                        Course<span className="text-red-500">*</span>
                    </label>
                    {/* <CommonSelect
                        id="courseId"
                        label=""
                        options={options.courses}
                        value={formData.branch.courseId}
                        onChange={handleSelectChange('branch', 'courseId')}
                        required
                        loading={loadingStates.courses}
                        error={touched['branch.courseId'] && errors['branch.courseId'] ? errors['branch.courseId'] : undefined}
                    /> */}
                </div>
                <div>
                    <label htmlFor="branchName" className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="branchName"
                        value={formData.branch.name}
                        onChange={handleInputChange('branch', 'name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="Computer Science"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="branchCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Branch Code<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="branchCode"
                        value={formData.branch.code}
                        onChange={handleInputChange('branch', 'code')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="CS"
                        required
                    />
                </div>
                {errors.general && (
                    <div className="text-red-600 text-sm">{errors.general}</div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="submit"
                        disabled={loadingStates.branch}
                        className="px-4 py-1 bg-primary text-white rounded-md cursor-pointer"
                    >
                        {loadingStates.branch ? <Spinner /> : 'Create'}
                    </button>
                </div>
            </form>
        </>
    );

    const renderSectionForm = () => (
        <>
            <form onSubmit={handleSubmit} className="space-y-4 px-2">
                <div>
                    <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-1">
                        Branch
                    </label>
                    {/* <CommonSelect
                        id="branchId"
                        label=""
                        options={options.branches}
                        value={formData.section.branchId}
                        onChange={handleSelectChange('section', 'branchId')}
                        required
                        loading={loadingStates.branches}
                        error={touched['section.branchId'] && errors['section.branchId'] ? errors['section.branchId'] : undefined}
                    /> */}
                </div>
                <div>
                    <label htmlFor="sectionName" className="block text-sm font-medium text-gray-700 mb-1">
                        Section Name<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="sectionName"
                        value={formData.section.name}
                        onChange={handleInputChange('section', 'name')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="A"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="capacity" className="block text-sm font-medium text-gray-700 mb-1">
                        Capacity<span className="text-red-500">*</span>
                    </label>
                    <input
                        type="number"
                        id="capacity"
                        value={formData.section.capacity}
                        onChange={handleInputChange('section', 'capacity')}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                        placeholder="60"
                    />
                </div>
                {errors.general && (
                    <div className="text-red-600 text-sm">{errors.general}</div>
                )}
                <div className="flex justify-end space-x-3 pt-4">
                    <button
                        type="submit"
                        disabled={loadingStates.section}
                        className="px-4 py-1 bg-primary text-white rounded-md cursor-pointer"
                    >
                        {loadingStates.section ? <Spinner /> : 'Create'}
                    </button>
                </div>
            </form>
        </>
    );

    const renderForm = () => {
        switch (activeEntityKey) {
            case 'batch':
                return renderBatchForm();
            case 'course':
                return renderCourseForm();
            case 'branch':
                return renderBranchForm();
            case 'section':
                return renderSectionForm();
            default:
                return <div>Unknown form type</div>;
        }
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Master Data</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {entities.map((entity) => {
                            const IconComponent = entity.icon;
                            return (
                                <div key={entity.key} className="bg-white rounded-md shadow-md border border-gray-300">
                                    <div className="flex items-center justify-evenly border-b border-gray-300">
                                        <IconComponent className="w-8 h-8 text-gray-600" />
                                        <div className="w-px h-24 bg-gray-300 mx-2"></div>
                                        <div>
                                            <p className="font-medium text-3xl text-gray-600">{entity.total}</p>
                                            <p className="text-[10px] text-gray-600">{entity.title}</p>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{entity.title}</h3>
                                        <div className="space-y-2">
                                            <button
                                                className="w-full bg-primary text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 cursor-pointer"
                                                onClick={() => {
                                                    setActiveEntityKey(entity.key);
                                                    setIsModalOpen(true);
                                                    resetForm();
                                                }}
                                            >
                                                <span>Create {entity.title}</span>
                                            </button>

                                            <button
                                                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md flex items-center justify-center space-x-2 cursor-pointer"
                                            >
                                                <span>View {entity.title}</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Modal */}
                {isModalOpen && activeEntityKey && (
                    <Modal
                        isOpen={isModalOpen}
                        onClose={() => {
                            setIsModalOpen(false);
                            setActiveEntityKey(null);
                            resetForm();
                        }}
                        title={`Create ${entities.find(e => e.key === activeEntityKey)?.title || ''}`}
                        size="md"
                    >
                        {renderForm()}
                    </Modal>
                )}
            </div>
        </>
    );
};

export default MasterDataDashboard;