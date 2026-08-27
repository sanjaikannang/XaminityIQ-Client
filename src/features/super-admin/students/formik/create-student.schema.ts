import * as Yup from 'yup';
import { Gender, AdmissionType, EducationLevel, Qualification, BoardType } from '../../../../utils/enum';
import { phoneValidator } from '../../../../common/form-sections/shared.schema';

// Self-serve fields (address, emergency contact, education history,
// parent/guardian, profile photo — see create-student.request.ts) are all
// optional here: admin can still fill them in up front, but a blank section
// must never block submission — the student completes it later instead.

const educationHistorySchema = Yup.object({
    level: Yup.string().oneOf(Object.values(EducationLevel)),
    qualification: Yup.string().oneOf(Object.values(Qualification)),
    boardOrUniversity: Yup.string().oneOf(Object.values(BoardType)),
    institutionName: Yup.string().max(100),
    yearOfPassing: Yup.number().typeError('Must be a number'),
    percentageOrCGPA: Yup.number().typeError('Must be a number'),
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

const leniantAddressSchema = Yup.object({
    addressLine1: Yup.string(),
    addressLine2: Yup.string(),
    city: Yup.string(),
    state: Yup.string(),
    pincode: Yup.string().matches(/^\d{6}$/, { message: 'Pincode must be a 6-digit number', excludeEmptyString: true }),
});

const leniantEmergencyContactSchema = Yup.object({
    name: Yup.string().max(50),
    relation: Yup.string(),
    phoneNumber: phoneValidator,
});

export const createStudentValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').max(30),
    lastName: Yup.string().required('Last name is required').max(30),
    gender: Yup.string().oneOf(Object.values(Gender)).required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    profilePhotoUrl: Yup.string(),
    religion: Yup.string().max(30),

    personalEmail: Yup.string().email('Must be a valid email').required('Personal email is required'),
    phoneNumber: phoneValidator.required('Phone number is required'),
    alternatePhoneNumber: phoneValidator,
    emergencyContact: leniantEmergencyContactSchema,

    currentAddress: leniantAddressSchema,
    sameAsCurrent: Yup.boolean(),
    permanentAddress: leniantAddressSchema,

    batchId: Yup.string().required('Batch is required'),
    courseId: Yup.string().required('Course is required'),
    departmentId: Yup.string().required('Department is required'),
    currentSemester: Yup.number().typeError('Must be a number').required('Current semester is required').min(1),
    admissionType: Yup.string().oneOf(Object.values(AdmissionType)).required('Admission type is required'),

    father: parentInfoSchema.notRequired(),
    mother: parentInfoSchema.notRequired(),
    guardian: guardianInfoSchema.notRequired(),

    educationHistory: Yup.array().of(educationHistorySchema),
});
