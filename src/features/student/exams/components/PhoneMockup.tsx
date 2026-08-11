import { Camera } from "lucide-react";

// A static, illustrative preview of what the student sees on their phone
// after scanning the QR — mirrors MobileWrittenAnswerPage's real layout at a
// glance so the desktop side can show "here's what happens next" up front.
const PhoneMockup = () => {
    return (
        <div className="flex flex-col items-center gap-2 shrink-0">
            <div className="relative w-[160px] rounded-[22px] border-[5px] border-neutral-800 bg-neutral-800 shadow-lg">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-neutral-800 rounded-b-md z-10" />
                <div className="rounded-[17px] overflow-hidden bg-bgSecondary" style={{ aspectRatio: "9 / 19" }}>
                    <div className="p-2 space-y-1.5 h-full flex flex-col">
                        <div className="bg-whiteColor rounded-md border border-borderLight p-1.5">
                            <p className="text-[5px] font-semibold text-textSecondary">QUESTION (10 MARKS)</p>
                            <p className="text-[5.5px] text-textPrimary mt-0.5 leading-tight">Explain the process in detail...</p>
                        </div>

                        <div className="flex-1 bg-whiteColor rounded-md border border-borderLight p-1.5 flex flex-col items-center justify-center gap-1.5 text-center">
                            <p className="text-[6px] font-semibold text-textPrimary">0 pages uploaded</p>
                            <div className="w-full bg-primary rounded-sm py-1.5 flex items-center justify-center gap-1">
                                <Camera className="w-2 h-2 text-whiteColor" />
                                <span className="text-[5px] font-medium text-whiteColor">Photograph Page 1</span>
                            </div>
                            <p className="text-[4.5px] text-textSecondary leading-tight px-1">
                                Once done, go back to your exam screen and tap "Finish &amp; Save Answer".
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="text-[11px] text-textTertiary text-center">Preview: your phone screen</p>
        </div>
    );
};

export default PhoneMockup;
