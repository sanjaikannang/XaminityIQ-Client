import * as Yup from 'yup';
import { Gender, EducationLevel, Qualification, BoardType } from '../../../../utils/enum';
import { addressSchema, emergencyContactSchema, phoneValidator } from '../../../../common/form-sections/shared.schema';

const educationHistorySchema = Yup.object({
    level: Yup.string().oneOf(Object.values(EducationLevel)).required('Level is required'),
    qualification: Yup.string().oneOf(Object.values(Qualification)).required('Qualification is required'),
    boardOrUniversity: Yup.string().oneOf(Object.values(BoardType)).required('Board/University is required'),
    institutionName: Yup.string().required('Institution name is required').max(100),
    yearOfPassing: Yup.number().typeError('Must be a number').required('Year of passing is required'),
    percentageOrCGPA: Yup.number().typeError('Must be a number').required('Percentage/CGPA is required'),
});

const parentInfoSchema = Yup.object({
    name: Yup.string().max(50),
    phoneNumber: phoneValidator,
    email: Yup.string().email('Must be a valid email'),
    occupation: Yup.string().max(50),
});

const guardianInfoSchema = parentInfoSchema.shape({
    relation: Yup.string(),
});

export const editStudentValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').max(30),
    lastName: Yup.string().required('Last name is required').max(30),
    gender: Yup.string().oneOf(Object.values(Gender)).required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
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

    father: parentInfoSchema.notRequired(),
    mother: parentInfoSchema.notRequired(),
    guardian: guardianInfoSchema.notRequired(),

    educationHistory: Yup.array().of(educationHistorySchema).min(1, 'At least one education record is required'),
});
