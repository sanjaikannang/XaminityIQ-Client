import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../../../common/ui/Button";
import Select from "../../../../common/ui/Select";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Chip from "../../../../common/ui/Chip";
import { ExamMode, ExamStatus } from "../../../../utils/enum";
import { formatEnumLabel, getChipVariant, toEnumOptions } from "../../../../utils/utils";
import { formatDate } from "../../../../utils/date";
import { ExamData } from "../../../../types/exams-types";
import { ColumnDef, Table } from "../../../../common/ui/Table";
import { useGetAllExamsQuery } from "../../../../state/services/endpoints/exams";

const modeOptions = toEnumOptions(ExamMode);
const statusOptions = toEnumOptions(ExamStatus);

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
        {
            accessorKey: "name",
            header: "Exam Name",
            sortKey: "name",
            width: "400px"
        },
        {
            accessorKey: "mode",
            header: "Mode",
            sortKey: "mode",
            width: "150px",
            cell: ({ getValue }: { getValue: () => string }) => {
                const value = getValue();
                return <Chip label={formatEnumLabel(value)} variant={getChipVariant(value)} />;
            },
        },
        {
            accessorKey: "status",
            header: "Status",
            sortKey: "status",
            width: "200px",
            cell: ({ getValue }: { getValue: () => string }) => {
                const value = getValue();
                return <Chip label={formatEnumLabel(value)} variant={getChipVariant(value)} />;
            },
        },
        {
            accessorKey: "deptName",
            header: "Batch / Course / Dept / Section",
            width: "500px",
            cell: ({ row }: { row: { original: ExamData } }) => {
                const e = row.original;
                return `${e.batchName || ''} / ${e.courseName || ''} / ${e.deptName || ''} / ${(e.sectionNames || []).join(', ')}`;
            },
        },
        {
            accessorKey: "startDate",
            header: "Schedule",
            sortKey: "startDate",
            width: "250px",
            cell: ({ row }: { row: { original: ExamData } }) => {
                const e = row.original;
                return `${formatDate(e.startDate)} - ${formatDate(e.endDate)}`;
            },
        },
        {
            accessorKey: "totalMarks",
            header: "Total Marks",
            sortKey: "totalMarks",
            width: "150px"
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
            <PageHeader>Exams</PageHeader>
            <div className="px-6">
                <div className="flex justify-end gap-3">
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
                        hasActiveFilters={hasActiveFilters}
                        filters={
                            <>
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
                            </>
                        }
                    />
                </div>
            </Container>
        </>
    );
};

export default ExamsPage;
