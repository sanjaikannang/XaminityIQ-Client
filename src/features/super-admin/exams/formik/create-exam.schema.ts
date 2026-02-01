import * as Yup from 'yup';
import moment from "moment";
import { ExamMode } from '../../../../utils/enum';

export const createExamValidationSchema = Yup.object().shape({
    examMode: Yup.string()
        .oneOf([ExamMode.PROCTORING, ExamMode.AUTO], 'Invalid exam mode')
        .required('Exam mode is required'),

    examName: Yup.string()
        .required('Exam name is required')
        .min(3, 'Exam name must be at least 3 characters')
        .max(100, 'Exam name must not exceed 100 characters'),

    duration: Yup.number()
        .required('Duration is required')
        .min(1, 'Duration must be at least 1 minute')
        .max(480, 'Duration must not exceed 480 minutes (8 hours)')
        .integer('Duration must be a whole number'),

    // PROCTORING mode fields
    examDate: Yup.string().when('examMode', {
        is: ExamMode.PROCTORING,
        then: (schema) => schema
            .required('Exam date is required for proctoring mode')
            .test('valid-date', 'Exam date must be today or in the future', (value) => {
                if (!value) return false;
                return moment(value).isSameOrAfter(moment().startOf('day'));
            }),
        otherwise: (schema) => schema.notRequired(),
    }),

    startTime: Yup.string().when('examMode', {
        is: ExamMode.PROCTORING,
        then: (schema) => schema
            .required('Start time is required for proctoring mode')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:mm format'),
        otherwise: (schema) => schema.notRequired(),
    }),

    endTime: Yup.string().when('examMode', {
        is: ExamMode.PROCTORING,
        then: (schema) => schema
            .required('End time is required for proctoring mode')
            .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:mm format')
            .test('time-after-start', 'End time must be after start time', function (value) {
                const { startTime } = this.parent;
                if (!value || !startTime) return true;
                return moment(value, 'HH:mm').isAfter(moment(startTime, 'HH:mm'));
            }),
        otherwise: (schema) => schema.notRequired(),
    }),

    facultyId: Yup.string().when('examMode', {
        is: ExamMode.PROCTORING,
        then: (schema) => schema.required('Faculty is required for proctoring mode'),
        otherwise: (schema) => schema.notRequired(),
    }),

    // AUTO mode fields
    examStartDate: Yup.string().when('examMode', {
        is: ExamMode.AUTO,
        then: (schema) => schema
            .required('Exam start date is required for auto mode')
            .test('valid-date', 'Exam start date must be today or in the future', (value) => {
                if (!value) return false;
                return moment(value).isSameOrAfter(moment().startOf('day'));
            }),
        otherwise: (schema) => schema.notRequired(),
    }),

    examEndDate: Yup.string().when('examMode', {
        is: ExamMode.AUTO,
        then: (schema) => schema
            .required('Exam end date is required for auto mode')
            .test('date-after-start', 'End date must be after start date', function (value) {
                const { examStartDate } = this.parent;
                if (!value || !examStartDate) return true;
                return moment(value).isAfter(moment(examStartDate));
            }),
        otherwise: (schema) => schema.notRequired(),
    }),

    // Student IDs validation
    studentIds: Yup.array().when('examMode', {
        is: ExamMode.PROCTORING,
        then: (schema) => schema
            .of(Yup.string().required())
            .min(5, 'Exactly 5 students are required for proctoring mode')
            .max(5, 'Exactly 5 students are required for proctoring mode')
            .required('Students are required for proctoring mode'),
        otherwise: (schema) => schema
            .of(Yup.string().required())
            .notRequired(),
    }),
});