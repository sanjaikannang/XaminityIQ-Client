import { Trash2 } from "lucide-react";
import { useState } from "react";

interface Option {
    text: string;
    isCorrect: boolean;
}

const McqQuestion = () => {

    const [options, setOptions] = useState<Option[]>([]);

    const handleAddOption = () => {
        if (options.length < 4) {
            setOptions([...options, { text: '', isCorrect: false }]);
        }
    };

    const handleOptionTextChange = (index: number, value: string) => {
        const updated = [...options];
        updated[index].text = value;
        setOptions(updated);
    };

    const handleCorrectChange = (index: number, isCorrect: boolean) => {
        const updated = [...options];
        updated[index].isCorrect = isCorrect;
        setOptions(updated);
    };

    const handleDeleteOption = (index: number) => {
        const updated = options.filter((_, i) => i !== index);
        setOptions(updated);
    };

    return (
        <>
            <div className="p-4 bg-white">
                <div className="border border-gray-300 rounded-md">

                    {/* Header Section */}
                    <div className="p-4 bg-gray-50 border-b border-gray-300 rounded-t-md">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">
                                MCQ Question
                            </span>
                        </div>
                    </div>

                    <div className="p-2">
                        <div className="border border-gray-300 rounded-md">

                            {/* Header Section */}
                            <div className="p-4 bg-gray-50 border-b border-gray-300 rounded-t-md">
                                <div className="flex items-center space-x-2">
                                    <span className="font-medium text-gray-700">
                                        Question 1
                                    </span>
                                </div>
                            </div>
                            
                            <div className="p-2 space-y-4">
                                {/* Question Text */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-0.5">
                                        Question Text *
                                    </label>
                                    <textarea
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder="Enter your question here..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    {/* Question Type */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-0.5">
                                            Question Type *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        />
                                    </div>

                                    {/* Marks */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-0.5">
                                            Marks *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        />
                                    </div>

                                    {/* Question Order */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-0.5">
                                            Order *
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        />
                                    </div>

                                    {/* Difficulty Level */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-0.5">
                                            Difficulty *
                                        </label>
                                        <select
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        >
                                            <option value="EASY">Easy</option>
                                            <option value="MEDIUM">Medium</option>
                                            <option value="HARD">Hard</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Explanation */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Explanation
                                    </label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder="Explain the correct answer..."
                                    />
                                </div>

                                {/* Options */}
                                <div className="p-4 rounded-md border border-gray-300 mt-4">
                                    <div className="flex items-center justify-center">
                                        <button
                                            type="button"
                                            onClick={handleAddOption}
                                            disabled={options.length >= 4}
                                            className={`px-3 py-2 text-sm rounded-md cursor-pointer ${options.length >= 4
                                                ? 'bg-gray-400 text-gray-900 cursor-not-allowed'
                                                : 'bg-primary text-white'
                                                }`}
                                        >
                                            Add Options
                                        </button>
                                    </div>

                                    {/* Show inputs only if options exist */}
                                    {options.map((option, index) => (
                                        <div key={index} className="flex items-center space-x-2 mb-2 mt-4">
                                            <span className="text-gray-700 font-medium">{String.fromCharCode(65 + index)}.</span>

                                            <input
                                                type="text"
                                                value={option.text}
                                                onChange={(e) => handleOptionTextChange(index, e.target.value)}
                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                placeholder="Option Text"
                                            />

                                            <div className="flex items-center space-x-1">
                                                <input
                                                    type="checkbox"
                                                    checked={option.isCorrect}
                                                    onChange={(e) => handleCorrectChange(index, e.target.checked)}
                                                    className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded"
                                                />
                                                <label className="text-sm text-gray-700 whitespace-nowrap">Correct</label>
                                            </div>

                                            <button
                                                type="button"
                                                className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer transition-colors"
                                                onClick={() => handleDeleteOption(index)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default McqQuestion;