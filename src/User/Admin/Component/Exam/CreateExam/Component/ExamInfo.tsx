import { Trash2 } from 'lucide-react';
import { ExamMode } from '../../../../../../Utils/enum';
import { useState } from 'react';

const ExamInfo = () => {

    const [instructions, setInstructions] = useState<string[]>([]);

    const handleAddInstruction = () => {
        if (instructions.length < 10) {
            setInstructions([...instructions, '']);
        }
    };

    const handleInstructionChange = (index: number, value: string) => {
        const updated = [...instructions];
        updated[index] = value;
        setInstructions(updated);
    };

    const handleDeleteInstruction = (index: number) => {
        const updated = instructions.filter((_, i) => i !== index);
        setInstructions(updated);
    };

    return (
        <>
            <div className="p-4 space-y-4">
                <div className="p-4 border border-gray-300 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Exam Mode */}
                        <div>
                            <label htmlFor="examMode" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Exam Mode *
                            </label>
                            <select
                                name="examMode"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                            >
                                {Object.values(ExamMode).map((mode) => (
                                    <option key={mode} value={mode}>
                                        {mode}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Exam Title */}
                        <div>
                            <label htmlFor="examTitle" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Exam Title *
                            </label>
                            <input
                                type="text"
                                id="examTitle"
                                name="examTitle"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Enter exam title"
                            />
                        </div>

                        {/* Subject */}
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Subject *
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Enter subject name"
                            />
                        </div>

                        {/* Total Marks */}
                        <div>
                            <label htmlFor="totalMarks" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Total Marks *
                            </label>
                            <input
                                type="number"
                                id="totalMarks"
                                name="totalMarks"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Enter total marks"
                            />
                        </div>

                        {/* Passing Marks */}
                        <div>
                            <label htmlFor="passingMarks" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Passing Marks *
                            </label>
                            <input
                                type="number"
                                id="passingMarks"
                                name="passingMarks"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Enter passing marks"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-0.5">
                                Duration (minutes) *
                            </label>
                            <input
                                type="number"
                                id="duration"
                                name="duration"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Enter duration in minutes"
                            />
                        </div>
                    </div>

                    {/* Exam Description */}
                    <div className="mt-4">
                        <label htmlFor="examDescription" className="block text-sm font-medium text-gray-700 mb-0.5">
                            Exam Description
                        </label>
                        <textarea
                            id="examDescription"
                            name="examDescription"
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="Enter exam description"
                        />
                    </div>

                    {/* General Instructions */}
                    <div className="p-4 rounded-md border border-gray-300 mt-4">
                        <div className="flex items-center justify-center">
                            <button
                                type="button"
                                onClick={handleAddInstruction}
                                className="px-3 py-2 text-sm bg-primary text-white rounded-md cursor-pointer"
                            >
                                Add Instruction
                            </button>
                        </div>

                        {/* Show inputs only if instructions exist */}
                        {instructions.map((instruction, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-2 mt-4">
                                <span className="text-gray-700">{index + 1}.</span>

                                <input
                                    type="text"
                                    value={instruction}
                                    onChange={(e) => handleInstructionChange(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="Instruction"
                                />

                                <button
                                    type="button"
                                    className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer"
                                    onClick={() => handleDeleteInstruction(index)}
                                >
                                    <Trash2 size={22} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamInfo;