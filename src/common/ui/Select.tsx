import { ChevronDown } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
}

interface SelectProps {
    id: string;
    name: string;
    label?: string;
    options: SelectOption[];
    value?: string | number;
    onChange?: (value: string | number) => void;
    onBlur?: (e: React.FocusEvent<HTMLButtonElement>) => void;
    placeholder?: string;
    required?: boolean;
    loading?: boolean;
    disabled?: boolean;
    error?: string;
    touched?: boolean;
    className?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

const Select: React.FC<SelectProps> = ({
    id,
    name,
    label,
    options,
    value,
    onChange,
    onBlur,
    placeholder = "Select an option",
    required = false,
    loading = false,
    disabled = false,
    error,
    touched,
    className = "",
    icon: Icon
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    const selectedOption = options.find(option => option.value === value);
    const hasError = error && touched;

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
        onChange?.(optionValue);
        setIsOpen(false);
    };

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
        if (onBlur) {
            onBlur(e);
        }
    };

    return (
        <>
            <div className={className}>
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium text-gray-700 mb-2"
                    >
                        {label}
                        {required && <span className="text-red-600 ml-1">*</span>}
                    </label>
                )}

                <div className="relative" ref={dropdownRef}>
                    <button
                        ref={buttonRef}
                        type="button"
                        id={id}
                        name={name}
                        onClick={handleToggle}
                        onBlur={handleBlur}
                        disabled={disabled || loading}
                        className={`
                        w-full ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg
                        transition-all duration-200
                        text-gray-900 bg-white text-left
                        focus:outline-none
                        ${disabled || loading ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'cursor-pointer hover:border-gray-400'}
                    `}
                    >
                        {Icon && (
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon className="h-5 w-5 text-gray-400" />
                            </div>
                        )}
                        <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                            {loading ? 'Loading...' : (selectedOption?.label || placeholder)}
                        </span>
                    </button>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-transparent"></div>
                        ) : (
                            <ChevronDown
                                className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                            />
                        )}
                    </div>

                    {isOpen && !loading && (
                        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
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
                                        w-full px-4 py-2 text-left hover:bg-gray-50
                                        focus:outline-none transition-colors duration-150
                                        ${value === option.value ? 'bg-gray-100 text-gray-900 font-medium' : 'text-gray-700'}
                                        first:rounded-t-lg last:rounded-b-lg
                                    `}
                                    >
                                        {option.label}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {hasError && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                )}
            </div>
        </>
    );
};

export default Select;