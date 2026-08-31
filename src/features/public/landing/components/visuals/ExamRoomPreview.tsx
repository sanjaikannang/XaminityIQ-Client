import { Video, Wifi, ShieldCheck } from "lucide-react";

// A representative mockup of the real exam-room UI (3-column question layout,
// section nav, live self-preview) — built from the same design tokens as the
// actual app, not a generic stock illustration.
const ExamRoomPreview = () => {
    return (
        <div className="relative mx-auto max-w-lg lg:max-w-none">
            {/* Browser chrome */}
            <div className="rounded-2xl border border-borderDefault bg-whiteColor shadow-2xl overflow-hidden">
                <div className="flex items-center gap-1.5 px-4 py-2.5 bg-bgSecondary border-b border-borderLight">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    <span className="ml-3 text-[11px] text-textTertiary">exam.xaminityiq.app</span>
                </div>

                {/* Mini exam-room header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-borderLight">
                    <span className="font-bold text-sm text-primary">XaminityIQ</span>
                    <span className="text-[11px] font-mono font-semibold text-textPrimary bg-bgSecondary px-2 py-0.5 rounded">18:24</span>
                </div>

                {/* 3-column body */}
                <div className="grid grid-cols-[1fr_1fr_84px] gap-2 p-3 bg-bgSecondary">
                    <div className="rounded-lg bg-whiteColor border border-borderLight p-2.5 space-y-1.5">
                        <div className="h-1.5 w-16 rounded-full bg-borderDefault" />
                        <div className="h-1.5 w-full rounded-full bg-borderLight" />
                        <div className="h-1.5 w-full rounded-full bg-borderLight" />
                        <div className="h-1.5 w-3/4 rounded-full bg-borderLight" />
                    </div>
                    <div className="rounded-lg bg-whiteColor border border-borderLight p-2.5 space-y-1.5">
                        {[0, 1, 2].map((i) => (
                            <div key={i} className={`h-5 rounded-md border flex items-center px-1.5 gap-1.5 ${i === 1 ? "border-primary bg-primaryLighter" : "border-borderLight"}`}>
                                <span className={`w-2 h-2 rounded-full shrink-0 ${i === 1 ? "bg-primary" : "bg-borderDefault"}`} />
                                <span className="h-1 w-full rounded-full bg-borderLight" />
                            </div>
                        ))}
                    </div>
                    <div className="space-y-2">
                        <div className="rounded-lg bg-whiteColor border border-borderLight p-1.5 grid grid-cols-3 gap-1">
                            {[...Array(6)].map((_, i) => (
                                <span key={i} className={`h-3.5 w-3.5 rounded ${i < 3 ? "bg-green-200" : "bg-bgTertiary"}`} />
                            ))}
                        </div>
                        <div className="rounded-lg bg-blackColor aspect-square flex items-center justify-center">
                            <Video className="w-4 h-4 text-whiteColor/70" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Floating status badges */}
            <div className="absolute -top-4 -right-4 hidden sm:flex items-center gap-1.5 bg-whiteColor border border-borderLight shadow-lg rounded-full px-3 py-1.5">
                <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-600" />
                </span>
                <span className="text-xs font-semibold text-textPrimary">Proctoring Live</span>
            </div>
            <div className="absolute -bottom-4 -left-4 hidden sm:flex items-center gap-1.5 bg-whiteColor border border-borderLight shadow-lg rounded-full px-3 py-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span className="text-xs font-semibold text-textPrimary">Environment Verified</span>
            </div>
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 hidden lg:flex items-center gap-1.5 bg-whiteColor border border-borderLight shadow-lg rounded-full px-3 py-1.5">
                <Wifi className="w-3.5 h-3.5 text-success" />
                <span className="text-xs font-semibold text-textPrimary">Stable Connection</span>
            </div>
        </div>
    );
};

export default ExamRoomPreview;
