import { ReactNode } from 'react';

interface InfoItemProps {
    label: string;
    value?: ReactNode;
    fullWidth?: boolean;
    icon?: string;
}

export const InfoItem = ({ label, value, fullWidth = false, icon }: InfoItemProps) => {
    return (
        <>
            <div className={`${fullWidth ? 'col-span-full' : ''}`}>
                <dt className="text-sm font-medium text-gray-500 mb-1 flex items-center">
                    {icon && <span className="mr-1">{icon}</span>}
                    {label}
                </dt>
                <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {value || 'Not provided'}
                </dd>
            </div>
        </>
    );
};
