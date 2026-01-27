import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container } from '../../../../common/ui/Container';
import { PageHeader } from '../../../../common/ui/PageHeader';
import Button from '../../../../common/ui/Button';
import { useGetFacultyExamsQuery } from '../../../../state/services/endpoints/exam';
import { Calendar, Clock } from 'lucide-react';

const FacultyExamsPage: React.FC = () => {
    const navigate = useNavigate();
    const facultyId = 'faculty_id_from_auth'; // Get from auth context

    const { data, isLoading } = useGetFacultyExamsQuery({ facultyId });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'upcoming': return 'bg-warning text-whiteColor';
            case 'ongoing': return 'bg-success text-whiteColor';
            case 'completed': return 'bg-borderDark text-whiteColor';
            default: return 'bg-borderLight text-textPrimary';
        }
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

                                        <span className={`inline-block px-3 py-1 rounded-lg text-xs font-semibold ${getStatusColor(exam.status)}`}>
                                            {exam.status.toUpperCase()}
                                        </span>
                                    </div>

                                    <div className="flex gap-2">
                                        {exam.status === 'upcoming' || exam.status === 'ongoing' ? (
                                            <Button
                                                variant="primary"
                                                size="sm"
                                                onClick={() => navigate(`/faculty/exams/${exam.examId}/monitor`)}
                                            >
                                                Monitor Exam
                                            </Button>
                                        ) : null}
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

export default FacultyExamsPage;