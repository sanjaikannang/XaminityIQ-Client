import * as Yup from 'yup';

export const createExamValidationSchema = Yup.object({
    name: Yup.string().required('Exam name is required').max(150),
    description: Yup.string().max(1000),
    mode: Yup.string().required('Mode is required'),

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

    // Required for both AUTO and PROCTORING — always IST
    startTime: Yup.string().required('Start time is required'),
    endTime: Yup.string().required('End time is required'),

    securitySettings: Yup.object({
        minTimePerQuestionSeconds: Yup.number().typeError('Must be a number').min(0),
        minTimePerExamMinutes: Yup.number().typeError('Must be a number').min(0),
    }),
});
