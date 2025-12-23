import React, { type ReactNode } from "react";

interface PageHeaderProps {
    children: ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ children }) => {
    return (
        <>
            <div className="mb-6">
                <div className="text-lg px-6 py-2 shadow-md bg-bgSecondary border-b border-borderLight">{children}</div>
            </div>
        </>
    );
};
