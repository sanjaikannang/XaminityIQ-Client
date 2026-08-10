import toast from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Info, HelpCircle, ShieldAlert, Building2, Users, Award, CheckCircle2 } from "lucide-react";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import RowActions from "../../../../common/ui/RowActions";
import DeleteConfirmModal from "../../../../common/ui/DeleteConfirmModal";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Chip from "../../../../common/ui/Chip";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { ExamMode, ExamStatus } from "../../../../utils/enum";
import { formatEnumLabel, getChipVariant } from "../../../../utils/utils";
import { formatDate } from "../../../../utils/date";
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
    useFormExamRoomsMutation,
    useGetExamRoomsQuery,
    useGetExamAttemptsQuery,
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

    const isProctoring = exam?.mode === ExamMode.PROCTORING;
    const canFormRooms = isProctoring && exam?.status && exam.status !== ExamStatus.DRAFT;
    const [formExamRooms, { isLoading: isFormingRooms }] = useFormExamRoomsMutation();
    const { data: examRoomsData, isFetching: isLoadingRooms } = useGetExamRoomsQuery(id as string, { skip: !id || !canFormRooms });
    const rooms = examRoomsData?.data?.rooms || [];

    const { data: examAttemptsData, isFetching: isLoadingAttempts } = useGetExamAttemptsQuery(id as string, { skip: !id });
    const attempts = examAttemptsData?.data?.attempts || [];

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

    const handleFormRooms = async () => {
        if (!id) return;
        try {
            const response = await formExamRooms(id).unwrap();
            const rooms = response.data?.rooms || [];
            const pooledNames = new Set(
                rooms.flatMap((r) => r.pooledExamNames).filter((name) => name !== exam?.name),
            );
            toast.success(
                pooledNames.size > 0
                    ? `${rooms.length} room(s) formed — pooled with: ${[...pooledNames].join(', ')}`
                    : response.message || `${rooms.length} room(s) formed successfully`,
            );
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to form exam rooms');
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
        { accessorKey: "order", header: "#", width: "60px" },
        {
            accessorKey: "type",
            header: "Type",
            width: "140px",
            cell: ({ getValue }: { getValue: () => string }) => {
                const value = getValue();
                return <Chip label={formatEnumLabel(value)} variant={getChipVariant(value)} />;
            },
        },
        { accessorKey: "text", header: "Question", width: "420px" },
        { accessorKey: "marks", header: "Marks", width: "100px" },
        {
            header: "Actions",
            width: "100px",
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

                <div className="space-y-6">
                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Info className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-bold text-textPrimary">Overview</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div><span className="text-sm text-textSecondary">Mode</span><p className="font-medium">{exam.mode}</p></div>
                            <div><span className="text-sm text-textSecondary">Status</span><p className="font-medium">{exam.status}</p></div>
                            <div><span className="text-sm text-textSecondary">Duration</span><p className="font-medium">{exam.durationMinutes} minutes</p></div>
                            <div><span className="text-sm text-textSecondary">Batch / Course</span><p className="font-medium">{exam.batchName} / {exam.courseName}</p></div>
                            <div><span className="text-sm text-textSecondary">Department / Section</span><p className="font-medium">{exam.deptName} / {exam.sectionName}</p></div>
                            <div><span className="text-sm text-textSecondary">Semester / Subject</span><p className="font-medium">Semester {exam.semester} - {exam.subjectName}</p></div>
                            <div><span className="text-sm text-textSecondary">Schedule</span><p className="font-medium">{formatDate(exam.startDate)} {exam.startTime || ''} - {formatDate(exam.endDate)} {exam.endTime || ''}</p></div>
                            <div><span className="text-sm text-textSecondary">Total / Passing Marks</span><p className="font-medium">{exam.totalMarks} / {exam.passingMarks}</p></div>
                            <div><span className="text-sm text-textSecondary">Matched Students</span><p className="font-medium">{exam.matchedStudentCount}</p></div>
                        </div>
                    </section>

                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <HelpCircle className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-lg font-bold text-textPrimary">
                                    Questions ({exam.questions.length}, {exam.totalQuestionMarks} marks)
                                </h2>
                            </div>
                            {isDraft && (
                                <Button variant="primary" size="sm" onClick={handleOpenAddQuestion}>
                                    Add Question
                                </Button>
                            )}
                        </div>
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
                    </section>

                {(isLoadingAttempts || attempts.length > 0) && (
                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <ShieldAlert className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-bold text-textPrimary">Attempts &amp; Integrity</h2>
                        </div>
                        {isLoadingAttempts && <p className="text-sm text-textSecondary">Loading attempts...</p>}
                        {!isLoadingAttempts && attempts.length > 0 && (
                            <div className="overflow-x-auto rounded-md border border-borderLight">
                                <table className="w-full text-sm">
                                    <thead className="bg-bgSecondary">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Student</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Status</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Score</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Flagged</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Violations</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borderLight">
                                        {attempts.map((attempt) => (
                                            <tr key={attempt.attemptId}>
                                                <td className="px-3 py-2 text-textPrimary">{attempt.studentCode}</td>
                                                <td className="px-3 py-2 text-textPrimary">{attempt.status}</td>
                                                <td className="px-3 py-2 text-textPrimary">
                                                    {attempt.totalScore !== undefined && attempt.totalScore !== null ? attempt.totalScore : '—'}
                                                </td>
                                                <td className="px-3 py-2">
                                                    {attempt.isFlagged ? (
                                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                                            Flagged
                                                        </span>
                                                    ) : (
                                                        <span className="text-textSecondary">—</span>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2 text-textSecondary">
                                                    {Object.keys(attempt.violationCounts).length > 0
                                                        ? Object.entries(attempt.violationCounts)
                                                            .map(([type, count]) => `${type}: ${count}`)
                                                            .join(', ')
                                                        : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {canFormRooms && (
                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-lg font-bold text-textPrimary">Exam Rooms</h2>
                            </div>
                            {rooms.length === 0 && (
                                <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={handleFormRooms}
                                    loading={isFormingRooms}
                                    disabled={isFormingRooms}
                                >
                                    {isFormingRooms ? '' : 'Form Exam Rooms'}
                                </Button>
                            )}
                        </div>
                        {isLoadingRooms && <p className="text-sm text-textSecondary">Loading rooms...</p>}
                        {!isLoadingRooms && rooms.length === 0 && (
                            <p className="text-sm text-textSecondary">No rooms formed yet.</p>
                        )}
                        {rooms.length > 0 && (
                            <div className="overflow-x-auto rounded-md border border-borderLight">
                                <table className="w-full text-sm">
                                    <thead className="bg-bgSecondary">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Faculty</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Students (this exam)</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Room Occupancy</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Status</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Pooled With</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borderLight">
                                        {rooms.map((room) => (
                                            <tr key={room.roomId}>
                                                <td className="px-3 py-2 text-textPrimary">{room.facultyCode}</td>
                                                <td className="px-3 py-2 text-textPrimary">{room.totalCount}</td>
                                                <td className="px-3 py-2 text-textPrimary">{room.roomTotalOccupancy}</td>
                                                <td className="px-3 py-2 text-textPrimary">{room.status}</td>
                                                <td className="px-3 py-2 text-textSecondary">
                                                    {room.pooledWithExamNames.length > 0 ? room.pooledWithExamNames.join(', ') : '—'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {!isResultsPublished && (
                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-bold text-textPrimary">Evaluators</h2>
                        </div>
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
                    </section>
                )}

                {isCompleted && (
                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6 mb-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <Award className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-lg font-bold text-textPrimary">Publish Results</h2>
                        </div>
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
                    </section>
                )}

                {isResultsPublished && (
                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <CheckCircle2 className="w-5 h-5 text-green-700" />
                            </div>
                            <p className="text-sm font-medium text-green-700">Results have been published to students.</p>
                        </div>
                    </section>
                )}
                </div>
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
