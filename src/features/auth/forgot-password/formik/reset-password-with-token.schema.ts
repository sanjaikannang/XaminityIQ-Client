import * as Yup from 'yup';

export const resetPasswordWithTokenValidationSchema = Yup.object({
    newPassword: Yup.string()
        .required('New password is required')
        .min(8, 'Password must be at least 8 characters long'),

    confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
});
