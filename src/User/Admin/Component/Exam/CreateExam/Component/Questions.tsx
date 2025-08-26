import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import McqQuestion from "./McqQuestion";
import ShortAnswer from "./ShortAnswer";
import LongAnswer from "./LongAnswer";
import { Form, Formik } from 'formik';
import { questionsSchema } from '../../../../FormikSchema/create-exam.schema';

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
    // For MCQ and TRUE_FALSE
    options?: Option[];
    // For SHORT_ANSWER
    sampleAnswer?: string;
    keywords?: string[];
    // For LONG_ANSWER
    modelAnswer?: string;
    minWordCount?: number;
    maxWordCount?: number;
}

interface SectionWithQuestions {
    id: string;
    totalQuestions: string;
    questions: Question[];
}

interface QuestionsFormData {
    sections: SectionWithQuestions[];
}

interface QuestionsProps {
    sections: Section[];
    onFormDataChange?: (values: QuestionsFormData, isValid: boolean) => void;
}

const Questions: React.FC<QuestionsProps> = ({ sections, onFormDataChange }) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
    const [sectionsWithQuestions, setSectionsWithQuestions] = useState<SectionWithQuestions[]>([]);

    // Initialize sections with questions when sections prop changes
    useEffect(() => {
        const initializedSections = sections.map(section => {
            const existingSection = sectionsWithQuestions.find(s => s.id === section.id);
            const totalQuestions = parseInt(section.totalQuestions) || 0;

            if (existingSection && existingSection.questions.length === totalQuestions) {
                return existingSection;
            }

            // Create new questions or adjust existing ones
            const questions: Question[] = [];
            for (let i = 0; i < totalQuestions; i++) {
                const existingQuestion = existingSection?.questions[i];
                if (existingQuestion && existingQuestion.questionType === section.questionType) {
                    questions.push(existingQuestion);
                } else {
                    questions.push(createNewQuestion(section.questionType, i + 1));
                }
            }

            return {
                id: section.id,
                totalQuestions: section.totalQuestions,
                questions
            };
        });

        setSectionsWithQuestions(initializedSections);
    }, [sections]);

    const createNewQuestion = (questionType: string, order: number): Question => {
        const baseQuestion: Question = {
            id: Date.now().toString() + Math.random(),
            questionText: '',
            questionType,
            marks: questionType === 'LONG_ANSWER' ? 5 : questionType === 'SHORT_ANSWER' ? 2 : 1,
            order,
            difficulty: 'MEDIUM',
            explanation: ''
        };

        switch (questionType) {
            case 'MCQ':
                return {
                    ...baseQuestion,
                    options: []
                };
            case 'TRUE_FALSE':
                return {
                    ...baseQuestion,
                    options: [
                        { text: 'True', isCorrect: false },
                        { text: 'False', isCorrect: false }
                    ]
                };
            case 'SHORT_ANSWER':
                return {
                    ...baseQuestion,
                    sampleAnswer: '',
                    keywords: []
                };
            case 'LONG_ANSWER':
                return {
                    ...baseQuestion,
                    modelAnswer: '',
                    minWordCount: 150,
                    maxWordCount: 500,
                    keywords: []
                };
            default:
                return baseQuestion;
        }
    };

    const initialValues: QuestionsFormData = {
        sections: sectionsWithQuestions
    };

    const handleFormChange = (values: QuestionsFormData, isValid: boolean) => {
        if (onFormDataChange) {
            onFormDataChange(values, isValid);
        }
    };

    const toggleSectionExpansion = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const updateQuestion = (sectionId: string, questionIndex: number, field: keyof Question, value: any) => {
        setSectionsWithQuestions(prev =>
            prev.map(section =>
                section.id === sectionId
                    ? {
                        ...section,
                        questions: section.questions.map((question, index) =>
                            index === questionIndex
                                ? { ...question, [field]: value }
                                : question
                        )
                    }
                    : section
            )
        );
    };

    const renderQuestionComponent = (
        section: SectionWithQuestions,
        questionIndex: number,
        sectionIndex: number,
        errors: any,
        touched: any
    ) => {
        const question = section.questions[questionIndex];
        if (!question) return null;

        const questionErrors = errors?.sections?.[sectionIndex]?.questions?.[questionIndex];
        const questionTouched = touched?.sections?.[sectionIndex]?.questions?.[questionIndex];

        const commonProps = {
            question,
            questionNumber: questionIndex + 1,
            sectionIndex,
            sectionId: section.id,
            questionIndex,
            onUpdateQuestion: updateQuestion,
            errors: questionErrors,
            touched: questionTouched
        };

        switch (question.questionType) {
            case 'MCQ':
                return <McqQuestion key={question.id} {...commonProps} />;
            case 'SHORT_ANSWER':
                return <ShortAnswer key={question.id} {...commonProps} />;
            case 'LONG_ANSWER':
                return <LongAnswer key={question.id} {...commonProps} />;
            case 'TRUE_FALSE':
                return <McqQuestion key={question.id} {...commonProps} isTrueFalse={true} />;
            default:
                return <McqQuestion key={question.id} {...commonProps} />;
        }
    };

    const handleSubmit = (values: QuestionsFormData) => {
        console.log('Questions form values:', values);
    };

    if (sections.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p className="text-lg">No sections created yet.</p>
                <p className="text-sm mt-2">Please add sections in the Exam Structure step to create questions.</p>
            </div>
        );
    }


    return (
        <>
            <div className="p-4 space-y-4">
                <Formik
                    initialValues={initialValues}
                    validationSchema={questionsSchema}
                    onSubmit={handleSubmit}
                    validateOnChange={true}
                    validateOnBlur={true}
                    enableReinitialize={true}
                    values={{ sections: sectionsWithQuestions }}
                >
                    {({ isValid, errors, touched }) => {
                        // Send form data to parent whenever values change
                        useEffect(() => {
                            handleFormChange({ sections: sectionsWithQuestions }, isValid);
                        }, [sectionsWithQuestions, isValid]);

                        return (
                            <Form>
                                {/* Global validation errors */}
                                {errors.sections && typeof errors.sections === 'string' && (
                                    <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md text-sm">
                                        {errors.sections}
                                    </div>
                                )}

                                {sectionsWithQuestions.map((section, sectionIndex) => {
                                    const originalSection = sections.find(s => s.id === section.id);
                                    if (!originalSection) return null;

                                    const totalQuestions = parseInt(section.totalQuestions) || 0;
                                    const isExpanded = expandedSections[section.id] ?? true;

                                    // Get section-specific errors
                                    const sectionErrors = errors.sections && Array.isArray(errors.sections)
                                        ? errors.sections[sectionIndex]
                                        : {};

                                    return (
                                        <div key={section.id} className="border border-gray-300 rounded-md">
                                            {/* Section Header */}
                                            <div
                                                className="bg-gray-100 p-4 rounded-t-md cursor-pointer hover:bg-gray-200 transition-colors"
                                                onClick={() => toggleSectionExpansion(section.id)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="text-md font-semibold text-gray-800">
                                                            Section {sectionIndex + 1}: {originalSection.name || 'Unnamed Section'}
                                                        </h3>

                                                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                                                            <span>
                                                                {originalSection.questionType.replace('_', ' ')}
                                                            </span>
                                                            <span>
                                                                {totalQuestions} Question{totalQuestions !== 1 ? 's' : ''}
                                                            </span>
                                                            <span>
                                                                {originalSection.marks} Mark{originalSection.marks !== '1' ? 's' : ''}
                                                            </span>
                                                            {/* Error indicator */}
                                                            {sectionErrors && typeof sectionErrors === 'object' && Object.keys(sectionErrors).length > 0 && (
                                                                <span className="w-2 h-2 bg-red-500 rounded-full" title="This section has validation errors"></span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        {isExpanded ? (
                                                            <ChevronUp className="w-5 h-5 text-gray-600" />
                                                        ) : (
                                                            <ChevronDown className="w-5 h-5 text-gray-600" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Section Questions */}
                                            {isExpanded && (
                                                <div className="p-2 space-y-4">
                                                    {totalQuestions === 0 ? (
                                                        <div className="text-center py-8 text-gray-500">
                                                            <p>No questions to display.</p>
                                                            <p className="text-sm mt-1">Please set the total questions count for this section.</p>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-4">
                                                            {section.questions.map((_, questionIndex) =>
                                                                renderQuestionComponent(section, questionIndex, sectionIndex, errors, touched)
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </Form>
                        );
                    }}
                </Formik>
            </div>
        </>
    );
};

export default Questions;