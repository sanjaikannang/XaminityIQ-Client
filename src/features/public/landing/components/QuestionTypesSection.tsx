import { CircleDot, ListChecks, QrCode, Type, type LucideIcon } from "lucide-react";
import Reveal from "./Reveal";

const TYPES: { icon: LucideIcon; name: string; description: string }[] = [
    { icon: CircleDot, name: "MCQ", description: "Single correct option from a list of choices." },
    { icon: ListChecks, name: "MSQ", description: "One or more correct options can be selected." },
    { icon: QrCode, name: "Written Answer", description: "Student scans a QR code and photographs handwritten pages from their phone." },
    { icon: Type, name: "Typing", description: "A rich-text editor for typed, free-form answers." },
];

const QuestionTypesSection = () => {
    return (
        <section className="py-16 sm:py-20 lg:py-24 bg-bgSecondary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Reveal className="text-center max-w-2xl mx-auto">
                    <span className="text-primary text-sm font-semibold uppercase tracking-wide">Examination Capabilities</span>
                    <h2 className="mt-2 text-3xl sm:text-4xl font-bold text-textPrimary">Four question types, one exam</h2>
                    <p className="mt-4 text-textSecondary leading-relaxed">
                        Mix objective and subjective questions freely within the same exam and the same section.
                    </p>
                </Reveal>

                <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {TYPES.map((type, i) => {
                        const Icon = type.icon;
                        return (
                            <Reveal key={type.name} delayMs={i * 80}>
                                <div className="h-full bg-whiteColor rounded-xl border border-borderDefault p-5 text-center hover:border-primary hover:shadow-md transition-all">
                                    <div className="w-12 h-12 rounded-lg bg-primaryLighter flex items-center justify-center mx-auto mb-3">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <p className="font-semibold text-textPrimary text-sm">{type.name}</p>
                                    <p className="mt-1.5 text-xs text-textSecondary leading-relaxed">{type.description}</p>
                                </div>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default QuestionTypesSection;
