import * as Yup from 'yup';

export const resetPasswordValidationSchema = Yup.object({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required')
        .trim(),
    temporaryPassword: Yup.string()
        .required('Temporary password is required')
        .min(1, 'Temporary password cannot be empty'),

    newPassword: Yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        ),

    confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
});