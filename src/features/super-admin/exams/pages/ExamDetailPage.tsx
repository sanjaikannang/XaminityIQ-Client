import toast from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import RowActions from "../../../../common/ui/RowActions";
import DeleteConfirmModal from "../../../../common/ui/DeleteConfirmModal";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { ExamStatus } from "../../../../utils/enum";
import { QuestionData } from "../../../../types/exams-types";
import QuestionForm, { QuestionFormValues } from "../components/QuestionForm";
import { useGetAllFacultyQuery } from "../../../../state/services/endpoints/faculty";
import {
    useGetExamQuery,
    usePublishExamMutation,
    useDeleteExamMutation,
    useAddQuestionMutation,
    useUpdateQuestionMutation,
    useDeleteQuestionMutation,
    useAssignEvaluatorsMutation,
    useGetEvaluationProgressQuery,
    usePublishResultsMutation,
} from "../../../../state/services/endpoints/exams";

const ExamDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const { data, isLoading } = useGetExamQuery(id as string, { skip: !id });
    const exam = data?.data;

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);
    const [deleteQuestionTarget, setDeleteQuestionTarget] = useState<QuestionData | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

    const [publishExam, { isLoading: isPublishing }] = usePublishExamMutation();
    const [cancelExam, { isLoading: isCancelling }] = useDeleteExamMutation();
    const [addQuestion, { isLoading: isAddingQuestion }] = useAddQuestionMutation();
    const [updateQuestion, { isLoading: isUpdatingQuestion }] = useUpdateQuestionMutation();
    const [deleteQuestion, { isLoading: isDeletingQuestion }] = useDeleteQuestionMutation();

    const { data: facultyData } = useGetAllFacultyQuery({ page: 1, limit: 1000 });
    const faculties = facultyData?.data || [];
    const [selectedEvaluatorIds, setSelectedEvaluatorIds] = useState<string[]>([]);
    const [assignEvaluators, { isLoading: isAssigningEvaluators }] = useAssignEvaluatorsMutation();

    const isDraft = exam?.status === ExamStatus.DRAFT;
    const isCompleted = exam?.status === ExamStatus.COMPLETED;
    const isResultsPublished = exam?.status === ExamStatus.RESULTS_PUBLISHED;

    const { data: evaluationProgressData } = useGetEvaluationProgressQuery(id as string, { skip: !id || !isCompleted });
    const evaluationProgress = evaluationProgressData?.data;
    const [publishResults, { isLoading: isPublishingResults }] = usePublishResultsMutation();

    useEffect(() => {
        if (exam) {
            setSelectedEvaluatorIds(exam.evaluatorFacultyIds || []);
        }
    }, [exam]);

    const handleOpenAddQuestion = useCallback(() => {
        setEditingQuestion(null);
        setIsQuestionModalOpen(true);
    }, []);

    const handleOpenEditQuestion = useCallback((question: QuestionData) => {
        setEditingQuestion(question);
        setIsQuestionModalOpen(true);
    }, []);

    const handleCloseQuestionModal = useCallback(() => {
        setIsQuestionModalOpen(false);
        setEditingQuestion(null);
    }, []);

    const handleQuestionSubmit = async (values: QuestionFormValues) => {
        if (!id) return;
        const payload = {
            type: values.type as any,
            text: values.text,
            marks: Number(values.marks),
            options: values.type === 'WRITTEN' ? undefined : values.options,
        };

        if (editingQuestion) {
            const response = await updateQuestion({ examId: id, questionId: editingQuestion._id, data: payload }).unwrap();
            toast.success(response.message || 'Question updated successfully');
        } else {
            const response = await addQuestion({ examId: id, data: payload }).unwrap();
            toast.success(response.message || 'Question added successfully');
        }
        handleCloseQuestionModal();
    };

    const handleDeleteQuestion = async () => {
        if (!id || !deleteQuestionTarget) return;
        try {
            const response = await deleteQuestion({ examId: id, questionId: deleteQuestionTarget._id }).unwrap();
            toast.success(response.message || 'Question deleted successfully');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to delete question');
        } finally {
            setDeleteQuestionTarget(null);
        }
    };

    const handlePublish = async () => {
        if (!id) return;
        try {
            const response = await publishExam(id).unwrap();
            toast.success(response.message || 'Exam published successfully');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to publish exam');
        }
    };

    const handleToggleEvaluator = (facultyId: string) => {
        setSelectedEvaluatorIds((prev) =>
            prev.includes(facultyId) ? prev.filter((f) => f !== facultyId) : [...prev, facultyId],
        );
    };

    const handleSaveEvaluators = async () => {
        if (!id) return;
        try {
            const response = await assignEvaluators({ examId: id, data: { evaluatorFacultyIds: selectedEvaluatorIds } }).unwrap();
            toast.success(response.message || 'Evaluators assigned successfully');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to assign evaluators');
        }
    };

    const handlePublishResults = async () => {
        if (!id) return;
        try {
            const response = await publishResults(id).unwrap();
            toast.success(response.message || 'Results published successfully');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to publish results');
        }
    };

    const handleCancelExam = async () => {
        if (!id) return;
        try {
            const response = await cancelExam(id).unwrap();
            toast.success(response.message || 'Exam cancelled successfully');
            navigate('/super-admin/exams');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to cancel exam');
        } finally {
            setIsCancelModalOpen(false);
        }
    };

    const questionColumns: ColumnDef<QuestionData, any>[] = [
        { accessorKey: "order", header: "#" },
        { accessorKey: "type", header: "Type" },
        { accessorKey: "text", header: "Question" },
        { accessorKey: "marks", header: "Marks" },
        {
            header: "Actions",
            cell: ({ row }: { row: { original: QuestionData } }) => (
                isDraft ? (
                    <RowActions
                        onEdit={() => handleOpenEditQuestion(row.original)}
                        onDelete={() => setDeleteQuestionTarget(row.original)}
                    />
                ) : null
            ),
        },
    ];

    if (isLoading || !exam) {
        return (
            <>
                <PageHeader>Exam Details</PageHeader>
                <Container>
                    <div className="py-10 text-center text-textSecondary">Loading...</div>
                </Container>
            </>
        );
    }

    return (
        <>
            <PageHeader>{exam.name}</PageHeader>
            <Container>
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="primary" size="sm" onClick={() => navigate('/super-admin/exams')}>
                        ← Back to Exams
                    </Button>
                    <div className="flex gap-2">
                        {isDraft && (
                            <Button variant="outline" size="sm" onClick={() => navigate(`/super-admin/exams/${id}/edit`)}>
                                Edit
                            </Button>
                        )}
                        {(exam.status === ExamStatus.DRAFT || exam.status === ExamStatus.PUBLISHED) && (
                            <Button variant="outline" size="sm" onClick={() => setIsCancelModalOpen(true)}>
                                Cancel Exam
                            </Button>
                        )}
                        {isDraft && (
                            <Button variant="primary" size="sm" onClick={handlePublish} loading={isPublishing} disabled={isPublishing}>
                                {isPublishing ? '' : 'Publish'}
                            </Button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-borderLight">
                    <div><span className="text-sm text-textSecondary">Mode</span><p className="font-medium">{exam.mode}</p></div>
                    <div><span className="text-sm text-textSecondary">Status</span><p className="font-medium">{exam.status}</p></div>
                    <div><span className="text-sm text-textSecondary">Duration</span><p className="font-medium">{exam.durationMinutes} minutes</p></div>
                    <div><span className="text-sm text-textSecondary">Batch / Course</span><p className="font-medium">{exam.batchName} / {exam.courseName}</p></div>
                    <div><span className="text-sm text-textSecondary">Department / Section</span><p className="font-medium">{exam.deptName} / {exam.sectionName}</p></div>
                    <div><span className="text-sm text-textSecondary">Semester / Subject</span><p className="font-medium">Semester {exam.semester} - {exam.subjectName}</p></div>
                    <div><span className="text-sm text-textSecondary">Schedule</span><p className="font-medium">{new Date(exam.startDate).toLocaleDateString()} {exam.startTime || ''} - {new Date(exam.endDate).toLocaleDateString()} {exam.endTime || ''}</p></div>
                    <div><span className="text-sm text-textSecondary">Total / Passing Marks</span><p className="font-medium">{exam.totalMarks} / {exam.passingMarks}</p></div>
                    <div><span className="text-sm text-textSecondary">Matched Students</span><p className="font-medium">{exam.matchedStudentCount}</p></div>
                </div>

                <div className="flex items-center justify-between pt-6">
                    <h3 className="text-lg font-semibold text-textPrimary">
                        Questions ({exam.questions.length}, {exam.totalQuestionMarks} marks)
                    </h3>
                    {isDraft && (
                        <Button variant="primary" size="sm" onClick={handleOpenAddQuestion}>
                            Add Question
                        </Button>
                    )}
                </div>

                <div className="py-6">
                    <Table
                        columns={questionColumns}
                        data={exam.questions}
                        totalCount={exam.questions.length}
                        pageNumber={1}
                        pageLimit={exam.questions.length || 10}
                        totalPages={1}
                        onPageChange={() => { }}
                        onPageSizeChange={() => { }}
                        isLoading={false}
                        tableTitle="Questions"
                    />
                </div>

                {!isResultsPublished && (
                    <div className="pt-6 border-t border-borderLight">
                        <h3 className="text-lg font-semibold text-textPrimary mb-3">Evaluators</h3>
                        <p className="text-sm text-textSecondary mb-3">
                            Faculty selected here can grade this exam's WRITTEN answers once it reaches COMPLETED.
                        </p>
                        <div className="max-h-56 overflow-y-auto rounded-md border border-borderLight divide-y divide-borderLight">
                            {faculties.map((f) => (
                                <label key={f.id} className="flex items-center gap-3 px-3 py-2 hover:bg-bgSecondary cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedEvaluatorIds.includes(f.id)}
                                        onChange={() => handleToggleEvaluator(f.id)}
                                        className="h-4 w-4"
                                    />
                                    <span className="text-textPrimary">{f.personalDetails.firstName} {f.personalDetails.lastName}</span>
                                    <span className="text-xs text-textSecondary">({f.facultyId})</span>
                                </label>
                            ))}
                            {faculties.length === 0 && (
                                <p className="px-3 py-4 text-sm text-textSecondary">No faculty available.</p>
                            )}
                        </div>
                        <div className="mt-3">
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleSaveEvaluators}
                                loading={isAssigningEvaluators}
                                disabled={isAssigningEvaluators}
                            >
                                {isAssigningEvaluators ? '' : 'Save Evaluators'}
                            </Button>
                        </div>
                    </div>
                )}

                {isCompleted && (
                    <div className="pt-6 border-t border-borderLight">
                        <h3 className="text-lg font-semibold text-textPrimary mb-3">Publish Results</h3>
                        {evaluationProgress ? (
                            <p className="text-sm text-textSecondary mb-3">
                                {evaluationProgress.evaluatedCount} of {evaluationProgress.totalWrittenAnswers} written answers graded
                                {evaluationProgress.pendingCount > 0 ? ` — ${evaluationProgress.pendingCount} still pending` : ''}
                            </p>
                        ) : (
                            <p className="text-sm text-textSecondary mb-3">Loading evaluation progress...</p>
                        )}
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handlePublishResults}
                            loading={isPublishingResults}
                            disabled={isPublishingResults || !evaluationProgress || evaluationProgress.pendingCount > 0}
                        >
                            {isPublishingResults ? '' : 'Publish Results'}
                        </Button>
                    </div>
                )}

                {isResultsPublished && (
                    <div className="pt-6 border-t border-borderLight">
                        <p className="text-sm font-medium text-green-700">✓ Results have been published to students.</p>
                    </div>
                )}
            </Container>

            <Modal
                isOpen={isQuestionModalOpen}
                onClose={handleCloseQuestionModal}
                title={editingQuestion ? "Edit Question" : "Add Question"}
                size="md"
            >
                <QuestionForm
                    initialValues={editingQuestion ? {
                        type: editingQuestion.type,
                        text: editingQuestion.text,
                        marks: editingQuestion.marks,
                        options: editingQuestion.options?.map((o) => ({
                            text: o.text,
                            isCorrect: !!editingQuestion.correctOptionIds?.includes(o.optionId),
                        })),
                    } : undefined}
                    onSubmit={handleQuestionSubmit}
                    isLoading={isAddingQuestion || isUpdatingQuestion}
                />
            </Modal>

            <DeleteConfirmModal
                isOpen={!!deleteQuestionTarget}
                onClose={() => setDeleteQuestionTarget(null)}
                onConfirm={handleDeleteQuestion}
                isDeleting={isDeletingQuestion}
                title="Delete Question"
                message={<>Are you sure you want to delete this question?</>}
            />

            <DeleteConfirmModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleCancelExam}
                isDeleting={isCancelling}
                title="Cancel Exam"
                message={<>Are you sure you want to cancel <span className="font-semibold text-textPrimary">{exam.name}</span>? This cannot be undone.</>}
            />
        </>
    );
};

export default ExamDetailPage;
