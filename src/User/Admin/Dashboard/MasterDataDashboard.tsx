import { useState } from 'react';
import { LayoutList, CalendarRange, GraduationCap, Layers3 } from 'lucide-react';
import Modal from '../../../Common/UI/Modal';
import BatchForm from '../Component/MasterData/_Component/BatchForm';
import CourseForm from '../Component/MasterData/_Component/CourseForm';
import BranchForm from '../Component/MasterData/_Component/BranchForm';
import SectionForm from '../Component/MasterData/_Component/SectionForm';


const MasterDataDashboard = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeEntityKey, setActiveEntityKey] = useState<string | null>(null);

    const entities = [
        { key: 'batch', title: 'Batch', total: 10, icon: CalendarRange },
        { key: 'course', title: 'Course', total: 14, icon: GraduationCap },
        { key: 'branch', title: 'Branch', total: 20, icon: Layers3 },
        { key: 'section', title: 'Section', total: 16, icon: LayoutList }
    ];

    const handleFormSuccess = () => {
        setIsModalOpen(false);
        setActiveEntityKey(null);
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