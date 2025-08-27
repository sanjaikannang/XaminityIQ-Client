import { ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface CommonSelectProps {
    id: string;
    label: string;
    options: SelectOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    placeholder?: string;
    required?: boolean;
    loading?: boolean;
    disabled?: boolean;
    error?: string;
    className?: string;
}

const CommonSelect: React.FC<CommonSelectProps> = ({
    id,
    label,
    options,
    value,
    onChange,
    placeholder = "Select an option",
    required = false,
    loading = false,
    disabled = false,
    error,
    className = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Find selected option
    const selectedOption = options.find(option => option.value === value);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = () => {
        if (!disabled && !loading) {
            setIsOpen(!isOpen);
        }
    };

    const handleOptionClick = (optionValue: string | number) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <>
            <div className={`space-y-1 ${className}`}>
                <label
                    htmlFor={id}
                    className="block text-sm font-semibold text-gray-800 mb-0.5"
                >
                    {label}
                    {required && <span className="text-red-500">*</span>}
                </label>

                <div className="relative" ref={dropdownRef}>
                    {/* Custom Select Button */}
                    <button
                        type="button"
                        id={id}
                        onClick={handleToggle}
                        disabled={disabled || loading}
                        className={`
                            w-full px-4 py-2 border border-gray-300 rounded-md
                            transition-all duration-300 ease-in-out
                            text-gray-800 bg-white text-left
                            focus:outline-none                                                        
                            ${disabled || loading ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'cursor-pointer'}
                            ${isOpen ? '' : ''}
                        `}
                    >
                        <span className={selectedOption ? 'text-gray-800' : 'text-gray-500'}>
                            {loading ? 'Loading...' : (selectedOption?.label || placeholder)}
                        </span>
                    </button>

                    {/* Custom dropdown arrow */}
                    <div className="absolute inset-y-0 right-0 flex items-center px-1.5 pointer-events-none">
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 mr-2 border border-primary border-t-transparent"></div>
                        ) : (
                            <div className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
                                <ChevronDown size={20} />
                            </div>
                        )}
                    </div>

                    {/* Custom Dropdown Menu */}
                    {isOpen && !loading && (
                        <div className="absolute z-[9999] w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-52 overflow-auto no-scrollbar">
                            {options.length === 0 ? (
                                <div className="px-4 py-2 text-gray-500 text-sm">
                                    No options available
                                </div>
                            ) : (
                                options.map((option) => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleOptionClick(option.value)}
                                        className={`
                                            w-full px-4 py-2 text-left hover:bg-blue-50 focus:bg-blue-50
                                            focus:outline-none transition-colors duration-150
                                            ${value === option.value ? 'bg-blue-100 text-primary font-medium' : 'text-gray-800'}
                                            first:rounded-t-md last:rounded-b-md
                                        `}
                                    >
                                        {option.label}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {error && (
                    <p className="text-red-600 text-[12px] flex items-center">
                        {error}
                    </p>
                )}
            </div>
        </>
    );
};

export default CommonSelect;