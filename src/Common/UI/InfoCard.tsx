import { ReactNode } from 'react';

interface InfoCardProps {
    title: string;
    children: ReactNode;
    icon?: ReactNode;
}

export const InfoCard = ({ title, children, icon }: InfoCardProps) => {
    return (
        <>
            <div className="bg-white rounded-md border border-gray-300 p-4">
                <div className="flex items-center mb-4 border-b border-gray-200 pb-2">
                    {icon && <div className="mr-2">{icon}</div>}
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                </div>
                {children}
            </div>
        </>
    );
};