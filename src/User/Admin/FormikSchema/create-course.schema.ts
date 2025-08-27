import * as Yup from 'yup';
import { CourseType } from '../../../Utils/enum';

export const createCourseSchema = Yup.object({
    batchId: Yup.string()
        .required('Batch is required')
        .min(1, 'Please select a batch'),

    name: Yup.string()
        .required('Course name is required')
        .min(2, 'Course name must be at least 2 characters')
        .max(50, 'Course name cannot exceed 50 characters')
        .matches(/^[a-zA-Z0-9.\s-]+$/, 'Course name can only contain letters, numbers, dots, spaces, and hyphens'),

    fullName: Yup.string()
        .required('Full name is required')
        .min(5, 'Full name must be at least 5 characters')
        .max(100, 'Full name cannot exceed 100 characters')
        .matches(/^[a-zA-Z\s.-]+$/, 'Full name can only contain letters, spaces, dots, and hyphens'),

    totalSemesters: Yup.number()
        .required('Total semesters is required')
        .min(1, 'Total semesters must be at least 1')
        .max(20, 'Total semesters cannot exceed 20')
        .integer('Total semesters must be a whole number'),

    durationYears: Yup.number()
        .required('Duration in years is required')
        .min(0.5, 'Duration must be at least 0.5 years')
        .max(10, 'Duration cannot exceed 10 years')
        .test(
            'is-valid-semester-duration',
            'Duration and semesters should be consistent (typically 2 semesters per year)',
            function (value) {
                const { totalSemesters } = this.parent;
                if (!totalSemesters || !value) return true;

                // Allow some flexibility in the ratio (1.5 to 2.5 semesters per year)
                const semesterPerYear = totalSemesters / value;
                return semesterPerYear >= 1.5 && semesterPerYear <= 2.5;
            }
        ),

    courseType: Yup.string()
        .required('Course type is required')
        .oneOf(Object.values(CourseType), 'Please select a valid course type'),

});