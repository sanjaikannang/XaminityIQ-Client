import * as Yup from 'yup';

export const createBranchSchema = Yup.object({
    courseId: Yup.string()
        .required('Course is required'),

    name: Yup.string()
        .required('Branch name is required')
        .min(2, 'Branch name must be at least 2 characters')
        .max(100, 'Branch name must not exceed 100 characters')
        .trim(),

    code: Yup.string()
        .required('Branch code is required')
        .min(1, 'Branch code must be at least 1 character')
        .max(10, 'Branch code must not exceed 10 characters')
        .matches(/^[A-Z0-9]+$/, 'Branch code must contain only uppercase letters and numbers')
        .trim()
});