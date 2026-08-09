import * as Yup from 'yup';
import { SubjectType } from '../../../../utils/enum';

export const subjectValidationSchema = Yup.object({
    subjectCode: Yup.string().required('Subject code is required').max(20),
    subjectName: Yup.string().required('Subject name is required').max(100),
    semester: Yup.number().typeError('Must be a number').required('Semester is required').min(1),
    credits: Yup.number().typeError('Must be a number').required('Credits are required').min(1),
    subjectType: Yup.string().oneOf(Object.values(SubjectType)).required('Subject type is required'),
    description: Yup.string().max(500),
});
