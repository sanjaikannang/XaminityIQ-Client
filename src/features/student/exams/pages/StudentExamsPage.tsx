import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';
import Button from '../../../../common/ui/Button';
import Select from '../../../../common/ui/Select';
import { Container } from '../../../../common/ui/Container';
import { PageHeader } from '../../../../common/ui/PageHeader';
import { ExamStatus, ExamMode } from '../../../../utils/enum';
import { useGetStudentExamsQuery } from '../../../../state/services/endpoints/exam';

const StudentExamsPage: React.FC = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<string>('');

    const { data, isLoading } = useGetStudentExamsQuery({
        status: statusFilter || undefined
    });

    const statusOptions = [
        { value: '', label: 'All Exams' },
        { value: ExamStatus.UPCOMING, label: 'Upcoming' },
        { value: ExamStatus.ONGOING, label: 'Ongoing' },
        { value: ExamStatus.COMPLETED, label: 'Completed' },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case ExamStatus.UPCOMING: return 'bg-warning text-whiteColor';
            case ExamStatus.ONGOING: return 'bg-success text-whiteColor';
            case ExamStatus.COMPLETED: return 'bg-borderDark text-whiteColor';
            default: return 'bg-borderLight text-textPrimary';
        }
    };

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return '';
        return new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const ExamCardSkeleton = () => (
        <>
            <div className="bg-whiteColor rounded-xl border border-borderDefault p-6 animate-pulse">
                <div className="flex justify-between items-start">
                    <div className="flex-1">
                        <div className="h-6 bg-borderLight rounded w-3/4 mb-4"></div>
                        <div className="flex gap-6 mb-4">
                            <div className="h-4 bg-borderLight rounded w-24"></div>
                            <div className="h-4 bg-borderLight rounded w-32"></div>
                        </div>
                        <div className="flex gap-2">
                            <div className="h-6 bg-borderLight rounded w-20"></div>
                            <div className="h-6 bg-borderLight rounded w-24"></div>
                        </div>
                    </div>
                    <div className="h-9 bg-borderLight rounded w-24"></div>
                </div>
            </div>
        </>
    );

    return (
        <>
            <PageHeader>My Exams</PageHeader>
            <Container>
                <div className="flex justify-end mb-4">
                    <Select
                        id="status-filter"
                        name="status"
                        options={statusOptions}
                        value={statusFilter}
                        onChange={(value) => setStatusFilter(value as string)}
                        placeholder="Filter by status"
                        className="w-48"
                    />
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 gap-4">
                        {[1, 2, 3].map((i) => (
                            <ExamCardSkeleton key={i} />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {data?.data?.map((exam) => (
                            <div
                                key={exam.examId}
                                className="bg-whiteColor rounded-xl border border-borderDefault p-4"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-textPrimary mb-2">
                                            {exam.examName}
                                        </h3>

                                        <div className="mb-2">
                                            <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-bgSecondary text-textSecondary">
                                                {exam.examMode === ExamMode.PROCTORING ? 'Proctored Exam' : 'Auto Exam'}
                                            </span>
                                        </div>

                                        <div className="flex gap-6 mb-4">
                                            {exam.examMode === ExamMode.PROCTORING ? (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-primary" />
                                                        <span className="text-sm text-textSecondary">
                                                            {formatDate(exam.examDate)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-primary" />
                                                        <span className="text-sm text-textSecondary">
                                                            {exam.startTime} - {exam.endTime} ({exam.duration} mins)
                                                        </span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 text-primary" />
                                                        <span className="text-sm text-textSecondary">
                                                            {formatDate(exam.examStartDate)} - {formatDate(exam.examEndDate)}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-primary" />
                                                        <span className="text-sm text-textSecondary">
                                                            {exam.duration} mins
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold ${getStatusColor(exam.status)}`}>
                                                Exam: {exam.status}
                                            </span>
                                            <span className="inline-block px-3 py-1 rounded-xl text-xs font-semibold bg-info text-whiteColor">
                                                Status: {exam.myStatus}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {exam.canJoin && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => navigate(`/student/exams/${exam.examId}/environment-check`)}
                                            >
                                                Join Exam
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {data?.data?.length === 0 && (
                            <div className="text-center py-12 text-textSecondary">
                                No exams found
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </>
    );
};

export default StudentExamsPage;