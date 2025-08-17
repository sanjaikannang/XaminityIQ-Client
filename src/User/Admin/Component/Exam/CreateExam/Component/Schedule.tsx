

const Schedule = () => {

    return (
        <>        
            <div className="space-y-4 p-4">
                {/* Proctoring Mode Schedule */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Exam Date */}
                        <div>
                            <label htmlFor="scheduleDetails.examDate" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Exam Date<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                name="scheduleDetails.examDate"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            />
                        </div>

                        {/* Start Time */}
                        <div>
                            <label htmlFor="scheduleDetails.startTime" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Start Time<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                name="scheduleDetails.startTime"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            />
                        </div>

                        {/* End Time */}
                        <div>
                            <label htmlFor="scheduleDetails.endTime" className="block text-sm font-medium text-gray-700 mb-0.5">
                                End Time<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                name="scheduleDetails.endTime"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Buffer Time */}
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Before Exam */}
                        <div>
                            <label htmlFor="scheduleDetails.bufferTime.beforeExam" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Before Exam (minutes)
                            </label>
                            <input
                                type="number"
                                name="scheduleDetails.bufferTime.beforeExam"
                                min="0"
                                placeholder="0"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            />
                        </div>

                        {/* After Exam */}
                        <div>
                            <label htmlFor="scheduleDetails.bufferTime.afterExam" className="block text-sm font-medium text-gray-700 mb-0.5">
                                After Exam (minutes)
                            </label>
                            <input
                                type="number"
                                name="scheduleDetails.bufferTime.afterExam"
                                min="0"
                                placeholder="0"
                                className="w-full px-3 py-2 border rounded-md focus:outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Schedule;