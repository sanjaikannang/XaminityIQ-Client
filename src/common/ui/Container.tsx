import type { ReactNode } from "react";

interface ContainerProps {
    children: ReactNode;
    className?: string;
}

export const Container = ({ children, className = "" }: ContainerProps) => {
    return (
        <>
            <div className={`mx-auto px-6 max-w-full ${className}`}>{children}</div>
        </>
    );
};
