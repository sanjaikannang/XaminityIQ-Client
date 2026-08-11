import { Clock } from "lucide-react";

interface CountdownTimerProps {
    remainingMs: number;
    size?: "sm" | "md";
    className?: string;
}

const pad = (n: number) => n.toString().padStart(2, "0");

const formatDuration = (ms: number): string => {
    const totalSeconds = Math.floor(Math.max(0, ms) / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
};

// Presentational countdown pill — callers own the ticking (setInterval)
// and just pass the current remaining milliseconds in. Urgency escalates
// visually as time runs out: normal -> warning (<=5 min) -> critical (<=1 min, pulsing).
export function CountdownTimer({ remainingMs, size = "md", className = "" }: CountdownTimerProps) {
    const clamped = Math.max(0, remainingMs);
    const isCritical = clamped <= 60_000;
    const isWarning = !isCritical && clamped <= 5 * 60_000;

    const colorClasses = isCritical
        ? "text-red-700 bg-red-50 border-red-200"
        : isWarning
            ? "text-yellow-800 bg-yellow-50 border-yellow-200"
            : "text-primary bg-primary/5 border-primary/20";

    const sizeClasses = size === "sm" ? "text-xs px-2 py-1 gap-1" : "text-sm px-3 py-1.5 gap-1.5";

    return (
        <div
            className={`inline-flex items-center rounded-lg border font-semibold tabular-nums ${colorClasses} ${sizeClasses} ${isCritical ? "animate-pulse" : ""} ${className}`}
            role="timer"
            aria-live={isCritical ? "assertive" : "off"}
        >
            <Clock className={size === "sm" ? "w-3.5 h-3.5" : "w-4 h-4"} />
            {formatDuration(clamped)}
        </div>
    );
}
