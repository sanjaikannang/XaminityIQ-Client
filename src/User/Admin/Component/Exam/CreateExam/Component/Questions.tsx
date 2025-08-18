import { Plus, Trash2, Edit3, ChevronUp, Copy, Image } from 'lucide-react';

export const SectionQuestionsCard = () => {

    return (
        <>
            <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
                {/* Section Header */}
                <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <h4 className="font-medium text-gray-900">
                                Section
                            </h4>
                            <span className="text-sm text-gray-500">
                                section
                            </span>
                            <span className="text-sm px-2 py-1 rounded-full">
                                questions
                            </span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                type="button"
                                className="flex items-center space-x-1 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Question</span>
                            </button>
                            <button
                                type="button"
                                className="p-1 text-gray-400 hover:text-gray-600"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Questions Content */}
                <div className="p-4">
                    <div className="space-y-4">
                    </div>
                    <div className="text-center py-8 text-gray-500">
                        <Edit3 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p>No questions added yet</p>
                        <p className="text-sm">Click "Add Question" to get started</p>
                    </div>
                </div>
            </div>
        </>
    );
};


export const QuestionCard = () => {
    return (
        <>
            <div className="border border-gray-200 rounded-lg bg-white">
                {/* Question Header */}
                <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded">
                                Q 1
                            </span>
                            <span className="text-sm text-gray-600">
                                marks
                            </span>
                            <span className="text-xs px-2 py-1 rounded">
                                difficultyLevel
                            </span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <button
                                type="button"
                                className="p-1 text-gray-400 hover:text-gray-600"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                className="p-1 text-gray-400 hover:text-gray-600"
                            >
                                <ChevronUp className="w-4 h-4" />
                            </button>
                            <button
                                type="button"
                                className="p-1 text-red-400 hover:text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Question Content */}
                <div className="p-4 space-y-4">
                    {/* Basic Question Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Marks */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Marks *
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                            />
                        </div>

                        {/* Question Order */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Order *
                            </label>
                            <input
                                type="number"
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                            />
                        </div>

                        {/* Difficulty Level */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Difficulty *
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                            >
                                <option value="EASY">Easy</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HARD">Hard</option>
                            </select>
                        </div>

                        {/* Question Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Image URL
                            </label>
                            <div className="flex">
                                <input
                                    type="url"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md text-sm focus:ring-primary focus:border-primary"
                                    placeholder="https://..."
                                />
                                <button
                                    type="button"
                                    className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-gray-500"
                                >
                                    <Image className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Question Text *
                        </label>
                        <textarea
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                            placeholder="Enter your question here..."
                        />
                    </div>


                    {/* Explanation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Explanation (Optional)
                        </label>
                        <textarea
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                            placeholder="Explain the correct answer..."
                        />
                    </div>
                </div>
            </div>
        </>
    );
};


export const MCQOptions = () => {

    return (
        <>
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                        Answer Options *
                    </label>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-500">
                            correct option
                        </span>
                        <button
                            type="button"
                            className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                        >
                            Add Option
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                        />
                        <input
                            type="url"
                            className="w-32 px-2 py-2 border border-gray-300 rounded-md text-xs focus:ring-primary focus:border-primary"
                            placeholder="Image URL"
                        />
                        <button
                            type="button"
                            className="p-1 text-red-400 hover:text-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};


export const TextAnswers = () => {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answers *
                </label>

                <div className="border border-gray-200 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        {/* Answer Text */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Answer Text *
                            </label>
                            <textarea
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                                placeholder="Enter the correct answer"
                            />
                        </div>

                        {/* Marks for this answer */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Marks *
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                            />
                        </div>
                    </div>

                    {/* Keywords */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-medium text-gray-700">
                                Keywords for Auto-grading *
                            </label>
                            <button
                                type="button"
                                className="text-xs px-2 py-1 bg-secondary text-white rounded hover:bg-secondary-dark"
                            >
                                Add Keyword
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <div className="flex items-center space-x-1">
                                <input
                                    type="text"
                                    className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                    placeholder="Keyword"
                                />
                                <button
                                    type="button"
                                    className="p-1 text-red-400 hover:text-red-600"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export const TrueFalseAnswer = () => {
    return (
        <>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Correct Answer *
                </label>
                <div className="flex space-x-4">
                    <label className="flex items-center">
                        <input
                            type="radio"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">True</span>
                    </label>
                    <label className="flex items-center">
                        <input
                            type="radio"
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">False</span>
                    </label>
                </div>
            </div>
        </>
    );
};
