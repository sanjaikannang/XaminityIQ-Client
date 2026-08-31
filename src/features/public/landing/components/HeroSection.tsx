import { useNavigate } from "react-router-dom";
import { ArrowRight, ShieldCheck, Video, Clock3, CircleDot } from "lucide-react";
import Button from "../../../../common/ui/Button";
import Reveal from "./Reveal";
import ExamRoomPreview from "./visuals/ExamRoomPreview";

const HeroSection = () => {
    const navigate = useNavigate();

    return (
        <section id="home" className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-white to-sky-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                    {/* Copy */}
                    <div className="text-center lg:text-left">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primaryLighter text-primary text-xs font-semibold tracking-wide uppercase">
                            <ShieldCheck className="w-3.5 h-3.5" /> XaminityIQ
                        </span>
                        <h1 className="mt-5 text-4xl sm:text-5xl lg:text-[3.25rem] font-bold text-textPrimary leading-[1.1]">
                            Run secure, proctored examinations from one platform
                        </h1>
                        <p className="mt-5 text-base sm:text-lg text-textSecondary max-w-xl mx-auto lg:mx-0 leading-relaxed">
                            XaminityIQ is an academic examination platform for colleges and institutes — admins manage
                            students, faculty and academic structure; faculty author exams and proctor them live;
                            students take exams in a monitored, distraction-free room. One system, from onboarding to results.
                        </p>

                        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                            <Button
                                variant="primary"
                                size="lg"
                                fullWidth
                                icon={ArrowRight}
                                iconPosition="right"
                                className="sm:w-auto"
                                onClick={() => navigate('/login')}
                            >
                                Get Started
                            </Button>
                            <Button
                                variant="outline"
                                size="lg"
                                fullWidth
                                className="sm:w-auto"
                                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Explore Features
                            </Button>
                        </div>

                        <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-x-8 gap-y-3 text-sm text-textSecondary">
                            <span className="flex items-center gap-1.5"><CircleDot className="w-4 h-4 text-primary" /> 3 dedicated roles</span>
                            <span className="flex items-center gap-1.5"><Video className="w-4 h-4 text-primary" /> Live camera &amp; screen proctoring</span>
                            <span className="flex items-center gap-1.5"><Clock3 className="w-4 h-4 text-primary" /> Real-time exam monitoring</span>
                        </div>
                    </div>

                    {/* Visual — a representative mockup of the actual exam room UI, not a stock illustration */}
                    <Reveal>
                        <ExamRoomPreview />
                    </Reveal>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
