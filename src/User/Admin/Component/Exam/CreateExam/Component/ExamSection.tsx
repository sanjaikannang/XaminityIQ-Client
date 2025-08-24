import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface Section {
    id: string;
    name: string;
    order: string;
    marks: string;
    questionType: string;
    totalQuestions: string;
    timeLimit: string;
    isOptional: boolean;
    instructions: string[];
    isExpanded: boolean;
}

interface SectionComponentProps {
    section: Section;
    sectionIndex: number;
    onDeleteSection: (sectionId: string) => void;
    onToggleSection: (sectionId: string) => void;
    onUpdateSection: (sectionId: string, field: keyof Section, value: any) => void;
    onAddInstruction: (sectionId: string) => void;
    onInstructionChange: (sectionId: string, index: number, value: string) => void;
    onDeleteInstruction: (sectionId: string, index: number) => void;
}

const ExamSection: React.FC<SectionComponentProps> = ({
    section,
    sectionIndex,
    onDeleteSection,
    onToggleSection,
    onUpdateSection,
    onAddInstruction,
    onInstructionChange,
    onDeleteInstruction
}) => {
    return (
        <>
            <div className="border border-gray-300 rounded-md">
                {/* Section Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-300 rounded-t-md">
                    <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">
                            Section {sectionIndex + 1}
                            {section.name && `: ${section.name}`}
                        </span>
                    </div>

                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => onToggleSection(section.id)}
                            className="p-1 cursor-pointer"
                        >
                            {section.isExpanded ? (
                                <ChevronUp size={20} className="text-gray-600" />
                            ) : (
                                <ChevronDown size={20} className="text-gray-600" />
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => onDeleteSection(section.id)}
                            className="p-1 text-red-600 cursor-pointer"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Section Content - Collapsible */}
                {section.isExpanded && (
                    <div className="p-4 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Section Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Section Name<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={section.name}
                                    onChange={(e) => onUpdateSection(section.id, 'name', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="Enter section name"
                                />
                            </div>

                            {/* Section Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Section Order<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={section.order}
                                    onChange={(e) => onUpdateSection(section.id, 'order', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="Enter section order"
                                />
                            </div>

                            {/* Section Marks */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Section Marks<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={section.marks}
                                    onChange={(e) => onUpdateSection(section.id, 'marks', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="0"
                                />
                            </div>

                            {/* Question Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question Type<span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={section.questionType}
                                    onChange={(e) => onUpdateSection(section.id, 'questionType', e.target.value)}
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
                                    Total Questions<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={section.totalQuestions}
                                    onChange={(e) => onUpdateSection(section.id, 'totalQuestions', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="0"
                                />
                            </div>

                            {/* Time Limit */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Time Limit (minutes)<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    value={section.timeLimit}
                                    onChange={(e) => onUpdateSection(section.id, 'timeLimit', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                    placeholder="0"
                                />
                            </div>

                            {/* Is Optional */}
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={section.isOptional}
                                    onChange={(e) => onUpdateSection(section.id, 'isOptional', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="text-sm text-gray-700">
                                    Optional Section
                                </label>
                            </div>
                        </div>

                        {/* Section Instructions */}
                        <div className="p-4 rounded-md border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                                <h4 className="text-sm font-medium text-gray-700">Instructions</h4>
                                <button
                                    type="button"
                                    onClick={() => onAddInstruction(section.id)}
                                    disabled={section.instructions.length >= 10}
                                    className={`px-3 py-1 text-sm rounded-md ${section.instructions.length >= 10
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary text-white cursor-pointer'
                                        }`}
                                >
                                    Add Instruction ({section.instructions.length}/10)
                                </button>
                            </div>

                            {/* Instructions List */}
                            {section.instructions.map((instruction, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-2">
                                    <span className="text-gray-700 text-sm">{index + 1}.</span>
                                    <input
                                        type="text"
                                        value={instruction}
                                        onChange={(e) => onInstructionChange(section.id, index, e.target.value)}
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder="Enter instruction"
                                    />
                                    <button
                                        type="button"
                                        className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer"
                                        onClick={() => onDeleteInstruction(section.id, index)}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ExamSection;