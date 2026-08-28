import toast from "react-hot-toast";
import { useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import Select from "../../../../common/ui/Select";
import AsyncSelect, { type AsyncSelectOption } from "../../../../common/ui/AsyncSelect";
import RowActions from "../../../../common/ui/RowActions";
import DeleteConfirmModal from "../../../../common/ui/DeleteConfirmModal";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Chip from "../../../../common/ui/Chip";
import { StudentStatus } from "../../../../utils/enum";
import { formatEnumLabel, getChipVariant, toEnumOptions } from "../../../../utils/utils";
import { StudentsData } from "../../../../types/students-types";
import type { BatchData, CourseData, DepartmentData } from "../../../../types/academics-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import UserActivityModal from "../../components/UserActivityModal";
import BulkUploadStudentsModal from "../components/BulkUploadStudentsModal";
import { useAppDispatch } from "../../../../app/store/hooks";
import { createPaginatedLoadOptions } from "../../../../utils/asyncSelectHelpers";
import { academicsApiService } from "../../../../state/services/endpoints/academics";
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
    const [batchOption, setBatchOption] = useState<AsyncSelectOption | null>(null);
    const [courseId, setCourseId] = useState("");
    const [courseOption, setCourseOption] = useState<AsyncSelectOption | null>(null);
    const [departmentId, setDepartmentId] = useState("");
    const [departmentOption, setDepartmentOption] = useState<AsyncSelectOption | null>(null);
    const [sectionId, setSectionId] = useState("");
    const [status, setStatus] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<StudentsData | null>(null);
    const [activityTarget, setActivityTarget] = useState<StudentsData | null>(null);
    const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

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

    const dispatch = useAppDispatch();

    const loadBatchOptions = useMemo(() => createPaginatedLoadOptions<BatchData, any>({
        dispatch,
        initiate: academicsApiService.endpoints.getBatches.initiate,
        extraParams: {},
        mapItem: (b) => ({ value: b._id, label: b.batchName, raw: b }),
    }), [dispatch]);

    const loadCourseOptions = useMemo(() => createPaginatedLoadOptions<CourseData, any>({
        dispatch,
        initiate: academicsApiService.endpoints.getCourses.initiate,
        extraParams: { batchId },
        mapItem: (c) => ({ value: c._id, label: c.courseName, raw: c }),
    }), [dispatch, batchId]);

    const loadDepartmentOptions = useMemo(() => createPaginatedLoadOptions<DepartmentData, any>({
        dispatch,
        initiate: academicsApiService.endpoints.getDepartments.initiate,
        extraParams: { batchCourseId: courseOption?.raw?.batchCourseId },
        mapItem: (d) => ({ value: d._id, label: d.deptName, raw: d }),
    }), [dispatch, courseOption?.raw?.batchCourseId]);

    const sections: { _id: string; sectionName: string }[] = departmentOption?.raw?.sections || [];
    const sectionOptions = sections.map((s) => ({ value: s._id, label: s.sectionName }));

    const hasActiveFilters = !!(batchId || courseId || departmentId || sectionId || status);

    const handleClearFilters = useCallback(() => {
        setBatchId("");
        setBatchOption(null);
        setCourseId("");
        setCourseOption(null);
        setDepartmentId("");
        setDepartmentOption(null);
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
                <div className="flex justify-end gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="md"
                        onClick={() => setIsBulkUploadOpen(true)}
                    >
                        Bulk Upload
                    </Button>
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
                                <AsyncSelect
                                    id="filter-batch"
                                    label="Batch"
                                    placeholder="All Batches"
                                    value={batchOption}
                                    loadOptions={loadBatchOptions}
                                    onChange={(option) => {
                                        setBatchOption(option);
                                        setBatchId(option?.value || "");
                                        setCourseOption(null);
                                        setCourseId("");
                                        setDepartmentOption(null);
                                        setDepartmentId("");
                                        setSectionId("");
                                        setPage(1);
                                    }}
                                    className="w-44"
                                />
                                <AsyncSelect
                                    key={batchId}
                                    id="filter-course"
                                    label="Course"
                                    placeholder="All Courses"
                                    value={courseOption}
                                    loadOptions={loadCourseOptions}
                                    disabled={!batchId}
                                    onChange={(option) => {
                                        setCourseOption(option);
                                        setCourseId(option?.value || "");
                                        setDepartmentOption(null);
                                        setDepartmentId("");
                                        setSectionId("");
                                        setPage(1);
                                    }}
                                    className="w-44"
                                />
                                <AsyncSelect
                                    key={courseOption?.raw?.batchCourseId || courseId}
                                    id="filter-department"
                                    label="Department"
                                    placeholder="All Departments"
                                    value={departmentOption}
                                    loadOptions={loadDepartmentOptions}
                                    disabled={!courseId}
                                    onChange={(option) => {
                                        setDepartmentOption(option);
                                        setDepartmentId(option?.value || "");
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

            <BulkUploadStudentsModal
                isOpen={isBulkUploadOpen}
                onClose={() => setIsBulkUploadOpen(false)}
            />
        </>
    );
};

export default StudentsPage;
