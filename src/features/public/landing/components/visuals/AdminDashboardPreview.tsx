import { Users, GraduationCap, ClipboardCheck, Building2 } from "lucide-react";

const STATS = [
    { icon: Users, label: "Students", value: "1,284", color: "text-primary bg-primaryLighter" },
    { icon: GraduationCap, label: "Faculty", value: "96", color: "text-success bg-green-100" },
    { icon: ClipboardCheck, label: "Exams", value: "42", color: "text-warning bg-yellow-100" },
    { icon: Building2, label: "Departments", value: "12", color: "text-primary bg-primaryLighter" },
];

const AdminDashboardPreview = () => {
    return (
        <div className="rounded-xl border border-borderLight bg-bgSecondary p-4 sm:p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                {STATS.map((s) => (
                    <div key={s.label} className="bg-whiteColor rounded-lg border border-borderLight p-3">
                        <div className={`w-7 h-7 rounded-md flex items-center justify-center mb-2 ${s.color}`}>
                            <s.icon className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-lg font-bold text-textPrimary leading-none">{s.value}</p>
                        <p className="text-[10px] text-textTertiary mt-1">{s.label}</p>
                    </div>
                ))}
            </div>
            <div className="bg-whiteColor rounded-lg border border-borderLight overflow-hidden">
                <div className="px-3 py-2 border-b border-borderLight text-[11px] font-semibold text-textSecondary">Recent Exams</div>
                {[
                    { name: "Data Structures — Mid Sem", chip: "PROCTORING", chipClass: "bg-blue-100 text-blue-700" },
                    { name: "DBMS — Unit Test", chip: "AUTO", chipClass: "bg-green-100 text-green-700" },
                    { name: "Operating Systems — Final", chip: "PUBLISHED", chipClass: "bg-yellow-100 text-yellow-700" },
                ].map((row) => (
                    <div key={row.name} className="flex items-center justify-between px-3 py-2 border-t border-borderLight first:border-t-0">
                        <span className="text-xs text-textPrimary truncate">{row.name}</span>
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 ml-2 ${row.chipClass}`}>{row.chip}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminDashboardPreview;
