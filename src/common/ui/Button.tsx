import React from 'react';

interface ButtonProps {
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    icon?: React.ComponentType<{ className?: string }>;
    iconPosition?: 'left' | 'right';
    fullWidth?: boolean;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    icon: Icon,
    iconPosition = 'left',
    fullWidth = false,
    className = ''
}) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none disabled:opacity-60 disabled:cursor-not-allowed';

    const variantStyles = {
        primary: 'bg-primary text-whiteColor cursor-pointer',
        secondary: 'bg-borderLight text-whiteColor hover:bg-borderLight border border-borderLight',
        outline: 'bg-white text-textTertiary border border-borderLight hover:borderLight',
        danger: 'bg-red-600 text-whiteColor hover:bg-red-700 border border-red-600',
        ghost: 'bg-transparent text-textTertiary hover:bg-borderLight border border-transparent'
    };

    const sizeStyles = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-base'
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    const isDisabled = disabled || loading;

    return (
        <>
            <button
                type={type}
                onClick={onClick}
                disabled={isDisabled}
                className={`
                ${baseStyles}
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${widthStyle}
                ${className}
            `}
            >
                {loading && (
                    <div className="mr-2 animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                )}

                {!loading && Icon && iconPosition === 'left' && (
                    <Icon className="mr-2 h-4 w-4" />
                )}

                <span>{children}</span>

                {!loading && Icon && iconPosition === 'right' && (
                    <Icon className="ml-2 h-4 w-4" />
                )}
            </button>
        </>
    );
};

export default Button;