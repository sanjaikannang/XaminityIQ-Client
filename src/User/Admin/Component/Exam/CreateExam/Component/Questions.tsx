import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import McqQuestion from "./McqQuestion";
import ShortAnswer from "./ShortAnswer";
import LongAnswer from "./LongAnswer";

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

interface QuestionsProps {
    sections: Section[];
}

const Questions: React.FC<QuestionsProps> = ({ sections }) => {
    const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

    const toggleSectionExpansion = (sectionId: string) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId]
        }));
    };

    const renderQuestionComponent = (questionType: string, questionIndex: number, sectionId: string, sectionIndex: number) => {
        const key = `${sectionId}-${questionIndex}`;

        switch (questionType) {
            case 'MCQ':
                return <McqQuestion key={key} questionNumber={questionIndex + 1} sectionIndex={sectionIndex} />;
            case 'SHORT_ANSWER':
                return <ShortAnswer key={key} questionNumber={questionIndex + 1} sectionIndex={sectionIndex} />;
            case 'LONG_ANSWER':
                return <LongAnswer key={key} questionNumber={questionIndex + 1} sectionIndex={sectionIndex} />;
            case 'TRUE_FALSE':
                return <McqQuestion key={key} questionNumber={questionIndex + 1} sectionIndex={sectionIndex} isTrueFalse={true} />;
            default:
                return <McqQuestion key={key} questionNumber={questionIndex + 1} sectionIndex={sectionIndex} />;
        }
    };

    const renderQuestionsForSection = (section: Section, sectionIndex: number) => {
        const totalQuestions = parseInt(section.totalQuestions) || 0;
        const questions = [];

        for (let i = 0; i < totalQuestions; i++) {
            questions.push(renderQuestionComponent(section.questionType, i, section.id, sectionIndex));
        }

        return questions;
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
                {sections.map((section, sectionIndex) => {
                    const totalQuestions = parseInt(section.totalQuestions) || 0;
                    const isExpanded = expandedSections[section.id] ?? true;

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
                                            Section {sectionIndex + 1}: {section.name || 'Unnamed Section'}
                                        </h3>

                                        <div className="flex items-center space-x-4 text-xs text-gray-600">
                                            <span>
                                                {section.questionType.replace('_', ' ')}
                                            </span>
                                            <span>
                                                {totalQuestions} Question{totalQuestions !== 1 ? 's' : ''}
                                            </span>
                                            <span>
                                                {section.marks} Mark{section.marks !== '1' ? 's' : ''}
                                            </span>
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

                                {/* Section Instructions */}
                                {section.instructions.length > 0 && (
                                    <div className="mt-3 p-2 bg-blue-50 rounded border-l-4 border-blue-400">
                                        <h4 className="text-sm font-medium text-blue-900 mb-2">Section Instructions:</h4>
                                        <ul className="text-sm text-blue-800 space-y-1">
                                            {section.instructions.map((instruction, index) => (
                                                <li key={index} className="flex items-start">
                                                    <span className="mr-2">{index + 1}.</span>
                                                    <span>{instruction}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
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
                                            {renderQuestionsForSection(section, sectionIndex)}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </>
    );
};

export default Questions;