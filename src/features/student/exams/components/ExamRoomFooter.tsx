import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../../../../common/ui/Button";

interface ExamRoomFooterProps {
    onPrev: () => void;
    onNext: () => void;
    canGoPrev: boolean;
    canGoNext: boolean;
    nextBlockedReason?: string;
    onSubmitClick: () => void;
    isSubmitting: boolean;
    examMinTimeRemainingMs: number;
}

// Bottom-fixed action bar for the exam room — a sub-footer row (Previous/Next
// question navigation) stacked directly above the main footer row (Submit
// Exam), so both are always reachable regardless of scroll position.
const ExamRoomFooter = ({
    onPrev,
    onNext,
    canGoPrev,
    canGoNext,
    nextBlockedReason,
    onSubmitClick,
    isSubmitting,
    examMinTimeRemainingMs,
}: ExamRoomFooterProps) => {
    return (
        <div className="flex-shrink-0 bg-whiteColor border-t border-borderLight">
            {/* Sub-footer: question navigation */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-2 border-b border-borderLight gap-2">
                <Button variant="outline" size="sm" icon={ChevronLeft} disabled={!canGoPrev} onClick={onPrev}>
                    Previous
                </Button>
                <div className="flex flex-col items-end gap-0.5">
                    <Button variant="outline" size="sm" icon={ChevronRight} iconPosition="right" disabled={!canGoNext} onClick={onNext}>
                        Next
                    </Button>
                    {!canGoNext && nextBlockedReason && (
                        <span className="text-xs text-textTertiary">{nextBlockedReason}</span>
                    )}
                </div>
            </div>

            {/* Footer: submit exam */}
            <div className="flex items-center justify-center px-4 sm:px-6 py-2.5">
                <div className="w-full max-w-xs space-y-1">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={onSubmitClick}
                        disabled={isSubmitting || examMinTimeRemainingMs > 0}
                    >
                        Submit Exam
                    </Button>
                    {examMinTimeRemainingMs > 0 && (
                        <p className="text-xs text-textTertiary text-center">
                            You can submit in {Math.ceil(examMinTimeRemainingMs / 1000)}s
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExamRoomFooter;
