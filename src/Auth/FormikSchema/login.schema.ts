import * as Yup from 'yup';

export const loginValidationSchema = Yup.object({
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required')
        .trim(),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters long')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Password must include uppercase, lowercase, number, and special character'
        )
        .required('Password is required')
});