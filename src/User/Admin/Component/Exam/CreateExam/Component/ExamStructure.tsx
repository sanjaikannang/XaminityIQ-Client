import { Trash2 } from 'lucide-react';
import { useState } from 'react';

const ExamStructure = () => {

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
            <div className='p-4'>
                <div className="border border-gray-300 rounded-md">
                    {/* Section Content */}
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Section Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Section Name *
                                </label>
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="Enter section name"
                                />
                            </div>

                            {/* Question Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question Type *
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                >
                                    <option value="MCQ">Multiple Choice</option>
                                    <option value="SHORT_ANSWER">Short Answer</option>
                                    <option value="LONG_ANSWER">Long Answer</option>
                                    <option value="TRUE_FALSE">True/False</option>
                                </select>
                            </div>

                            {/* Total Questions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Total Questions *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="0"
                                />
                            </div>

                            {/* Section Marks */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Section Marks *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="0"
                                />
                            </div>

                            {/* Time Limit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time Limit (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="0"
                                />
                            </div>

                            {/* Is Optional */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                />
                                <label className="text-sm text-gray-700">
                                    Optional Section
                                </label>
                            </div>
                        </div>

                        {/* Section Instructions */}
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
            </div>
        </>
    );
};

export default ExamStructure;