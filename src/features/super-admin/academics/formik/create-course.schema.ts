import * as Yup from 'yup';

export const createCourseValidationSchema = Yup.object().shape({
    courseId: Yup.string()
        .required('Please select a course')
        .min(1, 'Please select a valid course'),
});