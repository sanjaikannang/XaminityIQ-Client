import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../common/ui/Button';
import Select from '../../../../common/ui/Select';
import { ExamData } from '../../../../types/exam-types';
import { Container } from '../../../../common/ui/Container';
import { ExamMode, ExamStatus } from '../../../../utils/enum';
import { PageHeader } from '../../../../common/ui/PageHeader';
import { ColumnDef, Table } from '../../../../common/ui/Table';
import { useGetAllExamsQuery } from '../../../../state/services/endpoints/exam';

const ExamsPage = () => {
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [searchTerm, setSearchTerm] = useState("");
    const [examModeFilter, setExamModeFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    const { data, isLoading, isFetching } = useGetAllExamsQuery({
        page,
        limit: pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(examModeFilter && { examMode: examModeFilter }),
        ...(statusFilter && { status: statusFilter }),
    });

    const examModeOptions = [
        { value: '', label: 'All Modes' },
        { value: ExamMode.PROCTORING, label: 'Proctoring' },
        { value: ExamMode.AUTO, label: 'Auto' },
    ];

    const statusOptions = [
        { value: '', label: 'All Status' },
        { value: ExamStatus.UPCOMING, label: 'Upcoming' },
        { value: ExamStatus.ONGOING, label: 'Ongoing' },
        { value: ExamStatus.COMPLETED, label: 'Completed' },
    ];

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

    const handleCreateExam = useCallback(() => {
        navigate('/super-admin/exams/create');
    }, [navigate]);

    const getStatusBadge = (status: ExamStatus) => {
        return (
            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${status}`}>
                {status}
            </span>
        );
    };

    const getModeBadge = (mode: ExamMode) => {
        return (
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${mode === ExamMode.PROCTORING ? 'bg-info text-whiteColor' : 'bg-bgSecondary text-textSecondary'
                }`}>
                {mode === ExamMode.PROCTORING ? 'Proctoring' : 'Auto'}
            </span>
        );
    };

    const columns: ColumnDef<ExamData, any>[] = [
        {
            accessorKey: "examName",
            header: "Exam Name",
            cell: ({ row }: { row: { original: ExamData } }) => (
                <div>
                    <div className="font-medium text-textPrimary">{row.original.examName}</div>
                    <div className="mt-1">{getModeBadge(row.original.examMode)}</div>
                </div>
            ),
        },
        {
            accessorKey: "examDate",
            header: "Date/Duration",
            cell: ({ row }: { row: { original: ExamData } }) => {
                if (row.original.examMode === ExamMode.PROCTORING) {
                    return (
                        <div className="text-sm">
                            <div className="text-textPrimary">{row.original.examDate}</div>
                            <div className="text-textSecondary">{row.original.startTime} - {row.original.endTime}</div>
                        </div>
                    );
                } else {
                    return (
                        <div className="text-sm text-textPrimary">
                            {row.original.examStartDate} to {row.original.examEndDate}
                        </div>
                    );
                }
            },
        },
        {
            accessorKey: "duration",
            header: "Duration",
            cell: ({ getValue }: { getValue: () => number }) => (
                <span className="text-sm text-textPrimary">{getValue()} mins</span>
            ),
        },
        {
            accessorKey: "facultyName",
            header: "Faculty",
            cell: ({ row }: { row: { original: ExamData } }) => (
                <span className="text-sm text-textPrimary">
                    {row.original.examMode === ExamMode.PROCTORING ? row.original.facultyName : 'N/A'}
                </span>
            ),
        },
        {
            accessorKey: "totalStudents",
            header: "Students",
            cell: ({ getValue }: { getValue: () => number }) => (
                <span className="text-sm text-textPrimary">{getValue()}</span>
            ),
        },
        {
            accessorKey: "status",
            header: "Status",
            cell: ({ getValue }: { getValue: () => ExamStatus }) => getStatusBadge(getValue()),
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ getValue }: { getValue: () => string }) => {
                const date = new Date(getValue());
                return (
                    <span className="text-sm text-textSecondary">
                        {date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                );
            },
        },
    ];

    return (
        <>
            <PageHeader>Exams</PageHeader>
            <Container>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-3">
                        <Select
                            id="examMode-filter"
                            name="examMode"
                            options={examModeOptions}
                            value={examModeFilter}
                            onChange={(value) => {
                                setExamModeFilter(value as string);
                                setPage(1);
                            }}
                            placeholder="Filter by mode"
                            className="w-48"
                        />
                        <Select
                            id="status-filter"
                            name="status"
                            options={statusOptions}
                            value={statusFilter}
                            onChange={(value) => {
                                setStatusFilter(value as string);
                                setPage(1);
                            }}
                            placeholder="Filter by status"
                            className="w-48"
                        />
                    </div>
                    <Button
                        type="button"
                        variant="primary"
                        size="md"
                        onClick={handleCreateExam}
                    >
                        Create Exam
                    </Button>
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
                        tableTitle="Exams"
                        onSearch={handleSearch}
                    />
                </div>
            </Container>
        </>
    );
};

export default ExamsPage;