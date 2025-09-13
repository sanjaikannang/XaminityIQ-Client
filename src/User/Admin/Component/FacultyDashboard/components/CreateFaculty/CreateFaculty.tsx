import { Field, Form, Formik, FormikHelpers } from "formik";
import { BadgeInfo, Briefcase, Building2, Calendar, CalendarCheck2, CalendarDays, Flag, Globe, GraduationCap, HeartHandshake, Home, Hourglass, Landmark, Mail, Map, MapPin, Package, Percent, Phone, School, School2, Timer, User, UserCheck, VenusAndMars } from "lucide-react"
import { createFacultyValidationSchema } from "../../../../FormikSchema/create-faculty.schema";
import { Gender, MaritalStatus } from "../../../../../../Utils/enum";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearError, setError, setLoading } from "../../../../../../State/Slices/adminSlice";
import { CreateFacultyRequest } from "../../../../../../Types/admin.types";
import { createFaculty } from "../../../../../../Services/Admin/adminAPI";
import Spinner from "../../../../../../Common/UI/Spinner";

interface CreateFacultyFormValues {
    // Personal Information
    email: string;
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: Gender;
    nationality: string;
    religion: string;
    photo: string;
    maritalStatus: MaritalStatus;
    phoneNumber: string;

    // Current Address
    currentStreet: string;
    currentCity: string;
    currentState: string;
    currentZipCode: string;
    currentCountry: string;

    // Permanent Address (assuming the duplicate was meant for permanent address)
    permanentStreet: string;
    permanentCity: string;
    permanentState: string;
    permanentZipCode: string;
    permanentCountry: string;

    // Professional Information
    employeeId: string;
    department: string;
    designation: string;
    degree: string;
    institution: string;
    year: number | '';
    percentage: number | '';

    // Previous Experience
    totalYears: number | '';
    institutionName: string;
    previousDesignation: string;
    duration: string;
    from: string;
    to: string;
}

const CreateFaculty = () => {

    const dispatch = useDispatch()

    const initialCreateFacultyValues: CreateFacultyFormValues = {
        // Personal Information
        email: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: Gender.MALE,
        nationality: '',
        religion: '',
        photo: '',
        maritalStatus: MaritalStatus.SINGLE,
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

        // Professional Information
        employeeId: '',
        department: '',
        designation: '',
        degree: '',
        institution: '',
        year: '',
        percentage: '',

        // Previous Experience
        totalYears: '',
        institutionName: '',
        previousDesignation: '',
        duration: '',
        from: '',
        to: '',
    };

    const handleCreateFaculty = async (
        values: CreateFacultyFormValues,
        { setSubmitting, resetForm }: FormikHelpers<CreateFacultyFormValues>
    ) => {
        try {
            // Clear any previous errors
            dispatch(clearError());

            // Set loading state
            dispatch(setLoading(true));

            // Transform form values to API request format
            const facultyData: CreateFacultyRequest = {
                email: values.email,
                personalInfo: {
                    photo: values.photo,
                    firstName: values.firstName,
                    lastName: values.lastName,
                    dateOfBirth: new Date(values.dateOfBirth),
                    gender: values.gender,
                    nationality: values.nationality,
                    religion: values.nationality,
                    maritalStatus: values.maritalStatus,
                },
                contactInfo: {
                    phone: String(values.phoneNumber),
                    permanentAddress: {
                        street: values.permanentStreet,
                        city: values.permanentCity,
                        state: values.permanentState,
                        zipCode: values.permanentZipCode,
                        country: values.permanentCountry
                    },
                    currentAddress: {
                        street: values.currentStreet,
                        city: values.currentCity,
                        state: values.currentState,
                        zipCode: values.currentZipCode,
                        country: values.currentCountry
                    }
                },
                professionalInfo: {
                    employeeId: values.employeeId,
                    department: values.department,
                    designation: values.designation,
                    qualification: [
                        {
                            degree: values.degree,
                            institution: values.institution,
                            year: typeof values.year === 'number' ? values.year : parseInt(values.year as string),
                            percentage: typeof values.percentage === 'number' ? values.percentage : parseInt(values.percentage as string)
                        },
                    ],
                    experience: {
                        totalYears: typeof values.totalYears === 'number' ? values.totalYears : parseInt(values.totalYears as string),
                        previousInstitutions: [
                            {
                                institutionName: values.institutionName,
                                designation: values.previousDesignation,
                                duration: String(values.duration),
                                from: new Date(values.from),
                                to: new Date(values.to)
                            },
                        ]
                    }
                }
            }

            // Call the API
            const response = await createFaculty(facultyData);

            if (response.success) {
                // Show success toast with default password
                toast.success(`${response.message} Default password: ${response.data?.defaultPassword}`);

                // Reset form after successful creation
                resetForm();

            } else {
                toast.error(response.message || 'Failed to create faculty');
                throw new Error(response.message || 'Faculty creation failed');
            }

        } catch (error: any) {
            console.error('Create faculty error:', error);
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
                                Create Faculty
                            </h1>
                        </div>

                        <div className="p-4 space-y-8">
                            <Formik
                                initialValues={initialCreateFacultyValues}
                                validationSchema={createFacultyValidationSchema}
                                onSubmit={handleCreateFaculty}
                            >
                                {({ isSubmitting, errors, touched }) => (
                                    <Form>
                                        {/* Personal Info */}
                                        <div className="space-y-4 mb-5">
                                            <h2 className="text-xl font-semibold text-gray-800">Personal Information</h2>
                                            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
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

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <HeartHandshake className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                as="select"
                                                                name="maritalStatus"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                                            >
                                                                <option value="">Select Status</option>
                                                                <option value="Single">Single</option>
                                                                <option value="Married">Married</option>
                                                                <option value="Divorced">Divorced</option>
                                                                <option value="Widowed">Widowed</option>
                                                            </Field>
                                                        </div>
                                                        {errors.maritalStatus && touched.maritalStatus && (
                                                            <p className="text-xs text-red-600">{errors.maritalStatus}</p>
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
                                                                type="number"
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

                                        {/* Professional Info */}
                                        <div className="space-y-4 mb-5">
                                            <h2 className="text-xl font-semibold text-gray-800">Professional Information</h2>
                                            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <BadgeInfo className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                id="employeeId"
                                                                name="employeeId"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Employee ID"
                                                            />
                                                        </div>
                                                        {errors.employeeId && touched.employeeId && (
                                                            <p className="text-xs text-red-600">{errors.employeeId}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Department<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Building2 className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                id="department"
                                                                name="department"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Department"
                                                            />
                                                        </div>
                                                        {errors.department && touched.department && (
                                                            <p className="text-xs text-red-600">{errors.department}</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Designation<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <UserCheck className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                id="designation"
                                                                name="designation"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Designation"
                                                            />
                                                        </div>
                                                        {errors.designation && touched.designation && (
                                                            <p className="text-xs text-red-600">{errors.designation}</p>
                                                        )}
                                                    </div>

                                                </div>
                                            </div>
                                        </div>

                                        {/* Qualifications */}
                                        <div className="space-y-4 mb-5">
                                            <div className="flex justify-between">
                                                <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                                    Qualification
                                                </h3>
                                                <div>
                                                    <button className="bg-primary text-whiteColor px-8 py-1.5 rounded-md cursor-pointer">Add</button>
                                                </div>
                                            </div>
                                            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Degree<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <GraduationCap className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                id="degree"
                                                                name="degree"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Degree"
                                                            />
                                                        </div>
                                                        {errors.degree && touched.degree && (
                                                            <p className="text-xs text-red-600">{errors.degree}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Institution<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <School className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                id="institution"
                                                                name="institution"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Institution"
                                                            />
                                                        </div>
                                                        {errors.institution && touched.institution && (
                                                            <p className="text-xs text-red-600">{errors.institution}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Year<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Calendar className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                id="year"
                                                                name="year"
                                                                type="number"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Year"
                                                            />
                                                        </div>
                                                        {errors.year && touched.year && (
                                                            <p className="text-xs text-red-600">{errors.year}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Percent className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                id="percentage"
                                                                name="percentage"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Percentage"
                                                            />
                                                        </div>
                                                        {errors.percentage && touched.percentage && (
                                                            <p className="text-xs text-red-600">{errors.percentage}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Experience */}
                                        <div className="space-y-4 mb-5">
                                            <div className="flex items-center justify-between">
                                                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                                                    Experience
                                                </h2>
                                            </div>

                                            <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Years<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Hourglass className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                id="totalYears"
                                                                name="totalYears"
                                                                type="number"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Years"
                                                            />
                                                        </div>
                                                        {errors.totalYears && touched.totalYears && (
                                                            <p className="text-xs text-red-600">{errors.totalYears}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between">
                                                    <h3 className="text-lg font-medium text-gray-700 flex items-center gap-2">
                                                        Previous Institutions
                                                    </h3>
                                                    <div>
                                                        <button className="bg-primary text-whiteColor px-8 py-1.5 rounded-md cursor-pointer">Add</button>
                                                    </div>
                                                </div>

                                                <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Institution Name<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <School2 className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="institutionName"
                                                                    name="institutionName"
                                                                    type="text"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter your Institution Name"
                                                                />
                                                            </div>
                                                            {errors.institutionName && touched.institutionName && (
                                                                <p className="text-xs text-red-600">{errors.institutionName}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="previousDesignation"
                                                                    name="previousDesignation"
                                                                    type="text"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter your Institution Designation"
                                                                />
                                                            </div>
                                                            {errors.previousDesignation && touched.previousDesignation && (
                                                                <p className="text-xs text-red-600">{errors.previousDesignation}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Duration<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Timer className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="duration"
                                                                    name="duration"
                                                                    type="number"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter your Institution Duration"
                                                                />
                                                            </div>
                                                            {errors.duration && touched.duration && (
                                                                <p className="text-xs text-red-600">{errors.duration}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <CalendarDays className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="from"
                                                                    name="from"
                                                                    type="date"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                />
                                                            </div>
                                                            {errors.from && touched.from && (
                                                                <p className="text-xs text-red-600">{errors.from}</p>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <CalendarCheck2 className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="to"
                                                                    name="to"
                                                                    type="date"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                />
                                                            </div>
                                                            {errors.to && touched.to && (
                                                                <p className="text-xs text-red-600">{errors.to}</p>
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
                                                    'Create Faculty'
                                                )}
                                            </button>
                                        </div>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default CreateFaculty