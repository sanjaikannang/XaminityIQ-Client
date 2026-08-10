import toast from "react-hot-toast";
import { useState, useCallback } from "react";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import RowActions from "../../../../common/ui/RowActions";
import DeleteConfirmModal from "../../../../common/ui/DeleteConfirmModal";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Chip from "../../../../common/ui/Chip";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { SubjectData } from "../../../../types/subjects-types";
import { formatEnumLabel, getChipVariant } from "../../../../utils/utils";
import SubjectForm, { SubjectFormValues } from "../components/SubjectForm";
import {
    useGetMySubjectsQuery,
    useCreateSubjectMutation,
    useUpdateSubjectMutation,
    useDeleteSubjectMutation,
} from "../../../../state/services/endpoints/subjects";

const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1);

const SubjectsPage = () => {
    const [activeSemester, setActiveSemester] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSubject, setEditingSubject] = useState<SubjectData | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<SubjectData | null>(null);

    const { data, isLoading, isFetching, error } = useGetMySubjectsQuery({
        page,
        limit: pageSize,
        semester: activeSemester,
        ...(sortBy && { sortBy, sortOrder: sortOrder || 'asc' }),
    });

    const [createSubject, { isLoading: isCreating }] = useCreateSubjectMutation();
    const [updateSubject, { isLoading: isUpdating }] = useUpdateSubjectMutation();
    const [deleteSubject, { isLoading: isDeleting }] = useDeleteSubjectMutation();

    const isForbidden = (error as any)?.status === 403;

    const handleSelectSemester = useCallback((semester: number) => {
        setActiveSemester(semester);
        setPage(1);
    }, []);

    const handlePageChange = useCallback((newPage: number) => {
        setPage(newPage);
    }, []);

    const handlePageSizeChange = useCallback((newPageSize: number) => {
        setPageSize(newPageSize);
        setPage(1);
    }, []);

    const handleSortChange = useCallback((newSortBy: string, newSortOrder: 'asc' | 'desc') => {
        setSortBy(newSortBy);
        setSortOrder(newSortOrder);
        setPage(1);
    }, []);

    const handleOpenCreate = useCallback(() => {
        setEditingSubject(null);
        setIsModalOpen(true);
    }, []);

    const handleOpenEdit = useCallback((subject: SubjectData) => {
        setEditingSubject(subject);
        setIsModalOpen(true);
    }, []);

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
        setEditingSubject(null);
    }, []);

    const handleSubmit = async (values: SubjectFormValues) => {
        const payload = {
            subjectCode: values.subjectCode,
            subjectName: values.subjectName,
            semester: Number(values.semester),
            credits: Number(values.credits),
            subjectType: values.subjectType as any,
            description: values.description || undefined,
        };

        if (editingSubject) {
            const response = await updateSubject({ id: editingSubject._id, data: payload }).unwrap();
            toast.success(response.message || 'Subject updated successfully');
        } else {
            const response = await createSubject(payload).unwrap();
            toast.success(response.message || 'Subject created successfully');
        }
        handleCloseModal();
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const response = await deleteSubject(deleteTarget._id).unwrap();
            toast.success(response.message || 'Subject deleted successfully');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to delete subject');
        } finally {
            setDeleteTarget(null);
        }
    };

    const columns: ColumnDef<SubjectData, any>[] = [
        { accessorKey: "subjectCode", header: "Subject Code", sortKey: "subjectCode", width: "150px" },
        { accessorKey: "subjectName", header: "Subject Name", sortKey: "subjectName", width: "200px" },
        { accessorKey: "credits", header: "Credits", sortKey: "credits", width: "110px" },
        {
            accessorKey: "subjectType",
            header: "Type",
            sortKey: "subjectType",
            width: "140px",
            cell: ({ getValue }: { getValue: () => string }) => {
                const value = getValue();
                return <Chip label={formatEnumLabel(value)} variant={getChipVariant(value)} />;
            },
        },
        {
            accessorKey: "description",
            header: "Description",
            width: "280px",
            cell: ({ getValue }: { getValue: () => string }) => getValue() || '-',
        },
        {
            header: "Actions",
            width: "100px",
            cell: ({ row }: { row: { original: SubjectData } }) => (
                <RowActions
                    onEdit={() => handleOpenEdit(row.original)}
                    onDelete={() => setDeleteTarget(row.original)}
                />
            ),
        },
    ];

    return (
        <>
            <PageHeader>Subjects</PageHeader>
            <Container>
                {isForbidden ? (
                    <div className="py-10 text-center text-textSecondary">
                        This page is restricted to your department's Head of Department (HOD).
                    </div>
                ) : (
                    <>
                        <div className="flex justify-end pt-6">
                            <Button type="button" variant="primary" size="md" onClick={handleOpenCreate}>
                                Add Subject
                            </Button>
                        </div>

                        <div className="flex flex-wrap gap-2 border-b border-borderLight pb-4 pt-4">
                            {SEMESTERS.map((semester) => (
                                <button
                                    key={semester}
                                    type="button"
                                    onClick={() => handleSelectSemester(semester)}
                                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeSemester === semester
                                        ? "bg-primary text-whiteColor"
                                        : "bg-bgSecondary text-textPrimary hover:bg-borderLight"
                                        }`}
                                >
                                    Semester {semester}
                                </button>
                            ))}
                        </div>

                        <div className="py-6">
                            <Table
                                columns={columns}
                                data={data?.data || []}
                                totalCount={data?.pagination?.totalItems || 0}
                                pageNumber={page}
                                pageLimit={pageSize}
                                totalPages={data?.pagination?.totalPages || 1}
                                onPageChange={handlePageChange}
                                onPageSizeChange={handlePageSizeChange}
                                isLoading={isLoading || isFetching}
                                tableTitle="Subjects"
                                sortBy={sortBy}
                                sortOrder={sortOrder}
                                onSortChange={handleSortChange}
                            />
                        </div>
                    </>
                )}
            </Container>

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={editingSubject ? "Edit Subject" : "Add Subject"}
                size="md"
            >
                <SubjectForm
                    initialValues={editingSubject ? {
                        subjectCode: editingSubject.subjectCode,
                        subjectName: editingSubject.subjectName,
                        semester: editingSubject.semester,
                        credits: editingSubject.credits,
                        subjectType: editingSubject.subjectType,
                        description: editingSubject.description || '',
                    } : undefined}
                    fixedSemester={editingSubject ? undefined : activeSemester}
                    onSubmit={handleSubmit}
                    isLoading={isCreating || isUpdating}
                />
            </Modal>

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete Subject"
                message={
                    <>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-textPrimary">
                            {deleteTarget ? `${deleteTarget.subjectCode} - ${deleteTarget.subjectName}` : ''}
                        </span>
                        ?
                    </>
                }
            />
        </>
    );
};

export default SubjectsPage;
