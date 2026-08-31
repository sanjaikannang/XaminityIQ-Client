import { useEffect, useRef, useState, type ReactNode } from "react";

interface RevealProps {
    children: ReactNode;
    className?: string;
    // Stagger multiple reveals in the same section (e.g. a grid of cards)
    delayMs?: number;
}

// Lightweight fade-in-on-scroll wrapper — no animation library in this app,
// so this is a plain IntersectionObserver toggling the .reveal-visible class
// defined in global.css. Reveals once and stays visible (doesn't re-hide on
// scroll-away), and reduced-motion users see content immediately (global.css
// neutralizes .reveal entirely under prefers-reduced-motion).
const Reveal = ({ children, className = "", delayMs = 0 }: RevealProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.15 },
        );
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={`reveal ${isVisible ? "reveal-visible" : ""} ${className}`}
            style={delayMs ? { transitionDelay: `${delayMs}ms` } : undefined}
        >
            {children}
        </div>
    );
};

export default Reveal;
