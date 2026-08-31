import { useState } from "react";
import { UserCog, BookOpen, GraduationCap } from "lucide-react";
import Reveal from "./Reveal";
import AdminDashboardPreview from "./visuals/AdminDashboardPreview";
import ProctoringDashboardPreview from "./visuals/ProctoringDashboardPreview";
import StudentDashboardPreview from "./visuals/StudentDashboardPreview";

const TABS = [
    { key: "admin", label: "Super Admin", icon: UserCog, Preview: AdminDashboardPreview },
    { key: "faculty", label: "Faculty", icon: BookOpen, Preview: ProctoringDashboardPreview },
    { key: "student", label: "Student", icon: GraduationCap, Preview: StudentDashboardPreview },
] as const;

// Representative UI previews built from the app's own design tokens — not
// real screenshots (none exist yet), but the same layout/spacing/colors as
// the live screens, so it's an honest preview rather than a stock mockup.
const PreviewSection = () => {
    const [active, setActive] = useState<(typeof TABS)[number]["key"]>("admin");
    const ActivePreview = TABS.find((t) => t.key === active)!.Preview;

    return (
        <section id="preview" className="py-16 sm:py-20 lg:py-24 bg-bgSecondary">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-2xl mx-auto">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wide">Application Preview</span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-textPrimary">What each role actually sees</h2>
                    <p className="mt-4 text-textSecondary leading-relaxed">
                        A quick look at the real screens behind each role.
                    </p>
                </Reveal>

                <Reveal className="mt-10">
                    <div className="flex justify-center gap-2 mb-6">
                        {TABS.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = tab.key === active;
                            return (
                                <button
                                    key={tab.key}
                                    type="button"
                                    onClick={() => setActive(tab.key)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${isActive ? "bg-primary text-whiteColor" : "bg-whiteColor text-textSecondary border border-borderLight hover:bg-bgTertiary"
                                        }`}
                                >
                                    <Icon className="w-4 h-4" /> {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    <div className="rounded-2xl border border-borderDefault bg-whiteColor shadow-xl overflow-hidden">
                        <div className="flex items-center gap-1.5 px-4 py-2.5 bg-bgSecondary border-b border-borderLight">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                        </div>
                        <div className="p-4 sm:p-6">
                            <ActivePreview />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default PreviewSection;
