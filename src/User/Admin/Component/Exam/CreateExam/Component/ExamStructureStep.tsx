import React from 'react';
import { Field, FieldArray } from 'formik';
import { Plus, Trash2 } from 'lucide-react';
import { CreateExamFormValues } from '../../../../../../Types/admin.types';
import { QuestionType } from '../../../../../../Utils/enum';


interface ExamStructureStepProps {
    values: CreateExamFormValues;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
}


const ExamStructureStep: React.FC<ExamStructureStepProps> = ({ values, errors, touched, setFieldValue }) => {
    const addNewSection = () => {
        const newSection = {
            sectionName: '',
            sectionOrder: (values.examSections?.length || 0) + 1,
            sectionMarks: 0,
            questionType: QuestionType.MCQ,
            totalQuestions: 0,
            sectionInstructions: [],
            timeLimit: 0,
            isOptional: false,
            questions: []
        };
        setFieldValue('examSections', [...(values.examSections || []), newSection]);
    };

    const removeSection = (index: number) => {
        const updatedSections = values.examSections?.filter((_, i) => i !== index) || [];
        // Reorder sections
        const reorderedSections = updatedSections.map((section, i) => ({
            ...section,
            sectionOrder: i + 1
        }));
        setFieldValue('examSections', reorderedSections);
    };

    const addInstruction = (sectionIndex: number) => {
        const currentInstructions = values.examSections?.[sectionIndex]?.sectionInstructions || [];
        setFieldValue(`examSections.${sectionIndex}.sectionInstructions`, [...currentInstructions, '']);
    };

    const removeInstruction = (sectionIndex: number, instructionIndex: number) => {
        const currentInstructions = values.examSections?.[sectionIndex]?.sectionInstructions || [];
        const updatedInstructions = currentInstructions.filter((_, i) => i !== instructionIndex);
        setFieldValue(`examSections.${sectionIndex}.sectionInstructions`, updatedInstructions);
    };

    const calculateTotalMarks = () => {
        return values.examSections?.reduce((total, section) => total + (section.sectionMarks || 0), 0) || 0;
    };

    const calculateTotalQuestions = () => {
        return values.examSections?.reduce((total, section) => total + (section.totalQuestions || 0), 0) || 0;
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Exam Structure & Sections</h3>
                    <button
                        type="button"
                        onClick={addNewSection}
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
                        <p className="text-2xl font-bold text-blue-900">{values.examSections?.length || 0}</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h4 className="text-sm font-medium text-green-800">Total Questions</h4>
                        <p className="text-2xl font-bold text-green-900">{calculateTotalQuestions()}</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h4 className="text-sm font-medium text-purple-800">Section Marks Total</h4>
                        <p className="text-2xl font-bold text-purple-900">
                            {calculateTotalMarks()} / {values.totalMarks}
                        </p>
                        {calculateTotalMarks() !== values.totalMarks && (
                            <p className="text-xs text-red-600 mt-1">Must equal total exam marks</p>
                        )}
                    </div>
                </div>

                <FieldArray name="examSections">
                    {() => (
                        <div className="space-y-6">
                            {values.examSections?.map((section, sectionIndex) => (
                                <div key={sectionIndex} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-md font-semibold text-gray-800">
                                            Section {section.sectionOrder}
                                        </h4>
                                        <button
                                            type="button"
                                            onClick={() => removeSection(sectionIndex)}
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
                                            <Field
                                                name={`examSections.${sectionIndex}.sectionName`}
                                                type="text"
                                                placeholder="e.g., Multiple Choice Questions"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.examSections?.[sectionIndex]?.sectionName &&
                                                    touched.examSections?.[sectionIndex]?.sectionName
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.examSections?.[sectionIndex]?.sectionName &&
                                                touched.examSections?.[sectionIndex]?.sectionName && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.examSections[sectionIndex].sectionName}
                                                    </p>
                                                )}
                                        </div>

                                        {/* Question Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Question Type *
                                            </label>
                                            <Field
                                                as="select"
                                                name={`examSections.${sectionIndex}.questionType`}
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.examSections?.[sectionIndex]?.questionType &&
                                                    touched.examSections?.[sectionIndex]?.questionType
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                    }`}
                                            >
                                                {Object.values(QuestionType).map((type) => (
                                                    <option key={type} value={type}>
                                                        {type.replace('_', ' ')}
                                                    </option>
                                                ))}
                                            </Field>
                                            {errors.examSections?.[sectionIndex]?.questionType &&
                                                touched.examSections?.[sectionIndex]?.questionType && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.examSections[sectionIndex].questionType}
                                                    </p>
                                                )}
                                        </div>

                                        {/* Section Marks */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Section Marks *
                                            </label>
                                            <Field
                                                name={`examSections.${sectionIndex}.sectionMarks`}
                                                type="number"
                                                min="1"
                                                placeholder="0"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.examSections?.[sectionIndex]?.sectionMarks &&
                                                    touched.examSections?.[sectionIndex]?.sectionMarks
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.examSections?.[sectionIndex]?.sectionMarks &&
                                                touched.examSections?.[sectionIndex]?.sectionMarks && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.examSections[sectionIndex].sectionMarks}
                                                    </p>
                                                )}
                                        </div>

                                        {/* Total Questions */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Total Questions *
                                            </label>
                                            <Field
                                                name={`examSections.${sectionIndex}.totalQuestions`}
                                                type="number"
                                                min="1"
                                                placeholder="0"
                                                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.examSections?.[sectionIndex]?.totalQuestions &&
                                                    touched.examSections?.[sectionIndex]?.totalQuestions
                                                    ? 'border-red-500'
                                                    : 'border-gray-300'
                                                    }`}
                                            />
                                            {errors.examSections?.[sectionIndex]?.totalQuestions &&
                                                touched.examSections?.[sectionIndex]?.totalQuestions && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.examSections[sectionIndex].totalQuestions}
                                                    </p>
                                                )}
                                        </div>

                                        {/* Time Limit */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Time Limit (minutes)
                                            </label>
                                            <Field
                                                name={`examSections.${sectionIndex}.timeLimit`}
                                                type="number"
                                                min="0"
                                                placeholder="0"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                            <p className="mt-1 text-xs text-gray-500">0 = No time limit for this section</p>
                                        </div>

                                        {/* Is Optional */}
                                        <div className="flex items-center space-x-2">
                                            <Field
                                                name={`examSections.${sectionIndex}.isOptional`}
                                                type="checkbox"
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
                                        <FieldArray name={`examSections.${sectionIndex}.sectionInstructions`}>
                                            {() => (
                                                <div className="space-y-2">
                                                    {section.sectionInstructions?.map((instruction, instructionIndex) => (
                                                        <div key={instructionIndex} className="flex items-center space-x-2">
                                                            <Field
                                                                name={`examSections.${sectionIndex}.sectionInstructions.${instructionIndex}`}
                                                                type="text"
                                                                placeholder={`Instruction ${instructionIndex + 1}`}
                                                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removeInstruction(sectionIndex, instructionIndex)}
                                                                className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                                            >
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </div>
                                                    ))}
                                                    <button
                                                        type="button"
                                                        onClick={() => addInstruction(sectionIndex)}
                                                        className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
                                                    >
                                                        <Plus size={16} className="mr-1" />
                                                        Add Instruction
                                                    </button>
                                                </div>
                                            )}
                                        </FieldArray>
                                    </div>
                                </div>
                            )) || (
                                    <div className="text-center py-8">
                                        <p className="text-gray-500">No sections added yet. Click "Add Section" to start.</p>
                                    </div>
                                )}
                        </div>
                    )}
                </FieldArray>

                {/* Validation Messages */}
                {errors.examSections && typeof errors.examSections === 'string' && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-sm text-red-600">{errors.examSections}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamStructureStep;