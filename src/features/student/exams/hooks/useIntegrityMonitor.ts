import { useCallback, useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { ViolationType } from "../../../../utils/enum";
import { SecuritySettings } from "../../../../types/exams-types";
import { ReportViolationResponse } from "../../../../types/student-exam-types";
import { useReportViolationMutation } from "../../../../state/services/endpoints/student-exams";

interface UseIntegrityMonitorParams {
    attemptId: string;
    securitySettings: SecuritySettings | undefined;
    onTerminated: (response: ReportViolationResponse) => void;
}

// Wires up the browser-event anti-malpractice detection described by an exam's
// securitySettings — tab-switch, fullscreen-exit, copy/paste, right-click —
// logging each to the backend and reacting if a threshold breach terminates
// the attempt. blockBackwardNavigation is NOT handled here — it's a pure
// in-app navigation gate the room page applies directly (nothing to detect).
export function useIntegrityMonitor({ attemptId, securitySettings, onTerminated }: UseIntegrityMonitorParams) {
    const [reportViolation] = useReportViolationMutation();
    const settingsRef = useRef(securitySettings);
    settingsRef.current = securitySettings;
    const terminatedRef = useRef(false);

    const report = useCallback((type: ViolationType) => {
        if (terminatedRef.current || !attemptId) return;
        reportViolation({ attemptId, type })
            .unwrap()
            .then((response) => {
                if (response.terminated) {
                    terminatedRef.current = true;
                    onTerminated(response);
                }
            })
            .catch(() => { });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attemptId, reportViolation]);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                report(ViolationType.TAB_SWITCH);
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [report]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            if (!document.fullscreenElement) {
                report(ViolationType.FULLSCREEN_EXIT);
                if (settingsRef.current?.requireFullScreenThroughout) {
                    toast.error('Please return to full-screen mode to continue the exam.');
                }
            }
        };
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
    }, [report]);

    useEffect(() => {
        if (!securitySettings?.disableCopyPaste) return;
        const blockAndReport = (e: Event) => {
            e.preventDefault();
            report(ViolationType.COPY_ATTEMPT);
        };
        document.addEventListener('copy', blockAndReport);
        document.addEventListener('cut', blockAndReport);
        document.addEventListener('paste', blockAndReport);
        return () => {
            document.removeEventListener('copy', blockAndReport);
            document.removeEventListener('cut', blockAndReport);
            document.removeEventListener('paste', blockAndReport);
        };
    }, [securitySettings?.disableCopyPaste, report]);

    useEffect(() => {
        if (!securitySettings?.disableRightClick) return;
        const blockAndReport = (e: MouseEvent) => {
            e.preventDefault();
            report(ViolationType.RIGHT_CLICK_ATTEMPT);
        };
        document.addEventListener('contextmenu', blockAndReport);
        return () => document.removeEventListener('contextmenu', blockAndReport);
    }, [securitySettings?.disableRightClick, report]);
}
