import { Layers3, ClipboardList, Video, KeyRound, UserPlus, Users, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
    { icon: Layers3, title: "Centralized academic management", description: "Batches, courses, departments, sections, and subjects — one hierarchy, no spreadsheets." },
    { icon: ClipboardList, title: "Simplified exam management", description: "Author, schedule, and publish an exam without juggling separate tools for questions and scheduling." },
    { icon: Video, title: "Real proctoring, not just recording", description: "Faculty watch and act live — admit, mute, chat, or remove — instead of reviewing footage after the fact." },
    { icon: KeyRound, title: "Role-based access by default", description: "Every screen is scoped to Admin, Faculty, or Student from the start, not bolted on later." },
    { icon: UserPlus, title: "Fast onboarding", description: "Minimal fields at creation; students and faculty complete the rest of their own profile later." },
    { icon: Users, title: "Everyone in one workflow", description: "Admins, faculty, and students all work from the same exam record — no re-entry, no drift." },
];

const BenefitsSection = () => {
    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-whiteColor">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-2xl mx-auto">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wide">Why XaminityIQ</span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-textPrimary">Built around how exams actually run</h2>
                </Reveal>

                <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {BENEFITS.map((b, i) => {
                        const Icon = b.icon;
                        return (
                            <Reveal key={b.title} delayMs={(i % 3) * 100}>
                                <div className="h-full p-1">
                                    <Icon className="w-6 h-6 text-primary mb-3" />
                                    <p className="font-semibold text-textPrimary text-sm">{b.title}</p>
                                    <p className="mt-1.5 text-sm text-textSecondary leading-relaxed">{b.description}</p>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default BenefitsSection;
