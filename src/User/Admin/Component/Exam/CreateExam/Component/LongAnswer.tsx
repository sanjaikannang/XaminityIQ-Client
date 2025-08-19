import { Trash2 } from "lucide-react";
import { useState } from "react";

const LongAnswer = () => {

    const [keywords, setKeywords] = useState<string[]>([]);

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
        <>
            <div className="p-4 bg-white">
                <div className="border border-gray-300 rounded-md">
                    <div className="p-4 space-y-4">

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
                                Answer Text
                            </label>
                            <textarea
                                rows={6}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                placeholder="Explain the correct answer..."
                            />
                        </div>

                        {/* Keywords Section */}
                        <div className="p-4 rounded-md border border-gray-300 mt-4">
                            <div className="flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={handleAddKeyword}
                                    disabled={keywords.length >= 10}
                                    className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${keywords.length >= 10
                                        ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                        : 'bg-primary text-white'
                                        }`}
                                >
                                    Add Keywords
                                </button>
                            </div>

                            {/* Keywords List */}
                            {keywords.map((keyword, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2 mt-4">
                                    <span className="text-gray-700 font-medium">{index + 1}.</span>

                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => handleKeywordChange(index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder="Enter keyword or key phrase"
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
                        </div>
                    </div>

                </div>
            </div>
        </>
    )
}

export default LongAnswer