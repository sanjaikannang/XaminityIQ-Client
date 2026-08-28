import toast from "react-hot-toast";
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Info, HelpCircle, ShieldAlert, Building2, Users, Award, CheckCircle2, Circle, UserCheck, Clock, ClipboardList, Video, LayoutList, Upload } from "lucide-react";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import RowActions from "../../../../common/ui/RowActions";
import DeleteConfirmModal from "../../../../common/ui/DeleteConfirmModal";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Chip from "../../../../common/ui/Chip";
import { Accordion, AccordionItem } from "../../../../common/ui/Accordion";
import { ExamMode, ExamStatus, QuestionType } from "../../../../utils/enum";
import { formatEnumLabel, getChipVariant } from "../../../../utils/utils";
import { formatDate, formatDateTime } from "../../../../utils/date";
import { QuestionData } from "../../../../types/exams-types";
import QuestionForm, { QuestionFormValues } from "../components/QuestionForm";
import RecordingViewerModal from "../components/RecordingViewerModal";
import ExamSectionsManager from "../components/ExamSectionsManager";
import BulkUploadQuestionsModal from "../components/BulkUploadQuestionsModal";
import AttemptAnswersModal from "../components/AttemptAnswersModal";
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
    useGetAssignedStudentsQuery,
} from "../../../../state/services/endpoints/exams";

const ExamDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    // Poll while PUBLISHED so the status badge (and the Form Exam Rooms gate
    // below) don't go stale relative to the lifecycle sweeper, which can flip
    // PUBLISHED -> ONGOING at any moment once the exam's window opens.
    const [pollForStatusChange, setPollForStatusChange] = useState(false);
    const { data, isLoading } = useGetExamQuery(id as string, {
        skip: !id,
        pollingInterval: pollForStatusChange ? 5000 : 0,
    });
    const exam = data?.data;

    useEffect(() => {
        setPollForStatusChange(exam?.status === ExamStatus.PUBLISHED);
    }, [exam?.status]);
    // Older exams (created before exam sections existed) never got this field
    // backfilled — Mongoose schema defaults only apply to newly-created
    // documents, not existing ones — so it can genuinely be absent.
    const examSections = exam?.examSections || [];

    const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<QuestionData | null>(null);
    const [deleteQuestionTarget, setDeleteQuestionTarget] = useState<QuestionData | null>(null);
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [recordingAttemptId, setRecordingAttemptId] = useState<string | null>(null);
    const [answersAttemptId, setAnswersAttemptId] = useState<string | null>(null);
    const [answersStudentLabel, setAnswersStudentLabel] = useState<string | undefined>(undefined);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

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
    // Rooms can only be formed while the exam is PUBLISHED (server-enforced —
    // see formExamRoomsAPI). Once the scheduler sweeps it to ONGOING/COMPLETED
    // the button must disappear too, not just fail on click.
    const canFormRooms = isProctoring && exam?.status === ExamStatus.PUBLISHED;
    // Once rooms exist, keep showing the Exam Rooms section even if the exam
    // has since moved past PUBLISHED — this only gates the ability to form
    // NEW rooms, not visibility of ones already formed.
    const showRoomsSection = isProctoring && exam?.status && exam.status !== ExamStatus.DRAFT;
    const [formExamRooms, { isLoading: isFormingRooms }] = useFormExamRoomsMutation();
    const { data: examRoomsData, isFetching: isLoadingRooms } = useGetExamRoomsQuery(id as string, { skip: !id || !showRoomsSection });
    const rooms = examRoomsData?.data?.rooms || [];

    const { data: examAttemptsData, isFetching: isLoadingAttempts } = useGetExamAttemptsQuery(id as string, { skip: !id });
    const attempts = examAttemptsData?.data?.attempts || [];

    const { data: assignedStudentsData, isFetching: isLoadingAssignedStudents } = useGetAssignedStudentsQuery(id as string, { skip: !id });
    const assignedStudents = assignedStudentsData?.data?.students || [];

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
        const isSubjective = values.type === QuestionType.WRITTEN || values.type === QuestionType.TYPING;
        const payload = {
            type: values.type as any,
            text: values.text,
            marks: Number(values.marks),
            examSectionId: values.examSectionId,
            options: isSubjective ? undefined : values.options,
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
                            <div><span className="text-sm text-textSecondary">Department / Sections</span><p className="font-medium">{exam.deptName} / {(exam.sectionNames || []).join(', ') || '—'}</p></div>
                            <div><span className="text-sm text-textSecondary">Semesters / Subject</span><p className="font-medium">Semester {(exam.semesters || []).join(', ')} - {exam.subjectName}</p></div>
                            <div><span className="text-sm text-textSecondary">Schedule</span><p className="font-medium">{formatDate(exam.startDate)} {exam.startTime || ''} - {formatDate(exam.endDate)} {exam.endTime || ''}</p></div>
                            <div><span className="text-sm text-textSecondary">Total / Passing Marks</span><p className="font-medium">{exam.totalMarks} / {exam.passingMarks}</p></div>
                            <div><span className="text-sm text-textSecondary">Matched Students</span><p className="font-medium">{exam.matchedStudentCount}</p></div>
                        </div>
                    </section>

                    {isDraft && (
                        <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <LayoutList className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-textPrimary">Sections</h2>
                                    <p className="text-sm text-textSecondary">
                                        Group questions into named sections (Section A, Section B, ...) — optional.
                                    </p>
                                </div>
                            </div>
                            <ExamSectionsManager
                                examId={id as string}
                                examSections={examSections}
                                hasSectionedQuestions={exam.questions.some((q) => !!q.examSectionId)}
                            />
                        </section>
                    )}

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
                                <div className="flex items-center gap-2">
                                    <Button variant="outline" size="sm" icon={Upload} onClick={() => setIsBulkUploadOpen(true)}>
                                        Bulk Upload
                                    </Button>
                                    <Button variant="primary" size="sm" onClick={handleOpenAddQuestion}>
                                        Add Question
                                    </Button>
                                </div>
                            )}
                        </div>
                        {exam.questions.length === 0 ? (
                            <p className="text-sm text-textSecondary">No questions added yet.</p>
                        ) : (
                            <Accordion>
                                {exam.questions.map((question) => {
                                    const sectionLabel = examSections.find((s) => s._id === question.examSectionId)?.label;
                                    return (
                                    <AccordionItem
                                        key={question._id}
                                        header={
                                            <div className="flex items-center gap-3 flex-wrap">
                                                <span className="text-xs font-semibold text-textSecondary shrink-0">#{question.order}</span>
                                                <Chip label={formatEnumLabel(question.type)} variant={getChipVariant(question.type)} />
                                                {sectionLabel && <Chip label={sectionLabel} variant="blue" />}
                                                <span className="text-sm text-textPrimary truncate flex-1 min-w-[160px]">{question.text}</span>
                                                <span className="text-xs font-medium text-textSecondary shrink-0">{question.marks} marks</span>
                                            </div>
                                        }
                                        actions={
                                            isDraft ? (
                                                <RowActions
                                                    onEdit={() => handleOpenEditQuestion(question)}
                                                    onDelete={() => setDeleteQuestionTarget(question)}
                                                />
                                            ) : undefined
                                        }
                                    >
                                        <div className="space-y-3 pt-2">
                                            <div>
                                                <span className="text-xs font-medium text-textSecondary uppercase tracking-wide">Question</span>
                                                <p className="text-sm text-textPrimary mt-1">{question.text}</p>
                                            </div>

                                            {question.type === QuestionType.WRITTEN || question.type === QuestionType.TYPING ? (
                                                <p className="text-sm text-textSecondary italic">
                                                    {question.type === QuestionType.WRITTEN
                                                        ? 'Written answer (photo upload) — evaluated manually by an assigned faculty member.'
                                                        : 'Typed answer — evaluated manually by an assigned faculty member.'}
                                                </p>
                                            ) : (
                                                <div>
                                                    <span className="text-xs font-medium text-textSecondary uppercase tracking-wide">
                                                        Options & Correct Answer{(question.correctOptionIds?.length ?? 0) > 1 ? "s" : ""}
                                                    </span>
                                                    <div className="mt-2 space-y-1.5">
                                                        {question.options?.map((option) => {
                                                            const isCorrect = !!question.correctOptionIds?.includes(option.optionId);
                                                            return (
                                                                <div
                                                                    key={option.optionId}
                                                                    className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm ${isCorrect
                                                                        ? "border-green-200 bg-green-50 text-green-800"
                                                                        : "border-borderLight text-textPrimary"
                                                                        }`}
                                                                >
                                                                    {isCorrect ? (
                                                                        <CheckCircle2 size={16} className="text-green-600 shrink-0" />
                                                                    ) : (
                                                                        <Circle size={16} className="text-textTertiary shrink-0" />
                                                                    )}
                                                                    <span className="flex-1">{option.text}</span>
                                                                    {isCorrect && (
                                                                        <span className="text-xs font-semibold text-green-700 shrink-0">Correct</span>
                                                                    )}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-center gap-6 text-xs text-textSecondary pt-1">
                                                <span>Type: <span className="font-medium text-textPrimary">{formatEnumLabel(question.type)}</span></span>
                                                <span>Marks: <span className="font-medium text-textPrimary">{question.marks}</span></span>
                                                <span>Added: <span className="font-medium text-textPrimary">{formatDate(question.createdAt)}</span></span>
                                            </div>
                                        </div>
                                    </AccordionItem>
                                    );
                                })}
                            </Accordion>
                        )}
                    </section>

                <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-textPrimary">Assigned Students</h2>
                            <p className="text-sm text-textSecondary">
                                Every student whose batch/course/department/section/semester matches this exam.
                            </p>
                        </div>
                    </div>
                    {isLoadingAssignedStudents && <p className="text-sm text-textSecondary">Loading students...</p>}
                    {!isLoadingAssignedStudents && assignedStudents.length === 0 && (
                        <p className="text-sm text-textSecondary">No students match this exam's batch/course/department/section/semester selection.</p>
                    )}
                    {!isLoadingAssignedStudents && assignedStudents.length > 0 && (
                        <div className="overflow-x-auto rounded-md border border-borderLight">
                            <table className="w-full text-sm">
                                <thead className="bg-bgSecondary">
                                    <tr>
                                        <th className="px-3 py-2 text-left font-medium text-textSecondary">Student</th>
                                        <th className="px-3 py-2 text-left font-medium text-textSecondary">Attempt Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-borderLight">
                                    {assignedStudents.map((student) => (
                                        <tr key={student.studentId}>
                                            <td className="px-3 py-2">
                                                <div className="font-medium text-textPrimary">{student.studentName || '—'}</div>
                                                <div className="text-xs text-textSecondary">{student.studentEmail}</div>
                                                <div className="text-xs text-textTertiary">{student.studentCode}</div>
                                            </td>
                                            <td className="px-3 py-2">
                                                <Chip label={formatEnumLabel(student.attemptStatus)} variant={getChipVariant(student.attemptStatus)} />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    <p className="text-xs text-textTertiary mt-3">
                        {assignedStudents.length} student{assignedStudents.length === 1 ? '' : 's'} assigned
                    </p>
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
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Recording</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Answers</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borderLight">
                                        {attempts.map((attempt) => (
                                            <tr key={attempt.attemptId}>
                                                <td className="px-3 py-2">
                                                    <div className="font-medium text-textPrimary">{attempt.studentName || '—'}</div>
                                                    <div className="text-xs text-textSecondary">{attempt.studentEmail}</div>
                                                    <div className="text-xs text-textTertiary">{attempt.studentCode}</div>
                                                </td>
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
                                                <td className="px-3 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setRecordingAttemptId(attempt.attemptId)}
                                                        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer"
                                                    >
                                                        <Video className="w-3.5 h-3.5" /> View
                                                    </button>
                                                </td>
                                                <td className="px-3 py-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setAnswersAttemptId(attempt.attemptId);
                                                            setAnswersStudentLabel(attempt.studentName || attempt.studentCode);
                                                        }}
                                                        className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline cursor-pointer"
                                                    >
                                                        <HelpCircle className="w-3.5 h-3.5" /> View
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </section>
                )}

                {showRoomsSection && (
                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-lg font-bold text-textPrimary">Exam Rooms</h2>
                            </div>
                            {rooms.length === 0 && canFormRooms && (
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
                            <p className="text-sm text-textSecondary">
                                {canFormRooms ? 'No rooms formed yet.' : 'No rooms were formed for this exam — it moved past PUBLISHED before rooms were created.'}
                            </p>
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
                                                <td className="px-3 py-2">
                                                    <div className="font-medium text-textPrimary">{room.facultyName || '—'}</div>
                                                    <div className="text-xs text-textSecondary">{room.facultyEmail}</div>
                                                    <div className="text-xs text-textTertiary">{room.facultyCode}</div>
                                                </td>
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

                {showRoomsSection && rooms.length > 0 && (
                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <ClipboardList className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-textPrimary">Room Information</h2>
                                <p className="text-sm text-textSecondary">
                                    Every formed room for this exam, with its invigilating faculty and assigned students.
                                </p>
                            </div>
                        </div>
                        <Accordion>
                            {rooms.map((room, index) => (
                                <AccordionItem
                                    key={room.roomId}
                                    header={
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="text-sm font-semibold text-textPrimary shrink-0">Room {index + 1}</span>
                                            <Chip label={formatEnumLabel(room.status)} variant={getChipVariant(room.status)} />
                                            <span className="text-sm text-textSecondary truncate flex-1 min-w-[120px]">
                                                {room.facultyName || room.facultyCode}
                                            </span>
                                            <span className="text-xs text-textSecondary shrink-0">
                                                {room.roomTotalOccupancy} student{room.roomTotalOccupancy !== 1 ? 's' : ''}
                                            </span>
                                        </div>
                                    }
                                >
                                    <div className="space-y-4 pt-2">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="rounded-md border border-borderLight p-3 bg-whiteColor">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <UserCheck size={16} className="text-primary" />
                                                    <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">
                                                        Invigilating Faculty
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-textPrimary">{room.facultyName || '—'}</p>
                                                <p className="text-xs text-textSecondary">{room.facultyEmail}</p>
                                                <p className="text-xs text-textTertiary">{room.facultyCode}</p>
                                            </div>
                                            <div className="rounded-md border border-borderLight p-3 bg-whiteColor">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Clock size={16} className="text-primary" />
                                                    <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">
                                                        Session
                                                    </span>
                                                </div>
                                                <p className="text-sm text-textPrimary">
                                                    {formatDateTime(room.startDateTime)} — {formatDateTime(room.endDateTime)}
                                                </p>
                                                <p className="text-xs text-textTertiary mt-1">LiveKit session: {room.liveKitSessionId}</p>
                                                {room.pooledWithExamNames.length > 0 && (
                                                    <p className="text-xs text-textSecondary mt-1">
                                                        Pooled with: {room.pooledWithExamNames.join(', ')}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">
                                                Assigned Students ({room.assignments.length})
                                            </span>
                                            <div className="mt-2 overflow-x-auto rounded-md border border-borderLight">
                                                <table className="w-full text-sm">
                                                    <thead className="bg-bgSecondary">
                                                        <tr>
                                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Student</th>
                                                            {room.pooledWithExamNames.length > 0 && (
                                                                <th className="px-3 py-2 text-left font-medium text-textSecondary">Exam</th>
                                                            )}
                                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Status</th>
                                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Timeline</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-borderLight">
                                                        {room.assignments.map((a) => (
                                                            <tr key={a.assignmentId}>
                                                                <td className="px-3 py-2">
                                                                    <div className="font-medium text-textPrimary">{a.studentName || '—'}</div>
                                                                    <div className="text-xs text-textSecondary">{a.studentEmail}</div>
                                                                    <div className="text-xs text-textTertiary">{a.studentCode}</div>
                                                                </td>
                                                                {room.pooledWithExamNames.length > 0 && (
                                                                    <td className="px-3 py-2 text-textSecondary">{a.examName}</td>
                                                                )}
                                                                <td className="px-3 py-2">
                                                                    <Chip label={formatEnumLabel(a.status)} variant={getChipVariant(a.status)} />
                                                                </td>
                                                                <td className="px-3 py-2 text-xs text-textSecondary">
                                                                    {a.admittedAt && <div>Admitted: {formatDateTime(a.admittedAt)}</div>}
                                                                    {a.removedAt && (
                                                                        <div className="text-red-600">
                                                                            Removed: {formatDateTime(a.removedAt)}
                                                                            {a.removalReason ? ` (${a.removalReason})` : ''}
                                                                        </div>
                                                                    )}
                                                                    {!a.admittedAt && !a.removedAt && a.enteredWaitingRoomAt && (
                                                                        <div>Waiting since {formatDateTime(a.enteredWaitingRoomAt)}</div>
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionItem>
                            ))}
                        </Accordion>
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
                        examSectionId: editingQuestion.examSectionId,
                        options: editingQuestion.options?.map((o) => ({
                            text: o.text,
                            isCorrect: !!editingQuestion.correctOptionIds?.includes(o.optionId),
                        })),
                    } : undefined}
                    examSections={examSections}
                    onSubmit={handleQuestionSubmit}
                    isLoading={isAddingQuestion || isUpdatingQuestion}
                />
            </Modal>

            <BulkUploadQuestionsModal
                isOpen={isBulkUploadOpen}
                onClose={() => setIsBulkUploadOpen(false)}
                examId={id as string}
                examSections={examSections}
            />

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

            <RecordingViewerModal attemptId={recordingAttemptId} onClose={() => setRecordingAttemptId(null)} />

            <AttemptAnswersModal
                attemptId={answersAttemptId}
                studentLabel={answersStudentLabel}
                onClose={() => { setAnswersAttemptId(null); setAnswersStudentLabel(undefined); }}
            />
        </>
    );
};

export default ExamDetailPage;
