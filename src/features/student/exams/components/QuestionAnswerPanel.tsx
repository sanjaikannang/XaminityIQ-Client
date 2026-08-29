import { QuestionType } from "../../../../utils/enum";
import WrittenAnswerCapture from "./WrittenAnswerCapture";
import TypingAnswerEditor from "./TypingAnswerEditor";
import type { AttemptQuestionData } from "../../../../types/student-exam-types";

type LocalAnswer = { selectedOptionId?: string; selectedOptionIds?: string[] };

interface QuestionAnswerPanelProps {
    question: AttemptQuestionData;
    questionNumber: number;
    sectionLabel?: string;
    attemptId: string;
    answer?: LocalAnswer;
    answerText?: string;
    onSelectMcq: (optionId: string) => void;
    onToggleMsq: (optionId: string) => void;
    onChangeText: (text: string) => void;
}

// Column 2 of the exam-room layout — the interactive answer area, whose
// content depends entirely on the question type: MCQ/MSQ options, the QR
// written-answer capture flow, or the Typing rich-text editor.
const QuestionAnswerPanel = ({
    question,
    questionNumber,
    sectionLabel,
    attemptId,
    answer,
    answerText,
    onSelectMcq,
    onToggleMsq,
    onChangeText,
}: QuestionAnswerPanelProps) => {
    return (
        <div className="bg-whiteColor rounded-xl border border-borderDefault p-6 space-y-4 h-full">
            <p className="text-sm font-semibold text-textPrimary">Your Answer</p>

            {question.type === QuestionType.WRITTEN && (
                <WrittenAnswerCapture
                    key={question._id}
                    attemptId={attemptId}
                    questionId={question._id}
                    questionNumber={questionNumber}
                    sectionLabel={sectionLabel}
                />
            )}

            {question.type === QuestionType.TYPING && (
                <TypingAnswerEditor key={question._id} initialValue={answerText} onChange={onChangeText} />
            )}

            {question.type === QuestionType.MCQ && (
                <div className="space-y-2">
                    {question.options?.map((option) => {
                        const selected = answer?.selectedOptionId === option.optionId;
                        return (
                            <label
                                key={option.optionId}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selected ? "border-primary bg-primary/5" : "border-borderLight hover:bg-bgSecondary"}`}
                            >
                                <input
                                    type="radio"
                                    name={`q-${question._id}`}
                                    checked={selected}
                                    onChange={() => onSelectMcq(option.optionId)}
                                    className="h-4 w-4 accent-primary"
                                />
                                <span className="text-textPrimary">{option.text}</span>
                            </label>
                        );
                    })}
                </div>
            )}

            {question.type === QuestionType.MSQ && (
                <div className="space-y-2">
                    {question.options?.map((option) => {
                        const selected = (answer?.selectedOptionIds || []).includes(option.optionId);
                        return (
                            <label
                                key={option.optionId}
                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${selected ? "border-primary bg-primary/5" : "border-borderLight hover:bg-bgSecondary"}`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selected}
                                    onChange={() => onToggleMsq(option.optionId)}
                                    className="h-4 w-4 accent-primary"
                                />
                                <span className="text-textPrimary">{option.text}</span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default QuestionAnswerPanel;
