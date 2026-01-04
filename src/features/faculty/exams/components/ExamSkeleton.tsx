const ExamSkeleton = () => {
    return (
        <>
            <div className="bg-whiteColor border border-borderLight rounded-lg shadow-sm p-6 animate-pulse">
                <div className="flex justify-between mb-4">
                    <div className="h-6 w-2/3 bg-borderLight rounded"></div>
                    <div className="h-5 w-20 bg-borderLight rounded-full"></div>
                </div>

                <div className="space-y-3 mb-6">
                    <div className="h-4 w-1/2 bg-borderLight rounded"></div>
                    <div className="h-4 w-2/3 bg-borderLight rounded"></div>
                    <div className="h-4 w-1/3 bg-borderLight rounded"></div>
                    <div className="h-4 w-1/4 bg-borderLight rounded"></div>
                </div>

                <div className="h-10 w-full bg-borderLight rounded-lg"></div>
            </div>
        </>
    )
}

export default ExamSkeleton