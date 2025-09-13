import { useState } from 'react';
import Modal from '../../../Common/UI/Modal';
import { useNavigate } from 'react-router-dom';
import Batch from "../../../assets/Images/batch.png";
import Course from "../../../assets/Images/course.png";
import Branch from "../../../assets/Images/branch.png";
import Section from "../../../assets/Images/section.png";
import BatchForm from '../Component/MasterDataDashboard/components/Batch/BatchForm';
import CourseForm from '../Component/MasterDataDashboard/components/Course/CourseForm';
import BranchForm from '../Component/MasterDataDashboard/components/Branch/BranchForm';
import SectionForm from '../Component/MasterDataDashboard/components/Section/SectionForm';

const MasterDataDashboard = () => {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeEntityKey, setActiveEntityKey] = useState<string | null>(null);

    const entities = [
        { key: 'batch', title: 'Batch', total: 10, image: Batch, viewPath: '/admin/data/view-batch' },
        { key: 'course', title: 'Course', total: 14, image: Course, viewPath: '/admin/data/view-course' },
        { key: 'branch', title: 'Branch', total: 20, image: Branch, viewPath: '/admin/data/view-branch' },
        { key: 'section', title: 'Section', total: 16, image: Section, viewPath: '/admin/data/view-section' }
    ];

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        setActiveEntityKey(null);
    };

    const handleViewClick = (viewPath: string) => {
        navigate(viewPath);
    };

    const renderForm = () => {
        switch (activeEntityKey) {
            case 'batch':
                return <BatchForm onSuccess={handleFormSuccess} />;
            case 'course':
                return <CourseForm onSuccess={handleFormSuccess} />;
            case 'branch':
                return <BranchForm onSuccess={handleFormSuccess} />;
            case 'section':
                return <SectionForm onSuccess={handleFormSuccess} />;
            default:
                return <div>Unknown form type</div>;
        }
    };

    return (
        <>
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="max-w-9xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">Master Data</h1>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {entities.map((entity) => {
                            return (
                                <div key={entity.key} className="bg-white rounded-md shadow-md border border-gray-300">

                                    <div className="border-b border-gray-100">
                                        <img src={entity.image} alt="Batch" className="w-full h-48 object-contain" />
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">{entity.title}</h3>
                                        <div className="space-y-2">
                                            <button
                                                className="w-full bg-primary text-white px-4 py-2 rounded-md flex items-center justify-center space-x-2 cursor-pointer"
                                                onClick={() => {
                                                    setActiveEntityKey(entity.key);
                                                    setIsModalOpen(true);
                                                }}
                                            >
                                                <span>Create {entity.title}</span>
                                            </button>

                                            <button
                                                onClick={() => handleViewClick(entity.viewPath)}
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
