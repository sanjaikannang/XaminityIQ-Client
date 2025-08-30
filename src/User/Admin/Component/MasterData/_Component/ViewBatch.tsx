import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllBatch } from '../../../../../Services/Admin/adminAPI';

interface Batch {
    _id: string;
    name: string;
    startYear: number;
    endYear: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const ViewBatch = () => {
    const [batches, setBatches] = useState<Batch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBatches();
    }, []);

    const loadBatches = async () => {
        setLoading(true);
        try {
            const response = await getAllBatch();
            if (response.success && response.data) {
                setBatches(response.data);
            } else {
                toast.error('Failed to load batches');
            }
        } catch (error) {
            console.error('Error loading batches:', error);
            toast.error('Failed to load batches');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <div className="p-4 bg-gray-50 min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        {/* Header Skeleton */}
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-2">
                                    <div className="h-8 w-32 bg-gray-300 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>

                        {/* Cards Skeleton */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="bg-white rounded-md shadow-xs border border-gray-300">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div className="w-full">
                                                <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <div className="p-4 bg-gray-50 min-h-screen">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <h1 className="text-2xl font-semibold text-gray-900">All Batches</h1>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {batches.map((batch) => (
                            <div key={batch._id} className="bg-white rounded-md shadow-xs border border-gray-300 hover:scale-105 duration-300">
                                <div className="p-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-1">{batch.name}</h3>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ViewBatch;