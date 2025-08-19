import { Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

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

const ExamStructure = () => {
    const [sections, setSections] = useState<Section[]>([]);

    const createNewSection = (): Section => ({
        id: Date.now().toString(),
        name: '',
        order: '',
        marks: '',
        questionType: 'MCQ',
        totalQuestions: '',
        timeLimit: '',
        isOptional: false,
        instructions: [],
        isExpanded: true
    });

    const handleAddSection = () => {
        if (sections.length < 5) {
            setSections([...sections, createNewSection()]);
        }
    };

    const handleDeleteSection = (sectionId: string) => {
        setSections(sections.filter(section => section.id !== sectionId));
    };

    const toggleSection = (sectionId: string) => {
        setSections(sections.map(section =>
            section.id === sectionId
                ? { ...section, isExpanded: !section.isExpanded }
                : section
        ));
    };

    const updateSection = (sectionId: string, field: keyof Section, value: any) => {
        setSections(sections.map(section =>
            section.id === sectionId
                ? { ...section, [field]: value }
                : section
        ));
    };

    const handleAddInstruction = (sectionId: string) => {
        const section = sections.find(s => s.id === sectionId);
        if (section && section.instructions.length < 10) {
            updateSection(sectionId, 'instructions', [...section.instructions, '']);
        }
    };

    const handleInstructionChange = (sectionId: string, index: number, value: string) => {
        const section = sections.find(s => s.id === sectionId);
        if (section) {
            const updated = [...section.instructions];
            updated[index] = value;
            updateSection(sectionId, 'instructions', updated);
        }
    };

    const handleDeleteInstruction = (sectionId: string, index: number) => {
        const section = sections.find(s => s.id === sectionId);
        if (section) {
            const updated = section.instructions.filter((_, i) => i !== index);
            updateSection(sectionId, 'instructions', updated);
        }
    };

    return (
        <div className='p-4 space-y-4'>
            {/* Add Section Button */}
            <div className="flex justify-center">
                <button
                    type="button"
                    onClick={handleAddSection}
                    disabled={sections.length >= 5}
                    className={`px-6 py-1.5 rounded-md flex items-center space-x-2 font-medium ${sections.length >= 5
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-primary text-white cursor-pointer'
                        }`}
                >
                    <span>Add Section</span>
                </button>
            </div>

            {/* Sections */}
            {sections.map((section, sectionIndex) => (
                <div key={section.id} className="border border-gray-300 rounded-md">
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
                                onClick={() => toggleSection(section.id)}
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
                                onClick={() => handleDeleteSection(section.id)}
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
                                        Section Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={section.name}
                                        onChange={(e) => updateSection(section.id, 'name', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder="Enter section name"
                                    />
                                </div>

                                {/* Section Order */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Section Order *
                                    </label>
                                    <input
                                        type="text"
                                        value={section.order}
                                        onChange={(e) => updateSection(section.id, 'order', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder="Enter section order"
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
                                        value={section.marks}
                                        onChange={(e) => updateSection(section.id, 'marks', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder="0"
                                    />
                                </div>

                                {/* Question Type */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Question Type *
                                    </label>
                                    <select
                                        value={section.questionType}
                                        onChange={(e) => updateSection(section.id, 'questionType', e.target.value)}
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
                                        value={section.totalQuestions}
                                        onChange={(e) => updateSection(section.id, 'totalQuestions', e.target.value)}
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
                                        value={section.timeLimit}
                                        onChange={(e) => updateSection(section.id, 'timeLimit', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                        placeholder="0"
                                    />
                                </div>

                                {/* Is Optional */}
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={section.isOptional}
                                        onChange={(e) => updateSection(section.id, 'isOptional', e.target.checked)}
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
                                        onClick={() => handleAddInstruction(section.id)}
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
                                            onChange={(e) => handleInstructionChange(section.id, index, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                            placeholder="Enter instruction"
                                        />
                                        <button
                                            type="button"
                                            className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer"
                                            onClick={() => handleDeleteInstruction(section.id, index)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ExamStructure;