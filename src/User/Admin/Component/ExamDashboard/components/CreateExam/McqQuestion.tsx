import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Option {
    text: string;
    isCorrect: boolean;
}

interface Question {
    id: string;
    questionText: string;
    questionType: string;
    marks: number;
    order: number;
    difficulty: string;
    explanation: string;
    options?: Option[];
}

interface McqQuestionProps {
    question: Question;
    questionNumber: number;
    sectionIndex: number;
    sectionId: string;
    questionIndex: number;
    onUpdateQuestion: (sectionId: string, questionIndex: number, field: keyof Question, value: any) => void;
    errors?: any;
    touched?: any;
    isTrueFalse?: boolean;
}

const McqQuestion: React.FC<McqQuestionProps> = ({
    question,
    questionNumber,
    sectionIndex,
    sectionId,
    questionIndex,
    onUpdateQuestion,
    errors,
    touched,
    isTrueFalse = false
}) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    const toggleQuestionExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    // Helper function to check if a field has an error
    const hasError = (fieldName: keyof Question | string) => {
        if (fieldName.includes('.')) {
            // Handle nested field like 'options.0.text'
            const parts = fieldName.split('.');
            let errorObj = errors;
            let touchedObj = touched;

            for (const part of parts) {
                errorObj = errorObj?.[part];
                touchedObj = touchedObj?.[part];
            }

            return errorObj && touchedObj;
        }

        return errors?.[fieldName] && touched?.[fieldName];
    };

    // Helper function to get error message
    const getErrorMessage = (fieldName: keyof Question | string) => {
        if (fieldName.includes('.')) {
            const parts = fieldName.split('.');
            let errorObj = errors;

            for (const part of parts) {
                errorObj = errorObj?.[part];
            }

            return errorObj;
        }

        return errors?.[fieldName];
    };

    const handleAddOption = () => {
        if (!isTrueFalse && question.options && question.options.length < 4) {
            const newOptions = [...question.options, { text: '', isCorrect: false }];
            onUpdateQuestion(sectionId, questionIndex, 'options', newOptions);
        }
    };

    const handleOptionTextChange = (index: number, value: string) => {
        if (question.options) {
            const updated = [...question.options];
            updated[index].text = value;
            onUpdateQuestion(sectionId, questionIndex, 'options', updated);
        }
    };

    const handleCorrectChange = (index: number, isCorrect: boolean) => {
        if (question.options) {
            const updated = [...question.options];

            if (isTrueFalse || updated.filter(opt => opt.isCorrect).length === 0 || !isCorrect) {
                updated[index].isCorrect = isCorrect;
            } else if (isCorrect) {
                // For regular MCQ, allow only one correct answer
                const singleCorrect = updated.map((opt, i) => ({
                    ...opt,
                    isCorrect: i === index
                }));
                onUpdateQuestion(sectionId, questionIndex, 'options', singleCorrect);
                return;
            }

            onUpdateQuestion(sectionId, questionIndex, 'options', updated);
        }
    };

    const handleDeleteOption = (index: number) => {
        if (!isTrueFalse && question.options) {
            const updated = question.options.filter((_, i) => i !== index);
            onUpdateQuestion(sectionId, questionIndex, 'options', updated);
        }
    };

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-lg">
                {/* Collapsible Header */}
                <div
                    className="p-4 bg-gray-50 border-b border-gray-200 rounded-t-lg cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={toggleQuestionExpansion}
                >
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-700">
                                Section {sectionIndex + 1} - Question {questionNumber}
                            </span>
                            {/* Error indicator */}
                            {errors && Object.keys(errors).length > 0 && (
                                <span className="w-2 h-2 bg-red-500 rounded-full" title="This question has validation errors"></span>
                            )}
                        </div>

                        <div>
                            {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                        </div>
                    </div>
                </div>

                {/* Expandable Content */}
                {isExpanded && (
                    <div className="p-4 space-y-4">
                        {/* Question Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Question Text<span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                value={question.questionText}
                                onChange={(e) => onUpdateQuestion(sectionId, questionIndex, 'questionText', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 ${hasError('questionText') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your question here..."
                            />
                            {hasError('questionText') && (
                                <p className="text-xs text-red-600 mt-1">{getErrorMessage('questionText')}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Question Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Question Type<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={isTrueFalse ? 'TRUE_FALSE' : 'MCQ'}
                                    readOnly
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none bg-gray-100 text-gray-700"
                                />
                            </div>

                            {/* Marks */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Marks<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={question.marks}
                                    onChange={(e) => onUpdateQuestion(sectionId, questionIndex, 'marks', parseInt(e.target.value) || 1)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 ${hasError('marks') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                {hasError('marks') && (
                                    <p className="text-xs text-red-600 mt-1">{getErrorMessage('marks')}</p>
                                )}
                            </div>

                            {/* Question Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Order<span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    value={question.order}
                                    onChange={(e) => onUpdateQuestion(sectionId, questionIndex, 'order', parseInt(e.target.value) || 1)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 ${hasError('order') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                />
                                {hasError('order') && (
                                    <p className="text-xs text-red-600 mt-1">{getErrorMessage('order')}</p>
                                )}
                            </div>

                            {/* Difficulty Level */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Difficulty<span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={question.difficulty}
                                    onChange={(e) => onUpdateQuestion(sectionId, questionIndex, 'difficulty', e.target.value)}
                                    className={`w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 ${hasError('difficulty') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                        }`}
                                >
                                    <option value="EASY">Easy</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="HARD">Hard</option>
                                </select>
                                {hasError('difficulty') && (
                                    <p className="text-xs text-red-600 mt-1">{getErrorMessage('difficulty')}</p>
                                )}
                            </div>
                        </div>

                        {/* Explanation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Explanation<span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={3}
                                value={question.explanation}
                                onChange={(e) => onUpdateQuestion(sectionId, questionIndex, 'explanation', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 ${hasError('explanation') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Explain the correct answer..."
                            />
                            {hasError('explanation') && (
                                <p className="text-xs text-red-600 mt-1">{getErrorMessage('explanation')}</p>
                            )}
                        </div>

                        {/* Options */}
                        <div className="p-4 rounded-md border border-gray-300 mt-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-medium text-gray-700">
                                    {isTrueFalse ? 'True/False Options' : 'Answer Options'}
                                    <span className="text-red-500">*</span>
                                </h4>
                                {!isTrueFalse && (
                                    <button
                                        type="button"
                                        onClick={handleAddOption}
                                        disabled={!question.options || question.options.length >= 4}
                                        className={`px-3 py-2 text-sm rounded-md cursor-pointer ${!question.options || question.options.length >= 4
                                            ? 'bg-gray-400 text-gray-900 cursor-not-allowed'
                                            : 'bg-primary text-white'
                                            }`}
                                    >
                                        Add Option ({question.options?.length || 0}/4)
                                    </button>
                                )}
                            </div>

                            {/* Global options error */}
                            {hasError('options') && typeof getErrorMessage('options') === 'string' && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                                    {getErrorMessage('options')}
                                </div>
                            )}

                            {/* Options List */}
                            {question.options?.map((option, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-3">
                                    <span className="text-gray-700 font-medium min-w-[20px]">
                                        {String.fromCharCode(65 + index)}.
                                    </span>

                                    <input
                                        type="text"
                                        value={option.text}
                                        onChange={(e) => handleOptionTextChange(index, e.target.value)}
                                        readOnly={isTrueFalse}
                                        className={`flex-1 px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 ${hasError(`options.${index}.text`) ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            } ${isTrueFalse ? 'bg-gray-100' : ''}`}
                                        placeholder={isTrueFalse ? option.text : "Option Text"}
                                    />

                                    <div className="flex items-center space-x-1">
                                        <input
                                            type="checkbox"
                                            checked={option.isCorrect}
                                            onChange={(e) => handleCorrectChange(index, e.target.checked)}
                                            className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded"
                                        />
                                        <label className="text-sm text-gray-700 whitespace-nowrap">Correct</label>
                                    </div>

                                    {!isTrueFalse && (
                                        <button
                                            type="button"
                                            className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer transition-colors"
                                            onClick={() => handleDeleteOption(index)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    )}

                                    {/* Option-specific error */}
                                    {hasError(`options.${index}.text`) && (
                                        <div className="absolute mt-12 text-xs text-red-600">
                                            {getErrorMessage(`options.${index}.text`)}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {!isTrueFalse && (!question.options || question.options.length === 0) && (
                                <div className="text-center py-4 text-gray-500">
                                    <p className="text-sm">Click "Add Option" to create answer choices</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default McqQuestion;