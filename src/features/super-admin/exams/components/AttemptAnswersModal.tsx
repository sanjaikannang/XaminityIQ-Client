import { CheckCircle2, XCircle } from "lucide-react";
import Modal from "../../../../common/ui/Modal";
import Chip from "../../../../common/ui/Chip";
import { QuestionType } from "../../../../utils/enum";
import { formatEnumLabel } from "../../../../utils/utils";
import { sanitizeAnswerHtml } from "../../../../utils/sanitizeHtml";
import { useGetAttemptAnswersQuery } from "../../../../state/services/endpoints/exams";

interface AttemptAnswersModalProps {
    attemptId: string | null;
    studentLabel?: string;
    onClose: () => void;
}

// Admin's per-question view of one attempt — MCQ/MSQ selections (with
// correctness), Written photo pages, and Typing text, shown alongside the
// question itself (companion to RecordingViewerModal's video/screen view).
const AttemptAnswersModal = ({ attemptId, studentLabel, onClose }: AttemptAnswersModalProps) => {
    const { data, isFetching } = useGetAttemptAnswersQuery(attemptId as string, { skip: !attemptId });
    const answers = data?.data || [];

    return (
        <Modal isOpen={!!attemptId} onClose={onClose} title={studentLabel ? `Answers — ${studentLabel}` : 'Answers'} size="xl">
            {isFetching && answers.length === 0 ? (
                <p className="text-sm text-textSecondary py-6 text-center">Loading answers...</p>
            ) : answers.length === 0 ? (
                <p className="text-sm text-textSecondary py-6 text-center">No answers found.</p>
            ) : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
                    {answers.map((answer) => (
                        <div key={answer.questionId} className="rounded-lg border border-borderLight p-4 space-y-3">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-textSecondary">#{answer.order}</span>
                                    <Chip label={formatEnumLabel(answer.type)} variant="gray" />
                                </div>
                                <span className="text-xs font-medium text-textSecondary">
                                    {answer.marksAwarded !== undefined && answer.marksAwarded !== null
                                        ? `${answer.marksAwarded} / ${answer.marks} marks`
                                        : `${answer.marks} marks`}
                                </span>
                            </div>

                            <p className="text-sm text-textPrimary">{answer.text}</p>

                            {(answer.type === QuestionType.MCQ || answer.type === QuestionType.MSQ) && (
                                <div className="flex items-center gap-2 text-sm">
                                    {answer.selectedOptionText || (answer.selectedOptionTexts && answer.selectedOptionTexts.length > 0) ? (
                                        <>
                                            {answer.isCorrect ? (
                                                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                                            ) : (
                                                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
                                            )}
                                            <span className="text-textPrimary">
                                                {answer.type === QuestionType.MCQ
                                                    ? answer.selectedOptionText
                                                    : (answer.selectedOptionTexts || []).join(', ')}
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-textTertiary italic">Not answered</span>
                                    )}
                                </div>
                            )}

                            {answer.type === QuestionType.WRITTEN && (
                                answer.pages && answer.pages.length > 0 ? (
                                    <div className="flex gap-2 flex-wrap">
                                        {answer.pages.map((page) => (
                                            <a key={page.pageNumber} href={page.cloudinaryUrl} target="_blank" rel="noopener noreferrer">
                                                <img
                                                    src={page.cloudinaryUrl}
                                                    alt={`Page ${page.pageNumber}`}
                                                    loading="lazy"
                                                    decoding="async"
                                                    className="h-32 w-24 object-cover rounded-md border border-borderLight"
                                                />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-textTertiary italic">No pages uploaded.</p>
                                )
                            )}

                            {answer.type === QuestionType.TYPING && (
                                answer.answerText ? (
                                    <div
                                        className="prose prose-sm max-w-none rounded-md border border-borderLight p-3 bg-bgSecondary"
                                        dangerouslySetInnerHTML={{ __html: sanitizeAnswerHtml(answer.answerText) }}
                                    />
                                ) : (
                                    <p className="text-sm text-textTertiary italic">No answer typed.</p>
                                )
                            )}

                            {answer.remarks && (
                                <p className="text-xs text-textSecondary">Remarks: {answer.remarks}</p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </Modal>
    );
};

export default AttemptAnswersModal;
