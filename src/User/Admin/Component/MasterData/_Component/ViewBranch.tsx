import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getAllBranches } from '../../../../../Services/Admin/adminAPI';

interface Branch {
    _id: string;
    name: string;
    code: string;
    courseId: string;
    status: string;
}

const ViewBranch = () => {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        setLoading(true);
        try {
            const response = await getAllBranches();
            if (response.success && response.data) {
                setBranches(response.data);
            } else {
                toast.error('Failed to load branches');
            }
        } catch (error) {
            console.error('Error loading branches:', error);
            toast.error('Failed to load branches');
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
                        {[...Array(3)].map((_, index) => (
                            <div key={index} className="bg-white rounded-md shadow-xs border border-gray-300">
                                <div className="p-4">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-full">
                                            <div className="h-6 w-3/4 bg-gray-300 rounded animate-pulse mb-2"></div>
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
                                <h1 className="text-2xl font-semibold text-gray-900">All Branches</h1>                               
                            </div>
                        </div>
                    </div>

                    {branches.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-500 text-lg mb-2">No branches found</div>
                            <div className="text-gray-400 text-sm">Start by adding your first branch</div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {branches.map((branch) => (
                                <div key={branch._id} className="bg-white rounded-md shadow-xs border border-gray-300 hover:scale-105 duration-300 hover:shadow-md">
                                    <div className="p-4">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{branch.name}</h3>
                                                <p className="text-gray-600 text-sm font-mono bg-gray-100 px-4 py-1 inline-block">
                                                    {branch.code}
                                                </p>
                                            </div>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-xs font-medium ${branch.status === 'Active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {branch.status}
                                            </span>
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

export default ViewBranch;
