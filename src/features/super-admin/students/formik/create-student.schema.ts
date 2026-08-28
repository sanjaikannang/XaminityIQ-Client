import * as Yup from 'yup';
import { Gender, AdmissionType } from '../../../../utils/enum';
import { phoneValidator } from '../../../../common/form-sections/shared.schema';

// Only identity + academic placement are collected at creation time —
// address, emergency contact, education history, parent/guardian, and
// profile photo are completed by the student themselves later (see
// CreateStudentPage.tsx).
export const createStudentValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').max(30),
    lastName: Yup.string().required('Last name is required').max(30),
    gender: Yup.string().oneOf(Object.values(Gender)).required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    religion: Yup.string().max(30),

    personalEmail: Yup.string().email('Must be a valid email').required('Personal email is required'),
    phoneNumber: phoneValidator.required('Phone number is required'),
    alternatePhoneNumber: phoneValidator,

    batchId: Yup.string().required('Batch is required'),
    courseId: Yup.string().required('Course is required'),
    departmentId: Yup.string().required('Department is required'),
    currentSemester: Yup.number().typeError('Must be a number').required('Current semester is required').min(1),
    admissionType: Yup.string().oneOf(Object.values(AdmissionType)).required('Admission type is required'),
});
