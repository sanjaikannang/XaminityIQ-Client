import { useState } from "react";
import toast from "react-hot-toast";
import { Plus, GripVertical, Trash2 } from "lucide-react";
import Button from "../../../../common/ui/Button";
import InputField from "../../../../common/ui/Input";
import { ExamSectionData, ExamSectionInput } from "../../../../types/exams-types";
import { useUpdateExamMutation } from "../../../../state/services/endpoints/exams";

interface ExamSectionsManagerProps {
    examId: string;
    examSections: ExamSectionData[];
    hasSectionedQuestions: boolean;
}

// Sections are edited as a whole list (matching how securitySettings is
// already edited) — existing _id's are preserved so ExamQuestion.examSectionId
// references stay valid across a rename/reorder.
const ExamSectionsManager = ({ examId, examSections, hasSectionedQuestions }: ExamSectionsManagerProps) => {
    const [draft, setDraft] = useState<ExamSectionInput[]>(
        [...examSections].sort((a, b) => a.order - b.order).map((s) => ({ _id: s._id, label: s.label, order: s.order })),
    );
    const [isDirty, setIsDirty] = useState(false);
    const [updateExam, { isLoading }] = useUpdateExamMutation();

    const handleAdd = () => {
        setDraft((prev) => [...prev, { label: `Section ${String.fromCharCode(65 + prev.length)}`, order: prev.length + 1 }]);
        setIsDirty(true);
    };

    const handleRename = (index: number, label: string) => {
        setDraft((prev) => prev.map((s, i) => (i === index ? { ...s, label } : s)));
        setIsDirty(true);
    };

    const handleRemove = (index: number) => {
        setDraft((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 })));
        setIsDirty(true);
    };

    const handleMove = (index: number, direction: -1 | 1) => {
        setDraft((prev) => {
            const next = [...prev];
            const target = index + direction;
            if (target < 0 || target >= next.length) return prev;
            [next[index], next[target]] = [next[target], next[index]];
            return next.map((s, i) => ({ ...s, order: i + 1 }));
        });
        setIsDirty(true);
    };

    const handleSave = async () => {
        try {
            const response = await updateExam({
                id: examId,
                data: { examSections: draft.length > 0 ? draft : undefined },
            }).unwrap();
            toast.success(response.message || 'Sections saved successfully');
            setIsDirty(false);
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to save sections');
        }
    };

    return (
        <div className="space-y-3">
            {draft.length === 0 ? (
                <p className="text-sm text-textSecondary">
                    No sections yet — questions will show as a flat list. Add a section to group questions (e.g. Section A, Section B).
                </p>
            ) : (
                <div className="space-y-2">
                    {draft.map((section, index) => (
                        <div key={section._id || index} className="flex items-center gap-2">
                            <GripVertical size={16} className="text-textTertiary shrink-0" />
                            <InputField
                                id={`section-${index}`}
                                name={`section-${index}`}
                                value={section.label}
                                onChange={(e) => handleRename(index, e.target.value)}
                                className="flex-1"
                            />
                            <button
                                type="button"
                                onClick={() => handleMove(index, -1)}
                                disabled={index === 0}
                                className="text-xs px-2 py-1 rounded border border-borderLight text-textSecondary hover:bg-bgSecondary disabled:opacity-40 cursor-pointer"
                            >
                                ↑
                            </button>
                            <button
                                type="button"
                                onClick={() => handleMove(index, 1)}
                                disabled={index === draft.length - 1}
                                className="text-xs px-2 py-1 rounded border border-borderLight text-textSecondary hover:bg-bgSecondary disabled:opacity-40 cursor-pointer"
                            >
                                ↓
                            </button>
                            <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="p-1.5 rounded text-red-600 hover:bg-red-50 cursor-pointer"
                                title="Remove section"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {hasSectionedQuestions && (
                <p className="text-xs text-warning">
                    Removing a section that already has questions assigned to it will leave those questions unsectioned.
                </p>
            )}

            <div className="flex items-center gap-2 pt-1">
                <Button variant="outline" size="sm" icon={Plus} onClick={handleAdd}>
                    Add Section
                </Button>
                {isDirty && (
                    <Button variant="primary" size="sm" onClick={handleSave} loading={isLoading} disabled={isLoading}>
                        {isLoading ? '' : 'Save Sections'}
                    </Button>
                )}
            </div>
        </div>
    );
};

export default ExamSectionsManager;
