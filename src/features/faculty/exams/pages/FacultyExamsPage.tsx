import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../../common/ui/Button';
import Select from '../../../../common/ui/Select';
import { ExamStatus } from '../../../../utils/enum';
import { Calendar, Clock, Users } from 'lucide-react';
import { Container } from '../../../../common/ui/Container';
import { PageHeader } from '../../../../common/ui/PageHeader';
import { useGetFacultyExamsQuery } from '../../../../state/services/endpoints/exam';

const FacultyExamsPage: React.FC = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState<string>('');

    const { data, isLoading } = useGetFacultyExamsQuery({
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

    const formatDate = (dateStr: string) => {
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
                            <div className="h-4 bg-borderLight rounded w-20"></div>
                        </div>
                        <div className="h-6 bg-borderLight rounded w-20"></div>
                    </div>
                    <div className="h-9 bg-borderLight rounded w-28"></div>
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
                                        <h3 className="text-xl font-bold text-textPrimary mb-4">
                                            {exam.examName}
                                        </h3>

                                        <div className="flex gap-6 mb-4">
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
                                            <div className="flex items-center gap-2">
                                                <Users className="w-4 h-4 text-primary" />
                                                <span className="text-sm text-textSecondary">
                                                    {exam.joinedStudents}/{exam.totalStudents} joined
                                                </span>
                                            </div>
                                        </div>

                                        <span className={`inline-block px-3 py-1 rounded-xl text-xs font-semibold ${getStatusColor(exam.status)}`}>
                                            Exam: {exam.status}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        {exam.canJoin && (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => navigate(`/faculty/exams/${exam.examId}/monitor`)}
                                            >
                                                Monitor Exam
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

export default FacultyExamsPage;