import * as Yup from 'yup';
import { ExamMode } from '../../../Utils/enum';

// Validation schema for buffer time
const bufferTimeSchema = Yup.object({
    beforeExam: Yup.number().min(0, 'Buffer time before exam must be at least 0').optional(),
    afterExam: Yup.number().min(0, 'Buffer time after exam must be at least 0').optional(),
});

// Validation schema for schedule details
const scheduleDetailsSchema = Yup.object({
    // For PROCTORING mode
    examDate: Yup.date().when('$examMode', {
        is: 'PROCTORING',
        then: (schema) => schema.required('Exam date is required for proctoring mode'),
        otherwise: (schema) => schema.optional(),
    }),
    startTime: Yup.string().when('$examMode', {
        is: 'PROCTORING',
        then: (schema) => schema.required('Start time is required for proctoring mode'),
        otherwise: (schema) => schema.optional(),
    }),
    endTime: Yup.string().when('$examMode', {
        is: 'PROCTORING',
        then: (schema) => schema.required('End time is required for proctoring mode'),
        otherwise: (schema) => schema.optional(),
    }),
    // For AUTO mode
    startDate: Yup.date().when('$examMode', {
        is: 'AUTO',
        then: (schema) => schema.required('Start date is required for auto mode'),
        otherwise: (schema) => schema.optional(),
    }),
    endDate: Yup.date().when('$examMode', {
        is: 'AUTO',
        then: (schema) => schema.required('End date is required for auto mode'),
        otherwise: (schema) => schema.optional(),
    }),
    bufferTime: bufferTimeSchema.optional(),
});

// Validation schema for question options (MCQ)
const questionOptionSchema = Yup.object({
    optionText: Yup.string().required('Option text is required'),
    optionImage: Yup.string().optional(),
    isCorrect: Yup.boolean().required('Please specify if this option is correct'),
});

// Validation schema for correct answers (Short/Long answer)
const correctAnswerSchema = Yup.object({
    answerText: Yup.string().required('Answer text is required'),
    keywords: Yup.array().of(Yup.string().required()).min(1, 'At least one keyword is required'),
    marks: Yup.number().min(0, 'Marks must be at least 0').required('Marks are required'),
});

// Validation schema for questions
const questionSchema = Yup.object({
    questionText: Yup.string().required('Question text is required'),
    questionImage: Yup.string().optional(),
    questionType: Yup.string().oneOf(['MCQ', 'SHORT_ANSWER', 'LONG_ANSWER', 'TRUE_FALSE'], 'Invalid question type').required('Question type is required'),
    marks: Yup.number().min(0, 'Marks must be at least 0').required('Marks are required'),
    questionOrder: Yup.number().min(1, 'Question order must be at least 1').required('Question order is required'),
    difficultyLevel: Yup.string().oneOf(['EASY', 'MEDIUM', 'HARD'], 'Invalid difficulty level').required('Difficulty level is required'),
    // For MCQ questions
    options: Yup.array().when('questionType', {
        is: 'MCQ',
        then: (schema) => schema.of(questionOptionSchema).min(2, 'At least 2 options are required for MCQ').required('Options are required for MCQ'),
        otherwise: (schema) => schema.optional(),
    }),
    // For Short/Long answer questions
    correctAnswers: Yup.array().when('questionType', {
        is: (val: string) => val === 'SHORT_ANSWER' || val === 'LONG_ANSWER',
        then: (schema) => schema.of(correctAnswerSchema).min(1, 'At least one correct answer is required').required('Correct answers are required'),
        otherwise: (schema) => schema.optional(),
    }),
    // For True/False questions
    correctAnswer: Yup.boolean().when('questionType', {
        is: 'TRUE_FALSE',
        then: (schema) => schema.required('Correct answer is required for True/False questions'),
        otherwise: (schema) => schema.optional(),
    }),
    explanation: Yup.string().optional(),
});

// Validation schema for exam sections
const examSectionSchema = Yup.object({
    sectionName: Yup.string().required('Section name is required'),
    sectionOrder: Yup.number().min(1, 'Section order must be at least 1').required('Section order is required'),
    sectionMarks: Yup.number().min(1, 'Section marks must be at least 1').required('Section marks are required'),
    questionType: Yup.string().oneOf(['MCQ', 'SHORT_ANSWER', 'LONG_ANSWER', 'TRUE_FALSE'], 'Invalid question type').required('Question type is required'),
    totalQuestions: Yup.number().min(1, 'Total questions must be at least 1').required('Total questions is required'),
    sectionInstructions: Yup.array().of(Yup.string()).optional(),
    timeLimit: Yup.number().min(0, 'Time limit must be at least 0').optional(),
    isOptional: Yup.boolean().optional(),
    questions: Yup.array().of(questionSchema).required('Questions are required'),
});

// Main validation schema for create exam request
export const createExamSchema = Yup.object({
    examStatus: Yup.string().oneOf(['DRAFT', 'PUBLISHED', 'SCHEDULED', 'ACTIVE', 'COMPLETED', 'CANCELLED'], 'Invalid exam status').required('Exam status is required'),
    examTitle: Yup.string().required('Exam title is required'),
    examDescription: Yup.string().optional(),
    subject: Yup.string().required('Subject is required'),
    totalMarks: Yup.number().min(1, 'Total marks must be at least 1').required('Total marks are required'),
    passingMarks: Yup.number().min(0, 'Passing marks must be at least 0').required('Passing marks are required'),
    duration: Yup.number().min(1, 'Duration must be at least 1 minute').required('Duration is required'),
    examMode: Yup.string()  .oneOf(Object.values(ExamMode), 'Invalid exam mode').required('Exam mode is required'),
    generalInstructions: Yup.array().of(Yup.string()).optional(),
    batchId: Yup.string().required('Batch ID is required'),
    courseId: Yup.string().required('Course ID is required'),
    branchId: Yup.string().required('Branch ID is required'),
    sectionIds: Yup.array().of(Yup.string()).optional(),
    scheduleDetails: scheduleDetailsSchema.required('Schedule details are required'),
    assignedFacultyIds: Yup.array().of(Yup.string()).when('examMode', {
        is: 'PROCTORING',
        then: (schema) => schema.min(1, 'At least one faculty must be assigned for proctoring mode'),
        otherwise: (schema) => schema.optional(),
    }),
    examSections: Yup.array().of(examSectionSchema).min(1, 'At least one exam section is required').required('Exam sections are required'),
});

export type CreateExamFormValues = Yup.InferType<typeof createExamSchema>;