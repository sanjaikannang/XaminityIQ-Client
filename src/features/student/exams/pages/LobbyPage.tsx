import toast from "react-hot-toast";
import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { XCircle, Ban } from "lucide-react";
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
            <div className="h-screen flex items-center justify-center bg-bgSecondary p-4">
                <div className="max-w-md w-full rounded-xl border border-red-200 bg-whiteColor p-6 text-center space-y-4">
                    <XCircle className="w-10 h-10 text-red-500 mx-auto" />
                    <p className="text-textPrimary font-semibold">{joinError}</p>
                    <Button variant="outline" onClick={handleBackToExams}>Back to My Exams</Button>
                </div>
            </div>
        );
    }

    if (status === RoomAssignmentStatus.REJECTED) {
        return (
            <div className="h-screen flex items-center justify-center bg-bgSecondary p-4">
                <div className="max-w-md w-full rounded-xl border border-red-200 bg-whiteColor p-6 text-center space-y-4">
                    <Ban className="w-10 h-10 text-red-500 mx-auto" />
                    <p className="text-textPrimary font-semibold">Your entry was declined by the invigilator.</p>
                    {removalReason && <p className="text-sm text-textSecondary">Reason: {removalReason}</p>}
                    <Button variant="outline" onClick={handleBackToExams}>Back to My Exams</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-bgSecondary gap-6 p-4">
            <div className="w-full max-w-sm rounded-xl border border-borderDefault bg-whiteColor p-4">
                <div className="relative rounded-lg overflow-hidden bg-black aspect-video">
                    <video ref={videoPreviewCallbackRef} autoPlay muted playsInline className="w-full h-full object-cover" />
                    <span className="absolute bottom-2 left-2 text-[10px] px-1.5 py-0.5 rounded bg-black/60 text-whiteColor">You</span>
                </div>
            </div>
            <div className="text-center space-y-2">
                <div className="flex items-center justify-center gap-2">
                    <span className="relative flex h-3 w-3">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-primary" />
                    </span>
                    <p className="font-semibold text-textPrimary">Waiting for faculty approval</p>
                </div>
                <p className="text-sm text-textSecondary">You will enter the exam automatically once admitted. Please stay on this page.</p>
            </div>
        </div>
    );
};

export default LobbyPage;
