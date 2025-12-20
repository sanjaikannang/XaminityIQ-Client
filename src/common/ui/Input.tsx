import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputFieldProps {
    id: string;
    name: string;
    type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
    label?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    error?: string;
    touched?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    showPasswordToggle?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
    id,
    name,
    type = 'text',
    label,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    touched,
    icon: Icon,
    disabled = false,
    required = false,
    className = '',
    showPasswordToggle = false
}) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === 'password' && showPasswordToggle && showPassword ? 'text' : type;
    const hasError = error && touched;
    const isPasswordField = type === 'password' && showPasswordToggle;

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
                <div className="relative">
                    {Icon && (
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Icon className="h-5 w-5 text-gray-400" />
                        </div>
                    )}
                    <input
                        id={id}
                        name={name}
                        type={inputType}
                        value={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        disabled={disabled}
                        className={`block w-full ${Icon ? 'pl-10' : 'pl-3'} ${isPasswordField ? 'pr-12' : 'pr-3'} py-2 border ${hasError ? 'border-red-500' : 'border-gray-300'
                            } rounded-lg focus:outline-none duration-200 text-gray-900 placeholder-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed`}
                        placeholder={placeholder}
                    />
                    {isPasswordField && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-gray-600 transition duration-200"
                        >
                            {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-400" />
                            ) : (
                                <Eye className="h-5 w-5 text-gray-400" />
                            )}
                        </button>
                    )}
                </div>
                {hasError && (
                    <p className="text-xs text-red-600 mt-1">{error}</p>
                )}
            </div>
        </>
    );
};

export default InputField;