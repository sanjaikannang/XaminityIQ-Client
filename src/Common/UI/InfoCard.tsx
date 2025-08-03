import { ReactNode } from 'react';

interface InfoCardProps {
    title: string;
    children: ReactNode;
}

export const InfoCard = ({ title, children }: InfoCardProps) => {
    return (
        <>
            <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow duration-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">
                    {title}
                </h3>
                {children}
            </div>
        </>
    );
};