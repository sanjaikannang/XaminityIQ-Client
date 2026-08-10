import { SubjectData } from "./subjects-types";

// Base Types
export interface PaginationMeta {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface BaseApiResponse<T> {
    success: boolean;
    message: string;
    data?: T[];
    pagination?: PaginationMeta;
}

export interface BasePaginationParams {
    page?: number;
    limit?: number;
    search?: string;
}

export interface GetAllFacultyParams extends BasePaginationParams {
    departmentId?: string;
    designation?: string;
    employmentType?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Faculty List Types
export interface FacultyPersonalData {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    profilePhotoUrl: string;
}

export interface FacultyContactData {
    personalEmail: string;
    facultyEmail: string;
    phoneNumber: string;
}

export interface FacultyEmploymentData {
    employeeId: string;
    designation: string;
    departmentName: string;
    employmentType: string;
    dateOfJoining: Date;
    status: string;
}

export interface FacultyData {
    id: string;
    facultyId: string;
    personalDetails: FacultyPersonalData;
    contactDetails: FacultyContactData;
    employmentDetails: FacultyEmploymentData;
    isActive: boolean;
}

export type GetAllFacultyResponse = BaseApiResponse<FacultyData>;

// Faculty Detail Types
export interface PersonalDetails {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    maritalStatus: string;
    profilePhotoUrl: string;
    nationality: string;
    religion?: string;
}

export interface EmergencyContact {
    name: string;
    relation: string;
    phoneNumber: string;
}

export interface ContactDetails {
    personalEmail: string;
    facultyEmail: string;
    phoneNumber: string;
    alternatePhoneNumber?: string;
    emergencyContact: EmergencyContact;
}

export interface Address {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

export interface AddressDetails {
    currentAddress: Address;
    sameAsCurrent: boolean;
    permanentAddress?: Address;
}

export interface EmploymentDetails {
    employeeId: string;
    designation: string;
    departmentName: string;
    employmentType: string;
    dateOfJoining: Date;
    dateOfLeaving?: Date;
    totalExperienceYears: number;
    highestQualification: string;
    status: string;
    basicSalary?: number;
    remarks?: string;
}

export interface EducationHistory {
    level: string;
    qualification: string;
    boardOrUniversity: string;
    institutionName: string;
    yearOfPassing: number;
    percentageOrCGPA: number;
    specialization?: string;
}

export interface WorkExperience {
    organization: string;
    role: string;
    department?: string;
    fromDate: string;
    toDate: string;
    experienceYears: number;
    jobDescription?: string;
    reasonForLeaving?: string;
    isCurrent: boolean;
}

export interface FacultyDetailData {
    facultyId: string;
    userId: string;
    personalDetails: PersonalDetails;
    contactDetails: ContactDetails;
    addressDetails: AddressDetails;
    employmentDetails: EmploymentDetails;
    educationHistory: EducationHistory[];
    workExperience: WorkExperience[];
    isActive: boolean;
}

export interface GetFacultyResponse {
    success: boolean;
    message: string;
    data?: FacultyDetailData;
}

// Faculty Self-Profile Types
export interface FacultyProfileData extends FacultyDetailData {
    // Subjects offered in this faculty's department — not personally assigned
    // (subjects aren't modeled per-faculty), reflects the department catalog
    departmentSubjects: SubjectData[];
}

export interface GetMyFacultyProfileResponse {
    success: boolean;
    message: string;
    data?: FacultyProfileData;
}

// Create / Edit Faculty Types
export interface FacultyEducationHistoryInput {
    level: string;
    qualification: string;
    boardOrUniversity: string;
    institutionName: string;
    yearOfPassing: number;
    percentageOrCGPA: number;
    specialization?: string;
}

export interface FacultyWorkExperienceInput {
    organization: string;
    role: string;
    department?: string;
    fromDate: string;
    toDate: string;
    experienceYears: number;
    jobDescription?: string;
    reasonForLeaving?: string;
    isCurrent?: boolean;
}

export interface CreateFacultyRequest {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    maritalStatus: string;
    profilePhotoUrl: string;
    religion?: string;

    personalEmail: string;
    phoneNumber: string;
    alternatePhoneNumber?: string;
    emergencyContact: EmergencyContact;

    currentAddress: Address;
    sameAsCurrent: boolean;
    permanentAddress?: Address;

    employeeId: string;
    designation: string;
    departmentId: string;
    employmentType: string;
    totalExperienceYears: number;
    highestQualification: string;
    remarks?: string;

    educationHistory: FacultyEducationHistoryInput[];
    workExperience?: FacultyWorkExperienceInput[];
}

export interface CreateFacultyResponse {
    success: boolean;
    message: string;
}

export type EditFacultyRequest = Omit<
    CreateFacultyRequest,
    "employeeId" | "designation" | "departmentId" | "employmentType" | "totalExperienceYears" | "highestQualification" | "remarks"
>;

export interface EditFacultyResponse {
    success: boolean;
    message: string;
}

export interface DeleteFacultyResponse {
    success: boolean;
    message: string;
}