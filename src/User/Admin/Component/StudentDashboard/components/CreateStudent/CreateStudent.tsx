import { Field, Form, Formik, FormikHelpers } from "formik"
import { BookOpen, Briefcase, Calendar, CalendarCheck, CalendarClock, CalendarRange, Flag, Globe, Hash, Home, Landmark, Layers, LayoutGrid, ListOrdered, Mail, Map, MapPin, Package, Phone, User, UserCheck, Users, VenusAndMars } from "lucide-react"
import { createStudentValidationSchema } from "../../../../FormikSchema/create-student.schema";
import { useDispatch } from "react-redux";
import { CreateStudentRequest } from "../../../../../../Types/admin.types";
import toast from "react-hot-toast";
import { clearError, setError, setLoading } from "../../../../../../State/Slices/adminSlice";
import { createStudent } from "../../../../../../Services/Admin/adminAPI";
import Spinner from "../../../../../../Common/UI/Spinner";
import { Gender } from "../../../../../../Utils/enum";

interface CreateStudentFormValues {
    // Personal Information
    email: string;
    rollNumber: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string; // ISO date string format (YYYY-MM-DD)
    gender: Gender;
    nationality: string;
    religion: string;
    photo: string;
    phoneNumber: string;

    // Current Address
    currentStreet: string;
    currentCity: string;
    currentState: string;
    currentZipCode: string;
    currentCountry: string;

    // Permanent Address
    permanentStreet: string;
    permanentCity: string;
    permanentState: string;
    permanentZipCode: string;
    permanentCountry: string;

    // Father's Information
    fatherName: string;
    fatherOccupation: string;
    fatherPhone: string;
    fatherEmail: string;

    // Mother's Information
    motherName: string;
    motherOccupation: string;
    motherPhone: string;
    motherEmail: string;

    // Guardian Information (optional)
    guardianName: string;
    guardianRelationship: string;
    guardianPhone: string;
    guardianEmail: string;

    // Academic Information
    course: string;
    branch: string;
    semester: number | '';
    section: string;
    batchStartYear: string;
    batchEndYear: string;
    admissionYear: string;
    expectedGraduationYear: string;
}

const CreateStudent = () => {

    const dispatch = useDispatch();

    const initialCreateStudentValues: CreateStudentFormValues = {
        // Personal Information
        email: '',
        rollNumber: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: Gender.MALE,
        nationality: '',
        religion: '',
        photo: '',
        phoneNumber: '',

        // Current Address
        currentStreet: '',
        currentCity: '',
        currentState: '',
        currentZipCode: '',
        currentCountry: '',

        // Permanent Address
        permanentStreet: '',
        permanentCity: '',
        permanentState: '',
        permanentZipCode: '',
        permanentCountry: '',

        // Father's Information
        fatherName: '',
        fatherOccupation: '',
        fatherPhone: '',
        fatherEmail: '',

        // Mother's Information
        motherName: '',
        motherOccupation: '',
        motherPhone: '',
        motherEmail: '',

        // Guardian Information
        guardianName: '',
        guardianRelationship: '',
        guardianPhone: '',
        guardianEmail: '',

        // Academic Information
        course: '',
        branch: '',
        semester: '',
        section: '',
        batchStartYear: '',
        batchEndYear: '',
        admissionYear: '',
        expectedGraduationYear: ''
    };

    const handleCreateStudent = async (
        values: CreateStudentFormValues,
        { setSubmitting, resetForm }: FormikHelpers<CreateStudentFormValues>
    ) => {
        try {
            // Clear any previous errors
            dispatch(clearError());

            // Set loading state
            dispatch(setLoading(true));

            // Transform form values to API request format
            const studentData: CreateStudentRequest = {
                email: values.email,
                rollNumber: values.rollNumber,
                personalInfo: {
                    photo: values.photo,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    dateOfBirth: new Date(values.dateOfBirth),
                    gender: values.gender,
                    nationality: values.nationality,
                    religion: values.religion,
                },
                contactInfo: {
                    phone: values.phoneNumber,
                    permanentAddress: {
                        street: values.permanentStreet,
                        city: values.permanentCity,
                        state: values.permanentState,
                        zipCode: values.permanentZipCode,
                        country: values.permanentCountry,
                    },
                    currentAddress: {
                        street: values.currentStreet,
                        city: values.currentCity,
                        state: values.currentState,
                        zipCode: values.currentZipCode,
                        country: values.currentCountry,
                    }
                },
                familyInfo: {
                    father: {
                        name: values.fatherName,
                        occupation: values.fatherOccupation,
                        phone: values.fatherPhone,
                        email: values.fatherEmail,
                    },
                    mother: {
                        name: values.motherName,
                        occupation: values.motherOccupation,
                        phone: values.motherPhone,
                        email: values.motherEmail,
                    },
                    guardian: {
                        name: values.guardianName,
                        relationship: values.guardianRelationship,
                        phone: values.guardianPhone,
                        email: values.guardianEmail,
                    }
                },
                academicInfo: {
                    course: values.course,
                    branch: values.branch,
                    semester: typeof values.semester === 'number' ? values.semester : parseInt(values.semester as string),
                    section: values.section,
                    batch: `${values.batchStartYear ? values.batchStartYear.split('-')[0] : ''}-${values.batchEndYear ? values.batchEndYear.split('-')[0] : ''}`,
                    admissionYear: values.admissionYear ? parseInt(values.admissionYear.split('-')[0]) : 0,
                    expectedGraduationYear: values.expectedGraduationYear ? parseInt(values.expectedGraduationYear.split('-')[0]) : 0
                }
            };

            // Call the API
            const response = await createStudent(studentData);

            if (response.success) {
                // Show success toast with default password
                toast.success(`${response.message} Default password: ${response.data?.defaultPassword}`);

                // Reset form after successful creation
                resetForm();

            } else {
                toast.error(response.message || 'Failed to create student');
                throw new Error(response.message || 'Student creation failed');
            }
        } catch (error: any) {
            console.error('Create student error:', error);
            const errorMessage = error?.response?.data?.message ||
                error?.message ||
                'An unexpected error occurred';

            toast.error(errorMessage);
            dispatch(setError(errorMessage));
        }
        finally {
            setSubmitting(false);
            dispatch(setLoading(false));
        }
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50 p-4">
                <div className="max-w-9xl mx-auto">
                    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="bg-primary text-whiteColor p-4">
                            <h1 className="text-2xl font-semibold flex items-center">
                                Create Student
                            </h1>
                        </div>

                        <div className="p-4 space-y-8">
                            <Formik
                                initialValues={initialCreateStudentValues}
                                validationSchema={createStudentValidationSchema}
                                onSubmit={handleCreateStudent}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form>
                                        {/* Personal Info */}
                                        <div className="space-y-4 mb-5">
                                            <h2 className="text-xl font-semibold text-gray-800">User Information</h2>
                                            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                <div className="mb-6">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Mail className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="email"
                                                                    name="email"
                                                                    type="email"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter your email"
                                                                />
                                                            </div>
                                                            {errors.email && touched.email && (
                                                                <p className="text-xs text-red-600">{errors.email}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Hash className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="rollNumber"
                                                                    name="rollNumber"
                                                                    type="text"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter your Roll Number"
                                                                />
                                                            </div>
                                                            {errors.rollNumber && touched.rollNumber && (
                                                                <p className="text-xs text-red-600">{errors.rollNumber}</p>
                                                            )}
                                                        </div>

                                                    </div>
                                                </div>


                                                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                                    Personal Info
                                                </h3>
                                                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <User className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="firstName"
                                                                    name="firstName"
                                                                    type="text"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter your First Name"
                                                                />
                                                            </div>
                                                            {errors.firstName && touched.firstName && (
                                                                <p className="text-xs text-red-600">{errors.firstName}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <User className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="lastName"
                                                                    name="lastName"
                                                                    type="text"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter your Last Name"
                                                                />
                                                            </div>
                                                            {errors.lastName && touched.lastName && (
                                                                <p className="text-xs text-red-600">{errors.lastName}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Calendar className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="dateOfBirth"
                                                                    name="dateOfBirth"
                                                                    type="date"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                />
                                                            </div>
                                                            {errors.dateOfBirth && touched.dateOfBirth && (
                                                                <p className="text-xs text-red-600">{errors.dateOfBirth}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Gender<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <VenusAndMars className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    as="select"
                                                                    name="gender"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                                                >
                                                                    <option value="">Select Gender</option>
                                                                    <option value="MALE">Male</option>
                                                                    <option value="FEMALE">Female</option>
                                                                    <option value="OTHER">Other</option>
                                                                </Field>
                                                            </div>
                                                            {errors.gender && touched.gender && (
                                                                <p className="text-xs text-red-600">{errors.gender}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Nationality<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Globe className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="nationality"
                                                                    name="nationality"
                                                                    type="text"
                                                                    placeholder="Enter Nationality"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                />
                                                            </div>
                                                            {errors.nationality && touched.nationality && (
                                                                <p className="text-xs text-red-600">{errors.nationality}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Religion<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Landmark className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="religion"
                                                                    name="religion"
                                                                    type="text"
                                                                    placeholder="Enter Religion"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                />
                                                            </div>
                                                            {errors.religion && touched.religion && (
                                                                <p className="text-xs text-red-600">{errors.religion}</p>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL<span className="text-red-500">*</span></label>
                                                        <Field
                                                            id="photo"
                                                            name="photo"
                                                            type="text"
                                                            placeholder="Photo Link"
                                                            className="w-full py-2 border border-gray-300 rounded-md focus:outline-none"
                                                        />
                                                        {errors.photo && touched.photo && (
                                                            <p className="text-xs text-red-600">{errors.photo}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="space-y-4 mb-5">
                                            <h2 className="text-xl font-semibold text-gray-800">Contact Information</h2>
                                            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                {/* Permanent Address */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="mb-4">
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone number<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Phone className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                id="phoneNumber"
                                                                name="phoneNumber"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Phone Number"
                                                            />
                                                        </div>
                                                        {errors.phoneNumber && touched.phoneNumber && (
                                                            <p className="text-xs text-red-600">{errors.phoneNumber}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-3">
                                                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                                        Permanent Address
                                                    </h3>
                                                    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Street<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Home className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="currentStreet"
                                                                        name="currentStreet"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Street"
                                                                    />
                                                                </div>
                                                                {errors.currentStreet && touched.currentStreet && (
                                                                    <p className="text-xs text-red-600">{errors.currentStreet}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">City<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <MapPin className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="currentCity"
                                                                        name="currentCity"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your City"
                                                                    />
                                                                </div>
                                                                {errors.currentCity && touched.currentCity && (
                                                                    <p className="text-xs text-red-600">{errors.currentCity}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">State<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Map className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="currentState"
                                                                        name="currentState"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your State"
                                                                    />
                                                                </div>
                                                                {errors.currentState && touched.currentState && (
                                                                    <p className="text-xs text-red-600">{errors.currentState}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Package className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="currentZipCode"
                                                                        name="currentZipCode"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Zip Code"
                                                                    />
                                                                </div>
                                                                {errors.currentZipCode && touched.currentZipCode && (
                                                                    <p className="text-xs text-red-600">{errors.currentZipCode}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Country<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Flag className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="currentCountry"
                                                                        name="currentCountry"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Country"
                                                                    />
                                                                </div>
                                                                {errors.currentCountry && touched.currentCountry && (
                                                                    <p className="text-xs text-red-600">{errors.currentCountry}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Current Address */}
                                                <div className="space-y-3">
                                                    <div className="flex justify-between">
                                                        <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                                            Current Address
                                                        </h3>
                                                        <div>
                                                            <button>Same as Permanenet</button>
                                                        </div>
                                                    </div>

                                                    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Street<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Home className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="permanentStreet"
                                                                        name="permanentStreet"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Street"
                                                                    />
                                                                </div>
                                                                {errors.permanentStreet && touched.permanentStreet && (
                                                                    <p className="text-xs text-red-600">{errors.permanentStreet}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">City<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <MapPin className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="permanentCity"
                                                                        name="permanentCity"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your City"
                                                                    />
                                                                </div>
                                                                {errors.permanentCity && touched.permanentCity && (
                                                                    <p className="text-xs text-red-600">{errors.permanentCity}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">State<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Map className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="permanentState"
                                                                        name="permanentState"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your State"
                                                                    />
                                                                </div>
                                                                {errors.permanentState && touched.permanentState && (
                                                                    <p className="text-xs text-red-600">{errors.permanentState}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Zip Code<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Package className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="permanentZipCode"
                                                                        name="permanentZipCode"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Zip Code"
                                                                    />
                                                                </div>
                                                                {errors.permanentZipCode && touched.permanentZipCode && (
                                                                    <p className="text-xs text-red-600">{errors.permanentZipCode}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Country<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Flag className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="permanentCountry"
                                                                        name="permanentCountry"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Country"
                                                                    />
                                                                </div>
                                                                {errors.permanentCountry && touched.permanentCountry && (
                                                                    <p className="text-xs text-red-600">{errors.permanentCountry}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Family Info */}
                                        <div className="space-y-4 mb-5">
                                            <h2 className="text-xl font-semibold text-gray-800">Family Info</h2>
                                            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                {/* Father */}
                                                <div className="space-y-3">
                                                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                                        Father
                                                    </h3>
                                                    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <UserCheck className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="fatherName"
                                                                        name="fatherName"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Name"
                                                                    />
                                                                </div>
                                                                {errors.fatherName && touched.fatherName && (
                                                                    <p className="text-xs text-red-600">{errors.fatherName}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="fatherOccupation"
                                                                        name="fatherOccupation"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Occupation"
                                                                    />
                                                                </div>
                                                                {errors.fatherOccupation && touched.fatherOccupation && (
                                                                    <p className="text-xs text-red-600">{errors.fatherOccupation}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Phone className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="fatherPhone"
                                                                        name="fatherPhone"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Phone"
                                                                    />
                                                                </div>
                                                                {errors.fatherPhone && touched.fatherPhone && (
                                                                    <p className="text-xs text-red-600">{errors.fatherPhone}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Mail className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="fatherEmail"
                                                                        name="fatherEmail"
                                                                        type="email"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Email"
                                                                    />
                                                                </div>
                                                                {errors.fatherEmail && touched.fatherEmail && (
                                                                    <p className="text-xs text-red-600">{errors.fatherEmail}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Mother */}
                                                <div className="space-y-3">
                                                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                                        Mother
                                                    </h3>
                                                    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <UserCheck className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="motherName"
                                                                        name="motherName"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Name"
                                                                    />
                                                                </div>
                                                                {errors.motherName && touched.motherName && (
                                                                    <p className="text-xs text-red-600">{errors.motherName}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Occupation<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Briefcase className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="motherOccupation"
                                                                        name="motherOccupation"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Occupation"
                                                                    />
                                                                </div>
                                                                {errors.motherOccupation && touched.motherOccupation && (
                                                                    <p className="text-xs text-red-600">{errors.motherOccupation}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Phone className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="motherPhone"
                                                                        name="motherPhone"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Phone"
                                                                    />
                                                                </div>
                                                                {errors.motherPhone && touched.motherPhone && (
                                                                    <p className="text-xs text-red-600">{errors.motherPhone}</p>
                                                                )}
                                                            </div>

                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Mail className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="motherEmail"
                                                                        name="motherEmail"
                                                                        type="email"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Email"
                                                                    />
                                                                </div>
                                                                {errors.motherEmail && touched.motherEmail && (
                                                                    <p className="text-xs text-red-600">{errors.motherEmail}</p>
                                                                )}
                                                            </div>

                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Guardian */}
                                                <div className="space-y-3">
                                                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                                        Guardian
                                                    </h3>
                                                    <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Name<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <UserCheck className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="guardianName"
                                                                        name="guardianName"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Name"
                                                                    />
                                                                </div>
                                                                {errors.guardianName && touched.guardianName && (
                                                                    <p className="text-xs text-red-600">{errors.guardianName}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Relationship<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Users className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="guardianRelationship"
                                                                        name="guardianRelationship"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Relationship"
                                                                    />
                                                                </div>
                                                                {errors.guardianRelationship && touched.guardianRelationship && (
                                                                    <p className="text-xs text-red-600">{errors.guardianRelationship}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Phone className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="guardianPhone"
                                                                        name="guardianPhone"
                                                                        type="text"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Phone"
                                                                    />
                                                                </div>
                                                                {errors.guardianPhone && touched.guardianPhone && (
                                                                    <p className="text-xs text-red-600">{errors.guardianPhone}</p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                                                                <div className="relative">
                                                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                        <Mail className="h-5 w-5 text-gray-400" />
                                                                    </div>
                                                                    <Field
                                                                        id="guardianEmail"
                                                                        name="guardianEmail"
                                                                        type="email"
                                                                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                        placeholder="Enter Your Email"
                                                                    />
                                                                </div>
                                                                {errors.guardianEmail && touched.guardianEmail && (
                                                                    <p className="text-xs text-red-600">{errors.guardianEmail}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Academic Info */}
                                        <div className="space-y-4 mb-5">
                                            <h2 className="text-xl font-semibold text-gray-800">Academic Info</h2>
                                            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                <div className="space-y-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Course<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <BookOpen className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="course"
                                                                    name="course"
                                                                    type="text"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter Your Course"
                                                                />
                                                            </div>
                                                            {errors.course && touched.course && (
                                                                <p className="text-xs text-red-600">{errors.course}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Branch<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Layers className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="branch"
                                                                    name="branch"
                                                                    type="text"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter Your Branch"
                                                                />
                                                            </div>
                                                            {errors.branch && touched.branch && (
                                                                <p className="text-xs text-red-600">{errors.branch}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Semester<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <ListOrdered className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="semester"
                                                                    name="semester"
                                                                    type="number"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter Your Semester"
                                                                />
                                                            </div>
                                                            {errors.semester && touched.semester && (
                                                                <p className="text-xs text-red-600">{errors.semester}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Section<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <LayoutGrid className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="section"
                                                                    name="section"
                                                                    type="text"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter Your Section"
                                                                />
                                                            </div>
                                                            {errors.section && touched.section && (
                                                                <p className="text-xs text-red-600">{errors.section}</p>
                                                            )}
                                                        </div>

                                                        {/* Batch Start Year */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch Start Year<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <CalendarRange className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="batchStartYear"
                                                                    name="batchStartYear"
                                                                    type="month"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter Batch Start Year (e.g., 2024)"
                                                                />
                                                            </div>
                                                            {errors.batchStartYear && touched.batchStartYear && (
                                                                <p className="text-xs text-red-600">{errors.batchStartYear}</p>
                                                            )}
                                                        </div>

                                                        {/* Batch End Year */}
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch End Year<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <CalendarRange className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="batchEndYear"
                                                                    name="batchEndYear"
                                                                    type="month"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter Batch End Year (e.g., 2028)"
                                                                />
                                                            </div>
                                                            {errors.batchEndYear && touched.batchEndYear && (
                                                                <p className="text-xs text-red-600">{errors.batchEndYear}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Admission Year<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <CalendarCheck className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="admissionYear"
                                                                    name="admissionYear"
                                                                    type="month"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter Your Admission Year"
                                                                />
                                                            </div>
                                                            {errors.admissionYear && touched.admissionYear && (
                                                                <p className="text-xs text-red-600">{errors.admissionYear}</p>
                                                            )}
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation Year<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <CalendarClock className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="expectedGraduationYear"
                                                                    name="expectedGraduationYear"
                                                                    type="month"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter Your Expected Graduation Year"
                                                                />
                                                            </div>
                                                            {errors.expectedGraduationYear && touched.expectedGraduationYear && (
                                                                <p className="text-xs text-red-600">{errors.expectedGraduationYear}</p>
                                                            )}
                                                        </div>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end gap-4">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="bg-primary text-whiteColor px-6 py-1.5 rounded-md focus:outline-none font-medium cursor-pointer"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <Spinner />
                                                    </>
                                                ) : (
                                                    'Create Student'
                                                )}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateStudent