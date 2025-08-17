import { Plus, Trash2 } from 'lucide-react';
import { DifficultyLevel } from '../../../../../../Utils/enum';


const Questions = () => {

    return (
        <>
            <div className="bg-white">
                {/* Question Header */}
                <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600">Q</span>
                        <span className="text-sm text-gray-800">
                            Untitled Question
                        </span>
                        <span className="px-2 py-1 text-xs rounded-full">
                            question
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">marks</span>
                        <button
                            type="button"
                            className="text-red-600 hover:text-red-800 p-1"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                </div>

                {/* Question Content */}
                <div className="p-4 border-t border-gray-200 space-y-4">
                    {/* Basic Question Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Difficulty Level *
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                            >
                                {Object.values(DifficultyLevel).map((level) => (
                                    <option key={level} value={level}>{level}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Marks *
                            </label>
                            <input
                                type="number"
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>

                    {/* Question Text */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Text *
                        </label>
                        <input
                            placeholder="Enter your question here..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Question Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Question Image URL (Optional)
                        </label>
                        <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* MCQ Options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Options *
                        </label>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <input
                                    type="text"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="button"
                                    className="text-red-600 hover:text-red-800 p-1"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                            >
                                <Plus size={16} className="mr-1" />
                                Add Option
                            </button>
                        </div>
                    </div>

                    {/* True/False Answer */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correct Answer *
                        </label>
                        <div className="flex space-x-4">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="true"
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span>True</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    value="false"
                                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                />
                                <span>False</span>
                            </label>
                        </div>
                    </div>

                    {/* Short/Long Answer Correct Answers */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Correct Answers *
                        </label>
                        <div className="space-y-4">
                            <div className="border border-gray-200 rounded-md p-4">
                                <div className="flex justify-between items-center mb-3">
                                    <h5 className="text-sm font-medium text-gray-700">Answer</h5>
                                    <button
                                        type="button"
                                        className="text-red-600 hover:text-red-800 p-1"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <input
                                            placeholder="Enter the correct answer..."
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <input
                                            type="number"
                                            min="0"
                                            placeholder="Marks for this answer"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Keywords
                                        </label>
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                />
                                                <button
                                                    type="button"
                                                    className="text-red-600 hover:text-red-800 p-1"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                                            >
                                                <Plus size={14} className="mr-1" />
                                                Add Keyword
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                            >
                                <Plus size={16} className="mr-1" />
                                Add Correct Answer
                            </button>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Explanation (Optional)
                        </label>
                        <input
                            placeholder="Provide an explanation for the correct answer..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions & Answers</h3>
                    <p className="text-sm text-gray-600 mb-6">
                        Add questions for each section. Make sure the number of questions matches what you specified in the previous step.
                    </p>

                    <div className="space-y-6">
                        <div className="border border-gray-200 rounded-lg">
                            {/* Section Header */}
                            <div
                                className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                            >
                                <div>
                                    <h4 className="text-md font-semibold text-gray-800">
                                        Section
                                    </h4>
                                    <p className="text-sm text-gray-600">
                                        questions • marks
                                    </p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-2">
                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Section Content */}
                            <div className="p-4 space-y-4">
                                {/* Add Question Button */}
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">
                                    </span>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        <Plus size={16} className="mr-2" />
                                        Add Question
                                    </button>
                                </div>

                                {/* Questions List */}
                                <div className="space-y-4">
                                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                        <p className="text-gray-500">No questions added yet</p>
                                        <p className="text-sm text-gray-400">Click "Add Question" to start</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Overall Progress Summary */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                        <h5 className="text-sm font-medium text-blue-800 mb-2">Exam Summary</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                                <span className="text-blue-700 font-medium">Total Sections:</span>
                            </div>
                            <div>
                                <span className="text-blue-700 font-medium">Total Questions:</span>
                            </div>
                            <div>
                                <span className="text-blue-700 font-medium">Expected Questions:</span>
                            </div>
                            <div>
                                <span className="text-blue-700 font-medium">Total Marks:</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
export default Questions;