import * as Yup from 'yup';
import { QuestionType } from '../../../../utils/enum';

const optionSchema = Yup.object({
    text: Yup.string().required('Option text is required'),
    isCorrect: Yup.boolean(),
});

export const questionValidationSchema = Yup.object({
    type: Yup.string().oneOf(Object.values(QuestionType)).required('Question type is required'),
    text: Yup.string().required('Question text is required'),
    marks: Yup.number()
        .typeError('Must be a number')
        .required('Marks are required')
        .when('type', {
            is: QuestionType.WRITTEN,
            then: (schema) => schema.min(2, 'Written questions must be worth at least 2 marks').max(20, 'Written questions must be worth at most 20 marks'),
            otherwise: (schema) => schema.min(1, 'Marks must be at least 1'),
        }),
    options: Yup.array().when('type', {
        is: (type: string) => type !== QuestionType.WRITTEN,
        then: (schema) => schema
            .of(optionSchema)
            .length(4, 'Exactly 4 options are required')
            .test('has-correct', 'At least 1 option must be marked correct', (options) =>
                (options || []).some((opt: any) => opt.isCorrect))
            .test('mcq-single-correct', 'MCQ must have exactly 1 correct option', function (options) {
                if (this.parent.type !== QuestionType.MCQ) return true;
                return (options || []).filter((opt: any) => opt.isCorrect).length === 1;
            }),
        otherwise: (schema) => schema.notRequired(),
    }),
});
