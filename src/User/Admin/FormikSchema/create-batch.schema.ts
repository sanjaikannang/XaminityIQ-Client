import * as Yup from 'yup';

export const createBatchSchema = Yup.object({
    startYear: Yup.number()
        .required('Start year is required')
        .min(2000, 'Start year must be at least 2000')
        .max(2050, 'Start year cannot be more than 2050')
        .integer('Start year must be a whole number'),

    endYear: Yup.number()
        .required('End year is required')
        .min(2000, 'End year must be at least 2000')
        .max(2060, 'End year cannot be more than 2060')
        .integer('End year must be a whole number')
        .test(
            'is-greater-than-start-year',
            'End year must be greater than start year',
            function (value) {
                const { startYear } = this.parent;
                if (!startYear || !value) return true;
                return value > startYear;
            }
        )
        .test(
            'is-valid-duration',
            'Batch duration must be between 1 and 10 years',
            function (value) {
                const { startYear } = this.parent;
                if (!startYear || !value) return true;
                const duration = value - startYear;
                return duration >= 1 && duration <= 10;
            }
        )
});