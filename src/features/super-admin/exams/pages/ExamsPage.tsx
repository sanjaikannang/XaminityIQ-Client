import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import Select from "../../../../common/ui/Select";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { ExamMode, ExamStatus } from "../../../../utils/enum";
import { ExamData } from "../../../../types/exams-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { useGetAllExamsQuery } from "../../../../state/services/endpoints/exams";

const modeOptions = Object.values(ExamMode).map((value) => ({ value, label: value }));
const statusOptions = Object.values(ExamStatus).map((value) => ({ value, label: value }));

const ExamsPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<string | undefined>(undefined);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

    const [mode, setMode] = useState("");
    const [status, setStatus] = useState("");

    const { data, isLoading, isFetching } = useGetAllExamsQuery({
        page,
        limit: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(mode && { mode: mode as ExamMode }),
        ...(status && { status: status as ExamStatus }),
        ...(sortBy && { sortBy, sortOrder: sortOrder || 'asc' }),
    });

    const hasActiveFilters = !!(mode || status);

    const handleClearFilters = useCallback(() => {
        setMode("");
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

    const handleRowClick = useCallback((row: ExamData) => {
        navigate(`/super-admin/exams/${row._id}`);
    }, [navigate]);

    const columns: ColumnDef<ExamData, any>[] = [
        { accessorKey: "name", header: "Exam Name", sortKey: "name" },
        { accessorKey: "mode", header: "Mode", sortKey: "mode" },
        { accessorKey: "status", header: "Status", sortKey: "status" },
        {
            accessorKey: "deptName",
            header: "Batch / Course / Dept / Section",
            cell: ({ row }: { row: { original: ExamData } }) => {
                const e = row.original;
                return `${e.batchName || ''} / ${e.courseName || ''} / ${e.deptName || ''} / ${e.sectionName || ''}`;
            },
        },
        {
            accessorKey: "startDate",
            header: "Schedule",
            sortKey: "startDate",
            cell: ({ row }: { row: { original: ExamData } }) => {
                const e = row.original;
                const start = new Date(e.startDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                const end = new Date(e.endDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                return `${start} - ${end}`;
            },
        },
        { accessorKey: "totalMarks", header: "Total Marks", sortKey: "totalMarks" },
        {
            accessorKey: "createdAt",
            header: "Created At",
            sortKey: "createdAt",
            cell: ({ getValue }: { getValue: () => string }) => {
                const date = new Date(getValue());
                return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
            },
        },
    ];

    return (
        <>
            <PageHeader>Exams</PageHeader>
            <div className="px-6">
                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={() => navigate('/super-admin/exams/create')}
                    >
                        Create Exam
                    </Button>
                </div>
            </div>

            <Container>
                <div className="pt-6 flex flex-wrap items-end gap-3">
                    <Select
                        id="filter-mode"
                        name="filter-mode"
                        label="Mode"
                        placeholder="All Modes"
                        options={modeOptions}
                        value={mode}
                        onChange={(value) => {
                            setMode(value as string);
                            setPage(1);
                        }}
                        className="w-44"
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
                        className="w-44"
                    />
                    {hasActiveFilters && (
                        <Button type="button" variant="outline" size="md" onClick={handleClearFilters}>
                            Clear Filters
                        </Button>
                    )}
                </div>

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
                        tableTitle="Exams"
                        onSearch={handleSearch}
                        sortBy={sortBy}
                        sortOrder={sortOrder}
                        onSortChange={handleSortChange}
                    />
                </div>
            </Container>
        </>
    );
};

export default ExamsPage;
