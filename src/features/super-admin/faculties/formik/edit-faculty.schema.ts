import * as Yup from 'yup';
import { Gender, MaritalStatus, EducationLevel } from '../../../../utils/enum';
import { addressSchema, emergencyContactSchema, phoneValidator } from '../../../../common/form-sections/shared.schema';

const educationHistorySchema = Yup.object({
    level: Yup.string().oneOf(Object.values(EducationLevel)).required('Level is required'),
    qualification: Yup.string().required('Qualification is required').max(50),
    boardOrUniversity: Yup.string().required('Board/University is required').max(100),
    institutionName: Yup.string().required('Institution name is required').max(100),
    yearOfPassing: Yup.number().typeError('Must be a number').required('Year of passing is required'),
    percentageOrCGPA: Yup.number().typeError('Must be a number').required('Percentage/CGPA is required'),
    specialization: Yup.string().max(100),
});

const workExperienceSchema = Yup.object({
    organization: Yup.string().required('Organization is required').max(100),
    role: Yup.string().required('Role is required').max(50),
    department: Yup.string().max(50),
    fromDate: Yup.string().required('From date is required'),
    toDate: Yup.string().required('To date is required'),
    experienceYears: Yup.number().typeError('Must be a number').required('Experience is required'),
    jobDescription: Yup.string(),
    reasonForLeaving: Yup.string(),
    isCurrent: Yup.boolean(),
});

export const editFacultyValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').max(30),
    lastName: Yup.string().required('Last name is required').max(30),
    gender: Yup.string().oneOf(Object.values(Gender)).required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    maritalStatus: Yup.string().oneOf(Object.values(MaritalStatus)).required('Marital status is required'),
    profilePhotoUrl: Yup.string().required('Profile photo URL is required'),
    religion: Yup.string().max(30),

    personalEmail: Yup.string().email('Must be a valid email').required('Personal email is required'),
    phoneNumber: phoneValidator.required('Phone number is required'),
    alternatePhoneNumber: phoneValidator,
    emergencyContact: emergencyContactSchema,

    currentAddress: addressSchema,
    sameAsCurrent: Yup.boolean(),
    permanentAddress: Yup.object().when('sameAsCurrent', {
        is: false,
        then: () => addressSchema,
        otherwise: (schema) => schema.notRequired(),
    }),

    educationHistory: Yup.array().of(educationHistorySchema).min(1, 'At least one education record is required'),
    workExperience: Yup.array().of(workExperienceSchema),
});
