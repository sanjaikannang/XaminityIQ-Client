import { KeyRound, Lock, Route, Video, MonitorX, ActivitySquare, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

const ITEMS: { icon: LucideIcon; title: string; description: string }[] = [
    { icon: KeyRound, title: "Secure Authentication", description: "JWT-based login with password recovery, kept separate from exam-session state." },
    { icon: Lock, title: "Role-Based Access", description: "Admin, Faculty, and Student each see only the screens and data their role permits." },
    { icon: Route, title: "Protected Routes", description: "Every page is guarded — the wrong role is redirected, not just hidden in the UI." },
    { icon: Video, title: "Camera & Screen Monitoring", description: "Proctored exams stream live camera and screen-share feeds to the invigilating faculty." },
    { icon: MonitorX, title: "Tab-Switch & Fullscreen Detection", description: "Leaving fullscreen or switching tabs is logged as a violation, with a configurable threshold." },
    { icon: ActivitySquare, title: "Exam-Session Monitoring", description: "Disconnects, violations, and timing are tracked for every attempt, visible to faculty and admin." },
];

const SecuritySection = () => {
    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-whiteColor">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-2xl mx-auto">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wide">Security &amp; Monitoring</span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-textPrimary">A controlled exam environment</h2>
                    <p className="mt-4 text-textSecondary leading-relaxed">
                        Access is scoped by role, and proctored sessions are actively monitored — not just recorded after the fact.
                    </p>
                </Reveal>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ITEMS.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <Reveal key={item.title} delayMs={(i % 3) * 100}>
                                <div className="h-full flex gap-3.5 bg-bgSecondary rounded-xl border border-borderDefault p-5">
                                    <div className="w-10 h-10 rounded-lg bg-primaryLighter flex items-center justify-center shrink-0">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm text-textPrimary">{item.title}</p>
                                        <p className="mt-1 text-xs text-textSecondary leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default SecuritySection;
