import {
    LogIn, ShieldCheck, Camera, Clock3, UserCheck2, ScreenShare, PlayCircle, Eye, CheckCircle,
    Video, Mic, Maximize, MonitorX, Wifi, type LucideIcon,
} from "lucide-react";
import Chip from "../../../../common/ui/Chip";
import Reveal from "./Reveal";
import StepFlow from "./StepFlow";

const STEPS = [
    { icon: LogIn, title: "Student Joins", description: "Opens the proctored exam from their dashboard." },
    { icon: ShieldCheck, title: "Environment Check", description: "System readiness is verified before anything else." },
    { icon: Camera, title: "Camera & Mic Check", description: "Webcam and microphone access is confirmed." },
    { icon: Clock3, title: "Waiting Room", description: "Student holds until an invigilator is available." },
    { icon: UserCheck2, title: "Faculty Approval", description: "Faculty reviews and admits the student." },
    { icon: ScreenShare, title: "Screen Share", description: "Entire-screen sharing is captured and published." },
    { icon: PlayCircle, title: "Exam Starts", description: "Timer begins; the exam room UI loads." },
    { icon: Eye, title: "Continuous Monitoring", description: "Faculty watches live video, screen, and activity." },
    { icon: CheckCircle, title: "Exam Submission", description: "Attempt is finalized and recordings are saved." },
];

const MONITORS: { icon: LucideIcon; label: string }[] = [
    { icon: Video, label: "Camera status" },
    { icon: Mic, label: "Microphone status" },
    { icon: ScreenShare, label: "Screen sharing" },
    { icon: Maximize, label: "Fullscreen status" },
    { icon: MonitorX, label: "Tab-switch detection" },
    { icon: Wifi, label: "Connection status" },
];

const ProctoringWorkflowSection = () => {
    return (
        <section id="proctoring" className="py-16 sm:py-20 lg:py-24 bg-whiteColor">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-2xl mx-auto">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wide">Proctoring Workflow</span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-textPrimary">How a proctored exam is monitored</h2>
                    <p className="mt-4 text-textSecondary leading-relaxed">
                        Every invigilated exam follows this exact path — a student is only ever admitted by a human faculty member.
                    </p>
                </Reveal>

                <Reveal className="mt-14">
                    <div className="bg-bgSecondary rounded-2xl border border-borderDefault p-6 sm:p-10">
                        <StepFlow steps={STEPS} accent="success" />
                    </div>
                </Reveal>

                <Reveal className="mt-8" delayMs={100}>
                    <div className="bg-bgSecondary rounded-2xl border border-borderDefault p-6 sm:p-8">
                        <p className="text-sm font-semibold text-textPrimary mb-4">Monitored throughout the exam</p>
                        <div className="flex flex-wrap gap-2.5">
                            {MONITORS.map((m) => (
                                <span key={m.label} className="inline-flex items-center gap-1.5 pl-2.5 pr-3 py-1.5 rounded-full bg-whiteColor border border-borderLight text-sm text-textPrimary">
                                    <m.icon className="w-3.5 h-3.5 text-primary" /> {m.label}
                                </span>
                            ))}
                            <Chip label="Faculty-only admission" variant="blue" />
                        </div>
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default ProctoringWorkflowSection;
