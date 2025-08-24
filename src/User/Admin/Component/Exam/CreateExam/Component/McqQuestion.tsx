import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Option {
    text: string;
    isCorrect: boolean;
}

interface McqQuestionProps {
    questionNumber: number;
    sectionIndex: number;
    isTrueFalse?: boolean;
}

const McqQuestion: React.FC<McqQuestionProps> = ({
    questionNumber,
    sectionIndex,
    isTrueFalse = false
}) => {
    const [options, setOptions] = useState<Option[]>(
        isTrueFalse
            ? [
                { text: 'True', isCorrect: false },
                { text: 'False', isCorrect: false }
            ]
            : []
    );

    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    const toggleQuestionExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddOption = () => {
        if (!isTrueFalse && options.length < 4) {
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

        if (isTrueFalse || updated.filter(opt => opt.isCorrect).length === 0 || !isCorrect) {
            updated[index].isCorrect = isCorrect;
            setOptions(updated);
        } else if (isCorrect) {
            // For regular MCQ, allow only one correct answer
            const singleCorrect = updated.map((opt, i) => ({
                ...opt,
                isCorrect: i === index
            }));
            setOptions(singleCorrect);
        }
    };

    const handleDeleteOption = (index: number) => {
        if (!isTrueFalse) {
            const updated = options.filter((_, i) => i !== index);
            setOptions(updated);
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            {/* Collapsible Header */}
            <div
                className="p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={toggleQuestionExpansion}
            >
                <div className="flex justify-between items-center">
                    <div>
                        <span className="font-medium text-gray-700">
                            Section {sectionIndex + 1} - Question {questionNumber}
                        </span>
                    </div>

                    <div>
                        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>

                </div>
            </div>

            {/* Expandable Content */}
            {isExpanded && (
                <div className="p-4 space-y-4">
                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Text<span className="text-red-500">*</span>
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
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question Type<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={isTrueFalse ? 'TRUE_FALSE' : 'MCQ'}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none  bg-gray-100 text-gray-700"
                            />
                        </div>

                        {/* Marks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Marks<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                defaultValue="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                            />
                        </div>

                        {/* Question Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                value={questionNumber}
                                readOnly
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none  bg-gray-100 text-gray-700"
                            />
                        </div>

                        {/* Difficulty Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Difficulty<span className="text-red-500">*</span>
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900"
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
                            Explanation<span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="Explain the correct answer..."
                        />
                    </div>

                    {/* Options */}
                    <div className="p-4 rounded-md border border-gray-300 mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-700">
                                {isTrueFalse ? 'True/False Options' : 'Answer Options'}
                            </h4>
                            {!isTrueFalse && (
                                <button
                                    type="button"
                                    onClick={handleAddOption}
                                    disabled={options.length >= 4}
                                    className={`px-3 py-2 text-sm rounded-md cursor-pointer ${options.length >= 4
                                        ? 'bg-gray-400 text-gray-900 cursor-not-allowed'
                                        : 'bg-primary text-white'
                                        }`}
                                >
                                    Add Option ({options.length}/4)
                                </button>
                            )}
                        </div>

                        {/* Options List */}
                        {options.map((option, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-3">
                                <span className="text-gray-700 font-medium min-w-[20px]">
                                    {String.fromCharCode(65 + index)}.
                                </span>

                                <input
                                    type="text"
                                    value={option.text}
                                    onChange={(e) => handleOptionTextChange(index, e.target.value)}
                                    readOnly={isTrueFalse}
                                    className={`flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 ${isTrueFalse ? 'bg-gray-100' : ''
                                        }`}
                                    placeholder={isTrueFalse ? option.text : "Option Text"}
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

                                {!isTrueFalse && (
                                    <button
                                        type="button"
                                        className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer transition-colors"
                                        onClick={() => handleDeleteOption(index)}
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                )}
                            </div>
                        ))}

                        {!isTrueFalse && options.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                <p className="text-sm">Click "Add Option" to create answer choices</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default McqQuestion;