import { Plus, Trash2 } from 'lucide-react';
import { QuestionType } from '../../../../../../Utils/enum';


const ExamStructure = () => {

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Exam Structure & Sections</h3>
                    <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        <Plus size={16} className="mr-2" />
                        Add Section
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-medium text-blue-800">Total Sections</h4>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="text-sm font-medium text-green-800">Total Questions</h4>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="text-sm font-medium text-purple-800">Section Marks Total</h4>
                        <p className="text-2xl font-bold text-purple-900">
                        </p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-md font-semibold text-gray-800">
                                Section
                            </h4>
                            <button
                                type="button"
                                className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-md transition-colors"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Section Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section Name *
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g., Multiple Choice Questions"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                                />
                            </div>

                            {/* Question Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Question Type *
                                </label>
                                <select
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                                >
                                    {Object.values(QuestionType).map((type) => (
                                        <option key={type} value={type}>
                                            {type.replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Section Marks */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Section Marks *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="0"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                                />
                            </div>

                            {/* Total Questions */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Total Questions *
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    placeholder="0"
                                    className="w-full px-3 py-2 border rounded-md focus:outline-none"
                                />
                            </div>

                            {/* Time Limit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Time Limit (minutes)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    placeholder="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <p className="mt-1 text-xs text-gray-500">0 = No time limit for this section</p>
                            </div>

                            {/* Is Optional */}
                            <div className="flex items-center space-x-2">
                                <select
                                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                />
                                <label className="text-sm font-medium text-gray-700">
                                    Optional Section
                                </label>
                            </div>
                        </div>

                        {/* Section Instructions */}
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Section Instructions
                            </label>
                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <button
                                        type="button"
                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                                <button
                                    type="button"
                                    className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                                >
                                    <Plus size={16} className="mr-1" />
                                    Add Instruction
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="text-center py-8">
                        <p className="text-gray-500">No sections added yet. Click "Add Section" to start.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ExamStructure;