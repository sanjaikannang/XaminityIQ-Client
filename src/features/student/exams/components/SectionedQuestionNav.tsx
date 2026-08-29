import { ExamSectionData } from "../../../../types/exams-types";

export type QuestionNavStatus = "not-visited" | "not-answered" | "answered";

interface QuestionLike {
    _id: string;
    examSectionId?: string;
}

interface SectionedQuestionNavProps {
    examSections: ExamSectionData[];
    questions: QuestionLike[];
    currentIndex: number;
    statusFor: (questionId: string) => QuestionNavStatus;
    blockBackwardNavigation?: boolean;
    onNavigate: (index: number) => void;
}

const STATUS_CLASSES: Record<QuestionNavStatus, string> = {
    "not-visited": "bg-bgSecondary text-textPrimary border border-borderLight",
    "not-answered": "bg-red-100 text-red-700",
    "answered": "bg-green-100 text-green-700",
};

const LEGEND: { status: QuestionNavStatus; label: string }[] = [
    { status: "answered", label: "Answered" },
    { status: "not-answered", label: "Not answered" },
    { status: "not-visited", label: "Not visited" },
];

const UNSECTIONED_KEY = "__unsectioned__";

// Section navigation + per-section question grid — replaces the older
// SectionTabs/QuestionPalette pair with a single grouped view: each section
// shows its own questions renumbered 1,2,3... within that section, while
// still navigating to the correct GLOBAL index in the flat questions array.
const SectionedQuestionNav = ({
    examSections,
    questions,
    currentIndex,
    statusFor,
    blockBackwardNavigation,
    onNavigate,
}: SectionedQuestionNavProps) => {
    const sortedSections = [...examSections].sort((a, b) => a.order - b.order);
    const hasUnsectioned = questions.some((q) => !q.examSectionId);

    const groups = [
        ...sortedSections.map((s) => ({ key: s._id, label: s.label, sectionId: s._id as string | null })),
        ...(hasUnsectioned ? [{ key: UNSECTIONED_KEY, label: examSections.length > 0 ? "Other Questions" : "Questions", sectionId: null }] : []),
    ];

    return (
        <div className="space-y-4">
            <p className="text-sm font-semibold text-textPrimary">Section Navigation</p>
            {groups.map((group) => {
                const groupQuestions = questions
                    .map((q, globalIndex) => ({ q, globalIndex }))
                    .filter(({ q }) => (group.sectionId === null ? !q.examSectionId : q.examSectionId === group.sectionId));

                if (groupQuestions.length === 0) return null;

                return (
                    <div key={group.key}>
                        <p className="text-xs font-semibold text-textSecondary uppercase tracking-wide mb-1.5">{group.label}</p>
                        <div className="grid grid-cols-5 gap-2">
                            {groupQuestions.map(({ q, globalIndex }, localIndex) => {
                                const isBlocked = !!blockBackwardNavigation && globalIndex < currentIndex;
                                return (
                                    <button
                                        key={q._id}
                                        type="button"
                                        disabled={isBlocked}
                                        onClick={() => onNavigate(globalIndex)}
                                        className={`h-9 w-9 rounded-md text-sm font-semibold transition-all cursor-pointer ${STATUS_CLASSES[statusFor(q._id)]} ${currentIndex === globalIndex ? "ring-2 ring-primary ring-offset-1" : ""} ${isBlocked ? "opacity-40 cursor-not-allowed" : ""}`}
                                    >
                                        {localIndex + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}

            <div className="grid grid-cols-2 gap-y-1.5 gap-x-3 pt-1 border-t border-borderLight">
                {LEGEND.map((item) => (
                    <div key={item.status} className="flex items-center gap-1.5 text-[11px] text-textSecondary pt-2">
                        <span className={`h-2.5 w-2.5 rounded-sm shrink-0 ${STATUS_CLASSES[item.status].split(" ").slice(0, 2).join(" ")}`} />
                        {item.label}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SectionedQuestionNav;
