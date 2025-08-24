import { ExamMode } from "../../../../../../Utils/enum";

interface ExamScheduleProps {
    examMode: ExamMode;
}

const Schedule = ({ examMode }: ExamScheduleProps) => {

    return (
        <>
            <div className="p-4 space-y-4">
                {examMode === ExamMode.PROCTORING && (
                    <div className="p-4 border border-gray-300 rounded-md">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Exam Date */}
                            <div>
                                <label htmlFor="examDate" className="block text-sm font-medium text-gray-700 mb-0.5">
                                    Exam Date<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="examDate"
                                    name="examDate"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            {/* Start Time */}
                            <div>
                                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-0.5">
                                    Start Time<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    id="startTime"
                                    name="scheduleDetails.startTime"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            {/* End Time */}
                            <div>
                                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-0.5">
                                    End Time<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="time"
                                    id="endTime"
                                    name="scheduleDetails.endTime"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </div>
                    </div>
                )}


                {examMode === ExamMode.AUTO && (
                    <div className="p-4 border border-gray-300 rounded-md">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Start Date */}
                            <div>
                                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-0.5">
                                    Start Date<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                />
                            </div>

                            {/* End Date */}
                            <div>
                                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-0.5">
                                    End Date<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Buffer Time Settings */}
                <div className="p-4 rounded-md border border-gray-300">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Before Exam Buffer */}
                        <div>
                            <label htmlFor="beforeExam" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Before Exam (minutes)<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="beforeExam"
                                name="scheduleDetails.bufferTime.beforeExam"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Enter buffer time before exam"
                            />
                        </div>

                        {/* After Exam Buffer */}
                        <div>
                            <label htmlFor="afterExam" className="block text-sm font-medium text-gray-700 mb-0.5">
                                After Exam (minutes)<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                id="afterExam"
                                name="scheduleDetails.bufferTime.afterExam"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Enter buffer time after exam"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Schedule;