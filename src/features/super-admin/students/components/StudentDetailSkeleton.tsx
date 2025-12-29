const StudentDetailSkeleton = () => {
    return (
        <>
            <div className="space-y-6 mb-6">
                {/* Section 1: Profile Header Skeleton */}
                <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                    <div className="flex gap-8 items-start">
                        <div className="w-40 h-40 rounded-xl bg-bgSecondary animate-pulse"></div>

                        <div className="flex-1 self-center">
                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, index) => (
                                    <div key={index} className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primaryLighter animate-pulse flex-shrink-0"></div>
                                        <div className="flex-1">
                                            <div className="h-3 bg-bgSecondary rounded animate-pulse mb-2 w-16"></div>
                                            <div className="h-4 bg-bgSecondary rounded animate-pulse w-24"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 2: Academic & Contact Details Skeleton */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Academic Details Skeleton */}
                    <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 animate-pulse"></div>
                            <div className="h-6 bg-bgSecondary rounded animate-pulse w-40"></div>
                        </div>

                        <div className="space-y-4">
                            {[...Array(7)].map((_, index) => (
                                <div key={index} className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <div className="h-4 bg-bgSecondary rounded animate-pulse w-24"></div>
                                    <div className="h-4 bg-bgSecondary rounded animate-pulse w-32"></div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Contact Details Skeleton */}
                    <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 animate-pulse"></div>
                            <div className="h-6 bg-bgSecondary rounded animate-pulse w-40"></div>
                        </div>

                        <div className="space-y-4">
                            {[...Array(4)].map((_, index) => (
                                <div key={index} className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <div className="h-4 bg-bgSecondary rounded animate-pulse w-24"></div>
                                    <div className="h-4 bg-bgSecondary rounded animate-pulse w-40"></div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-bgSecondary border border-borderDefault rounded-xl p-3 mt-3">
                            <div className="h-4 bg-borderLight rounded animate-pulse w-32 mb-3"></div>
                            <div className="space-y-2">
                                {[...Array(3)].map((_, index) => (
                                    <div key={index} className="flex justify-between">
                                        <div className="h-3 bg-borderLight rounded animate-pulse w-16"></div>
                                        <div className="h-3 bg-borderLight rounded animate-pulse w-24"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: Education History & Address Skeleton */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Education History Skeleton */}
                    <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 animate-pulse"></div>
                            <div className="h-6 bg-bgSecondary rounded animate-pulse w-40"></div>
                        </div>

                        <div className="mt-6 space-y-6">
                            {[...Array(2)].map((_, index) => (
                                <div key={index} className="relative flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-primary/10 animate-pulse"></div>
                                        {index !== 1 && <div className="w-0.5 h-20 bg-borderLight mt-2"></div>}
                                    </div>
                                    <div className="flex-1">
                                        <div className="bg-bgSecondary rounded-xl p-4 border border-borderDefault">
                                            <div className="h-5 bg-borderLight rounded animate-pulse w-3/4 mb-2"></div>
                                            <div className="h-4 bg-borderLight rounded animate-pulse w-1/2 mb-3"></div>
                                            <div className="grid grid-cols-2 gap-3">
                                                {[...Array(3)].map((_, idx) => (
                                                    <div key={idx} className="h-4 bg-borderLight rounded animate-pulse"></div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Address Details Skeleton */}
                    <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 animate-pulse"></div>
                            <div className="h-6 bg-bgSecondary rounded animate-pulse w-40"></div>
                        </div>

                        <div className="space-y-6">
                            {[...Array(2)].map((_, index) => (
                                <div key={index}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-4 h-4 rounded bg-primary/10 animate-pulse"></div>
                                        <div className="h-4 bg-bgSecondary rounded animate-pulse w-32"></div>
                                    </div>
                                    <div className="bg-bgSecondary rounded-xl p-4 border border-borderDefault">
                                        <div className="space-y-2">
                                            <div className="h-4 bg-borderLight rounded animate-pulse w-full"></div>
                                            <div className="h-4 bg-borderLight rounded animate-pulse w-3/4"></div>
                                            <div className="h-4 bg-borderLight rounded animate-pulse w-1/2"></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Section 4: Parent Details Skeleton */}
                <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 animate-pulse"></div>
                        <div className="h-6 bg-bgSecondary rounded animate-pulse w-48"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        {[...Array(2)].map((_, index) => (
                            <div key={index} className="bg-bgSecondary rounded-xl p-5 border border-borderDefault">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-4 h-4 rounded bg-primary/10 animate-pulse"></div>
                                    <div className="h-4 bg-borderLight rounded animate-pulse w-32"></div>
                                </div>
                                <div className="space-y-3">
                                    {[...Array(4)].map((_, idx) => (
                                        <div key={idx} className="flex justify-between items-center">
                                            <div className="h-3 bg-borderLight rounded animate-pulse w-16"></div>
                                            <div className="h-3 bg-borderLight rounded animate-pulse w-24"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6">
                        <div className="bg-bgSecondary rounded-xl p-5 border border-borderDefault">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-4 h-4 rounded bg-primary/10 animate-pulse"></div>
                                <div className="h-4 bg-borderLight rounded animate-pulse w-40"></div>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {[...Array(5)].map((_, idx) => (
                                    <div key={idx} className="flex justify-between items-center">
                                        <div className="h-3 bg-borderLight rounded animate-pulse w-20"></div>
                                        <div className="h-3 bg-borderLight rounded animate-pulse w-32"></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default StudentDetailSkeleton;