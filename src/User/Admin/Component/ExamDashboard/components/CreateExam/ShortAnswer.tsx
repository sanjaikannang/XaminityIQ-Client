import { Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Question {
    id: string;
    questionText: string;
    questionType: string;
    marks: number;
    order: number;
    difficulty: string;
    explanation: string;
    sampleAnswer?: string;
    keywords?: string[];
}

interface ShortAnswerProps {
    question: Question;
    questionNumber: number;
    sectionIndex: number;
    sectionId: string;
    questionIndex: number;
    onUpdateQuestion: (sectionId: string, questionIndex: number, field: keyof Question, value: any) => void;
    errors?: any;
    touched?: any;
}

const ShortAnswer: React.FC<ShortAnswerProps> = ({
    question,
    questionNumber,
    sectionIndex,
    sectionId,
    questionIndex,
    onUpdateQuestion,
    errors,
    touched
}) => {

    const [isExpanded, setIsExpanded] = useState<boolean>(true);

    const toggleQuestionExpansion = () => {
        setIsExpanded(!isExpanded);
    };

    // Helper function to check if a field has an error
    const hasError = (fieldName: keyof Question | string) => {
        if (fieldName.includes('.')) {
            // Handle nested field like 'keywords.0'
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

    const handleAddKeyword = () => {
        if (!question.keywords || question.keywords.length < 10) {
            const newKeywords = [...(question.keywords || []), ''];
            onUpdateQuestion(sectionId, questionIndex, 'keywords', newKeywords);
        }
    };

    const handleKeywordChange = (index: number, value: string) => {
        if (question.keywords) {
            const updated = [...question.keywords];
            updated[index] = value;
            onUpdateQuestion(sectionId, questionIndex, 'keywords', updated);
        }
    };

    const handleDeleteKeyword = (index: number) => {
        if (question.keywords) {
            const updated = question.keywords.filter((_, i) => i !== index);
            onUpdateQuestion(sectionId, questionIndex, 'keywords', updated);
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
                    <div className="flex items-center justify-between">
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
                                    value="SHORT_ANSWER"
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

                        {/* Answer Text */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sample Answer Text<span className="text-red-500">*</span>
                            </label>
                            <textarea
                                rows={4}
                                value={question.sampleAnswer || ''}
                                onChange={(e) => onUpdateQuestion(sectionId, questionIndex, 'sampleAnswer', e.target.value)}
                                className={`w-full px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 ${hasError('sampleAnswer') ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Provide a sample answer or key points for evaluation..."
                            />
                            {hasError('sampleAnswer') && (
                                <p className="text-xs text-red-600 mt-1">{getErrorMessage('sampleAnswer')}</p>
                            )}
                        </div>

                        {/* Keywords Section */}
                        <div className="p-4 rounded-md border border-gray-300 mt-4">
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-medium text-gray-700">
                                    Keywords<span className="text-red-500">*</span>
                                </h4>
                                <button
                                    type="button"
                                    onClick={handleAddKeyword}
                                    disabled={!question.keywords ? false : question.keywords.length >= 10}
                                    className={`px-3 py-2 text-sm rounded-md cursor-pointer transition-colors ${question.keywords && question.keywords.length >= 10
                                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                            : 'bg-primary text-white'
                                        }`}
                                >
                                    Add Keyword ({question.keywords?.length || 0}/10)
                                </button>
                            </div>

                            {/* Global keywords error */}
                            {hasError('keywords') && typeof getErrorMessage('keywords') === 'string' && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                                    {getErrorMessage('keywords')}
                                </div>
                            )}

                            {/* Keywords List */}
                            {question.keywords?.map((keyword, index) => (
                                <div key={index} className="flex items-center space-x-2 mb-3">
                                    <span className="text-gray-700 font-medium min-w-[24px]">
                                        {index + 1}.
                                    </span>

                                    <input
                                        type="text"
                                        value={keyword}
                                        onChange={(e) => handleKeywordChange(index, e.target.value)}
                                        className={`flex-1 px-3 py-2 border rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500 ${hasError(`keywords.${index}`) ? 'border-red-500 bg-red-50' : 'border-gray-300'
                                            }`}
                                        placeholder="Enter keyword or key phrase"
                                    />

                                    <button
                                        type="button"
                                        className="p-2 bg-red-500 text-white rounded-sm hover:bg-red-600 cursor-pointer transition-colors"
                                        onClick={() => handleDeleteKeyword(index)}
                                    >
                                        <Trash2 size={18} />
                                    </button>

                                    {/* Keyword-specific error */}
                                    {hasError(`keywords.${index}`) && (
                                        <div className="absolute mt-12 text-xs text-red-600">
                                            {getErrorMessage(`keywords.${index}`)}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {(!question.keywords || question.keywords.length === 0) && (
                                <div className="text-center py-4 text-gray-500">
                                    <p className="text-sm">Add keywords that should appear in the answer for automatic scoring</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default ShortAnswer;