import { CheckCircle2 } from "lucide-react";
import Button from "./Button";

interface ProfileCompletionBarProps {
    percentage: number;
    onCompleteClick: () => void;
}

const ProfileCompletionBar = ({ percentage, onCompleteClick }: ProfileCompletionBarProps) => {
    const isComplete = percentage >= 100;

    return (
        <section className="bg-whiteColor rounded-xl border border-borderDefault p-5">
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-[220px]">
                    <div className="flex items-center gap-2 mb-1.5">
                        {isComplete ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : null}
                        <p className="text-sm font-semibold text-textPrimary">
                            {isComplete ? 'Profile complete' : `Profile ${percentage}% complete`}
                        </p>
                    </div>
                    <div className="h-2 w-full rounded-full bg-bgSecondary overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${isComplete ? 'bg-green-600' : 'bg-primary'}`}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
                {!isComplete && (
                    <Button variant="primary" size="sm" onClick={onCompleteClick}>
                        Complete Profile
                    </Button>
                )}
            </div>
        </section>
    );
};

export default ProfileCompletionBar;
