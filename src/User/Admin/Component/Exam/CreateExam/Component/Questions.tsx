import React from 'react';
import { FormikProps } from 'formik';
import { Plus, Trash2, Edit3, ChevronDown, ChevronUp, Copy, Image } from 'lucide-react';
import { CreateExamFormValues } from '../../../../FormikSchema/create-exam.schema';
import { CorrectAnswer, CreateQuestion, QuestionOption } from '../../../../../../Types/admin.types';

interface QuestionsProps {
    formik: FormikProps<CreateExamFormValues>;
}

const Questions: React.FC<QuestionsProps> = ({ formik }) => {
    const { values, setFieldValue } = formik;

    // Add question to a specific section
    const addQuestionToSection = (sectionIndex: number) => {
        const section = values.examSections[sectionIndex];
        const newQuestion: CreateQuestion = {
            questionText: '',
            questionType: section.questionType,
            marks: Math.floor(section.sectionMarks / section.totalQuestions) || 1,
            questionOrder: section.questions.length + 1,
            difficultyLevel: 'MEDIUM',
            options: section.questionType === 'MCQ' ? [
                { optionText: '', isCorrect: false },
                { optionText: '', isCorrect: false },
                { optionText: '', isCorrect: false },
                { optionText: '', isCorrect: false }
            ] : undefined,
            correctAnswers: (section.questionType === 'SHORT_ANSWER' || section.questionType === 'LONG_ANSWER') ? [
                { answerText: '', keywords: [], marks: Math.floor(section.sectionMarks / section.totalQuestions) || 1 }
            ] : undefined,
            correctAnswer: section.questionType === 'TRUE_FALSE' ? false : undefined
        };

        const updatedQuestions = [...section.questions, newQuestion];
        setFieldValue(`examSections.${sectionIndex}.questions`, updatedQuestions);
    };

    // Remove question from section
    const removeQuestionFromSection = (sectionIndex: number, questionIndex: number) => {
        const section = values.examSections[sectionIndex];
        const updatedQuestions = section.questions.filter((_, index) => index !== questionIndex);
        setFieldValue(`examSections.${sectionIndex}.questions`, updatedQuestions);
    };

    // Duplicate question
    const duplicateQuestion = (sectionIndex: number, questionIndex: number) => {
        const section = values.examSections[sectionIndex];
        const questionToDuplicate = { ...section.questions[questionIndex] };
        questionToDuplicate.questionOrder = section.questions.length + 1;
        questionToDuplicate.questionText = `${questionToDuplicate.questionText} (Copy)`;

        const updatedQuestions = [...section.questions, questionToDuplicate];
        setFieldValue(`examSections.${sectionIndex}.questions`, updatedQuestions);
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-900">Questions</h3>
                    <p className="text-sm text-gray-600">Add questions for each section</p>
                </div>
            </div>

            {values.examSections && values.examSections.length > 0 ? (
                <div className="space-y-6">
                    {values.examSections.map((section, sectionIndex) => (
                        <SectionQuestionsCard
                            key={sectionIndex}
                            section={section}
                            sectionIndex={sectionIndex}
                            formik={formik}
                            onAddQuestion={() => addQuestionToSection(sectionIndex)}
                            onRemoveQuestion={(questionIndex) => removeQuestionFromSection(sectionIndex, questionIndex)}
                            onDuplicateQuestion={(questionIndex) => duplicateQuestion(sectionIndex, questionIndex)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <div className="text-gray-400 mb-4">
                        <Edit3 className="w-12 h-12 mx-auto" />
                    </div>
                    <p className="text-gray-500 text-lg mb-2">No sections available</p>
                    <p className="text-gray-400 text-sm">Please add sections in the Exam Structure tab first</p>
                </div>
            )}
        </div>
    );
};

// Section Questions Card Component
interface SectionQuestionsCardProps {
    section: any;
    sectionIndex: number;
    formik: FormikProps<CreateExamFormValues>;
    onAddQuestion: () => void;
    onRemoveQuestion: (questionIndex: number) => void;
    onDuplicateQuestion: (questionIndex: number) => void;
}

const SectionQuestionsCard: React.FC<SectionQuestionsCardProps> = ({
    section,
    sectionIndex,
    formik,
    onAddQuestion,
    onRemoveQuestion,
    onDuplicateQuestion
}) => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const questionsCount = section.questions?.length || 0;
    const requiredQuestions = section.totalQuestions || 0;

    return (
        <div className="border border-gray-200 rounded-lg bg-white shadow-sm">
            {/* Section Header */}
            <div className="p-4 border-b border-gray-200 bg-gray-50 rounded-t-lg">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <h4 className="font-medium text-gray-900">
                            {section.sectionName || `Section ${sectionIndex + 1}`}
                        </h4>
                        <span className="text-sm text-gray-500">
                            ({section.questionType})
                        </span>
                        <span className={`text-sm px-2 py-1 rounded-full ${questionsCount >= requiredQuestions
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {questionsCount}/{requiredQuestions} questions
                        </span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <button
                            type="button"
                            onClick={onAddQuestion}
                            className="flex items-center space-x-1 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary-dark"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add Question</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Questions Content */}
            {isExpanded && (
                <div className="p-4">
                    {section.questions && section.questions.length > 0 ? (
                        <div className="space-y-4">
                            {section.questions.map((question: CreateQuestion, questionIndex: number) => (
                                <QuestionCard
                                    key={questionIndex}
                                    question={question}
                                    questionIndex={questionIndex}
                                    sectionIndex={sectionIndex}
                                    formik={formik}
                                    onRemove={() => onRemoveQuestion(questionIndex)}
                                    onDuplicate={() => onDuplicateQuestion(questionIndex)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-gray-500">
                            <Edit3 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>No questions added yet</p>
                            <p className="text-sm">Click "Add Question" to get started</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Individual Question Card Component
interface QuestionCardProps {
    question: CreateQuestion;
    questionIndex: number;
    sectionIndex: number;
    formik: FormikProps<CreateExamFormValues>;
    onRemove: () => void;
    onDuplicate: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
    question,
    questionIndex,
    sectionIndex,
    formik,
    onRemove,
    onDuplicate
}) => {
    const { handleChange, handleBlur, setFieldValue } = formik;
    const [isExpanded, setIsExpanded] = React.useState(false);

    const questionPath = `examSections.${sectionIndex}.questions.${questionIndex}`;

    // Handle option changes for MCQ
    const handleOptionChange = (optionIndex: number, field: string, value: any) => {
        const updatedOptions = [...(question.options || [])];
        updatedOptions[optionIndex] = { ...updatedOptions[optionIndex], [field]: value };
        setFieldValue(`${questionPath}.options`, updatedOptions);
    };

    // Add new option for MCQ
    const addOption = () => {
        const updatedOptions = [...(question.options || []), { optionText: '', isCorrect: false }];
        setFieldValue(`${questionPath}.options`, updatedOptions);
    };

    // Remove option for MCQ
    const removeOption = (optionIndex: number) => {
        const updatedOptions = (question.options || []).filter((_, index) => index !== optionIndex);
        setFieldValue(`${questionPath}.options`, updatedOptions);
    };

    // Handle correct answer changes for Short/Long answer
    const handleCorrectAnswerChange = (answerIndex: number, field: string, value: any) => {
        const updatedAnswers = [...(question.correctAnswers || [])];
        updatedAnswers[answerIndex] = { ...updatedAnswers[answerIndex], [field]: value };
        setFieldValue(`${questionPath}.correctAnswers`, updatedAnswers);
    };

    // Handle keywords for correct answers
    const handleKeywordChange = (answerIndex: number, keywordIndex: number, value: string) => {
        const updatedAnswers = [...(question.correctAnswers || [])];
        const updatedKeywords = [...(updatedAnswers[answerIndex].keywords || [])];
        updatedKeywords[keywordIndex] = value;
        updatedAnswers[answerIndex] = { ...updatedAnswers[answerIndex], keywords: updatedKeywords };
        setFieldValue(`${questionPath}.correctAnswers`, updatedAnswers);
    };

    const addKeyword = (answerIndex: number) => {
        const updatedAnswers = [...(question.correctAnswers || [])];
        const updatedKeywords = [...(updatedAnswers[answerIndex].keywords || []), ''];
        updatedAnswers[answerIndex] = { ...updatedAnswers[answerIndex], keywords: updatedKeywords };
        setFieldValue(`${questionPath}.correctAnswers`, updatedAnswers);
    };

    const removeKeyword = (answerIndex: number, keywordIndex: number) => {
        const updatedAnswers = [...(question.correctAnswers || [])];
        const updatedKeywords = updatedAnswers[answerIndex].keywords.filter((_, index) => index !== keywordIndex);
        updatedAnswers[answerIndex] = { ...updatedAnswers[answerIndex], keywords: updatedKeywords };
        setFieldValue(`${questionPath}.correctAnswers`, updatedAnswers);
    };

    return (
        <div className="border border-gray-200 rounded-lg bg-white">
            {/* Question Header */}
            <div className="p-3 border-b border-gray-200 bg-gray-50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded">
                            Q{question.questionOrder || questionIndex + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                            {question.questionType} - {question.marks} marks
                        </span>
                        <span className={`text-xs px-2 py-1 rounded ${question.difficultyLevel === 'EASY' ? 'bg-green-100 text-green-800' :
                            question.difficultyLevel === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                            }`}>
                            {question.difficultyLevel}
                        </span>
                    </div>
                    <div className="flex items-center space-x-1">
                        <button
                            type="button"
                            onClick={onDuplicate}
                            className="p-1 text-gray-400 hover:text-gray-600"
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="p-1 text-gray-400 hover:text-gray-600"
                        >
                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
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

            {/* Question Content */}
            {isExpanded && (
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
                                name={`${questionPath}.marks`}
                                value={question.marks}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                                name={`${questionPath}.questionOrder`}
                                value={question.questionOrder}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                                name={`${questionPath}.difficultyLevel`}
                                value={question.difficultyLevel}
                                onChange={handleChange}
                                onBlur={handleBlur}
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
                                    name={`${questionPath}.questionImage`}
                                    value={question.questionImage || ''}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
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
                            name={`${questionPath}.questionText`}
                            value={question.questionText}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                            placeholder="Enter your question here..."
                        />
                    </div>

                    {/* Question Type Specific Fields */}
                    {question.questionType === 'MCQ' && (
                        <MCQOptions
                            options={question.options || []}
                            questionPath={questionPath}
                            onOptionChange={handleOptionChange}
                            onAddOption={addOption}
                            onRemoveOption={removeOption}
                        />
                    )}

                    {(question.questionType === 'SHORT_ANSWER' || question.questionType === 'LONG_ANSWER') && (
                        <TextAnswers
                            correctAnswers={question.correctAnswers || []}
                            questionPath={questionPath}
                            onAnswerChange={handleCorrectAnswerChange}
                            onKeywordChange={handleKeywordChange}
                            onAddKeyword={addKeyword}
                            onRemoveKeyword={removeKeyword}
                        />
                    )}

                    {question.questionType === 'TRUE_FALSE' && (
                        <TrueFalseAnswer
                            correctAnswer={question.correctAnswer}
                            questionPath={questionPath}
                            setFieldValue={setFieldValue}
                        />
                    )}

                    {/* Explanation */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Explanation (Optional)
                        </label>
                        <textarea
                            name={`${questionPath}.explanation`}
                            value={question.explanation || ''}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            rows={2}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                            placeholder="Explain the correct answer..."
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

// MCQ Options Component
interface MCQOptionsProps {
    options: QuestionOption[];
    questionPath: string;
    onOptionChange: (optionIndex: number, field: string, value: any) => void;
    onAddOption: () => void;
    onRemoveOption: (optionIndex: number) => void;
}

const MCQOptions: React.FC<MCQOptionsProps> = ({
    options,
    onOptionChange,
    onAddOption,
    onRemoveOption
}) => {
    const correctOptionsCount = options.filter(option => option.isCorrect).length;

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                    Answer Options *
                </label>
                <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">
                        {correctOptionsCount} correct option(s)
                    </span>
                    <button
                        type="button"
                        onClick={onAddOption}
                        className="text-xs px-2 py-1 bg-primary text-white rounded hover:bg-primary-dark"
                    >
                        Add Option
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {options.map((option, optionIndex) => (
                    <div key={optionIndex} className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            checked={option.isCorrect}
                            onChange={(e) => onOptionChange(optionIndex, 'isCorrect', e.target.checked)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                        />
                        <input
                            type="text"
                            value={option.optionText}
                            onChange={(e) => onOptionChange(optionIndex, 'optionText', e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-primary focus:border-primary"
                            placeholder={`Option ${optionIndex + 1}`}
                        />
                        <input
                            type="url"
                            value={option.optionImage || ''}
                            onChange={(e) => onOptionChange(optionIndex, 'optionImage', e.target.value)}
                            className="w-32 px-2 py-2 border border-gray-300 rounded-md text-xs focus:ring-primary focus:border-primary"
                            placeholder="Image URL"
                        />
                        {options.length > 2 && (
                            <button
                                type="button"
                                onClick={() => onRemoveOption(optionIndex)}
                                className="p-1 text-red-400 hover:text-red-600"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                ))}
            </div>

            {correctOptionsCount === 0 && (
                <p className="mt-1 text-xs text-red-600">Please select at least one correct option</p>
            )}
        </div>
    );
};

// Text Answers Component
interface TextAnswersProps {
    correctAnswers: CorrectAnswer[];
    questionPath: string;
    onAnswerChange: (answerIndex: number, field: string, value: any) => void;
    onKeywordChange: (answerIndex: number, keywordIndex: number, value: string) => void;
    onAddKeyword: (answerIndex: number) => void;
    onRemoveKeyword: (answerIndex: number, keywordIndex: number) => void;
}

const TextAnswers: React.FC<TextAnswersProps> = ({
    correctAnswers,
    onAnswerChange,
    onKeywordChange,
    onAddKeyword,
    onRemoveKeyword
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answers *
            </label>

            {correctAnswers.map((answer, answerIndex) => (
                <div key={answerIndex} className="border border-gray-200 rounded-lg p-3 mb-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        {/* Answer Text */}
                        <div>
                            <label className="block text-xs font-medium text-gray-700 mb-1">
                                Answer Text *
                            </label>
                            <textarea
                                value={answer.answerText}
                                onChange={(e) => onAnswerChange(answerIndex, 'answerText', e.target.value)}
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
                                value={answer.marks}
                                onChange={(e) => onAnswerChange(answerIndex, 'marks', parseInt(e.target.value) || 0)}
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
                                onClick={() => onAddKeyword(answerIndex)}
                                className="text-xs px-2 py-1 bg-secondary text-white rounded hover:bg-secondary-dark"
                            >
                                Add Keyword
                            </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {answer.keywords.map((keyword, keywordIndex) => (
                                <div key={keywordIndex} className="flex items-center space-x-1">
                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => onKeywordChange(answerIndex, keywordIndex, e.target.value)}
                                        className="px-2 py-1 border border-gray-300 rounded text-xs focus:ring-primary focus:border-primary"
                                        placeholder="Keyword"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => onRemoveKeyword(answerIndex, keywordIndex)}
                                        className="p-1 text-red-400 hover:text-red-600"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        {answer.keywords.length === 0 && (
                            <p className="text-xs text-red-600">Please add at least one keyword</p>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

// True/False Answer Component
interface TrueFalseAnswerProps {
    correctAnswer?: boolean;
    questionPath: string;
    setFieldValue: (field: string, value: any) => void;
}

const TrueFalseAnswer: React.FC<TrueFalseAnswerProps> = ({
    correctAnswer,
    questionPath,
    setFieldValue
}) => {
    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Correct Answer *
            </label>
            <div className="flex space-x-4">
                <label className="flex items-center">
                    <input
                        type="radio"
                        name={`${questionPath}.correctAnswer`}
                        checked={correctAnswer === true}
                        onChange={() => setFieldValue(`${questionPath}.correctAnswer`, true)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">True</span>
                </label>
                <label className="flex items-center">
                    <input
                        type="radio"
                        name={`${questionPath}.correctAnswer`}
                        checked={correctAnswer === false}
                        onChange={() => setFieldValue(`${questionPath}.correctAnswer`, false)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-700">False</span>
                </label>
            </div>
        </div>
    );
};

export default Questions;