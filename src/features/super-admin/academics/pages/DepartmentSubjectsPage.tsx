import { useState, useCallback } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Chip from "../../../../common/ui/Chip";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { SubjectData } from "../../../../types/subjects-types";
import { formatEnumLabel, getChipVariant } from "../../../../utils/utils";
import { formatDate } from "../../../../utils/date";
import { useGetDepartmentSectionsQuery } from "../../../../state/services/endpoints/academics";
import { useGetAllSubjectsAdminQuery } from "../../../../state/services/endpoints/subjects";

const SEMESTERS = Array.from({ length: 8 }, (_, i) => i + 1);

const DepartmentSubjectsPage = () => {
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

    const deptId = departmentData?.data?.deptId;

    const [activeSemester, setActiveSemester] = useState(1);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

    const { data, isLoading, isFetching } = useGetAllSubjectsAdminQuery(
        {
            departmentId: deptId,
            semester: activeSemester,
            page,
            limit: pageSize,
            ...(sortBy && { sortBy, sortOrder: sortOrder || 'asc' }),
        },
        { skip: !deptId }
    );

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

    const handleBack = useCallback(() => {
        navigate(`/super-admin/academics/courses/${batchCourseId}/departments?courseId=${courseId}&batchId=${batchId}`);
    }, [navigate, batchCourseId, courseId, batchId]);

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
            accessorKey: "createdAt",
            header: "Created At",
            sortKey: "createdAt",
            width: "150px",
            cell: ({ getValue }: { getValue: () => string }) => formatDate(getValue()),
        },
    ];

    return (
        <>
            <PageHeader>
                {isDepartmentLoading
                    ? "Subjects"
                    : `${departmentData?.data?.deptName || "Department"} - Subjects`}
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

                <div className="flex flex-wrap gap-2 border-b border-borderLight pb-4">
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
                        isLoading={isDepartmentLoading || isLoading || isFetching}
                        tableTitle="Subjects"
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                    />
                </div>
            </Container>
        </>
    );
};

export default DepartmentSubjectsPage;
