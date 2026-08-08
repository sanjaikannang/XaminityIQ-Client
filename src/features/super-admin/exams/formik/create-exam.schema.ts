import * as Yup from 'yup';
import { ExamMode } from '../../../../utils/enum';

export const createExamValidationSchema = Yup.object({
    name: Yup.string().required('Exam name is required').max(150),
    description: Yup.string().max(1000),
    mode: Yup.string().oneOf(Object.values(ExamMode)).required('Mode is required'),

    batchId: Yup.string().required('Batch is required'),
    courseId: Yup.string().required('Course is required'),
    departmentId: Yup.string().required('Department is required'),
    sectionId: Yup.string().required('Section is required'),
    semester: Yup.number().typeError('Must be a number').required('Semester is required').min(1),
    subjectId: Yup.string().required('Subject is required'),

    durationMinutes: Yup.number().typeError('Must be a number').required('Duration is required').min(1),
    totalMarks: Yup.number().typeError('Must be a number').required('Total marks are required').min(1),
    passingMarks: Yup.number().typeError('Must be a number').required('Passing marks are required').min(1),

    startDate: Yup.string().required('Start date is required'),
    endDate: Yup.string().required('End date is required'),

    startTime: Yup.string().when('mode', {
        is: ExamMode.PROCTORING,
        then: (schema) => schema.required('Start time is required for PROCTORING exams'),
        otherwise: (schema) => schema.notRequired(),
    }),
    endTime: Yup.string().when('mode', {
        is: ExamMode.PROCTORING,
        then: (schema) => schema.required('End time is required for PROCTORING exams'),
        otherwise: (schema) => schema.notRequired(),
    }),
});
