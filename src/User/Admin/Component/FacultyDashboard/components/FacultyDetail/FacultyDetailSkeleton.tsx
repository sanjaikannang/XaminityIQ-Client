export const FacultyDetailSkeleton = () => {
    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-9xl mx-auto p-6">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Profile Card Skeleton */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <div className="flex flex-col items-center">
                                    <div className="w-32 h-32 bg-gray-300 rounded-full animate-pulse mb-4"></div>
                                    <div className="h-6 bg-gray-300 rounded w-32 mb-2 animate-pulse"></div>
                                    <div className="h-4 bg-gray-300 rounded w-24 mb-4 animate-pulse"></div>
                                    <div className="space-y-2 w-full">
                                        {[...Array(4)].map((_, i) => (
                                            <div key={i} className="h-4 bg-gray-300 rounded animate-pulse"></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Cards Skeleton */}
                        <div className="lg:col-span-2 space-y-6">
                            {[...Array(4)].map((_, cardIndex) => (
                                <div key={cardIndex} className="bg-white rounded-lg shadow-md p-6">
                                    <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {[...Array(6)].map((_, i) => (
                                            <div key={i} className="space-y-2">
                                                <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                                                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};