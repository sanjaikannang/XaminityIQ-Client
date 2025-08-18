import { Trash2 } from 'lucide-react';

const ExamStructure = () => {

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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                                    placeholder="Enter section name"
                                />
                            </div>

                            {/* Question Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question Type *
                                </label>
                                <select
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
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
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    Section Instructions
                                </label>
                                <button
                                    type="button"
                                    className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                                >
                                    Add Instruction
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="text"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
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
                    </div>
                </div>
            </div>
        </>
    );
};

export default ExamStructure;