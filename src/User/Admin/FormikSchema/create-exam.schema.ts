import * as Yup from 'yup';
import { ExamMode, ExamStatus } from '../../../Utils/enum';

export const formSchema = Yup.object({

    examStatus: Yup.string()
        .oneOf(Object.values(ExamStatus), 'Invalid exam status')
        .required('Exam status is required'),

})


export const examInfoSchema = Yup.object({

    examMode: Yup.string()
        .oneOf(Object.values(ExamMode), 'Invalid exam mode')
        .required('Exam mode is required'),

    examTitle: Yup.string()
        .min(3, 'Exam title must be at least 3 characters')
        .max(100, 'Exam title must be less than 100 characters')
        .required('Exam title is required'),

    subject: Yup.string()
        .min(2, 'Subject must be at least 2 characters')
        .max(50, 'Subject must be less than 50 characters')
        .required('Subject is required'),

    totalMarks: Yup.number()
        .min(1, 'Total marks must be at least 1')
        .max(200, 'Total marks cannot exceed 200')
        .required('Total marks are required'),

    passingMarks: Yup.number()
        .min(1, 'Passing marks must be at least 1')
        .required('Passing marks are required'),

    duration: Yup.number()
        .min(1, 'Duration must be at least 1 minute')
        .max(150, 'Duration cannot exceed 2.5 hours (150 minutes)')
        .required('Duration is required'),

    examDescription: Yup.string()
        .min(10, 'Exam description must be at least 10 characters')
        .max(500, 'Exam description must be less than 500 characters')
        .required('Exam description is required'),

    generalInstructions: Yup.array()
        .of(Yup.string().min(1, 'Instruction cannot be empty'))
        .min(1, 'At least one instruction is required')
        .max(10, 'Cannot have more than 10 instructions')
        .required('General instructions are required')
});


export const examAssignmentSchema = Yup.object({
    batchId: Yup.string()
        .required('Batch selection is required'),

    courseId: Yup.string()
        .required('Course selection is required'),

    branchId: Yup.string()
        .required('Branch selection is required'),

    sectionId: Yup.string()
        .required('Section selection is required'),

    facultyId: Yup.string()
        .when('examMode', {
            is: ExamMode.PROCTORING,
            then: (schema) => schema.required('Faculty selection is required for proctoring mode'),
            otherwise: (schema) => schema.optional()
        })
});

