import { Loader } from 'lucide-react';
import React, { useEffect } from 'react';
import { JoinRequestStatus } from '../../../../utils/enum';
import { Container } from '../../../../common/ui/Container';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useCheckJoinStatusQuery } from '../../../../state/services/endpoints/exam';

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
            <Container>
                <div className="flex items-center justify-center h-screen px-4">
                    <div className="bg-white rounded-2xl shadow-lg border border-borderDefault p-8 md:p-10 max-w-md w-full text-center">

                        {/* Status Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="relative flex items-center justify-center w-24 h-24 rounded-full bg-primary/10">
                                <Loader className="w-10 h-10 text-primary absolute animate-spin" />
                            </div>
                        </div>

                        <h2 className="text-xl md:text-2xl font-semibold text-textPrimary mb-2">
                            Waiting for Approval
                        </h2>

                        <p className="text-sm text-textSecondary mb-6">
                            Your request has been sent to the faculty for review.
                        </p>

                        <div className="bg-bgSecondary rounded-xl p-2 border border-borderDefault text-center">
                            <p className="text-sm text-textSecondary">
                                <span className="font-semibold text-textPrimary">Important:</span>
                                <br />
                                Please keep this page open. You’ll be automatically redirected once approval is granted.
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default StudentExamWaitingPage;