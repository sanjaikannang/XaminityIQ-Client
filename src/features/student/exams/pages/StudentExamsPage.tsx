import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../../../common/ui/Container';
import { PageHeader } from '../../../../common/ui/PageHeader';
import Button from '../../../../common/ui/Button';
import { useGetStudentExamsQuery } from '../../../../state/services/endpoints/exam';
import { Calendar, Clock } from 'lucide-react';
import { ExamStatus, ParticipantStatus } from '../../../../utils/enum';

const StudentExamsPage: React.FC = () => {
    const navigate = useNavigate();
    const studentId = "6953d8163bfb64f64c0e7df7"; // Get from auth context

    const { data, isLoading } = useGetStudentExamsQuery({ studentId });

    const getStatusColor = (status: string) => {
        switch (status) {
            case ExamStatus.UPCOMING: return 'bg-warning text-whiteColor';
            case ExamStatus.ONGOING: return 'bg-success text-whiteColor';
            case ExamStatus.COMPLETED: return 'bg-borderDark text-whiteColor';
            default: return 'bg-borderLight text-textPrimary';
        }
    };

    const canJoin = (exam: any) => {
        return exam.status === ExamStatus.UPCOMING || exam.status === ExamStatus.ONGOING;
    };

    return (
        <>
            <PageHeader>My Exams</PageHeader>
            <Container>
                {isLoading ? (
                    <div className="text-center py-12">Loading exams...</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {data?.data?.map((exam) => (
                            <div
                                key={exam.examId}
                                className="bg-whiteColor rounded-xl border border-borderDefault p-6"
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
                                                    {new Date(exam.date).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary" />
                                                <span className="text-sm text-textSecondary">
                                                    {exam.time} ({exam.duration} mins)
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2">
                                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(exam.status)}`}>
                                                Exam: {exam.status.toUpperCase()}
                                            </span>
                                            {exam.myStatus && (
                                                <span className="inline-block px-3 py-1 rounded-lg text-xs font-semibold bg-info text-whiteColor">
                                                    Status: {exam.myStatus.toUpperCase()}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        {canJoin(exam) && exam.myStatus !== ParticipantStatus.FINISHED && (
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
                                No exams scheduled
                            </div>
                        )}
                    </div>
                )}
            </Container>
        </>
    );
};

export default StudentExamsPage;