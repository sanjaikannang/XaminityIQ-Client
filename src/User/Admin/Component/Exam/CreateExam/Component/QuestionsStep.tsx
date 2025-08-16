import React, { useState } from 'react';
import { Field, FieldArray } from 'formik';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { CreateExamFormValues } from '../../../../../../Types/admin.types';
import { DifficultyLevel, QuestionType } from '../../../../../../Utils/enum';

interface QuestionsStepProps {
    values: CreateExamFormValues;
    errors: any;
    touched: any;
    setFieldValue: (field: string, value: any) => void;
}

const QuestionsStep: React.FC<QuestionsStepProps> = ({ values, setFieldValue }) => {
    const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set([0]));
    const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());

    const toggleSection = (sectionIndex: number) => {
        const newExpanded = new Set(expandedSections);
        if (newExpanded.has(sectionIndex)) {
            newExpanded.delete(sectionIndex);
        } else {
            newExpanded.add(sectionIndex);
        }
        setExpandedSections(newExpanded);
    };

    const toggleQuestion = (questionId: string) => {
        const newExpanded = new Set(expandedQuestions);
        if (newExpanded.has(questionId)) {
            newExpanded.delete(questionId);
        } else {
            newExpanded.add(questionId);
        }
        setExpandedQuestions(newExpanded);
    };

    const addQuestion = (sectionIndex: number) => {
        const section = values.examSections?.[sectionIndex];
        if (!section) return;

        const newQuestion = {
            questionText: '',
            questionImage: '',
            questionType: section.questionType,
            marks: 0,
            questionOrder: (section.questions?.length || 0) + 1,
            difficultyLevel: DifficultyLevel.EASY,
            options: section.questionType === QuestionType.MCQ ? [
                { optionText: '', optionImage: '', isCorrect: false },
                { optionText: '', optionImage: '', isCorrect: false }
            ] : undefined,
            correctAnswers: [QuestionType.SHORT_ANSWER, QuestionType.LONG_ANSWER].includes(section.questionType) ? [
                { answerText: '', keywords: [], marks: 0 }
            ] : undefined,
            correctAnswer: section.questionType === QuestionType.TRUE_FALSE ? false : undefined,
            explanation: ''
        };

        const updatedQuestions = [...(section.questions || []), newQuestion];
        setFieldValue(`examSections.${sectionIndex}.questions`, updatedQuestions);
    };

    const removeQuestion = (sectionIndex: number, questionIndex: number) => {
        const section = values.examSections?.[sectionIndex];
        if (!section) return;

        const updatedQuestions = section.questions?.filter((_, i) => i !== questionIndex) || [];
        // Reorder questions
        const reorderedQuestions = updatedQuestions.map((q, i) => ({
            ...q,
            questionOrder: i + 1
        }));
        setFieldValue(`examSections.${sectionIndex}.questions`, reorderedQuestions);
    };

    const addOption = (sectionIndex: number, questionIndex: number) => {
        const currentOptions = values.examSections?.[sectionIndex]?.questions?.[questionIndex]?.options || [];
        const newOption = { optionText: '', optionImage: '', isCorrect: false };
        setFieldValue(`examSections.${sectionIndex}.questions.${questionIndex}.options`, [...currentOptions, newOption]);
    };

    const removeOption = (sectionIndex: number, questionIndex: number, optionIndex: number) => {
        const currentOptions = values.examSections?.[sectionIndex]?.questions?.[questionIndex]?.options || [];
        const updatedOptions = currentOptions.filter((_, i) => i !== optionIndex);
        setFieldValue(`examSections.${sectionIndex}.questions.${questionIndex}.options`, updatedOptions);
    };

    const addCorrectAnswer = (sectionIndex: number, questionIndex: number) => {
        const currentAnswers = values.examSections?.[sectionIndex]?.questions?.[questionIndex]?.correctAnswers || [];
        const newAnswer = { answerText: '', keywords: [], marks: 0 };
        setFieldValue(`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswers`, [...currentAnswers, newAnswer]);
    };

    const removeCorrectAnswer = (sectionIndex: number, questionIndex: number, answerIndex: number) => {
        const currentAnswers = values.examSections?.[sectionIndex]?.questions?.[questionIndex]?.correctAnswers || [];
        const updatedAnswers = currentAnswers.filter((_, i) => i !== answerIndex);
        setFieldValue(`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswers`, updatedAnswers);
    };

    const addKeyword = (sectionIndex: number, questionIndex: number, answerIndex: number) => {
        const currentKeywords = values.examSections?.[sectionIndex]?.questions?.[questionIndex]?.correctAnswers?.[answerIndex]?.keywords || [];
        setFieldValue(`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswers.${answerIndex}.keywords`, [...currentKeywords, '']);
    };

    const removeKeyword = (sectionIndex: number, questionIndex: number, answerIndex: number, keywordIndex: number) => {
        const currentKeywords = values.examSections?.[sectionIndex]?.questions?.[questionIndex]?.correctAnswers?.[answerIndex]?.keywords || [];
        const updatedKeywords = currentKeywords.filter((_, i) => i !== keywordIndex);
        setFieldValue(`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswers.${answerIndex}.keywords`, updatedKeywords);
    };

    const getQuestionProgress = (sectionIndex: number) => {
        const section = values.examSections?.[sectionIndex];
        if (!section) return { current: 0, total: 0 };
        return {
            current: section.questions?.length || 0,
            total: section.totalQuestions || 0
        };
    };

    const renderQuestionForm = (sectionIndex: number, questionIndex: number, question: any) => {
        const questionId = `${sectionIndex}-${questionIndex}`;
        const isExpanded = expandedQuestions.has(questionId);

        return (
            <div key={questionIndex} className="border border-gray-200 rounded-lg bg-white">
                {/* Question Header */}
                <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleQuestion(questionId)}
                >
                    <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-gray-600">Q{question.questionOrder}</span>
                        <span className="text-sm text-gray-800">
                            {question.questionText || 'Untitled Question'}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${question.difficultyLevel === DifficultyLevel.EASY ? 'bg-green-100 text-green-800' :
                            question.difficultyLevel === DifficultyLevel.MEDIUM ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {question.difficultyLevel}
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">{question.marks} marks</span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                removeQuestion(sectionIndex, questionIndex);
                            }}
                            className="text-red-600 hover:text-red-800 p-1"
                        >
                            <Trash2 size={14} />
                        </button>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                </div>

                {/* Question Content */}
                {isExpanded && (
                    <div className="p-4 border-t border-gray-200 space-y-4">
                        {/* Basic Question Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Difficulty Level *
                                </label>
                                <Field
                                    as="select"
                                    name={`examSections.${sectionIndex}.questions.${questionIndex}.difficultyLevel`}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {Object.values(DifficultyLevel).map((level) => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </Field>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Marks *
                                </label>
                                <Field
                                    name={`examSections.${sectionIndex}.questions.${questionIndex}.marks`}
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
                            <Field
                                as="textarea"
                                name={`examSections.${sectionIndex}.questions.${questionIndex}.questionText`}
                                rows={3}
                                placeholder="Enter your question here..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Question Image */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Question Image URL (Optional)
                            </label>
                            <Field
                                name={`examSections.${sectionIndex}.questions.${questionIndex}.questionImage`}
                                type="text"
                                placeholder="https://example.com/image.jpg"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* MCQ Options */}
                        {question.questionType === QuestionType.MCQ && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Options *
                                </label>
                                <FieldArray name={`examSections.${sectionIndex}.questions.${questionIndex}.options`}>
                                    {() => (
                                        <div className="space-y-3">
                                            {question.options?.map((option: any, optionIndex: number) => (
                                                <div key={optionIndex} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-md">
                                                    <Field
                                                        name={`examSections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}.isCorrect`}
                                                        type="checkbox"
                                                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                                    />
                                                    <Field
                                                        name={`examSections.${sectionIndex}.questions.${questionIndex}.options.${optionIndex}.optionText`}
                                                        type="text"
                                                        placeholder={`Option ${optionIndex + 1}`}
                                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeOption(sectionIndex, questionIndex, optionIndex)}
                                                        className="text-red-600 hover:text-red-800 p-1"
                                                        disabled={question.options?.length <= 2}
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addOption(sectionIndex, questionIndex)}
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                                            >
                                                <Plus size={16} className="mr-1" />
                                                Add Option
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>
                        )}

                        {/* True/False Answer */}
                        {question.questionType === QuestionType.TRUE_FALSE && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correct Answer *
                                </label>
                                <div className="flex space-x-4">
                                    <label className="flex items-center space-x-2">
                                        <Field
                                            name={`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswer`}
                                            type="radio"
                                            value="true"
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span>True</span>
                                    </label>
                                    <label className="flex items-center space-x-2">
                                        <Field
                                            name={`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswer`}
                                            type="radio"
                                            value="false"
                                            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                        />
                                        <span>False</span>
                                    </label>
                                </div>
                            </div>
                        )}

                        {/* Short/Long Answer Correct Answers */}
                        {[QuestionType.SHORT_ANSWER, QuestionType.LONG_ANSWER].includes(question.questionType) && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Correct Answers *
                                </label>
                                <FieldArray name={`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswers`}>
                                    {() => (
                                        <div className="space-y-4">
                                            {question.correctAnswers?.map((answer: any, answerIndex: number) => (
                                                <div key={answerIndex} className="border border-gray-200 rounded-md p-4">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <h5 className="text-sm font-medium text-gray-700">Answer {answerIndex + 1}</h5>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeCorrectAnswer(sectionIndex, questionIndex, answerIndex)}
                                                            className="text-red-600 hover:text-red-800 p-1"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </div>

                                                    <div className="space-y-3">
                                                        <div>
                                                            <Field
                                                                name={`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswers.${answerIndex}.answerText`}
                                                                as="textarea"
                                                                rows={2}
                                                                placeholder="Enter the correct answer..."
                                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            />
                                                        </div>

                                                        <div>
                                                            <Field
                                                                name={`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswers.${answerIndex}.marks`}
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
                                                            <FieldArray name={`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswers.${answerIndex}.keywords`}>
                                                                {() => (
                                                                    <div className="space-y-2">
                                                                        {answer.keywords?.map((keyword: string, keywordIndex: number) => (
                                                                            <div key={keywordIndex} className="flex items-center space-x-2">
                                                                                <Field
                                                                                    name={`examSections.${sectionIndex}.questions.${questionIndex}.correctAnswers.${answerIndex}.keywords.${keywordIndex}`}
                                                                                    type="text"
                                                                                    placeholder={`Keyword ${keywordIndex + 1}`}
                                                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                                                />
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={() => removeKeyword(sectionIndex, questionIndex, answerIndex, keywordIndex)}
                                                                                    className="text-red-600 hover:text-red-800 p-1"
                                                                                >
                                                                                    <Trash2 size={14} />
                                                                                </button>
                                                                            </div>
                                                                        ))}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => addKeyword(sectionIndex, questionIndex, answerIndex)}
                                                                            className="inline-flex items-center px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                                                                        >
                                                                            <Plus size={14} className="mr-1" />
                                                                            Add Keyword
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </FieldArray>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => addCorrectAnswer(sectionIndex, questionIndex)}
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100"
                                            >
                                                <Plus size={16} className="mr-1" />
                                                Add Correct Answer
                                            </button>
                                        </div>
                                    )}
                                </FieldArray>
                            </div>
                        )}

                        {/* Explanation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Explanation (Optional)
                            </label>
                            <Field
                                as="textarea"
                                name={`examSections.${sectionIndex}.questions.${questionIndex}.explanation`}
                                rows={2}
                                placeholder="Provide an explanation for the correct answer..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Questions & Answers</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Add questions for each section. Make sure the number of questions matches what you specified in the previous step.
                </p>

                {values.examSections?.length === 0 ? (
                    <div className="text-center py-8">
                        <p className="text-gray-500">No sections available. Please go back and add sections first.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {values.examSections?.map((section, sectionIndex) => {
                            const progress = getQuestionProgress(sectionIndex);
                            const isExpanded = expandedSections.has(sectionIndex);

                            return (
                                <div key={sectionIndex} className="border border-gray-200 rounded-lg">
                                    {/* Section Header */}
                                    <div
                                        className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                                        onClick={() => toggleSection(sectionIndex)}
                                    >
                                        <div>
                                            <h4 className="text-md font-semibold text-gray-800">
                                                {section.sectionName || `Section ${section.sectionOrder}`}
                                            </h4>
                                            <p className="text-sm text-gray-600">
                                                {section.questionType} • {progress.current}/{progress.total} questions • {section.sectionMarks} marks
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center space-x-2">
                                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                                        style={{
                                                            width: `${progress.total > 0 ? (progress.current / progress.total) * 100 : 0}%`
                                                        }}
                                                    ></div>
                                                </div>
                                                <span className="text-sm text-gray-500">
                                                    {progress.total > 0 ? Math.round((progress.current / progress.total) * 100) : 0}%
                                                </span>
                                            </div>
                                            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                        </div>
                                    </div>

                                    {/* Section Content */}
                                    {isExpanded && (
                                        <div className="p-4 space-y-4">
                                            {/* Add Question Button */}
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">
                                                    {progress.current < progress.total
                                                        ? `${progress.total - progress.current} more question(s) needed`
                                                        : progress.current > progress.total
                                                            ? `${progress.current - progress.total} extra question(s)`
                                                            : 'All questions added ✓'
                                                    }
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => addQuestion(sectionIndex)}
                                                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                >
                                                    <Plus size={16} className="mr-2" />
                                                    Add Question
                                                </button>
                                            </div>

                                            {/* Questions List */}
                                            <div className="space-y-4">
                                                {section.questions?.length === 0 ? (
                                                    <div className="text-center py-6 border-2 border-dashed border-gray-300 rounded-lg">
                                                        <p className="text-gray-500">No questions added yet</p>
                                                        <p className="text-sm text-gray-400">Click "Add Question" to start</p>
                                                    </div>
                                                ) : (
                                                    section.questions?.map((question, questionIndex) =>
                                                        renderQuestionForm(sectionIndex, questionIndex, question)
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Overall Progress Summary */}
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <h5 className="text-sm font-medium text-blue-800 mb-2">Exam Summary</h5>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span className="text-blue-700 font-medium">Total Sections:</span>
                            <span className="text-blue-900 ml-2">{values.examSections?.length || 0}</span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Total Questions:</span>
                            <span className="text-blue-900 ml-2">
                                {values.examSections?.reduce((total, section) => total + (section.questions?.length || 0), 0) || 0}
                            </span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Expected Questions:</span>
                            <span className="text-blue-900 ml-2">
                                {values.examSections?.reduce((total, section) => total + (section.totalQuestions || 0), 0) || 0}
                            </span>
                        </div>
                        <div>
                            <span className="text-blue-700 font-medium">Total Marks:</span>
                            <span className="text-blue-900 ml-2">{values.totalMarks}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionsStep;