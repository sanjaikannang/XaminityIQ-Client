import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Container } from '../../../../common/ui/Container';
import { PageHeader } from '../../../../common/ui/PageHeader';
import { useCheckJoinStatusQuery } from '../../../../state/services/endpoints/exam';
import { Loader, Clock } from 'lucide-react';
import { JoinRequestStatus } from '../../../../utils/enum';

const StudentExamWaitingPage: React.FC = () => {
    const { examId } = useParams<{ examId: string }>();
    const location = useLocation();
    const navigate = useNavigate();
    const requestId = location.state?.requestId;

    const { data } = useCheckJoinStatusQuery(
        { examId: examId!, requestId },
        { pollingInterval: 3000 }
    );

    useEffect(() => {
        if (data?.data?.status === JoinRequestStatus.APPROVED && data.data.tokens) {
            navigate(`/student/exams/${examId}/room`, {
                state: { tokens: data.data.tokens }
            });
        } else if (data?.data?.status === JoinRequestStatus.REJECTED) {
            // Show rejection message and redirect
            alert(`Your request was rejected: ${data.data.reason || 'No reason provided'}`);
            navigate('/student/exams');
        }
    }, [data, navigate, examId]);

    return (
        <>
            <PageHeader>Waiting for Approval</PageHeader>
            <Container>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="bg-whiteColor rounded-xl border border-borderDefault p-12 text-center max-w-md">
                        <div className="flex justify-center mb-6">
                            <div className="relative">
                                <Clock className="w-20 h-20 text-primary animate-pulse" />
                                <Loader className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin" />
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-textPrimary mb-4">
                            Waiting for Faculty Approval
                        </h2>

                        <p className="text-textSecondary mb-6">
                            Your join request has been sent to the faculty. Please wait while they review your request.
                        </p>

                        <div className="bg-bgSecondary rounded-xl p-4 border border-borderDefault">
                            <p className="text-sm text-textSecondary">
                                <span className="font-semibold text-textPrimary">Note:</span>
                                Do not close or refresh this page. You will be automatically redirected once approved.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default StudentExamWaitingPage;