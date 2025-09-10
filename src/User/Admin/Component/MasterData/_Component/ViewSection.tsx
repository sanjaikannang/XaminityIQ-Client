import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllSections } from '../../../../../Services/Admin/adminAPI';

interface Section {
    _id: string;
    name: string;
    branchId: string;
    capacity: number;
    status: string;
}

const ViewSection = () => {
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadSections();
    }, []);

    const loadSections = async () => {
        setLoading(true);
        try {
            const response = await getAllSections();
            if (response.success && response.data) {
                setSections(response.data);
            } else {
                toast.error('Failed to load sections');
            }
        } catch (error) {
            console.error('Error loading sections:', error);
            toast.error('Failed to load sections');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="max-w-9xl mx-auto">
                    {/* Header Skeleton */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
                            </div>
                        </div>
                    </div>

                    {/* Cards Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white rounded-md shadow-xs border border-gray-300">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-full">
                                            <div className="h-6 w-1/4 bg-gray-300 rounded animate-pulse mb-2"></div>
                                            <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse mb-3"></div>
                                        </div>
                                        <div className="h-6 w-16 bg-gray-300 rounded-full animate-pulse ml-2"></div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="h-4 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="max-w-9xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-semibold text-gray-900">All Sections</h1>                               
                            </div>
                        </div>
                    </div>

                    {sections.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-2">No sections found</div>
                            <div className="text-gray-400 text-sm">Start by adding your first section</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {sections.map((section) => (
                                <div key={section._id} className="bg-white rounded-md shadow-xs border border-gray-300 hover:scale-105 duration-300 hover:shadow-md">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h3 className="text-xl font-medium text-gray-900">Section {section.name}</h3>
                                                </div>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium ${section.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {section.status}
                                            </span>
                                        </div>

                                        <div className="space-y-3 text-sm text-gray-600">
                                            <div className="flex justify-between items-center">
                                                <span>Max Capacity</span>
                                                <span className="font-semibold text-gray-900">{section.capacity} Students</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewSection;