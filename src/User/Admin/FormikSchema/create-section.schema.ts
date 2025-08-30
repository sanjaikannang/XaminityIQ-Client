import * as Yup from 'yup';

export const createSectionSchema = Yup.object({
    branchId: Yup.string()
        .required('Branch is required'),

    name: Yup.string()
        .required('Section name is required')
        .min(1, 'Section name must be at least 1 character')
        .max(50, 'Section name must not exceed 50 characters')
        .matches(/^[A-Za-z0-9\s-]+$/, 'Section name can only contain letters, numbers, spaces, and hyphens')
        .trim(),

    capacity: Yup.number()
        .required('Capacity is required')
        .positive('Capacity must be a positive number')
        .integer('Capacity must be a whole number')
        .min(1, 'Capacity must be at least 1')
        .max(500, 'Capacity cannot exceed 500')
});