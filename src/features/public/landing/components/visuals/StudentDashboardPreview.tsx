import { BookOpen, ClipboardCheck } from "lucide-react";

const EXAMS = [
    { name: "Data Structures — Mid Sem", meta: "60 min • PROCTORING", action: "Join Lobby" },
    { name: "DBMS — Unit Test 2", meta: "30 min • AUTO", action: "Take Exam" },
    { name: "Operating Systems — Final", meta: "Result Published", action: "View Result" },
];

const StudentDashboardPreview = () => {
    return (
        <div className="rounded-xl border border-borderLight bg-bgSecondary p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-3">
                <BookOpen className="w-4 h-4 text-primary" />
                <p className="text-xs font-semibold text-textPrimary">My Exams</p>
            </div>
            <div className="space-y-2">
                {EXAMS.map((exam) => (
                    <div key={exam.name} className="flex items-center justify-between bg-whiteColor rounded-lg border border-borderLight px-3 py-2.5">
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-textPrimary truncate">{exam.name}</p>
                            <p className="text-[10px] text-textTertiary mt-0.5">{exam.meta}</p>
                        </div>
                        <span className="shrink-0 ml-2 text-[10px] font-semibold text-whiteColor bg-primary px-2.5 py-1 rounded-md">{exam.action}</span>
                    </div>
                ))}
            </div>
            <div className="mt-3 flex items-center gap-2 bg-whiteColor rounded-lg border border-borderLight px-3 py-2.5">
                <ClipboardCheck className="w-3.5 h-3.5 text-success shrink-0" />
                <p className="text-[10px] text-textSecondary">Profile 85% complete — finish it from your dashboard.</p>
            </div>
        </div>
    );
};

export default StudentDashboardPreview;
