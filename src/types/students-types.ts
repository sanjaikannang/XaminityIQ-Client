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

export interface GetAllStudentsParams extends BasePaginationParams {
    batchId?: string;
    courseId?: string;
    departmentId?: string;
    sectionId?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

// Student List Types
export interface StudentPersonalData {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    profilePhotoUrl: string;
}

export interface StudentContactData {
    personalEmail: string;
    studentEmail: string;
    phoneNumber: string;
}

export interface StudentAcademicData {
    rollNumber: string;
    batchName: string;
    courseName: string;
    departmentName: string;
    sectionName: string;
    currentSemester: number;
    status: string;
}

export interface StudentsData {
    id: string;
    studentId: string;
    personalDetails: StudentPersonalData;
    contactDetails: StudentContactData;
    academicDetails: StudentAcademicData;
}

export type GetAllStudentsResponse = BaseApiResponse<StudentsData>;

// Student Detail Types
export interface PersonalDetails {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    profilePhotoUrl?: string;
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
    studentEmail: string;
    phoneNumber: string;
    alternatePhoneNumber?: string;
    emergencyContact?: EmergencyContact;
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
    currentAddress?: Address;
    sameAsCurrent: boolean;
    permanentAddress?: Address;
}

export interface AcademicDetails {
    rollNumber: string;
    batchName: string;
    courseName: string;
    departmentName: string;
    sectionName: string;
    currentSemester: number;
    admissionType: string;
    status: string;
}

export interface EducationHistory {
    level: string;
    qualification: string;
    boardOrUniversity: string;
    institutionName: string;
    yearOfPassing: number;
    percentageOrCGPA: number;
    remarks?: string;
}

export interface ParentInfo {
    name?: string;
    phoneNumber?: string;
    email?: string;
    occupation?: string;
}

export interface GuardianInfo {
    name?: string;
    relation?: string;
    phoneNumber?: string;
    email?: string;
    occupation?: string;
}

export interface ParentDetails {
    father?: ParentInfo;
    mother?: ParentInfo;
    guardian?: GuardianInfo;
}

export interface StudentData {
    studentId: string;
    userId: string;
    personalDetails: PersonalDetails;
    contactDetails: ContactDetails;
    addressDetails: AddressDetails;
    academicDetails: AcademicDetails;
    educationHistory: EducationHistory[];
    parentDetails?: ParentDetails;
    profileCompletionPercentage: number;
}

export interface GetStudentResponse {
    success: boolean;
    message: string;
    data?: StudentData;
}

// Student Self-Profile Types
export interface GetMyStudentProfileResponse {
    success: boolean;
    message: string;
    data?: StudentData;
}

// Create / Edit Student Types
export interface EducationHistoryInput {
    level: string;
    qualification: string;
    boardOrUniversity: string;
    institutionName: string;
    yearOfPassing: number;
    percentageOrCGPA: number;
}

export interface ParentInfoInput {
    name?: string;
    phoneNumber?: string;
    email?: string;
    occupation?: string;
}

export interface GuardianInfoInput extends ParentInfoInput {
    relation?: string;
}

export interface CreateStudentRequest {
    firstName: string;
    lastName: string;
    gender: string;
    dateOfBirth: string;
    // Optional at creation — self-serve profile completion
    profilePhotoUrl?: string;
    religion?: string;

    personalEmail: string;
    phoneNumber: string;
    alternatePhoneNumber?: string;
    emergencyContact?: EmergencyContact;

    currentAddress?: Address;
    sameAsCurrent?: boolean;
    permanentAddress?: Address;

    batchId: string;
    courseId: string;
    departmentId: string;
    currentSemester: number;
    admissionType: string;

    father?: ParentInfoInput;
    mother?: ParentInfoInput;
    guardian?: GuardianInfoInput;

    educationHistory?: EducationHistoryInput[];
}

export interface CreateStudentResponse {
    success: boolean;
    message: string;
}

export type EditStudentRequest = Omit<
    CreateStudentRequest,
    "batchId" | "courseId" | "departmentId" | "currentSemester" | "admissionType"
>;

export interface EditStudentResponse {
    success: boolean;
    message: string;
}

export interface DeleteStudentResponse {
    success: boolean;
    message: string;
}

// Self-serve profile completion — same self-serve fields as CreateStudentRequest
export type UpdateMyStudentProfileRequest = Omit<
    CreateStudentRequest,
    "firstName" | "lastName" | "gender" | "dateOfBirth" | "personalEmail" | "phoneNumber" |
    "batchId" | "courseId" | "departmentId" | "currentSemester" | "admissionType"
>;

export interface UpdateMyProfileResponse {
    success: boolean;
    message: string;
}

// Bulk Upload Students (CSV)
export interface StudentUploadResult {
    rowNumber: number;
    studentId?: string;
    studentEmail?: string;
    status: 'success' | 'failed';
    error?: string;
}

export interface BulkUploadStudentsSummary {
    totalRecords: number;
    successCount: number;
    failedCount: number;
    successfulUploads: StudentUploadResult[];
    failedUploads: StudentUploadResult[];
}

export interface BulkUploadStudentsResponse {
    success: boolean;
    message: string;
    summary: BulkUploadStudentsSummary;
}