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
import { FacultyDesignation, EmploymentType, FacultyStatus } from "../../../../utils/enum";
import { formatEnumLabel, getChipVariant, toEnumOptions } from "../../../../utils/utils";
import { formatDate } from "../../../../utils/date";
import { FacultyData } from "../../../../types/faculty-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import UserActivityModal from "../../components/UserActivityModal";
import { useGetAllDepartmentsQuery } from "../../../../state/services/endpoints/academics";
import {
    useGetAllFacultyQuery,
    useDeleteFacultyMutation,
    useGetFacultyActivityQuery,
} from "../../../../state/services/endpoints/faculty";

const designationOptions = toEnumOptions(FacultyDesignation);
const employmentTypeOptions = toEnumOptions(EmploymentType);
const statusOptions = toEnumOptions(FacultyStatus);

const FacultiesPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

    const [departmentId, setDepartmentId] = useState("");
    const [designation, setDesignation] = useState("");
    const [employmentType, setEmploymentType] = useState("");
    const [status, setStatus] = useState("");

    const [deleteTarget, setDeleteTarget] = useState<FacultyData | null>(null);
    const [activityTarget, setActivityTarget] = useState<FacultyData | null>(null);

    const { data, isLoading, isFetching } = useGetAllFacultyQuery({
        page,
        limit: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(departmentId && { departmentId }),
        ...(designation && { designation }),
        ...(employmentType && { employmentType }),
        ...(status && { status }),
        ...(sortBy && { sortBy, sortOrder: sortOrder || 'asc' }),
    });

    const [deleteFaculty, { isLoading: isDeleting }] = useDeleteFacultyMutation();
    const { data: activityData, isLoading: isActivityLoading } = useGetFacultyActivityQuery(
        activityTarget?.id as string,
        { skip: !activityTarget }
    );

    const { data: departmentsData, isFetching: isDepartmentsLoading } = useGetAllDepartmentsQuery();
    const departmentOptions = (departmentsData?.data || []).map((d) => ({ value: d._id, label: d.deptName }));

    const hasActiveFilters = !!(departmentId || designation || employmentType || status);

    const handleClearFilters = useCallback(() => {
        setDepartmentId("");
        setDesignation("");
        setEmploymentType("");
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

    const handleRowClick = useCallback((row: FacultyData) => {
        navigate(`/super-admin/faculties/${row.id}`);
    }, [navigate]);

    const handleDelete = async () => {
        if (!deleteTarget) return;
        try {
            const response = await deleteFaculty(deleteTarget.id).unwrap();
            toast.success(response.message || 'Faculty deactivated successfully');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to delete faculty');
        } finally {
            setDeleteTarget(null);
        }
    };

    const columns: ColumnDef<FacultyData, any>[] = [
        {
            accessorKey: "facultyId",
            header: "Employee ID",
            sortKey: "employeeId",
            width: "200px",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.employmentDetails.employeeId}`;
            },
        },
        {
            accessorKey: "personalDetails.firstName",
            header: "Name",
            sortKey: "name",
            width: "250px",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.personalDetails.firstName} ${row.original.personalDetails.lastName}`;
            },
        },
        {
            accessorKey: "contactDetails.facultyEmail",
            header: "Personal Email",
            width: "350px",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.contactDetails.personalEmail}`;
            },
        },
        {
            accessorKey: "contactDetails.facultyEmail",
            header: "Faculty Email",
            width: "350px",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.contactDetails.facultyEmail}`;
            },
        },
        {
            accessorKey: "contactDetails.phoneNumber",
            header: "Phone",
            width: "180px",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.contactDetails.phoneNumber}`;
            },
        },
        {
            accessorKey: "employmentDetails.designation",
            header: "Designation",
            sortKey: "designation",
            width: "250px",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                const value = row.original.employmentDetails.designation;
                return <Chip label={formatEnumLabel(value)} variant={getChipVariant(value)} />;
            },
        },
        {
            accessorKey: "employmentDetails.departmentName",
            header: "Department",
            width: "280px",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                return `${row.original.employmentDetails.departmentName}`;
            },
        },
        {
            accessorKey: "employmentDetails.employmentType",
            header: "Employment Type",
            sortKey: "employmentType",
            width: "220px",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                const value = row.original.employmentDetails.employmentType;
                return <Chip label={formatEnumLabel(value)} variant={getChipVariant(value)} />;
            },
        },
        {
            accessorKey: "employmentDetails.dateOfJoining",
            header: "Date of Joining",
            width: "250px",
            cell: ({ row }: { row: { original: FacultyData } }) => formatDate(row.original.employmentDetails.dateOfJoining),
        },
        {
            accessorKey: "employmentDetails.status",
            header: "Status",
            sortKey: "status",
            width: "150px",
            cell: ({ row }: { row: { original: FacultyData } }) => {
                const value = row.original.employmentDetails.status;
                return <Chip label={formatEnumLabel(value)} variant={getChipVariant(value)} />;
            },
        },
        {
            header: "Actions",
            width: "150px",
            cell: ({ row }: { row: { original: FacultyData } }) => (
                <RowActions
                    onEdit={() => navigate(`/super-admin/faculties/${row.original.id}/edit`)}
                    onDelete={() => setDeleteTarget(row.original)}
                    onViewActivity={() => setActivityTarget(row.original)}
                />
            ),
        },
    ];

    return (
        <>
            <PageHeader>Faculty</PageHeader>
            <div className="px-6">
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/super-admin/faculties/create')}
                    >
                        Add Faculty
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
                        tableTitle="Faculty Members"
                        onSearch={handleSearch}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                        hasActiveFilters={hasActiveFilters}
                        filters={
                            <>
                                <Select
                                    id="filter-department"
                                    name="filter-department"
                                    label="Department"
                                    placeholder="All Departments"
                                    options={departmentOptions}
                                    value={departmentId}
                                    loading={isDepartmentsLoading}
                                    onChange={(value) => {
                                        setDepartmentId(value as string);
                                        setPage(1);
                                    }}
                                    className="w-44"
                                />
                                <Select
                                    id="filter-designation"
                                    name="filter-designation"
                                    label="Designation"
                                    placeholder="All Designations"
                                    options={designationOptions}
                                    value={designation}
                                    onChange={(value) => {
                                        setDesignation(value as string);
                                        setPage(1);
                                    }}
                                    className="w-48"
                                />
                                <Select
                                    id="filter-employment-type"
                                    name="filter-employment-type"
                                    label="Employment Type"
                                    placeholder="All Types"
                                    options={employmentTypeOptions}
                                    value={employmentType}
                                    onChange={(value) => {
                                        setEmploymentType(value as string);
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
                title="Delete Faculty"
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

export default FacultiesPage;
