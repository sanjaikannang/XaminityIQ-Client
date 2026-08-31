import { LogIn, ShieldCheck, Clock3, UserCheck2, LayoutGrid, PenLine, Send, PartyPopper } from "lucide-react";
import Reveal from "./Reveal";
import StepFlow from "./StepFlow";

const STEPS = [
    { icon: LogIn, title: "Login", description: "Student signs in and opens their assigned exam." },
    { icon: ShieldCheck, title: "Environment Check", description: "Camera, mic, screen, and fullscreen are verified." },
    { icon: Clock3, title: "Waiting Room", description: "Student waits to be admitted (proctored exams only)." },
    { icon: UserCheck2, title: "Faculty Approval", description: "Invigilating faculty admits the student in." },
    { icon: LayoutGrid, title: "Exam Room", description: "Distraction-free room with sections and a timer." },
    { icon: PenLine, title: "Exam", description: "Answer MCQ/MSQ, type, or capture written pages." },
    { icon: Send, title: "Submission", description: "Manual submit, or auto-submit at time-up." },
    { icon: PartyPopper, title: "Completion", description: "Attempt is finalized; result appears once published." },
];

const WorkflowSection = () => {
    return (
        <section id="workflow" className="py-16 sm:py-20 lg:py-24 bg-bgSecondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-2xl mx-auto">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wide">How It Works</span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-textPrimary">The student examination workflow</h2>
                    <p className="mt-4 text-textSecondary leading-relaxed">
                        The same eight steps every student's exam attempt moves through. A self-paced (AUTO) exam
                        skips straight from the environment check to the exam room — no waiting room or approval needed.
                    </p>
                </Reveal>

                <Reveal className="mt-14">
                    <div className="bg-whiteColor rounded-2xl border border-borderDefault p-6 sm:p-10">
                        <StepFlow steps={STEPS} />
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default WorkflowSection;
