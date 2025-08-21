import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ExamInfo from './Component/ExamInfo';
import { ExamMode } from '../../../../../Utils/enum';
import ExamAssignment from './Component/ExamAssignment';
import Schedule from './Component/Schedule';
import ExamStructure from './Component/ExamStructure';
import Questions from './Component/Questions';


const CreateExam = () => {
    const [status, setStatus] = useState(ExamStatus.DRAFT);
    const [currentExamMode, setCurrentExamMode] = useState<ExamMode>(ExamMode.AUTO);

    const [isExamInfoOpen, setIsExamInfoOpen] = useState(true);
    const [isTargetAudienceOpen, setIsTargetAudienceOpen] = useState(true);
    const [isScheduleOpen, setIsScheduleOpen] = useState(true);
    const [isExamStructureOpen, setIsExamStructureOpen] = useState(true);
    const [isQuestionsOpen, setIsQuestionsOpen] = useState(true);

  
    // Toggle functions
    const toggleExamInfo = () => setIsExamInfoOpen(!isExamInfoOpen);
    const toggleTargetAudience = () => setIsTargetAudienceOpen(!isTargetAudienceOpen);
    const toggleSchedule = () => setIsScheduleOpen(!isScheduleOpen);
    const toggleExamStructure = () => setIsExamStructureOpen(!isExamStructureOpen);
    const toggleQuestions = () => setIsQuestionsOpen(!isQuestionsOpen);

    const handleExamModeChange = (mode: ExamMode) => {
        setCurrentExamMode(mode);
    };

    return (
        <>
            <div className="p-4">
                <div className="max-w-9xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-primary text-whiteColor p-4 flex items-center justify-between">
                            <h1 className="text-2xl font-semibold">Create Exam</h1>

                            <div className="border border-white rounded-full overflow-hidden">
                                <button
                                    className={`px-4 transition-colors cursor-pointer ${status === 'DRAFT' ? 'bg-white text-primary rounded-full' : 'bg-transparent text-whiteColor'
                                        }`}
                                    onClick={() => setStatus(ExamStatus.DRAFT)}
                                >
                                    DRAFT
                                </button>
                                <button
                                    className={`px-2 transition-colors cursor-pointer ${status === 'PUBLISH' ? 'bg-white text-primary rounded-full' : 'bg-transparent text-whiteColor'
                                        }`}
                                    onClick={() => setStatus(ExamStatus.PUBLISH)}
                                >
                                    PUBLISH
                                </button>
                            </div>
                        </div>

                        {/* Exam Info Section */}
                        <div>
                            <div
                                className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                onClick={toggleExamInfo}
                            >
                                <h3 className="text-lg font-semibold text-gray-800">1. Exam Info</h3>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isExamInfoOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExamInfoOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <ExamInfo onExamModeChange={handleExamModeChange} />
                            </div>
                        </div>

                        {/* Target Audience Section */}
                        <div>
                            <div
                                className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                onClick={toggleTargetAudience}
                            >
                                <h3 className="text-lg font-semibold text-gray-800">2. Target Audience</h3>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isTargetAudienceOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isTargetAudienceOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <ExamAssignment examMode={currentExamMode} />
                            </div>
                        </div>

                        {/* Schedule Section */}
                        <div>
                            <div
                                className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                onClick={toggleSchedule}
                            >
                                <h3 className="text-lg font-semibold text-gray-800">3. Schedule</h3>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isScheduleOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isScheduleOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <Schedule examMode={currentExamMode} />
                            </div>
                        </div>

                        {/* Exam Structure Section */}
                        <div>
                            <div
                                className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                onClick={toggleExamStructure}
                            >
                                <h3 className="text-lg font-semibold text-gray-800">4. Exam Structure</h3>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isExamStructureOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isExamStructureOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <ExamStructure />
                            </div>
                        </div>

                        {/* Questions Section */}
                        <div>
                            <div
                                className="bg-gray-50 border-b border-gray-300 p-4 cursor-pointer hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between"
                                onClick={toggleQuestions}
                            >
                                <h3 className="text-lg font-semibold text-gray-800">5. Questions</h3>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-600 transform transition-transform duration-200 ${isQuestionsOpen ? 'rotate-180' : 'rotate-0'
                                        }`}
                                />
                            </div>

                            <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isQuestionsOpen ? 'h-full opacity-100' : 'max-h-0 opacity-0'
                                }`}>
                                <Questions />
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </>
    );
};

export default CreateExam;
