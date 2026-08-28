import * as Yup from 'yup';
import { Gender, EmploymentType, FacultyDesignation } from '../../../../utils/enum';
import { phoneValidator } from '../../../../common/form-sections/shared.schema';

// Only identity + academic placement are collected at creation time —
// marital status, profile photo, address, emergency contact, experience,
// qualification, education history, and work experience are completed by
// the faculty member themselves later (see CreateFacultyPage.tsx).
export const createFacultyValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').max(30),
    lastName: Yup.string().required('Last name is required').max(30),
    gender: Yup.string().oneOf(Object.values(Gender)).required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    religion: Yup.string().max(30),

    personalEmail: Yup.string().email('Must be a valid email').required('Personal email is required'),
    phoneNumber: phoneValidator.required('Phone number is required'),
    alternatePhoneNumber: phoneValidator,

    employeeId: Yup.string().required('Employee ID is required'),
    designation: Yup.string().oneOf(Object.values(FacultyDesignation)).required('Designation is required'),
    departmentId: Yup.string().required('Department is required'),
    employmentType: Yup.string().oneOf(Object.values(EmploymentType)).required('Employment type is required'),
});
