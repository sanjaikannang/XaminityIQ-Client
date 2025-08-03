import { Gender, MaritalStatus } from "../Utils/enum";

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
}

export interface UserInfo {
    _id: string;
    email: string;
    role: string;
    isActive: boolean;
    isEmailVerified: boolean;
    lastLogin?: Date;
    createdAt: Date;
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

// Faculty Types
export interface PersonalInfo {
    photo?: string;
    firstName: string;
    lastName: string;
    dateOfBirth?: Date;
    gender?: Gender;
    nationality?: string;
    religion?: string;
    maritalStatus?: MaritalStatus;
}

export interface ContactInfo {
    phone: string;
    permanentAddress?: Address;
    currentAddress?: Address;
}

export interface Qualification {
    degree?: string;
    institution?: string;
    year?: number;
    percentage?: number;
}

export interface PreviousInstitution {
    institutionName?: string;
    designation?: string;
    duration?: string;
    from?: Date;
    to?: Date;
}

export interface Experience {
    totalYears?: number;
    previousInstitutions?: PreviousInstitution[];
}

export interface ProfessionalInfo {
    employeeId?: string;
    department: string;
    designation: string;
    qualification?: Qualification[];
    experience?: Experience;
}

export interface FacultyResponse {
    _id: string;
    userId: UserInfo;
    facultyId: string;
    personalInfo: PersonalInfo;
    contactInfo: ContactInfo;
    professionalInfo: ProfessionalInfo;
    joiningDate: Date;
    status: string;
}

// Student Types
export interface StudentPersonalInfo {
    photo?: string;
    firstName: string;
    lastName: string;
    dateOfBirth: Date;
    gender: Gender;
    nationality?: string;
    religion?: string;
}

export interface StudentAddress {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country?: string;
}

export interface StudentContactInfo {
    phone?: string;
    permanentAddress: StudentAddress;
    currentAddress?: StudentAddress;
}

export interface ParentInfo {
    name: string;
    occupation?: string;
    phone?: string;
    email?: string;
}

export interface GuardianInfo {
    name?: string;
    relationship?: string;
    phone?: string;
    email?: string;
    occupation?: string;
}

export interface FamilyInfo {
    father: ParentInfo;
    mother: ParentInfo;
    guardian?: GuardianInfo;
}

export interface AcademicInfo {
    course: string;
    branch: string;
    semester: number;
    section?: string;
    batch: string;
    admissionYear: number;
    expectedGraduationYear?: number;
}

export interface StudentResponse {
    _id: string;
    userId: UserInfo;
    studentId: string;
    rollNumber: string;
    personalInfo: StudentPersonalInfo;
    contactInfo: StudentContactInfo;
    familyInfo: FamilyInfo;
    academicInfo: AcademicInfo;
    status: string;
}

// Request Types
export interface CreateFacultyRequest {
    email: string;
    personalInfo: PersonalInfo;
    contactInfo: ContactInfo;
    professionalInfo: ProfessionalInfo;
}

export interface CreateStudentRequest {
    email: string;
    rollNumber: string;
    personalInfo: StudentPersonalInfo;
    contactInfo: StudentContactInfo;
    familyInfo: FamilyInfo;
    academicInfo: AcademicInfo;
}

export interface GetAllFacultyRequest {
    page?: number;
    limit?: number;
}

export interface GetAllStudentRequest {
    page?: number;
    limit?: number;
}

export interface GetFacultyRequest {
    id: string;
}

export interface GetStudentRequest {
    id: string;
}

export interface DeleteFacultyRequest {
    id: string;
}

export interface DeleteStudentRequest {
    id: string;
}

// Response Types
export interface CreateFacultyResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            id: string;
            email: string;
            role: string;
        };
        faculty: {
            id: string;
            facultyId: string;
            personalInfo: any;
            contactInfo: any;
            professionalInfo: any;
        };
        defaultPassword: string;
    };
}

export interface CreateStudentResponse {
    success: boolean;
    message: string;
    data?: {
        user: {
            id: string;
            email: string;
            role: string;
        };
        student: {
            id: string;
            studentId: string;
            rollNumber: string;
            personalInfo: any;
            contactInfo: any;
            familyInfo: any;
            academicInfo: any;
        };
        defaultPassword: string;
    };
}

export interface GetAllFacultyResponse {
    success: boolean;
    message: string;
    data: {
        faculty: FacultyResponse[];
        pagination: PaginationInfo;
    };
}

export interface GetAllStudentResponse {
    success: boolean;
    message: string;
    data: {
        students: StudentResponse[];
        pagination: PaginationInfo;
    };
}

export interface GetFacultyResponse {
    success: boolean;
    message: string;
    data: {
        faculty: FacultyResponse[];
    };
}

export interface GetStudentResponse {
    success: boolean;
    message: string;
    data: {
        students: StudentResponse[];
    };
}

export interface DeleteFacultyResponse {
    success: boolean;
    message: string;
}

export interface DeleteStudentResponse {
    success: boolean;
    message: string;
}

export interface AdminState {
    // Faculty state
    faculty: FacultyResponse[];
    facultyPagination: PaginationInfo | null;
    selectedFaculty: FacultyResponse | null;

    // Student state
    students: StudentResponse[];
    studentPagination: PaginationInfo | null;
    selectedStudent: StudentResponse | null;

    // Loading states
    isLoading: boolean;
    isFacultyLoading: boolean;
    isStudentLoading: boolean;

    // Error states
    error: string | null;
    facultyError: string | null;
    studentError: string | null;

    // Success messages
    successMessage: string | null;
}