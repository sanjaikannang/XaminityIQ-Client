import { Mic, MessageSquare, UserX } from "lucide-react";

const STUDENTS = [
    { name: "Aarav Sharma", roll: "21CS041", hasScreen: true },
    { name: "Diya Patel", roll: "21CS057", hasScreen: false },
    { name: "Kabir Singh", roll: "21CS063", hasScreen: true },
];

const ProctoringDashboardPreview = () => {
    return (
        <div className="rounded-xl border border-borderLight bg-bgSecondary p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-textPrimary">Admitted Students (3)</p>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 bg-green-100 px-2 py-0.5 rounded-full">Live</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {STUDENTS.map((s) => (
                    <div key={s.roll} className="bg-whiteColor rounded-lg border border-borderLight overflow-hidden">
                        <div className="relative bg-blackColor aspect-video flex items-center justify-center">
                            {s.hasScreen ? (
                                <div className="absolute inset-1.5 rounded bg-slate-800" />
                            ) : (
                                <span className="text-[9px] text-whiteColor/60">No video</span>
                            )}
                            <span className="absolute top-1 right-1 p-0.5 rounded bg-green-600/90"><Mic className="w-2.5 h-2.5 text-whiteColor" /></span>
                        </div>
                        <div className="px-2 py-1.5 border-t border-borderLight">
                            <p className="text-[10px] font-semibold text-textPrimary truncate">{s.name}</p>
                            <p className="text-[9px] text-textTertiary">{s.roll}</p>
                        </div>
                        <div className="grid grid-cols-2 border-t border-borderLight text-[9px] text-textSecondary">
                            <span className="flex items-center justify-center gap-1 py-1 border-r border-borderLight"><MessageSquare className="w-2.5 h-2.5" /> Chat</span>
                            <span className="flex items-center justify-center gap-1 py-1 text-red-600"><UserX className="w-2.5 h-2.5" /> Remove</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProctoringDashboardPreview;
