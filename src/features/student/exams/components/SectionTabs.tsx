import { ExamSectionData } from "../../../../types/exams-types";

interface QuestionLike {
    _id: string;
    examSectionId?: string;
}

interface SectionTabsProps {
    examSections: ExamSectionData[];
    questions: QuestionLike[];
    currentQuestionId?: string;
    onSelectSection: (firstIndex: number) => void;
}

const UNSECTIONED_KEY = '__unsectioned__';

// Only renders when the exam actually has sections defined — a flat exam
// (no sections) shows nothing here, same as before this feature existed.
const SectionTabs = ({ examSections, questions, currentQuestionId, onSelectSection }: SectionTabsProps) => {
    if (examSections.length === 0) return null;

    const sortedSections = [...examSections].sort((a, b) => a.order - b.order);
    const hasUnsectioned = questions.some((q) => !q.examSectionId);

    const firstIndexOf = (sectionId: string | null) => {
        return questions.findIndex((q) => (sectionId === null ? !q.examSectionId : q.examSectionId === sectionId));
    };

    const currentQuestion = questions.find((q) => q._id === currentQuestionId);
    const activeKey = currentQuestion?.examSectionId || UNSECTIONED_KEY;

    const tabs = [
        ...sortedSections.map((s) => ({ key: s._id, label: s.label, sectionId: s._id as string | null })),
        ...(hasUnsectioned ? [{ key: UNSECTIONED_KEY, label: 'Other Questions', sectionId: null }] : []),
    ];

    return (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {tabs.map((tab) => {
                const isActive = activeKey === tab.key;
                const count = questions.filter((q) => (tab.sectionId === null ? !q.examSectionId : q.examSectionId === tab.sectionId)).length;
                return (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => {
                            const index = firstIndexOf(tab.sectionId);
                            if (index >= 0) onSelectSection(index);
                        }}
                        className={`shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${isActive ? 'bg-primary text-whiteColor' : 'bg-bgSecondary text-textSecondary hover:bg-borderLight'
                            }`}
                    >
                        {tab.label} <span className="opacity-70">({count})</span>
                    </button>
                );
            })}
        </div>
    );
};

export default SectionTabs;
