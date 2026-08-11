import { useCallback, useEffect, useRef, useState } from "react";
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

// Every violation is reported to the backend regardless of visible feedback —
// these are just the toast copy for the ones a student should be warned about
// as they happen, instead of only finding out via the terminal auto-submit.
const VIOLATION_MESSAGES: Record<ViolationType, string> = {
    [ViolationType.TAB_SWITCH]: "Tab switch detected — this has been recorded.",
    [ViolationType.FULLSCREEN_EXIT]: "You exited full-screen — this has been recorded.",
    [ViolationType.COPY_ATTEMPT]: "Copy/paste is disabled during this exam.",
    [ViolationType.RIGHT_CLICK_ATTEMPT]: "Right-click is disabled during this exam.",
};

// Wires up the browser-event anti-malpractice detection described by an exam's
// securitySettings — tab-switch, fullscreen-exit, copy/paste, right-click —
// logging each to the backend, surfacing a brief warning toast per violation,
// and reacting if a threshold breach terminates the attempt.
// blockBackwardNavigation is NOT handled here — it's a pure in-app navigation
// gate the room page applies directly (nothing to detect).
export function useIntegrityMonitor({ attemptId, securitySettings, onTerminated }: UseIntegrityMonitorParams) {
    const [reportViolation] = useReportViolationMutation();
    const settingsRef = useRef(securitySettings);
    settingsRef.current = securitySettings;
    const terminatedRef = useRef(false);
    const [violationCount, setViolationCount] = useState(0);

    const report = useCallback((type: ViolationType, silent = false) => {
        if (terminatedRef.current || !attemptId) return;
        setViolationCount((prev) => prev + 1);
        if (!silent) toast(VIOLATION_MESSAGES[type], { icon: '⚠️' });

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
                // The stronger message below already covers this when required — avoid double-toasting
                report(ViolationType.FULLSCREEN_EXIT, !!settingsRef.current?.requireFullScreenThroughout);
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

    return { violationCount };
}
