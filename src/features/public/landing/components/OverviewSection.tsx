import { Layers, Users2, Sparkles } from "lucide-react";
import Reveal from "./Reveal";

const POINTS = [
    {
        icon: Layers,
        title: "What it is",
        text: "A single platform covering academic structure, student and faculty management, exam authoring, and live proctored exam delivery — replacing spreadsheets, paper exam halls, and disconnected tools.",
    },
    {
        icon: Users2,
        title: "Who it's for",
        text: "Colleges and institutes running both self-paced and invigilated exams — administrators managing the institution, faculty authoring and supervising exams, and students taking them.",
    },
    {
        icon: Sparkles,
        title: "What it solves",
        text: "Manual room allocation, no visibility into who's cheating, scattered student records, and slow answer evaluation — all handled in one connected workflow instead of separate systems.",
    },
];

const OverviewSection = () => {
    return (
        <section id="overview" className="py-16 sm:py-20 lg:py-24 bg-whiteColor">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-2xl mx-auto">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wide">Application Overview</span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-textPrimary">One platform, the entire exam lifecycle</h2>
                    <p className="mt-4 text-textSecondary leading-relaxed">
                        From setting up departments and sections to publishing final results, XaminityIQ keeps every
                        step — and everyone involved — in one place.
                    </p>
                </Reveal>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                    {POINTS.map((point, i) => {
                        const Icon = point.icon;
                        return (
                            <Reveal key={point.title} delayMs={i * 100}>
                                <div className="h-full bg-whiteColor rounded-xl border border-borderDefault p-6">
                                    <div className="w-11 h-11 rounded-lg bg-primaryLighter flex items-center justify-center mb-4">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-textPrimary mb-2">{point.title}</h3>
                                    <p className="text-sm text-textSecondary leading-relaxed">{point.text}</p>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default OverviewSection;
