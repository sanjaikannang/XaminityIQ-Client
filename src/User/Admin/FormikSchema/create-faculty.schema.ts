import * as Yup from 'yup';

export const createFacultyValidationSchema = Yup.object({
    // Personal Information
    email: Yup.string()
        .email('Please enter a valid email address')
        .required('Email is required'),
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
    maritalStatus: Yup.string()
        .required('MaritalStatus is required'),
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

    // Professional Information
    employeeId: Yup.string()
        .required('EmployeeId is required')
        .min(3, 'EmployeeId must be at least 3 characters'),
    department: Yup.string()
        .required('Department is required'),
    designation: Yup.string()
        .required('Designation is required'),

    degree: Yup.string()
        .required('Degree is required'),
    institution: Yup.string()
        .required('Institution is required'),
    year: Yup.string()
        .required('Year is required'),
    percentage: Yup.string()
        .required('Percentage is required'),

    totalYears: Yup.string()
        .required('TotalYears is required'),
    institutionName: Yup.string()
        .required('InstitutionName is required'),
    previousDesignation: Yup.string()
        .required('Designation is required'),
    duration: Yup.string()
        .required('Duration is required'),
    from: Yup.string()
        .required('From is required'),
    to: Yup.string()
        .required('To is required'),
});