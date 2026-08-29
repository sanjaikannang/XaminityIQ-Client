import type { AttemptQuestionData } from "../../../../types/student-exam-types";

interface QuestionTextPanelProps {
    question: AttemptQuestionData;
    index: number;
    total: number;
}

// Column 1 of the exam-room layout — just the question's own text/marks,
// kept separate from its answer area (column 2) so each can scroll and size
// independently.
const QuestionTextPanel = ({ question, index, total }: QuestionTextPanelProps) => {
    return (
        <div className="bg-whiteColor rounded-xl border border-borderDefault p-6 space-y-4 h-full">
            <p className="text-sm font-medium text-textSecondary">
                Question {index + 1} of {total} <span className="text-textTertiary">•</span> {question.marks} mark{question.marks !== 1 ? "s" : ""}
            </p>
            <p className="text-lg text-textPrimary leading-relaxed" style={{ textWrap: "balance" as any }}>{question.text}</p>
        </div>
    );
};

export default QuestionTextPanel;
