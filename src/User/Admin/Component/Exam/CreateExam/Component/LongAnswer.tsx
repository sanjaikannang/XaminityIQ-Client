import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface LongAnswerProps {
    questionNumber: number;
    sectionIndex: number;
}

const LongAnswer: React.FC<LongAnswerProps> = ({ questionNumber, sectionIndex }) => {
    const [keywords, setKeywords] = useState<string[]>([]);
    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    const toggleQuestionExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    const handleAddKeyword = () => {
        if (keywords.length < 10) {
            setKeywords([...keywords, '']);
        }
    };

    const handleKeywordChange = (index: number, value: string) => {
        const updated = [...keywords];
        updated[index] = value;
        setKeywords(updated);
    };

    const handleDeleteKeyword = (index: number) => {
        const updated = keywords.filter((_, i) => i !== index);
        setKeywords(updated);
    };

    return (
        <div className="bg-white border border-gray-200 rounded-lg">
            {/* Collapsible Header */}
            <div
                className="p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={toggleQuestionExpansion}
            >
                <div className="flex items-center justify-between">
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
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="Enter your detailed question here..."
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
                                value="LONG_ANSWER"
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
                                defaultValue="5"
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

                    {/* Expected Answer Length */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expected Word Count (Min)<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="50"
                                defaultValue="150"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Minimum words expected"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Expected Word Count (Max)<span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="100"
                                defaultValue="500"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Maximum words expected"
                            />
                        </div>
                    </div>

                    {/* Model Answer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Model Answer / Key Points<span className="text-red-500">*</span>
                        </label>
                        <textarea
                            rows={6}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                            placeholder="Provide a model answer or key points that should be covered in the response..."
                        />
                    </div>

                    {/* Keywords Section */}
                    <div className="p-4 rounded-md border border-gray-300 mt-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-700">
                                Keywords<span className="text-red-500">*</span>
                            </h4>
                            <button
                                type="button"
                                onClick={handleAddKeyword}
                                disabled={keywords.length >= 10}
                                className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${keywords.length >= 10
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-primary text-white'
                                    }`}
                            >
                                Add Keyword ({keywords.length}/10)
                            </button>
                        </div>

                        {/* Keywords List */}
                        {keywords.map((keyword, index) => (
                            <div key={index} className="flex items-center space-x-2 mb-3">
                                <span className="text-gray-700 font-medium min-w-[24px]">
                                    {index + 1}.
                                </span>

                                <input
                                    type="text"
                                    value={keyword}
                                    onChange={(e) => handleKeywordChange(index, e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="Enter important keyword or concept"
                                />

                                <button
                                    type="button"
                                    className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer transition-colors"
                                    onClick={() => handleDeleteKeyword(index)}
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}

                        {keywords.length === 0 && (
                            <div className="text-center py-4 text-gray-500">
                                <p className="text-sm">Add keywords and concepts that should appear in comprehensive answers</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default LongAnswer;