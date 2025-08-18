const ExamAssignment = () => {

    return (
        <>
            <div className="p-4 space-y-4">
                <div className="border border-gray-300 rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Batch Selection */}
                    <div>
                        <label htmlFor="batchId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Batch *
                        </label>
                        <select
                            id="batchId"
                            name="batchId"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                        >
                            <option >
                                batch
                            </option>
                        </select>
                    </div>

                    {/* Course Selection */}
                    <div>
                        <label htmlFor="courseId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Course *
                        </label>
                        <select
                            id="courseId"
                            name="courseId"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                        >
                            <option >
                                course
                            </option>
                        </select>
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <label htmlFor="branchId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Branch *
                        </label>
                        <select
                            id="branchId"
                            name="branchId"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                        >
                            <option>
                                branch
                            </option>
                        </select>
                    </div>

                    {/* Section Selection */}
                    <div>
                        <label htmlFor="sectionId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Section *
                        </label>
                        <select
                            id="sectionId"
                            name="sectionId"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                        >
                            <option >
                                Section
                            </option>
                        </select>
                    </div>

                    {/* Faculty Selection */}
                    <div>
                        <label htmlFor="facultyId" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Faculty *
                        </label>
                        <select
                            id="facultyId"
                            name="facultyId"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                        >
                            <option>
                                Faculty
                            </option>
                        </select>
                    </div>

                </div>
                </div>
            </div>
        </>
    );
};

export default ExamAssignment;