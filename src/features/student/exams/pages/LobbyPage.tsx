import toast from "react-hot-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RoomAssignmentStatus } from "../../../../utils/enum";
import { examMediaStore } from "../utils/examMediaStore";
import Button from "../../../../common/ui/Button";
import {
    useJoinLobbyMutation,
    useGetLobbyStatusQuery,
} from "../../../../state/services/endpoints/student-proctoring";

const LobbyPage = () => {
    const navigate = useNavigate();
    const { examId } = useParams<{ examId: string }>();
    const [joinLobby] = useJoinLobbyMutation();
    const [assignmentId, setAssignmentId] = useState<string | null>(null);
    const [joinError, setJoinError] = useState<string | null>(null);
    const hasNavigatedRef = useRef(false);

    const streams = examMediaStore.get();
    const videoPreviewCallbackRef = useCallback((node: HTMLVideoElement | null) => {
        if (node && streams.video) {
            node.srcObject = streams.video;
        }
    }, [streams.video]);

    useEffect(() => {
        if (!examId) return;
        joinLobby(examId)
            .unwrap()
            .then((response) => {
                if (response.data) {
                    setAssignmentId(response.data.assignmentId);
                }
            })
            .catch((error: any) => {
                setJoinError(error.data?.message || 'Failed to join the waiting room');
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [examId]);

    const { data } = useGetLobbyStatusQuery(assignmentId as string, {
        skip: !assignmentId,
        pollingInterval: 3000,
    });

    const status = data?.data?.status;
    const attemptId = data?.data?.attemptId;
    const removalReason = data?.data?.removalReason;

    useEffect(() => {
        if (status === RoomAssignmentStatus.ADMITTED && attemptId && !hasNavigatedRef.current) {
            hasNavigatedRef.current = true;
            toast.success('You have been admitted — entering the exam room');
            navigate(`/student/exams/${examId}/proctored-room/${attemptId}`, { replace: true });
        }
    }, [status, attemptId, examId, navigate]);

    const handleBackToExams = () => {
        examMediaStore.clear();
        navigate('/student/exams', { replace: true });
    };

    if (joinError) {
        return (
            <div className="h-screen flex items-center justify-center bg-bgSecondary">
                <div className="max-w-md rounded-lg border border-borderLight bg-whiteColor p-6 text-center space-y-4">
                    <p className="text-red-600 font-medium">{joinError}</p>
                    <Button variant="outline" onClick={handleBackToExams}>Back to My Exams</Button>
                </div>
            </div>
        );
    }

    if (status === RoomAssignmentStatus.REJECTED) {
        return (
            <div className="h-screen flex items-center justify-center bg-bgSecondary">
                <div className="max-w-md rounded-lg border border-borderLight bg-whiteColor p-6 text-center space-y-4">
                    <p className="text-red-600 font-medium">Your entry was declined by the invigilator.</p>
                    {removalReason && <p className="text-sm text-textSecondary">Reason: {removalReason}</p>}
                    <Button variant="outline" onClick={handleBackToExams}>Back to My Exams</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-bgSecondary gap-6">
            <div className="w-full max-w-sm rounded-lg border border-borderLight bg-whiteColor p-4">
                <video ref={videoPreviewCallbackRef} autoPlay muted playsInline className="w-full rounded-md border border-borderLight" />
            </div>
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
                    <p className="font-semibold text-textPrimary">Waiting for faculty approval</p>
                </div>
                <p className="text-sm text-textSecondary">You will enter the exam automatically once admitted. Please stay on this page.</p>
            </div>
        </div>
    );
};

export default LobbyPage;
