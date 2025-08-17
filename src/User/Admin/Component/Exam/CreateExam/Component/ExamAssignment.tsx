
const ExamAssignment = () => {

    return (
        <>            
            <div className="space-y-6 p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Batch */}
                    <div>
                        <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Batch<span className="text-red-500">*</span>
                        </label>
                        <select
                            name="batchId"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        >
                            <option>Option A</option>
                        </select>
                    </div>

                    {/* Course */}
                    <div>
                        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Course<span className="text-red-500">*</span>
                        </label>
                        <select
                            name="courseId"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none "
                        >
                            <option>Option A</option>
                        </select>
                    </div>

                    {/* Branch */}
                    <div>
                        <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Branch<span className="text-red-500">*</span>
                        </label>
                        <select
                            name="branchId"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        >
                            <option>Option A</option>
                        </select>
                    </div>

                    {/* Section */}
                    <div>
                        <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Section<span className="text-red-500">*</span>
                        </label>
                        <select
                            name="sectionId"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        >
                        </select>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamAssignment;