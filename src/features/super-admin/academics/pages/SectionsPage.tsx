import toast from "react-hot-toast";
import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import Select from "../../../../common/ui/Select";
import RowActions from "../../../../common/ui/RowActions";
import DeleteConfirmModal from "../../../../common/ui/DeleteConfirmModal";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Chip from "../../../../common/ui/Chip";
import { StudentStatus } from "../../../../utils/enum";
import { formatEnumLabel, getChipVariant, toEnumOptions } from "../../../../utils/utils";
import { StudentsData } from "../../../../types/students-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import UserActivityModal from "../../components/UserActivityModal";
import { useGetDepartmentSectionsQuery } from "../../../../state/services/endpoints/academics";
import {
    useGetAllStudentsQuery,
    useDeleteStudentMutation,
    useGetStudentActivityQuery,
} from "../../../../state/services/endpoints/students";

const statusOptions = toEnumOptions(StudentStatus);

const SectionsPage = () => {
    const navigate = useNavigate();
    const { batchDepartmentId } = useParams<{ batchDepartmentId: string }>();
    const [searchParams] = useSearchParams();
    const batchCourseId = searchParams.get('batchCourseId');
    const courseId = searchParams.get('courseId');
    const batchId = searchParams.get('batchId');

    const { data: departmentData, isLoading: isDepartmentLoading } = useGetDepartmentSectionsQuery(
        batchDepartmentId as string,
        { skip: !batchDepartmentId }
    );

    const sections = departmentData?.data?.sections || [];

    const [activeSectionId, setActiveSectionId] = useState<string>("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);
    const [status, setStatus] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<StudentsData | null>(null);
    const [activityTarget, setActivityTarget] = useState<StudentsData | null>(null);

    // Default to the first section once the section list loads
    useEffect(() => {
        if (!activeSectionId && sections.length > 0) {
            setActiveSectionId(sections[0]._id);
        }
    }, [activeSectionId, sections]);

    const handleSelectSection = useCallback((sectionId: string) => {
        setActiveSectionId(sectionId);
        setPage(1);
    }, []);

    const { data, isLoading, isFetching } = useGetAllStudentsQuery(
        {
            page,
            limit: pageSize,
            sectionId: activeSectionId,
            ...(status && { status }),
            ...(sortBy && { sortBy, sortOrder: sortOrder || 'asc' }),
        },
        { skip: !activeSectionId }
    );

    const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
    const { data: activityData, isLoading: isActivityLoading } = useGetStudentActivityQuery(
        activityTarget?.id as string,
        { skip: !activityTarget }
    );

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

    const handleRowClick = useCallback((row: StudentsData) => {
        navigate(`/super-admin/students/${row.id}`);
    }, [navigate]);

    const handleBack = useCallback(() => {
        navigate(`/super-admin/academics/courses/${batchCourseId}/departments?courseId=${courseId}&batchId=${batchId}`);
    }, [navigate, batchCourseId, courseId, batchId]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const response = await deleteStudent(deleteTarget.id).unwrap();
            toast.success(response.message || 'Student deactivated successfully');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to delete student');
        } finally {
            setDeleteTarget(null);
        }
    };

    const columns: ColumnDef<StudentsData, any>[] = [
        {
            accessorKey: "academicDetails.rollNumber",
            header: "Roll Number",
            sortKey: "rollNumber",
            width: "140px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.rollNumber}`;
            },
        },
        {
            accessorKey: "personalDetails.firstName",
            header: "Name",
            sortKey: "name",
            width: "180px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.personalDetails.firstName} ${row.original.personalDetails.lastName}`;
            },
        },
        {
            accessorKey: "contactDetails.personalEmail",
            header: "Personal Email",
            width: "220px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.contactDetails.personalEmail}`;
            },
        },
        {
            accessorKey: "contactDetails.phoneNumber",
            header: "Phone",
            width: "140px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.contactDetails.phoneNumber}`;
            },
        },
        {
            accessorKey: "academicDetails.currentSemester",
            header: "Semester",
            sortKey: "semester",
            width: "120px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.currentSemester}`;
            },
        },
        {
            accessorKey: "academicDetails.status",
            header: "Status",
            sortKey: "status",
            width: "120px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                const value = row.original.academicDetails.status;
                return <Chip label={formatEnumLabel(value)} variant={getChipVariant(value)} />;
            },
        },
        {
            header: "Actions",
            width: "100px",
            cell: ({ row }: { row: { original: StudentsData } }) => (
                <RowActions
                    onEdit={() => navigate(`/super-admin/students/${row.original.id}/edit`)}
                    onDelete={() => setDeleteTarget(row.original)}
                    onViewActivity={() => setActivityTarget(row.original)}
                />
            ),
        },
    ];

    return (
        <>
            <PageHeader>
                {isDepartmentLoading
                    ? "Sections"
                    : `${departmentData?.data?.deptName || "Department"} - Sections`}
            </PageHeader>
            <Container>
                <div className="mb-6 flex items-center justify-between">
                    <Button variant="primary" size="sm" onClick={handleBack}>
                        ← Back to Departments
                    </Button>
                    {!isDepartmentLoading && departmentData?.data && (
                        <p className="text-sm text-textSecondary">
                            {departmentData.data.batchName} &gt; {departmentData.data.courseName} &gt; {departmentData.data.deptName}
                        </p>
                    )}
                </div>

                {sections.length > 0 && (
                    <div className="flex flex-wrap gap-2 border-b border-borderLight pb-4">
                        {sections.map((section) => (
                            <button
                                key={section._id}
                                type="button"
                                onClick={() => handleSelectSection(section._id)}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeSectionId === section._id
                                        ? "bg-primary text-whiteColor"
                                        : "bg-bgSecondary text-textPrimary hover:bg-borderLight"
                                }`}
                            >
                                Section {section.sectionName} ({section.currentStrength}/{section.capacity})
                            </button>
                        ))}
                    </div>
                )}

                {!isDepartmentLoading && sections.length === 0 && (
                    <p className="py-6 text-textSecondary">
                        No sections have been created for this department yet.
                    </p>
                )}

                {sections.length > 0 && (
                    <div className="py-6">
                        <Table
                            columns={columns}
                            data={data?.data || []}
                            onRowClick={handleRowClick}
                            totalCount={data?.pagination?.totalItems || 0}
                            pageNumber={page}
                            pageLimit={pageSize}
                            totalPages={data?.pagination?.totalPages || 1}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                            isLoading={isLoading || isFetching}
                            tableTitle="Students"
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            onSortChange={handleSortChange}
                            hasActiveFilters={!!status}
                            filters={
                                <Select
                                    id="filter-status"
                                    name="filter-status"
                                    label="Status"
                                    placeholder="All Statuses"
                                    options={statusOptions}
                                    value={status}
                                    onChange={(value) => {
                                        setStatus(value as string);
                                        setPage(1);
                                    }}
                                    className="w-40"
                                />
                            }
                        />
                    </div>
                )}
            </Container>

            <DeleteConfirmModal
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                isDeleting={isDeleting}
                title="Delete Student"
                message={
                    <>
                        Are you sure you want to delete{' '}
                        <span className="font-semibold text-textPrimary">
                            {deleteTarget ? `${deleteTarget.personalDetails.firstName} ${deleteTarget.personalDetails.lastName}` : ''}
                        </span>
                        ? This will deactivate their account and they will no longer be able to log in.
                    </>
                }
            />

            <UserActivityModal
                isOpen={!!activityTarget}
                onClose={() => setActivityTarget(null)}
                isLoading={isActivityLoading}
                records={activityData?.data || []}
                title={activityTarget ? `Activity - ${activityTarget.personalDetails.firstName} ${activityTarget.personalDetails.lastName}` : "Activity"}
            />
        </>
    );
};

export default SectionsPage;
