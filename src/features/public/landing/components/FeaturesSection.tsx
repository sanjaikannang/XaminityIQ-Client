import {
    Users, GraduationCap, ClipboardCheck, Video, ShieldCheck, CheckCircle2,
    type LucideIcon,
} from "lucide-react";
import Reveal from "./Reveal";

interface FeatureGroup {
    icon: LucideIcon;
    title: string;
    description: string;
    items: string[];
}

const GROUPS: FeatureGroup[] = [
    {
        icon: Users,
        title: "User Management",
        description: "Onboard and maintain every student and faculty record.",
        items: [
            "Student & faculty creation with minimal required fields",
            "Bulk CSV upload for students and questions",
            "Self-serve profile completion for the rest of their details",
            "Edit, deactivate, or remove accounts",
            "Per-user activity history",
        ],
    },
    {
        icon: GraduationCap,
        title: "Academic Management",
        description: "Model your institution's real academic structure.",
        items: [
            "Batches, courses, and departments",
            "Sections with student capacity",
            "Subjects with subject codes, mapped to a semester",
            "Faculty ownership of subjects",
            "Full batch → course → department → section hierarchy",
        ],
    },
    {
        icon: ClipboardCheck,
        title: "Examination Management",
        description: "Author, schedule, and publish exams end to end.",
        items: [
            "AUTO (self-paced) and PROCTORING (invigilated) exam modes",
            "MCQ, MSQ, Written, and Typing question types",
            "Named exam sections to group questions",
            "Bulk question upload via CSV",
            "Shuffle questions/options, minimum time rules, and marks validation",
            "Draft → Published → Ongoing → Completed → Results lifecycle",
        ],
    },
    {
        icon: Video,
        title: "Online Proctoring",
        description: "Live-monitor invigilated exams in real time.",
        items: [
            "Camera, microphone, and screen-share monitoring",
            "Automatic room formation with faculty invigilators",
            "Waiting-room approval — faculty admit or reject each student",
            "Live student camera & screen feed per faculty",
            "In-exam chat between faculty and student",
            "Tab-switch and fullscreen-exit detection with auto-submit",
        ],
    },
    {
        icon: ShieldCheck,
        title: "Authentication & Security",
        description: "Keep access scoped to the right people.",
        items: [
            "JWT-based secure authentication",
            "Role-based access for Admin, Faculty, and Student",
            "Protected routes per role across the app",
            "Forgot-password / reset-password flow",
            "Exam-session integrity monitoring with violation thresholds",
        ],
    },
];

const FeaturesSection = () => {
    return (
        <section id="features" className="py-16 sm:py-20 lg:py-24 bg-bgSecondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-2xl mx-auto">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wide">Key Features</span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-textPrimary">Everything an exam needs, built in</h2>
                    <p className="mt-4 text-textSecondary leading-relaxed">
                        Five connected feature areas — nothing bolted on, nothing missing.
                    </p>
                </Reveal>

                <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {GROUPS.map((group, i) => {
                        const Icon = group.icon;
                        return (
                            <Reveal key={group.title} delayMs={(i % 2) * 100} className={GROUPS.length - 1 === i ? "lg:col-span-2" : ""}>
                                <div className="h-full bg-whiteColor rounded-xl border border-borderDefault p-6 hover:border-primary hover:shadow-md transition-all">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-11 h-11 rounded-lg bg-primaryLighter flex items-center justify-center shrink-0">
                                            <Icon className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-textPrimary">{group.title}</h3>
                                            <p className="text-xs text-textSecondary">{group.description}</p>
                                        </div>
                                    </div>
                                    <ul className={`grid grid-cols-1 ${group.items.length > 4 ? "sm:grid-cols-2" : ""} gap-x-4 gap-y-2`}>
                                        {group.items.map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-sm text-textSecondary">
                                                <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                                                <span>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
