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


export const scheduleSchema = Yup.object({
    // For PROCTORING mode
    examDate: Yup.string()
        .when('examMode', {
            is: ExamMode.PROCTORING,
            then: (schema) => schema.required('Exam date is required for proctoring mode'),
            otherwise: (schema) => schema.optional()
        }),

    startTime: Yup.string()
        .when('examMode', {
            is: ExamMode.PROCTORING,
            then: (schema) => schema.required('Start time is required for proctoring mode'),
            otherwise: (schema) => schema.optional()
        }),

    endTime: Yup.string()
        .when('examMode', {
            is: ExamMode.PROCTORING,
            then: (schema) => schema
                .required('End time is required for proctoring mode')
                .test('is-after-start', 'End time must be after start time', function (value) {
                    const { startTime } = this.parent;
                    if (!startTime || !value) return true;
                    return value > startTime;
                }),
            otherwise: (schema) => schema.optional()
        }),

    // For AUTO mode
    startDate: Yup.string()
        .when('examMode', {
            is: ExamMode.AUTO,
            then: (schema) => schema.required('Start date is required for auto mode'),
            otherwise: (schema) => schema.optional()
        }),

    endDate: Yup.string()
        .when('examMode', {
            is: ExamMode.AUTO,
            then: (schema) => schema
                .required('End date is required for auto mode')
                .test('is-after-start', 'End date must be after or same as start date', function (value) {
                    const { startDate } = this.parent;
                    if (!startDate || !value) return true;
                    return new Date(value) >= new Date(startDate);
                }),
            otherwise: (schema) => schema.optional()
        }),

    // Buffer times (required for both modes)
    beforeExam: Yup.number()
        .min(0, 'Before exam buffer must be 0 or greater')
        .max(60, 'Before exam buffer cannot exceed 60 minutes')
        .required('Before exam buffer time is required'),

    afterExam: Yup.number()
        .min(0, 'After exam buffer must be 0 or greater')
        .max(60, 'After exam buffer cannot exceed 60 minutes')
        .required('After exam buffer time is required')
});


export const sectionSchema = Yup.object({
    name: Yup.string()
        .min(3, 'Section name must be at least 3 characters')
        .max(50, 'Section name must be less than 50 characters')
        .required('Section name is required'),

    order: Yup.string()
        .min(1, 'Section order is required')
        .required('Section order is required'),

    marks: Yup.number()
        .min(1, 'Section marks must be at least 1')
        .max(100, 'Section marks cannot exceed 100')
        .required('Section marks are required')
        .typeError('Section marks must be a valid number'),

    questionType: Yup.string()
        .oneOf(['MCQ', 'SHORT_ANSWER', 'LONG_ANSWER', 'TRUE_FALSE'], 'Invalid question type')
        .required('Question type is required'),

    totalQuestions: Yup.number()
        .min(1, 'Total questions must be at least 1')
        .max(50, 'Total questions cannot exceed 50')
        .required('Total questions are required')
        .typeError('Total questions must be a valid number'),

    timeLimit: Yup.number()
        .min(0, 'Time limit must be 0 or greater')
        .max(180, 'Time limit cannot exceed 180 minutes')
        .required('Time limit is required')
        .typeError('Time limit must be a valid number'),

    isOptional: Yup.boolean(),

    instructions: Yup.array()
        .of(Yup.string().min(1, 'Instruction cannot be empty'))
        .min(0, 'Instructions are optional')
        .max(10, 'Cannot have more than 10 instructions')
});


export const examStructureSchema = Yup.object({
    sections: Yup.array()
        .of(sectionSchema)
        .min(1, 'At least one section is required')
        .max(5, 'Cannot have more than 5 sections')
        .required('Sections are required')
        .test('unique-names', 'Section names must be unique', function (sections) {
            if (!sections) return true;
            const names = sections.map(section => section.name?.toLowerCase().trim()).filter(Boolean);
            return names.length === new Set(names).size;
        })
        .test('unique-orders', 'Section orders must be unique', function (sections) {
            if (!sections) return true;
            const orders = sections.map(section => section.order?.trim()).filter(Boolean);
            return orders.length === new Set(orders).size;
        })
});


export const optionSchema = Yup.object({
    text: Yup.string()
        .min(1, 'Option text is required')
        .max(200, 'Option text must be less than 200 characters')
        .required('Option text is required'),

    isCorrect: Yup.boolean().required()
});


export const baseQuestionSchema = Yup.object({
    questionText: Yup.string()
        .min(10, 'Question text must be at least 10 characters')
        .max(1000, 'Question text must be less than 1000 characters')
        .required('Question text is required'),

    questionType: Yup.string()
        .oneOf(['MCQ', 'SHORT_ANSWER', 'LONG_ANSWER', 'TRUE_FALSE'], 'Invalid question type')
        .required('Question type is required'),

    marks: Yup.number()
        .min(1, 'Marks must be at least 1')
        .max(20, 'Marks cannot exceed 20')
        .required('Marks are required')
        .typeError('Marks must be a valid number'),

    order: Yup.number()
        .min(1, 'Order must be at least 1')
        .required('Order is required')
        .typeError('Order must be a valid number'),

    difficulty: Yup.string()
        .oneOf(['EASY', 'MEDIUM', 'HARD'], 'Invalid difficulty level')
        .required('Difficulty level is required'),

    explanation: Yup.string()
        .min(10, 'Explanation must be at least 10 characters')
        .max(500, 'Explanation must be less than 500 characters')
        .required('Explanation is required')
});


export const mcqQuestionSchema = baseQuestionSchema.shape({
    options: Yup.array()
        .of(optionSchema)
        .min(2, 'At least 2 options are required')
        .max(4, 'Cannot have more than 4 options')
        .required('Options are required')
        .test('at-least-one-correct', 'At least one option must be marked as correct', function (options) {
            if (!options) return false;
            return options.some(option => option.isCorrect);
        })
        .test('mcq-single-correct', 'Only one option can be correct for MCQ questions', function (options) {
            if (!options) return true;
            const { questionType } = this.parent;
            if (questionType === 'MCQ') {
                const correctCount = options.filter(option => option.isCorrect).length;
                return correctCount === 1;
            }
            return true;
        })
});


export const trueFalseQuestionSchema = baseQuestionSchema.shape({
    options: Yup.array()
        .of(optionSchema)
        .length(2, 'True/False questions must have exactly 2 options')
        .required('Options are required')
        .test('at-least-one-correct', 'At least one option must be marked as correct', function (options) {
            if (!options) return false;
            return options.some(option => option.isCorrect);
        })
});


export const shortAnswerQuestionSchema = baseQuestionSchema.shape({
    sampleAnswer: Yup.string()
        .min(10, 'Sample answer must be at least 10 characters')
        .max(500, 'Sample answer must be less than 500 characters')
        .required('Sample answer is required'),

    keywords: Yup.array()
        .of(Yup.string().min(1, 'Keyword cannot be empty'))
        .min(1, 'At least one keyword is required')
        .max(10, 'Cannot have more than 10 keywords')
        .required('Keywords are required')
});


export const longAnswerQuestionSchema = baseQuestionSchema.shape({
    modelAnswer: Yup.string()
        .min(50, 'Model answer must be at least 50 characters')
        .max(2000, 'Model answer must be less than 2000 characters')
        .required('Model answer is required'),

    minWordCount: Yup.number()
        .min(50, 'Minimum word count must be at least 50')
        .max(1000, 'Minimum word count cannot exceed 1000')
        .required('Minimum word count is required')
        .typeError('Minimum word count must be a valid number'),

    maxWordCount: Yup.number()
        .min(100, 'Maximum word count must be at least 100')
        .max(2000, 'Maximum word count cannot exceed 2000')
        .required('Maximum word count is required')
        .typeError('Maximum word count must be a valid number')
        .test('max-greater-than-min', 'Maximum word count must be greater than minimum', function (value) {
            const { minWordCount } = this.parent;
            if (!minWordCount || !value) return true;
            return value > minWordCount;
        }),

    keywords: Yup.array()
        .of(Yup.string().min(1, 'Keyword cannot be empty'))
        .min(1, 'At least one keyword is required')
        .max(10, 'Cannot have more than 10 keywords')
        .required('Keywords are required')
});


export const questionValidationSchema = Yup.lazy((value) => {
    if (!value || !value.questionType) {
        return baseQuestionSchema;
    }

    switch (value.questionType) {
        case 'MCQ':
            return mcqQuestionSchema;
        case 'TRUE_FALSE':
            return trueFalseQuestionSchema;
        case 'SHORT_ANSWER':
            return shortAnswerQuestionSchema;
        case 'LONG_ANSWER':
            return longAnswerQuestionSchema;
        default:
            return baseQuestionSchema;
    }
});


export const questionsSchema = Yup.object({
    sections: Yup.array()
        .of(
            Yup.object({
                id: Yup.string().required(),
                questions: Yup.array()
                    .of(questionValidationSchema)
                    .required('Questions are required')
                    .test('questions-count-match', 'Number of questions must match section total', function (questions, context) {
                        const sectionData = context.parent;
                        const expectedCount = parseInt(sectionData.totalQuestions) || 0;
                        if (!questions) return expectedCount === 0;
                        return questions.length === expectedCount;
                    })
            })
        )
        .required('Sections with questions are required')
});