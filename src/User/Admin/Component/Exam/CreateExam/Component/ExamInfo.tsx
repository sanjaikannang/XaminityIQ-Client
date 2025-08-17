import { ExamMode, ExamStatus } from '../../../../../../Utils/enum';


const ExamInfo = () => {
    return (
        <>           
            <div className="p-4 space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Exam Status */}
                    <div>
                        <label htmlFor="examStatus" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Exam Status<span className="text-red-500">*</span>
                        </label>
                        <select
                            name="examStatus"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        >
                            {Object.values(ExamStatus).map((status) => (
                                <option key={status} value={status}>
                                    {status.replace('_', ' ')}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Exam Mode */}
                    <div>
                        <label htmlFor="examMode" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Exam Mode<span className="text-red-500">*</span>
                        </label>
                        <select
                            name="examMode"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none ${errors.examMode && touched.examMode"
                        >
                            {Object.values(ExamMode).map((mode) => (
                                <option key={mode} value={mode}>
                                    {mode}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Exam Title */}
                    <div>
                        <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Exam Title<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="examTitle"
                            placeholder="Enter exam title"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none ${errors.examTitle && touched.examTitle"
                        />
                    </div>

                    {/* Subject */}
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Subject<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="subject"
                            placeholder="Enter subject"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Total Marks */}
                    <div>
                        <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Total Marks<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="totalMarks"
                            min="1"
                            placeholder="0"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        />
                    </div>

                    {/* Passing Marks */}
                    <div>
                        <label htmlFor="passingMarks" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Passing Marks<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="passingMarks"
                            min="0"
                            placeholder="0"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        />
                    </div>

                    {/* Duration */}
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Duration (min)<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            name="duration"
                            min="1"
                            placeholder="0"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {/* Exam Description */}
                    <div>
                        <label htmlFor="examDescription" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Exam Description<span className="text-red-500">*</span>
                        </label>
                        <input
                            name="examDescription"
                            placeholder="Enter exam description"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none"
                        />
                    </div>
                </div>

                {/* General Instructions */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                        General Instructions<span className="text-red-500">*</span>
                    </label>
                    <input
                        name="examDescription"
                        placeholder="Enter exam description"
                        className="w-full px-3 py-2 border rounded-md focus:outline-none"
                    />
                </div>
            </div>
        </>
    );
};

export default ExamInfo;