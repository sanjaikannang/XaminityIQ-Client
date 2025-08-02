import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminState, FacultyResponse, PaginationInfo, StudentResponse } from '../../Types/admin.types';

const initialState: AdminState = {
    faculty: [],
    facultyPagination: null,
    selectedFaculty: null,

    students: [],
    studentPagination: null,
    selectedStudent: null,

    isLoading: false,
    isFacultyLoading: false,
    isStudentLoading: false,

    error: null,
    facultyError: null,
    studentError: null,

    successMessage: null,
};

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        // General loading and error actions
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action: PayloadAction<string>) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
            state.facultyError = null;
            state.studentError = null;
        },
        setSuccessMessage: (state, action: PayloadAction<string>) => {
            state.successMessage = action.payload;
        },
        clearSuccessMessage: (state) => {
            state.successMessage = null;
        },

        // Faculty actions
        setFacultyLoading: (state, action: PayloadAction<boolean>) => {
            state.isFacultyLoading = action.payload;
        },
        setFacultyError: (state, action: PayloadAction<string>) => {
            state.facultyError = action.payload;
            state.isFacultyLoading = false;
        },
        setAllFaculty: (state, action: PayloadAction<{ faculty: FacultyResponse[], pagination: PaginationInfo }>) => {
            state.faculty = action.payload.faculty;
            state.facultyPagination = action.payload.pagination;
            state.isFacultyLoading = false;
            state.facultyError = null;
        },
        setSelectedFaculty: (state, action: PayloadAction<FacultyResponse>) => {
            state.selectedFaculty = action.payload;
            state.isFacultyLoading = false;
            state.facultyError = null;
        },
        addFaculty: (state, action: PayloadAction<FacultyResponse>) => {
            state.faculty.unshift(action.payload);
            state.isLoading = false;
            state.error = null;
        },
        removeFaculty: (state, action: PayloadAction<string>) => {
            state.faculty = state.faculty.filter(faculty => faculty._id !== action.payload);
            if (state.selectedFaculty?._id === action.payload) {
                state.selectedFaculty = null;
            }
            state.isLoading = false;
            state.error = null;
        },
        clearSelectedFaculty: (state) => {
            state.selectedFaculty = null;
        },

        // Student actions
        setStudentLoading: (state, action: PayloadAction<boolean>) => {
            state.isStudentLoading = action.payload;
        },
        setStudentError: (state, action: PayloadAction<string>) => {
            state.studentError = action.payload;
            state.isStudentLoading = false;
        },
        setAllStudents: (state, action: PayloadAction<{ students: StudentResponse[], pagination: PaginationInfo }>) => {
            state.students = action.payload.students;
            state.studentPagination = action.payload.pagination;
            state.isStudentLoading = false;
            state.studentError = null;
        },
        setSelectedStudent: (state, action: PayloadAction<StudentResponse>) => {
            state.selectedStudent = action.payload;
            state.isStudentLoading = false;
            state.studentError = null;
        },
        addStudent: (state, action: PayloadAction<StudentResponse>) => {
            state.students.unshift(action.payload);
            state.isLoading = false;
            state.error = null;
        },
        removeStudent: (state, action: PayloadAction<string>) => {
            state.students = state.students.filter(student => student._id !== action.payload);
            if (state.selectedStudent?._id === action.payload) {
                state.selectedStudent = null;
            }
            state.isLoading = false;
            state.error = null;
        },
        clearSelectedStudent: (state) => {
            state.selectedStudent = null;
        },

        // Reset actions
        resetAdminState: () => {
            return initialState;
        },
    }
});

export const {
    setLoading,
    setError,
    clearError,
    setSuccessMessage,
    clearSuccessMessage,

    setFacultyLoading,
    setFacultyError,
    setAllFaculty,
    setSelectedFaculty,
    addFaculty,
    removeFaculty,
    clearSelectedFaculty,

    setStudentLoading,
    setStudentError,
    setAllStudents,
    setSelectedStudent,
    addStudent,
    removeStudent,
    clearSelectedStudent,

    resetAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;