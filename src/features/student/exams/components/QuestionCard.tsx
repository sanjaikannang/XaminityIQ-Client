import { Bookmark, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../../../common/ui/Button";
import { QuestionType } from "../../../../utils/enum";
import WrittenAnswerCapture from "./WrittenAnswerCapture";
import type { AttemptQuestionData } from "../../../../types/student-exam-types";

type LocalAnswer = { selectedOptionId?: string; selectedOptionIds?: string[] };

interface QuestionCardProps {
    question: AttemptQuestionData;
    index: number;
    total: number;
    attemptId: string;
    answer?: LocalAnswer;
    onSelectMcq: (optionId: string) => void;
    onToggleMsq: (optionId: string) => void;
    isMarked: boolean;
    onToggleMark: () => void;
    onPrev: () => void;
    onNext: () => void;
    canGoPrev: boolean;
    canGoNext: boolean;
}

const QuestionCard = ({
    question,
    index,
    total,
    attemptId,
    answer,
    onSelectMcq,
    onToggleMsq,
    isMarked,
    onToggleMark,
    onPrev,
    onNext,
    canGoPrev,
    canGoNext,
}: QuestionCardProps) => {
    return (
        <div className="bg-whiteColor rounded-xl border border-borderDefault p-6 space-y-5">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="text-sm font-medium text-textSecondary">
                    Question {index + 1} of {total} <span className="text-textTertiary">•</span> {question.marks} mark{question.marks !== 1 ? "s" : ""}
                </p>
                {isMarked && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">
                        <Bookmark className="w-3 h-3" /> Marked for review
                    </span>
                )}
            </div>

            <p className="text-lg text-textPrimary leading-relaxed" style={{ textWrap: "balance" as any }}>{question.text}</p>

            {question.type === QuestionType.WRITTEN && (
                <WrittenAnswerCapture key={question._id} attemptId={attemptId} questionId={question._id} />
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

            <div className="flex items-center justify-between pt-4 border-t border-borderLight">
                <Button variant="outline" size="sm" icon={ChevronLeft} disabled={!canGoPrev} onClick={onPrev}>
                    Previous
                </Button>
                <Button variant="outline" size="sm" icon={Bookmark} onClick={onToggleMark}>
                    {isMarked ? "Unmark Review" : "Mark for Review"}
                </Button>
                <Button variant="outline" size="sm" icon={ChevronRight} iconPosition="right" disabled={!canGoNext} onClick={onNext}>
                    Next
                </Button>
            </div>
        </div>
    );
};

export default QuestionCard;
