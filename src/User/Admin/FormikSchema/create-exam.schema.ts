import * as Yup from 'yup';
import { DifficultyLevel, ExamMode, ExamStatus, QuestionType } from '../../../Utils/enum';

// Buffer Time Validation Schema
const bufferTimeSchema = Yup.object({
    beforeExam: Yup.number().min(0, 'Buffer time before exam must be 0 or more').optional(),
    afterExam: Yup.number().min(0, 'Buffer time after exam must be 0 or more').optional(),
});

// Schedule Details Validation Schema
const scheduleDetailsSchema = Yup.object({
    examDate: Yup.string().when('$examMode', {
        is: ExamMode.PROCTORING,
        then: () => Yup.string().required('Exam date is required for proctoring mode'),
        otherwise: () => Yup.string().optional(),
    }),
    startTime: Yup.string().when('$examMode', {
        is: ExamMode.PROCTORING,
        then: () => Yup.string().required('Start time is required for proctoring mode'),
        otherwise: () => Yup.string().optional(),
    }),
    endTime: Yup.string().when('$examMode', {
        is: ExamMode.PROCTORING,
        then: () => Yup.string().required('End time is required for proctoring mode'),
        otherwise: () => Yup.string().optional(),
    }),
    startDate: Yup.string().when('$examMode', {
        is: ExamMode.AUTO,
        then: () => Yup.string().required('Start date is required for auto mode'),
        otherwise: () => Yup.string().optional(),
    }),
    endDate: Yup.string().when('$examMode', {
        is: ExamMode.AUTO,
        then: () => Yup.string().required('End date is required for auto mode'),
        otherwise: () => Yup.string().optional(),
    }),
    bufferTime: bufferTimeSchema.optional(),
});

// Question Option Validation Schema
const questionOptionSchema = Yup.object({
    optionText: Yup.string().required('Option text is required'),
    optionImage: Yup.string().optional(),
    isCorrect: Yup.boolean().required('Option correctness is required'),
});

// Correct Answer Validation Schema
const correctAnswerSchema = Yup.object({
    answerText: Yup.string().required('Answer text is required'),
    keywords: Yup.array()
        .of(Yup.string().required('Keyword cannot be empty'))
        .min(1, 'At least one keyword is required'),
    marks: Yup.number().min(0, 'Marks must be 0 or more').required('Marks are required'),
});

// Question Validation Schema
const questionSchema = Yup.object({
    questionText: Yup.string().required('Question text is required'),
    questionImage: Yup.string().optional(),
    questionType: Yup.string()
        .oneOf(Object.values(QuestionType), 'Invalid question type')
        .required('Question type is required'),
    marks: Yup.number().min(0, 'Marks must be 0 or more').required('Marks are required'),
    questionOrder: Yup.number().min(1, 'Question order must be 1 or more').required('Question order is required'),
    difficultyLevel: Yup.string()
        .oneOf(Object.values(DifficultyLevel), 'Invalid difficulty level')
        .required('Difficulty level is required'),

    // Conditional validation for MCQ questions
    options: Yup.array().when('questionType', {
        is: QuestionType.MCQ,
        then: () => Yup.array()
            .of(questionOptionSchema)
            .min(2, 'MCQ questions must have at least 2 options')
            .test('at-least-one-correct', 'At least one option must be correct', (value) => {
                return value && value.some((option: any) => option.isCorrect);
            })
            .required('Options are required for MCQ questions'),
        otherwise: () => Yup.array().optional(),
    }),

    // Conditional validation for Short/Long answer questions
    correctAnswers: Yup.array().when('questionType', {
        is: (value: string) => [QuestionType.SHORT_ANSWER, QuestionType.LONG_ANSWER].includes(value as QuestionType),
        then: () => Yup.array()
            .of(correctAnswerSchema)
            .min(1, 'At least one correct answer is required')
            .required('Correct answers are required'),
        otherwise: () => Yup.array().optional(),
    }),

    // Conditional validation for True/False questions
    correctAnswer: Yup.boolean().when('questionType', {
        is: QuestionType.TRUE_FALSE,
        then: () => Yup.boolean().required('Correct answer is required for True/False questions'),
        otherwise: () => Yup.boolean().optional(),
    }),

    explanation: Yup.string().optional(),
});

// Exam Section Validation Schema
const examSectionSchema = Yup.object({
    sectionName: Yup.string().required('Section name is required'),
    sectionOrder: Yup.number().min(1, 'Section order must be 1 or more').required('Section order is required'),
    sectionMarks: Yup.number().min(1, 'Section marks must be 1 or more').required('Section marks are required'),
    questionType: Yup.string()
        .oneOf(Object.values(QuestionType), 'Invalid question type')
        .required('Question type is required'),
    totalQuestions: Yup.number().min(1, 'Total questions must be 1 or more').required('Total questions are required'),
    sectionInstructions: Yup.array().of(Yup.string()).optional(),
    timeLimit: Yup.number().min(0, 'Time limit must be 0 or more').optional(),
    isOptional: Yup.boolean().optional(),
    questions: Yup.array()
        .of(questionSchema)
        .min(1, 'At least one question is required per section')
        .test('questions-count-match', 'Number of questions must match total questions count', function (value) {
            const { totalQuestions } = this.parent;
            return value && value.length === totalQuestions;
        })
        .required('Questions are required'),
});

// Main Exam Validation Schema
export const createExamValidationSchema = Yup.object({
    examStatus: Yup.string()
        .oneOf(Object.values(ExamStatus), 'Invalid exam status')
        .required('Exam status is required'),

    // Basic Exam Info
    examTitle: Yup.string()
        .min(3, 'Exam title must be at least 3 characters')
        .max(100, 'Exam title cannot exceed 100 characters')
        .required('Exam title is required'),

    examDescription: Yup.string()
        .max(500, 'Exam description cannot exceed 500 characters')
        .optional(),

    subject: Yup.string()
        .min(2, 'Subject must be at least 2 characters')
        .required('Subject is required'),

    totalMarks: Yup.number()
        .min(1, 'Total marks must be at least 1')
        .required('Total marks are required'),

    passingMarks: Yup.number()
        .min(0, 'Passing marks cannot be negative')
        .test('passing-marks-validation', 'Passing marks cannot exceed total marks', function (value) {
            const { totalMarks } = this.parent;
            return value !== undefined && totalMarks !== undefined ? value <= totalMarks : true;
        })
        .required('Passing marks are required'),

    duration: Yup.number()
        .min(1, 'Duration must be at least 1 minute')
        .required('Duration is required'),

    examMode: Yup.string()
        .oneOf(Object.values(ExamMode), 'Invalid exam mode')
        .required('Exam mode is required'),

    generalInstructions: Yup.array().of(Yup.string()).optional(),

    // Target Audience
    batchId: Yup.string().required('Batch is required'),
    courseId: Yup.string().required('Course is required'),
    branchId: Yup.string().required('Branch is required'),
    sectionIds: Yup.array().of(Yup.string()).optional(),

    // Schedule Details
    scheduleDetails: scheduleDetailsSchema.required('Schedule details are required'),

    // Faculty Assignment
    assignedFacultyIds: Yup.array().of(Yup.string()).optional(),

    // Exam Sections
    examSections: Yup.array()
        .of(examSectionSchema)
        .min(1, 'At least one exam section is required')
        .test('total-marks-match', 'Sum of section marks must equal total marks', function (value) {
            const { totalMarks } = this.parent;
            if (value && totalMarks) {
                const sectionMarksSum = value.reduce((sum: number, section: any) => sum + (section.sectionMarks || 0), 0);
                return sectionMarksSum === totalMarks;
            }
            return true;
        })
        .test('unique-section-order', 'Section orders must be unique', function (value) {
            if (value) {
                const orders = value.map((section: any) => section.sectionOrder);
                return orders.length === new Set(orders).size;
            }
            return true;
        })
        .required('Exam sections are required'),
});

// Step-wise validation schemas
export const examInfoValidationSchema = Yup.object({
    examStatus: Yup.string()
        .oneOf(Object.values(ExamStatus), 'Invalid exam status')
        .required('Exam status is required'),
    examTitle: Yup.string()
        .min(3, 'Exam title must be at least 3 characters')
        .max(100, 'Exam title cannot exceed 100 characters')
        .required('Exam title is required'),
    examDescription: Yup.string()
        .max(500, 'Exam description cannot exceed 500 characters')
        .optional(),
    subject: Yup.string()
        .min(2, 'Subject must be at least 2 characters')
        .required('Subject is required'),
    totalMarks: Yup.number()
        .min(1, 'Total marks must be at least 1')
        .required('Total marks are required'),
    passingMarks: Yup.number()
        .min(0, 'Passing marks cannot be negative')
        .test('passing-marks-validation', 'Passing marks cannot exceed total marks', function (value) {
            const { totalMarks } = this.parent;
            return value !== undefined && totalMarks !== undefined ? value <= totalMarks : true;
        })
        .required('Passing marks are required'),
    duration: Yup.number()
        .min(1, 'Duration must be at least 1 minute')
        .required('Duration is required'),
    examMode: Yup.string()
        .oneOf(Object.values(ExamMode), 'Invalid exam mode')
        .required('Exam mode is required'),
    generalInstructions: Yup.array().of(Yup.string()).optional(),
});

export const examAssignmentValidationSchema = Yup.object({
    batchId: Yup.string().required('Batch is required'),
    courseId: Yup.string().required('Course is required'),
    branchId: Yup.string().required('Branch is required'),
    sectionIds: Yup.array().of(Yup.string()).optional(),
    assignedFacultyIds: Yup.array().of(Yup.string()).optional(),
});

export const scheduleValidationSchema = scheduleDetailsSchema;