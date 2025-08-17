import React from 'react';
import { FormikProps, FieldArray } from 'formik';
import { Plus, Trash2, Edit3, Eye, EyeOff } from 'lucide-react';
import { CreateExamFormValues } from '../../../../FormikSchema/create-exam.schema';
import { CreateExamSection } from '../../../../../../Types/admin.types';
import { QuestionType } from '../../../../../../Utils/enum';

interface ExamStructureProps {
    formik: FormikProps<CreateExamFormValues>;
}

const ExamStructure: React.FC<ExamStructureProps> = ({ formik }) => {
    const { values, errors, setFieldValue } = formik;

    // Add new section
    const addSection = (push: (obj: any) => void) => {
        const newSection: CreateExamSection = {
            sectionName: '',
            sectionOrder: values.examSections.length + 1,
            sectionMarks: 0,
            questionType: QuestionType.MCQ,
            totalQuestions: 0,
            sectionInstructions: [],
            timeLimit: 0,
            isOptional: false,
            questions: []
        };
        push(newSection);
    };

    // Calculate total marks from all sections
    const calculateTotalMarks = () => {
        return values.examSections.reduce((total, section) => total + (section.sectionMarks || 0), 0);
    };

    // Update total marks in the main form when section marks change
    React.useEffect(() => {
        const totalMarks = calculateTotalMarks();
        if (totalMarks !== values.totalMarks) {
            setFieldValue('totalMarks', totalMarks);
        }
    }, [values.examSections]);

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Exam Structure</h3>
                    <p className="text-sm text-gray-600">Define sections and their properties</p>
                </div>
                <div className="text-sm text-gray-600">
                    <span className="font-medium">Total Marks: </span>
                    <span className="text-lg font-bold text-primary">{calculateTotalMarks()}</span>
                </div>
            </div>

            <FieldArray name="examSections">
                {({ push, remove }) => (
                    <>
                        {values.examSections && values.examSections.length > 0 ? (
                            <div className="space-y-4">
                                {values.examSections.map((section, index) => (
                                    <SectionCard
                                        key={index}
                                        section={{
                                            ...section,
                                            sectionInstructions: (section.sectionInstructions || []).filter((instr): instr is string => typeof instr === 'string')
                                        }}
                                        index={index}
                                        formik={formik}
                                        onRemove={() => remove(index)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                                <div className="text-gray-400 mb-4">
                                    <Edit3 className="w-12 h-12 mx-auto" />
                                </div>
                                <p className="text-gray-500 text-lg mb-2">No sections added yet</p>
                                <p className="text-gray-400 text-sm mb-4">Add your first section to get started</p>
                            </div>
                        )}

                        <button
                            type="button"
                            onClick={() => addSection(push)}
                            className="w-full flex items-center justify-center space-x-2 px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors"
                        >
                            <Plus className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600 font-medium">Add Section</span>
                        </button>
                    </>
                )}
            </FieldArray>

            {/* Structure Summary */}
            {values.examSections.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-3">Exam Structure Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="font-medium text-blue-800">Total Sections:</span>
                            <span className="ml-2 text-blue-700">{values.examSections.length}</span>
                        </div>
                        <div>
                            <span className="font-medium text-blue-800">Total Questions:</span>
                            <span className="ml-2 text-blue-700">
                                {values.examSections.reduce((total, section) => total + (section.totalQuestions || 0), 0)}
                            </span>
                        </div>
                        <div>
                            <span className="font-medium text-blue-800">Total Marks:</span>
                            <span className="ml-2 text-blue-700">{calculateTotalMarks()}</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Validation Errors */}
            {errors.examSections && typeof errors.examSections === 'string' && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4">
                    <p className="text-red-700">{errors.examSections}</p>
                </div>
            )}
        </div>
    );
};

// Individual Section Card Component
interface SectionCardProps {
    section: CreateExamSection;
    index: number;
    formik: FormikProps<CreateExamFormValues>;
    onRemove: () => void;
}

const SectionCard: React.FC<SectionCardProps> = ({ section, index, formik, onRemove }) => {
    const { errors, touched, handleChange, handleBlur, setFieldValue } = formik;
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isInstructionsExpanded, setIsInstructionsExpanded] = React.useState(false);

    const sectionErrors = errors.examSections?.[index] as any;
    const sectionTouched = touched.examSections?.[index] as any;

    // Handle instruction changes
    const handleInstructionChange = (instructionIndex: number, value: string) => {
        const updatedInstructions = [...(section.sectionInstructions || [])];
        updatedInstructions[instructionIndex] = value;
        setFieldValue(`examSections.${index}.sectionInstructions`, updatedInstructions);
    };

    const addInstruction = () => {
        const updatedInstructions = [...(section.sectionInstructions || []), ''];
        setFieldValue(`examSections.${index}.sectionInstructions`, updatedInstructions);
        setIsInstructionsExpanded(true);
    };

    const removeInstruction = (instructionIndex: number) => {
        const updatedInstructions = (section.sectionInstructions || []).filter((_, i) => i !== instructionIndex);
        setFieldValue(`examSections.${index}.sectionInstructions`, updatedInstructions);
    };

    return (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
            {/* Section Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <span className="bg-primary text-white text-sm font-medium px-2 py-1 rounded">
                            Section {section.sectionOrder || index + 1}
                        </span>
                        <h4 className="font-medium text-gray-900">
                            {section.sectionName || `Section ${index + 1}`}
                        </h4>
                        <span className="text-sm text-gray-500">
                            ({section.questionType}) - {section.sectionMarks} marks
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                        >
                            {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                            type="button"
                            onClick={onRemove}
                            className="p-1 text-red-400 hover:text-red-600"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Section Content */}
            {isExpanded && (
                <div className="p-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Section Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Section Name *
                            </label>
                            <input
                                type="text"
                                name={`examSections.${index}.sectionName`}
                                value={section.sectionName}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm ${sectionErrors?.sectionName && sectionTouched?.sectionName ? 'border-red-500' : ''
                                    }`}
                                placeholder="Enter section name"
                            />
                            {sectionErrors?.sectionName && sectionTouched?.sectionName && (
                                <p className="mt-1 text-xs text-red-600">{sectionErrors.sectionName}</p>
                            )}
                        </div>

                        {/* Question Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question Type *
                            </label>
                            <select
                                name={`examSections.${index}.questionType`}
                                value={section.questionType}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                                name={`examSections.${index}.totalQuestions`}
                                value={section.totalQuestions}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                                name={`examSections.${index}.sectionMarks`}
                                value={section.sectionMarks}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                                name={`examSections.${index}.timeLimit`}
                                value={section.timeLimit || ''}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm"
                                placeholder="0"
                            />
                        </div>

                        {/* Is Optional */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id={`examSections.${index}.isOptional`}
                                name={`examSections.${index}.isOptional`}
                                checked={section.isOptional || false}
                                onChange={handleChange}
                                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                            />
                            <label htmlFor={`examSections.${index}.isOptional`} className="text-sm text-gray-700">
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
                                onClick={addInstruction}
                                className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                            >
                                Add Instruction
                            </button>
                        </div>

                        {isInstructionsExpanded || (section.sectionInstructions && section.sectionInstructions.length > 0) ? (
                            <div className="space-y-2">
                                {(section.sectionInstructions || []).map((instruction, instructionIndex) => (
                                    <div key={instructionIndex} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={instruction}
                                            onChange={(e) => handleInstructionChange(instructionIndex, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                                            placeholder={`Instruction ${instructionIndex + 1}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => removeInstruction(instructionIndex)}
                                            className="p-1 text-red-400 hover:text-red-600"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setIsInstructionsExpanded(false)}
                                    className="text-xs text-gray-500 hover:text-gray-700"
                                >
                                    Collapse
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsInstructionsExpanded(true)}
                                className="text-sm text-gray-500 italic hover:text-gray-700"
                            >
                                Click to add instructions...
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExamStructure;