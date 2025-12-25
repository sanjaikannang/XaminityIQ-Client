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
        onBlur?.(e);
    };

    return (
        <>
            <div className={className}>
                {label && (
                    <label
                        htmlFor={id}
                        className="block text-sm font-medium mb-2"
                        style={{ color: 'var(--color-textSecondary)' }}
                    >
                        {label}
                        {required && (
                            <span className="ml-1" style={{ color: 'var(--color-error)' }}>*</span>
                        )}
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
                        className={`w-full ${Icon ? 'pl-10' : 'pl-3'} pr-10 py-2 rounded-lg text-left transition-all duration-200`}
                        style={{
                            backgroundColor: disabled || loading
                                ? 'var(--color-bgTertiary)'
                                : 'var(--color-bgPrimary)',
                            border: `1px solid ${hasError ? 'var(--color-error)' : 'var(--color-borderLight)'}`,
                            color: 'var(--color-textPrimary)',
                            cursor: disabled || loading ? 'not-allowed' : 'pointer',
                            opacity: disabled || loading ? 0.6 : 1
                        }}
                    >
                        {Icon && (
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Icon
                                    className="h-5 w-5"
                                />
                            </div>
                        )}

                        <span style={{ color: 'var(--color-textSecondary)' }}>
                            {loading ? 'Loading...' : (selectedOption?.label || placeholder)}
                        </span>
                    </button>

                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        {loading ? (
                            <div
                                className="animate-spin rounded-full h-4 w-4 border-2 border-t-transparent"
                                style={{ borderColor: 'var(--color-borderDark)' }}
                            />
                        ) : (
                            <ChevronDown
                                className={`h-5 w-5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                style={{ color: 'var(--color-textSecondary)' }}
                            />
                        )}
                    </div>

                    {isOpen && !loading && (
                        <div
                            className="absolute z-50 w-full mt-1 rounded-lg shadow-lg max-h-24 overflow-auto no-scrollbar"
                            style={{
                                backgroundColor: 'var(--color-bgPrimary)',
                                border: '1px solid var(--color-borderLight)'
                            }}
                        >
                            {options.length === 0 ? (
                                <div
                                    className="px-4 py-2 text-sm"
                                    style={{ color: 'var(--color-textTertiary)' }}
                                >
                                    No options available
                                </div>
                            ) : (
                                options.map(option => (
                                    <button
                                        key={option.value}
                                        type="button"
                                        onClick={() => handleOptionClick(option.value)}
                                        className="w-full px-4 py-2 text-left cursor-pointer transition-colors duration-150 first:rounded-t-lg last:rounded-b-lg"
                                        style={{
                                            backgroundColor:
                                                value === option.value
                                                    ? 'var(--color-bgSecondary)'
                                                    : 'transparent',
                                            color: 'var(--color-textPrimary)'
                                        }}
                                        onMouseEnter={e =>
                                            (e.currentTarget.style.backgroundColor = 'var(--color-bgSecondary)')
                                        }
                                        onMouseLeave={e =>
                                        (e.currentTarget.style.backgroundColor =
                                            value === option.value
                                                ? 'var(--color-bgSecondary)'
                                                : 'transparent')
                                        }
                                    >
                                        {option.label}
                                    </button>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {hasError && (
                    <p
                        className="text-xs mt-1"
                        style={{ color: 'var(--color-error)' }}
                    >
                        {error}
                    </p>
                )}
            </div>
        </>
    );
};

export default Select;
