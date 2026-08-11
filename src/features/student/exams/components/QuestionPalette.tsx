export type PaletteStatus = "not-visited" | "not-answered" | "answered" | "marked";

interface QuestionPaletteProps {
    questionIds: string[];
    currentIndex: number;
    statusFor: (questionId: string) => PaletteStatus;
    blockBackwardNavigation?: boolean;
    onNavigate: (index: number) => void;
}

const STATUS_CLASSES: Record<PaletteStatus, string> = {
    "not-visited": "bg-bgSecondary text-textPrimary border border-borderLight",
    "not-answered": "bg-red-100 text-red-700",
    "answered": "bg-green-100 text-green-700",
    "marked": "bg-purple-100 text-purple-700",
};

const LEGEND: { status: PaletteStatus; label: string }[] = [
    { status: "answered", label: "Answered" },
    { status: "not-answered", label: "Not answered" },
    { status: "marked", label: "Marked" },
    { status: "not-visited", label: "Not visited" },
];

const QuestionPalette = ({ questionIds, currentIndex, statusFor, blockBackwardNavigation, onNavigate }: QuestionPaletteProps) => {
    return (
        <div>
            <p className="text-sm font-semibold text-textPrimary mb-2">Question Palette</p>
            <div className="grid grid-cols-5 gap-2">
                {questionIds.map((id, index) => {
                    const isBlocked = !!blockBackwardNavigation && index < currentIndex;
                    return (
                        <button
                            key={id}
                            type="button"
                            disabled={isBlocked}
                            onClick={() => onNavigate(index)}
                            className={`h-9 w-9 rounded-md text-sm font-semibold transition-all cursor-pointer ${STATUS_CLASSES[statusFor(id)]} ${currentIndex === index ? "ring-2 ring-primary ring-offset-1" : ""} ${isBlocked ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                            {index + 1}
                        </button>
                    );
                })}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-y-1.5 gap-x-3">
                {LEGEND.map((item) => (
                    <div key={item.status} className="flex items-center gap-1.5 text-[11px] text-textSecondary">
                        <span className={`h-2.5 w-2.5 rounded-sm shrink-0 ${STATUS_CLASSES[item.status].split(" ").slice(0, 2).join(" ")}`} />
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuestionPalette;
