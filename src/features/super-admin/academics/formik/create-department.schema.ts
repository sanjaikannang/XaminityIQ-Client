import * as Yup from 'yup';

export const createDepartmentValidationSchema = Yup.object().shape({
    deptId: Yup.string()
        .required('Please select a department')
        .min(1, 'Please select a valid department'),
    totalSeats: Yup.number()
        .required('Total seats is required')
        .positive('Total seats must be a positive number')
        .integer('Total seats must be a whole number')
        .min(1, 'Total seats must be at least 1'),
    sectionCapacity: Yup.number()
        .positive('Section capacity must be a positive number')
        .integer('Section capacity must be a whole number')
        .min(1, 'Section capacity must be at least 1')
        .test(
            'less-than-total',
            'Section capacity cannot exceed total seats',
            function (value) {
                const { totalSeats } = this.parent;
                if (!value || !totalSeats) return true;
                return value <= totalSeats;
            }
        )
        .optional(),
});