import { useState } from "react";
import { UserCog, BookOpen, GraduationCap, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

interface RoleInfo {
    icon: LucideIcon;
    name: string;
    purpose: string;
    responsibilities: string[];
    workflow: string;
}

const ROLES: RoleInfo[] = [
    {
        icon: UserCog,
        name: "Super Admin",
        purpose: "Runs the institution's entire academic and exam setup.",
        responsibilities: [
            "Create batches, courses, departments, sections, and subjects",
            "Onboard students and faculty (individually or via bulk CSV)",
            "Create exams, add questions, and publish them",
            "Form proctoring rooms and assign invigilators",
            "Review assigned students, attempts, and recordings",
            "Publish results once evaluation is complete",
        ],
        workflow: "Set up academics → onboard users → create & publish exam → form rooms → review results",
    },
    {
        icon: BookOpen,
        name: "Faculty",
        purpose: "Manages subjects and proctors the exams assigned to them.",
        responsibilities: [
            "Manage their assigned subjects",
            "Monitor students live during a proctored exam",
            "Admit or reject students from the waiting room",
            "View student camera and screen-share feeds",
            "Chat with students and mute a student's mic if needed",
            "Evaluate Written and Typing answers with marks and remarks",
        ],
        workflow: "Open assigned room → admit students → monitor live → evaluate subjective answers",
    },
    {
        icon: GraduationCap,
        name: "Student",
        purpose: "Completes their profile and takes exams assigned to them.",
        responsibilities: [
            "Complete their profile after first login",
            "View subjects and assigned exams on their dashboard",
            "Run the pre-flight environment check before an exam",
            "Join the waiting room and get admitted by faculty (proctored exams)",
            "Answer MCQ/MSQ, type answers, or capture written answers via QR",
            "Submit the exam and view results once published",
        ],
        workflow: "Login → environment check → (waiting room) → exam room → submit → view result",
    },
];

const RolesSection = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const active = ROLES[activeIndex];

    return (
        <section id="roles" className="py-16 sm:py-20 lg:py-24 bg-whiteColor">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-2xl mx-auto">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wide">User Roles</span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-textPrimary">Built for three distinct roles</h2>
                    <p className="mt-4 text-textSecondary leading-relaxed">
                        Every screen and permission is scoped to what that role actually needs to do.
                    </p>
                </Reveal>

                <Reveal className="mt-12">
                    {/* Role switcher */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-8">
                        {ROLES.map((role, i) => {
                            const Icon = role.icon;
                            const isActive = i === activeIndex;
                            return (
                                <button
                                    key={role.name}
                                    type="button"
                                    onClick={() => setActiveIndex(i)}
                                    className={`flex items-center gap-2.5 px-5 py-3 rounded-xl border text-left transition-all cursor-pointer ${isActive
                                        ? "bg-primary border-primary text-whiteColor shadow-md"
                                        : "bg-whiteColor border-borderDefault text-textPrimary hover:border-primary"
                                        }`}
                                >
                                    <Icon className={`w-5 h-5 shrink-0 ${isActive ? "text-whiteColor" : "text-primary"}`} />
                                    <div>
                                        <p className="font-semibold text-sm">{role.name}</p>
                                        <p className={`text-xs ${isActive ? "text-whiteColor/80" : "text-textTertiary"}`}>{role.purpose}</p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active role detail */}
                    <div className="bg-bgSecondary rounded-2xl border border-borderDefault p-6 sm:p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h3 className="font-bold text-lg text-textPrimary mb-1">{active.name}</h3>
                                <p className="text-sm text-textSecondary mb-4">{active.purpose}</p>
                                <p className="text-xs font-semibold uppercase tracking-wide text-textTertiary mb-2">Responsibilities</p>
                                <ul className="space-y-1.5">
                                    {active.responsibilities.map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-sm text-textSecondary">
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />
                                            <span>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex flex-col justify-center">
                                <p className="text-xs font-semibold uppercase tracking-wide text-textTertiary mb-3">Typical workflow</p>
                                <div className="bg-whiteColor rounded-xl border border-borderLight p-4">
                                    <p className="text-sm text-textPrimary leading-relaxed font-medium">{active.workflow}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default RolesSection;
