import * as Yup from 'yup';

export const createStudentValidationSchema = Yup.object({
    // Personal Information
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
    rollNumber: Yup.string()
        .required('Roll number is required')
        .min(3, 'Roll number must be at least 3 characters'),
    firstName: Yup.string()
        .required('First name is required')
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name cannot exceed 50 characters'),
    lastName: Yup.string()
        .required('Last name is required')
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name cannot exceed 50 characters'),
    dateOfBirth: Yup.date()
        .required('Date of birth is required')
        .max(new Date(), 'Date of birth cannot be in the future'),
    gender: Yup.string()
        .required('Gender is required'),
    nationality: Yup.string()
        .required('Nationality is required'),
    religion: Yup.string()
        .required('Religion is required'),
    photo: Yup.string()
        .url('Please enter a valid photo URL')
        .required('Photo is required'),
    phoneNumber: Yup.string()
        .required('Phone number is required')
        .matches(/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),

    // Current Address
    currentStreet: Yup.string()
        .required('Current street address is required'),
    currentCity: Yup.string()
        .required('Current city is required'),
    currentState: Yup.string()
        .required('Current state is required'),
    currentZipCode: Yup.string()
        .required('Current zip code is required')
        .matches(/^[\d\-\s]{3,10}$/, 'Please enter a valid zip code'),
    currentCountry: Yup.string()
        .required('Current country is required'),

    // Permanent Address (assuming the duplicate was meant for permanent address)
    permanentStreet: Yup.string()
        .required('Permanent street address is required'),
    permanentCity: Yup.string()
        .required('Permanent city is required'),
    permanentState: Yup.string()
        .required('Permanent state is required'),
    permanentZipCode: Yup.string()
        .required('Permanent zip code is required')
        .matches(/^[\d\-\s]{3,10}$/, 'Please enter a valid zip code'),
    permanentCountry: Yup.string()
        .required('Permanent country is required'),

    // Father's Information
    fatherName: Yup.string()
        .required('Father\'s name is required')
        .min(2, 'Father\'s name must be at least 2 characters'),
    fatherOccupation: Yup.string()
        .required('Father\'s occupation is required'),
    fatherPhone: Yup.string()
        .required('Father\'s phone number is required')
        .matches(/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),
    fatherEmail: Yup.string()
        .email('Please enter a valid email address')
        .required('Father\'s email is required'),

    // Mother's Information
    motherName: Yup.string()
        .required('Mother\'s name is required')
        .min(2, 'Mother\'s name must be at least 2 characters'),
    motherOccupation: Yup.string()
        .required('Mother\'s occupation is required'),
    motherPhone: Yup.string()
        .required('Mother\'s phone number is required')
        .matches(/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),
    motherEmail: Yup.string()
        .email('Please enter a valid email address')
        .required('Mother\'s email is required'),

    // Guardian Information (optional if parents are available)
    guardianName: Yup.string()
        .required('Guardian\'s name is required')
        .min(2, 'Guardian\'s name must be at least 2 characters'),
    guardianRelationship: Yup.string()
        .required('Guardian\'s Relationship is required'),
    guardianPhone: Yup.string()
        .required('Guardian\'s phone number is required')
        .matches(/^[+]?[\d\s\-\(\)]{10,15}$/, 'Please enter a valid phone number'),
    guardianEmail: Yup.string()
        .email('Please enter a valid email address')
        .required('Guardian\'s email is required'),

    // Academic Information
    course: Yup.string()
        .required('Course is required'),
    branch: Yup.string()
        .required('Branch is required'),
    semester: Yup.number()
        .required('Semester is required')
        .min(1, 'Semester must be at least 1')
        .max(10, 'Semester cannot exceed 10')
        .integer('Semester must be a whole number'),
    section: Yup.string()
        .required('Section is required'),
    batchStartYear: Yup.string()
        .required('Batch start year is required'),
    batchEndYear: Yup.string()
        .required('Batch end year is required')
        .test('end-after-start', 'End year must be after start year', function (value) {
            return value > this.parent.batchStartYear;
        }),
    admissionYear: Yup.string()
        .required('Admission year is required'),
    expectedGraduationYear: Yup.string()
        .required('Expected graduation year is required')
});