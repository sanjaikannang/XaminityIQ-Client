import * as Yup from 'yup';

export const createBatchValidationSchema = Yup.object().shape({
    batchName: Yup.string()
        .required('Batch name is required')
        .matches(
            /^\d{4}-\d{4}$/,
            'Batch name must be in format YYYY-YYYY (e.g., 2020-2024)'
        )
        .test('batch-name-match', 'Batch name must match start and end years', function (value) {
            const { startYear, endYear } = this.parent;
            if (value && startYear && endYear) {
                const expectedBatchName = `${startYear}-${endYear}`;
                return value === expectedBatchName;
            }
            return true;
        }),

    startYear: Yup.string()
        .required('Start year is required')
        .matches(/^\d{4}$/, 'Start year must be 4 digits')
        .test('valid-year', 'Start year must be 2000 or later', (value) => {
            if (!value) return false;
            const year = parseInt(value);
            const currentYear = new Date().getFullYear();
            return year >= 2000 && year <= currentYear + 10;
        }),

    endYear: Yup.string()
        .required('End year is required')
        .matches(/^\d{4}$/, 'End year must be 4 digits')
        .test('valid-year', 'End year must be valid', (value) => {
            if (!value) return false;
            const year = parseInt(value);
            const currentYear = new Date().getFullYear();
            return year >= 2000 && year <= currentYear + 10;
        })
        .test('year-difference', 'End year must be 2-5 years after start year', function (value) {
            const { startYear } = this.parent;
            if (!value || !startYear) return true;

            const start = parseInt(startYear);
            const end = parseInt(value);
            const difference = end - start;

            if (difference < 2 || difference > 5) {
                return this.createError({
                    message: `End year must be 2-5 years after start year. Current difference is ${difference} years`,
                });
            }

            return true;
        }),
});