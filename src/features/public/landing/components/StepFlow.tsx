import type { LucideIcon } from "lucide-react";

export interface FlowStep {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface StepFlowProps {
    steps: FlowStep[];
    accent?: "primary" | "success";
}

// Connected step flow — a numbered, iconed row of steps joined by a
// connector line, stacking to a vertical timeline on small screens. Shared
// by the exam workflow and proctoring workflow sections so both stay visually
// consistent.
const StepFlow = ({ steps, accent = "primary" }: StepFlowProps) => {
    const accentBg = accent === "primary" ? "bg-primary" : "bg-success";
    const accentText = accent === "primary" ? "text-primary" : "text-success";
    const accentBgLight = accent === "primary" ? "bg-primaryLighter" : "bg-green-100";

    return (
        <div className="relative">
            {/* Connector line — horizontal on desktop, vertical on mobile */}
            <div className="hidden md:block absolute top-6 left-0 right-0 h-0.5 bg-borderLight" style={{ marginInline: `${100 / steps.length / 2}%` }} />
            <div className="md:hidden absolute top-0 bottom-0 left-6 w-0.5 bg-borderLight" />

            <div className="relative grid grid-cols-1 md:grid-cols-[repeat(var(--steps),minmax(0,1fr))] gap-8 md:gap-4" style={{ ["--steps" as any]: steps.length }}>
                {steps.map((step, i) => {
                    const Icon = step.icon;
                    return (
                        <div key={step.title} className="relative flex md:flex-col gap-4 md:gap-0 md:text-center">
                            <div className="relative shrink-0 md:mx-auto">
                                <div className={`w-12 h-12 rounded-full ${accentBgLight} border-2 border-whiteColor ring-2 ring-borderLight flex items-center justify-center relative z-10`}>
                                    <Icon className={`w-5 h-5 ${accentText}`} />
                                </div>
                                <span className={`absolute -top-1.5 -right-1.5 z-20 w-5 h-5 rounded-full ${accentBg} text-whiteColor text-[10px] font-bold flex items-center justify-center`}>
                                    {i + 1}
                                </span>
                            </div>
                            <div className="md:mt-3">
                                <p className="font-semibold text-sm text-textPrimary">{step.title}</p>
                                <p className="mt-1 text-xs text-textSecondary leading-relaxed md:max-w-[10rem] md:mx-auto">{step.description}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StepFlow;
