import toast from "react-hot-toast";
import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
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
import { useGetBatchesQuery, useGetCoursesQuery, useGetDepartmentsQuery } from "../../../../state/services/endpoints/academics";
import {
    useGetAllStudentsQuery,
    useDeleteStudentMutation,
    useGetStudentActivityQuery,
} from "../../../../state/services/endpoints/students";

const statusOptions = toEnumOptions(StudentStatus);

const StudentsPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

    // Cascading filter state
    const [batchId, setBatchId] = useState("");
    const [courseId, setCourseId] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [sectionId, setSectionId] = useState("");
    const [status, setStatus] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<StudentsData | null>(null);
    const [activityTarget, setActivityTarget] = useState<StudentsData | null>(null);

    const { data, isLoading, isFetching } = useGetAllStudentsQuery({
        page,
        limit: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(batchId && { batchId }),
        ...(courseId && { courseId }),
        ...(departmentId && { departmentId }),
        ...(sectionId && { sectionId }),
        ...(status && { status }),
        ...(sortBy && { sortBy, sortOrder: sortOrder || 'asc' }),
    });

    const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
    const { data: activityData, isLoading: isActivityLoading } = useGetStudentActivityQuery(
        activityTarget?.id as string,
        { skip: !activityTarget }
    );

    const { data: batchesData, isFetching: isBatchesLoading } = useGetBatchesQuery({ limit: 100 });
    const { data: coursesData, isFetching: isCoursesLoading } = useGetCoursesQuery(
        { batchId, limit: 100 },
        { skip: !batchId }
    );
    const selectedCourse = coursesData?.data?.find((c) => c._id === courseId);
    const { data: departmentsData, isFetching: isDepartmentsLoading } = useGetDepartmentsQuery(
        { batchCourseId: selectedCourse?.batchCourseId as string, limit: 100 },
        { skip: !selectedCourse?.batchCourseId }
    );
    const selectedDepartment = departmentsData?.data?.find((d) => d._id === departmentId);
    const sections = selectedDepartment?.sections || [];

    const batchOptions = (batchesData?.data || []).map((b) => ({ value: b._id, label: b.batchName }));
    const courseOptions = (coursesData?.data || []).map((c) => ({ value: c._id, label: c.courseName }));
    const departmentOptions = (departmentsData?.data || []).map((d) => ({ value: d._id, label: d.deptName }));
    const sectionOptions = sections.map((s) => ({ value: s._id, label: s.sectionName }));

    const hasActiveFilters = !!(batchId || courseId || departmentId || sectionId || status);

    const handleClearFilters = useCallback(() => {
        setBatchId("");
        setCourseId("");
        setDepartmentId("");
        setSectionId("");
        setStatus("");
        setPage(1);
    }, []);

    const handleSearch = useCallback((search: string) => {
        setSearchTerm(search);
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

    const handleRowClick = useCallback((row: StudentsData) => {
        navigate(`/super-admin/students/${row.id}`);
    }, [navigate]);

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
            width: "200px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.rollNumber}`;
            },
        },
        {
            accessorKey: "personalDetails.firstName",
            header: "Name",
            sortKey: "name",
            width: "250px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.personalDetails.firstName} ${row.original.personalDetails.lastName}`;
            },
        },
        {
            accessorKey: "contactDetails.personalEmail",
            header: "Personal Email",
            width: "350px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.contactDetails.personalEmail}`;
            },
        },
        {
            accessorKey: "contactDetails.studentEmail",
            header: "Student Email",
            width: "350px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.contactDetails.studentEmail}`;
            },
        },
        {
            accessorKey: "contactDetails.phoneNumber",
            header: "Phone",
            width: "180px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.contactDetails.phoneNumber}`;
            },
        },
        {
            accessorKey: "academicDetails.batchName",
            header: "Batch",
            width: "150px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.batchName}`;
            },
        },
        {
            accessorKey: "academicDetails.courseName",
            header: "Course",
            width: "280px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.courseName}`;
            },
        },
        {
            accessorKey: "academicDetails.departmentName",
            header: "Department",
            width: "250px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.departmentName}`;
            },
        },
        {
            accessorKey: "academicDetails.sectionName",
            header: "Section",
            width: "150px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.sectionName}`;
            },
        },
        {
            accessorKey: "academicDetails.currentSemester",
            header: "Semester",
            sortKey: "semester",
            width: "150px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                return `${row.original.academicDetails.currentSemester}`;
            },
        },
        {
            accessorKey: "academicDetails.status",
            header: "Status",
            sortKey: "status",
            width: "150px",
            cell: ({ row }: { row: { original: StudentsData } }) => {
                const value = row.original.academicDetails.status;
                return <Chip label={formatEnumLabel(value)} variant={getChipVariant(value)} />;
            },
        },
        {
            header: "Actions",
            width: "150px",
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
            <PageHeader>Students</PageHeader>
            <div className="px-6">
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/super-admin/students/create')}
                    >
                        Add Student
                    </Button>
                </div>
            </div>

            <Container>
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
                        onSearch={handleSearch}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                        hasActiveFilters={hasActiveFilters}
                        filters={
                            <>
                                <Select
                                    id="filter-batch"
                                    name="filter-batch"
                                    label="Batch"
                                    placeholder="All Batches"
                                    options={batchOptions}
                                    value={batchId}
                                    loading={isBatchesLoading}
                                    onChange={(value) => {
                                        setBatchId(value as string);
                                        setCourseId("");
                                        setDepartmentId("");
                                        setSectionId("");
                                        setPage(1);
                                    }}
                                    className="w-44"
                                />
                                <Select
                                    id="filter-course"
                                    name="filter-course"
                                    label="Course"
                                    placeholder="All Courses"
                                    options={courseOptions}
                                    value={courseId}
                                    loading={isCoursesLoading}
                                    disabled={!batchId}
                                    onChange={(value) => {
                                        setCourseId(value as string);
                                        setDepartmentId("");
                                        setSectionId("");
                                        setPage(1);
                                    }}
                                    className="w-44"
                                />
                                <Select
                                    id="filter-department"
                                    name="filter-department"
                                    label="Department"
                                    placeholder="All Departments"
                                    options={departmentOptions}
                                    value={departmentId}
                                    loading={isDepartmentsLoading}
                                    disabled={!courseId}
                                    onChange={(value) => {
                                        setDepartmentId(value as string);
                                        setSectionId("");
                                        setPage(1);
                                    }}
                                    className="w-44"
                                />
                                <Select
                                    id="filter-section"
                                    name="filter-section"
                                    label="Section"
                                    placeholder="All Sections"
                                    options={sectionOptions}
                                    value={sectionId}
                                    disabled={!departmentId}
                                    onChange={(value) => {
                                        setSectionId(value as string);
                                        setPage(1);
                                    }}
                                    className="w-40"
                                />
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
                                {hasActiveFilters && (
                                    <Button type="button" variant="outline" size="md" onClick={handleClearFilters}>
                                        Clear Filters
                                    </Button>
                                )}
                            </>
                        }
                    />
                </div>
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

export default StudentsPage;
