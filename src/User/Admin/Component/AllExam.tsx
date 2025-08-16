import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FileText, Eye } from 'lucide-react';
import { RootState } from '../../../State/store';
import Table, { TableColumn, TableRow } from '../../../Common/UI/Table';
import { getAllExam } from '../../../Services/Admin/adminAPI';
import { setAllExams, setExamError, setExamLoading } from '../../../State/Slices/adminSlice';
import { ExamResponse } from '../../../Types/admin.types';


const AllExam = () => {
    const dispatch = useDispatch();
    const {
        exams,
        examPagination,
        isExamLoading,
    } = useSelector((state: RootState) => state.admin);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Define table columns
    const columns: TableColumn[] = [
        {
            key: 'id',
            label: 'Exam Id',
            width: '150px'
        },
        {
            key: 'examTitle',
            label: 'Exam Title',
            width: '350px'
        },
        {
            key: 'subject',
            label: 'Subject',
            width: '200px'
        },
        {
            key: 'examMode',
            label: 'Mode',
            width: '100px'
        },
        {
            key: 'examStatus',
            label: 'Status',
            width: '100px'
        },
        {
            key: 'totalMarks',
            label: 'Total Marks',
            width: '120px',
            align: 'center'
        },
        {
            key: 'passingMarks',
            label: 'Pass Marks',
            width: '120px',
            align: 'center'
        },
        {
            key: 'duration',
            label: 'Duration',
            width: '120px',
            align: 'center'
        },
        {
            key: 'scheduleDetails',
            label: 'Schedule',
            width: '180px'
        },
        {
            key: 'assignedFaculty',
            label: 'Faculty Count',
            width: '150px',
            align: 'center'
        },
        {
            key: 'actions',
            label: 'Actions',
            width: '150px',
            align: 'center'
        }
    ];

    // Fetch exams data
    const fetchExams = async (page: number = 1) => {
        try {
            dispatch(setExamLoading(true));
            const response = await getAllExam({ page, limit: itemsPerPage });

            if (response.success) {
                dispatch(setAllExams({
                    exams: response.data.exams,
                    pagination: response.data.pagination
                }));
            } else {
                dispatch(setExamError(response.message));
            }
        } catch (error: any) {
            dispatch(setExamError(error.message || 'Failed to fetch exams'));
        }
    };

    useEffect(() => {
        fetchExams(currentPage);
    }, [currentPage]);

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    // Format schedule details
    const formatScheduleDetails = (scheduleDetails: ExamResponse['scheduleDetails']) => {
        if (scheduleDetails.examDate) {
            const date = new Date(scheduleDetails.examDate).toLocaleDateString();
            const time = scheduleDetails.startTime ? ` at ${scheduleDetails.startTime}` : '';
            return `${date}${time}`;
        }
        if (scheduleDetails.startDate && scheduleDetails.endDate) {
            const startDate = new Date(scheduleDetails.startDate).toLocaleDateString();
            const endDate = new Date(scheduleDetails.endDate).toLocaleDateString();
            return `${startDate} - ${endDate}`;
        }
        return 'Not scheduled';
    };

    // Convert exam data to table rows
    const tableData: TableRow[] = exams.map((exam) => ({
        id: exam.examId,
        examTitle: exam.examTitle,
        subject: exam.subject,
        examMode: exam.examMode,
        examStatus: exam.examStatus,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        duration: exam.duration,
        scheduleDetails: exam.scheduleDetails,
        assignedFaculty: exam.assignedFacultyIds.length,
        actions: 'actions'
    }));

    // Custom cell renderer
    const renderCell = (column: TableColumn, row: TableRow, value: any) => {
        switch (column.key) {
            case 'id':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-800">{value}</span>
                    </div>
                );

            case 'examTitle':
                return (
                    <div className="flex flex-col">
                        <span className="text-gray-800">{value}</span>
                    </div>
                );

            case 'subject':
                return (
                    <div className="flex items-center gap-2">
                        <span>{value}</span>
                    </div>
                );

            case 'examMode':
                return (
                    <div className="flex items-center gap-2">
                        <span>{value}</span>
                    </div>
                )

            case 'examStatus':
                return (
                    <div className="flex items-center gap-2">
                        <span>{value}</span>
                    </div>
                )

            case 'totalMarks':
                return (
                    <div className="flex items-center justify-center gap-1">
                        <span>{value}</span>
                    </div>
                );

            case 'passingMarks':
                return (
                    <div className="flex items-center justify-center gap-1">
                        <span>{value}</span>
                    </div>
                );

            case 'duration':
                return (
                    <div className="flex items-center justify-center gap-1">
                        <span>{value}</span>
                    </div>
                );

            case 'scheduleDetails':
                const exam = exams.find(e => e.examId === row.id);
                return (
                    <div className="flex items-center gap-2">
                        <span className="text-sm">
                            {exam ? formatScheduleDetails(exam.scheduleDetails) : 'N/A'}
                        </span>
                    </div>
                );

            case 'assignedFaculty':
                return (
                    <div className="flex items-center justify-center gap-1">
                        <span>{value}</span>
                    </div>
                );

            case 'actions':
                return (
                    <div className="flex items-center justify-center">
                        <button
                            className="text-primary hover:bg-blue-50 cursor-pointer"
                            onClick={() => {
                                // Handle view exam details
                                console.log('View exam:', row.id);
                            }}
                        >
                            <Eye className="w-4 h-4" />
                        </button>
                    </div>
                );

            default:
                return value;
        }
    };

    // Empty state configuration
    const emptyState = {
        icon: <FileText className="mx-auto h-12 w-12 text-gray-400" />,
        title: 'No exams found',
        description: 'There are no exams available at the moment.'
    };

    return (
        <div className="max-w-9xl mx-auto py-3">
            {/* Table */}
            <Table
                columns={columns}
                data={tableData}
                loading={isExamLoading}
                renderCell={renderCell}
                emptyState={emptyState}
                pagination={examPagination ? {
                    currentPage: examPagination.currentPage,
                    totalPages: examPagination.totalPages,
                    totalProducts: examPagination.totalCount,
                    hasNextPage: examPagination.hasNextPage,
                    hasPrevPage: examPagination.hasPreviousPage
                } : undefined}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                showPagination={true}
                paginationLabel="exams"
                className="shadow-sm"
            />
        </div>
    );
};

export default AllExam;