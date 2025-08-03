import { ReactNode } from 'react';

interface InfoItemProps {
    label: string;
    value?: ReactNode;
    fullWidth?: boolean;
}

export const InfoItem = ({ label, value, fullWidth = false }: InfoItemProps) => {
    return (
        <>
            <div className={`${fullWidth ? 'col-span-full' : ''}`}>
                <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
                <dd className="text-sm text-gray-900 bg-gray-50 px-3 py-2 rounded-md">
                    {value || 'Not provided'}
                </dd>
            </div>
        </>
    );
};
