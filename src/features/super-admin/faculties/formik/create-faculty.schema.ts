import * as Yup from 'yup';
import { Gender, EmploymentType, FacultyDesignation, EducationLevel } from '../../../../utils/enum';
import { phoneValidator } from '../../../../common/form-sections/shared.schema';

// Self-serve fields (marital status, profile photo, address, emergency
// contact, total experience, highest qualification, education history, work
// experience — see create-faculty.request.ts) are all optional here: admin
// can still fill them in up front, but a blank section must never block
// submission — the faculty member completes it later instead.

const educationHistorySchema = Yup.object({
    level: Yup.string().oneOf(Object.values(EducationLevel)),
    qualification: Yup.string().max(50),
    boardOrUniversity: Yup.string().max(100),
    institutionName: Yup.string().max(100),
    yearOfPassing: Yup.number().typeError('Must be a number'),
    percentageOrCGPA: Yup.number().typeError('Must be a number'),
    specialization: Yup.string().max(100),
});

const workExperienceSchema = Yup.object({
    organization: Yup.string().max(100),
    role: Yup.string().max(50),
    department: Yup.string().max(50),
    fromDate: Yup.string(),
    toDate: Yup.string(),
    experienceYears: Yup.number().typeError('Must be a number'),
    jobDescription: Yup.string(),
    reasonForLeaving: Yup.string(),
    isCurrent: Yup.boolean(),
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

export const createFacultyValidationSchema = Yup.object({
    firstName: Yup.string().required('First name is required').max(30),
    lastName: Yup.string().required('Last name is required').max(30),
    gender: Yup.string().oneOf(Object.values(Gender)).required('Gender is required'),
    dateOfBirth: Yup.string().required('Date of birth is required'),
    maritalStatus: Yup.string(),
    profilePhotoUrl: Yup.string(),
    religion: Yup.string().max(30),

    personalEmail: Yup.string().email('Must be a valid email').required('Personal email is required'),
    phoneNumber: phoneValidator.required('Phone number is required'),
    alternatePhoneNumber: phoneValidator,
    emergencyContact: leniantEmergencyContactSchema,

    currentAddress: leniantAddressSchema,
    sameAsCurrent: Yup.boolean(),
    permanentAddress: leniantAddressSchema,

    employeeId: Yup.string().required('Employee ID is required'),
    designation: Yup.string().oneOf(Object.values(FacultyDesignation)).required('Designation is required'),
    departmentId: Yup.string().required('Department is required'),
    employmentType: Yup.string().oneOf(Object.values(EmploymentType)).required('Employment type is required'),
    totalExperienceYears: Yup.number().typeError('Must be a number').min(0),
    highestQualification: Yup.string(),
    remarks: Yup.string(),

    educationHistory: Yup.array().of(educationHistorySchema),
    workExperience: Yup.array().of(workExperienceSchema),
});
