import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { ExamStatus, QuestionType } from "../../../../utils/enum";
import { formatDateTime } from "../../../../utils/date";
import { sanitizeAnswerHtml } from "../../../../utils/sanitizeHtml";
import {
    useGetMyEvaluationExamsQuery,
    useGetExamAnswersForEvaluationQuery,
    useEvaluateAnswerMutation,
} from "../../../../state/services/endpoints/evaluation";

type DraftMap = Record<string, { marksAwarded: string; remarks: string }>;

const EvaluationQueuePage = () => {
    const { examId } = useParams<{ examId: string }>();

    const { data: examsData } = useGetMyEvaluationExamsQuery();
    const currentExam = examsData?.data?.find((e) => e.examId === examId);
    const isReadOnly = currentExam?.status === ExamStatus.RESULTS_PUBLISHED;

    const { data, isLoading } = useGetExamAnswersForEvaluationQuery(examId as string, { skip: !examId });
    const answers = data?.data || [];

    const [evaluateAnswer, { isLoading: isSaving }] = useEvaluateAnswerMutation();
    const [drafts, setDrafts] = useState<DraftMap>({});

    useEffect(() => {
        const next: DraftMap = {};
        answers.forEach((a) => {
            next[a.answerId] = {
                marksAwarded: a.marksAwarded !== undefined ? String(a.marksAwarded) : '',
                remarks: a.remarks || '',
            };
        });
        setDrafts(next);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const updateDraft = (answerId: string, patch: Partial<DraftMap[string]>) => {
        setDrafts((prev) => ({ ...prev, [answerId]: { ...prev[answerId], ...patch } }));
    };

    const handleSave = async (answerId: string, maxMarks: number) => {
        const draft = drafts[answerId];
        const marks = Number(draft?.marksAwarded);
        if (Number.isNaN(marks) || marks < 0 || marks > maxMarks) {
            toast.error(`Marks must be between 0 and ${maxMarks}`);
            return;
        }
        try {
            await evaluateAnswer({ answerId, data: { marksAwarded: marks, remarks: draft.remarks || undefined } }).unwrap();
            toast.success('Answer graded');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to save grade');
        }
    };

    return (
        <>
            <PageHeader>{currentExam?.name || 'Grade Written Answers'}</PageHeader>
            <Container>
                <div className="py-6 space-y-4">
                    {isLoading && <p className="text-textSecondary">Loading...</p>}
                    {!isLoading && answers.length === 0 && (
                        <p className="text-textSecondary">No written answers to grade for this exam.</p>
                    )}
                    {answers.map((answer) => (
                        <div key={answer.answerId} className="rounded-lg border border-borderLight bg-whiteColor p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <p className="font-semibold text-textPrimary">{answer.studentCode}</p>
                                <p className="text-sm text-textSecondary">Max {answer.maxMarks} marks</p>
                            </div>
                            <p className="text-textPrimary">{answer.questionText}</p>

                            {answer.type === QuestionType.TYPING ? (
                                answer.answerText ? (
                                    <div
                                        className="prose prose-sm max-w-none rounded-md border border-borderLight p-3 bg-bgSecondary"
                                        dangerouslySetInnerHTML={{ __html: sanitizeAnswerHtml(answer.answerText) }}
                                    />
                                ) : (
                                    <p className="text-sm text-textSecondary">No answer typed.</p>
                                )
                            ) : (
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
                                    {answer.pages.length === 0 && (
                                        <p className="text-sm text-textSecondary">No pages uploaded.</p>
                                    )}
                                </div>
                            )}

                            <div className="flex gap-3 items-start flex-wrap">
                                <div>
                                    <label className="text-xs text-textSecondary block mb-1">Marks (0-{answer.maxMarks})</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={answer.maxMarks}
                                        value={drafts[answer.answerId]?.marksAwarded ?? ''}
                                        onChange={(e) => updateDraft(answer.answerId, { marksAwarded: e.target.value })}
                                        disabled={isReadOnly}
                                        className="w-24 border border-borderLight rounded-md px-2 py-1 disabled:bg-bgSecondary"
                                    />
                                </div>
                                <div className="flex-1 min-w-[200px]">
                                    <label className="text-xs text-textSecondary block mb-1">Remarks</label>
                                    <textarea
                                        value={drafts[answer.answerId]?.remarks ?? ''}
                                        onChange={(e) => updateDraft(answer.answerId, { remarks: e.target.value })}
                                        disabled={isReadOnly}
                                        rows={2}
                                        className="w-full border border-borderLight rounded-md px-2 py-1 disabled:bg-bgSecondary"
                                    />
                                </div>
                                {!isReadOnly && (
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        onClick={() => handleSave(answer.answerId, answer.maxMarks)}
                                        loading={isSaving}
                                        disabled={isSaving}
                                    >
                                        Save
                                    </Button>
                                )}
                            </div>

                            {answer.evaluatedAt && (
                                <p className="text-xs text-green-600">Graded {formatDateTime(answer.evaluatedAt)}</p>
                            )}
                        </div>
                    ))}
                </div>
            </Container>
        </>
    );
};

export default EvaluationQueuePage;
