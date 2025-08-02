import { Field, Form, Formik } from "formik";
import { BadgeInfo, Briefcase, Building2, Calendar, CalendarCheck2, CalendarDays, Flag, Globe, GraduationCap, HeartHandshake, Home, Hourglass, Landmark, Mail, Map, MapPin, Package, Percent, Phone, School, School2, Timer, User, UserCheck, VenusAndMars } from "lucide-react"
import { createFacultyValidationSchema } from "../FormikSchema/create-faculty.schema";

interface CreateFacultyFormValues {
}

const CreateFaculty = () => {

    const initialCreateFacultyValues: CreateFacultyFormValues = {
    };

    const handleCreateFaculty = async () => {
        try {

        } catch (error: any) {
        }
        finally {
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
                                {() => (
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
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <HeartHandshake className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <select
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                                            >
                                                                <option value="">Select Status</option>
                                                                <option value="Single">Single</option>
                                                                <option value="Married">Married</option>
                                                                <option value="Divorced">Divorced</option>
                                                                <option value="Widowed">Widowed</option>
                                                            </select>
                                                        </div>
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
                                                                id="employeeID"
                                                                name="employeeID"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Employee ID"
                                                            />
                                                        </div>
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
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Percentage<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Percent className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <Field
                                                                id="percentage"
                                                                name="ercentage"
                                                                type="number"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Percentage"
                                                            />
                                                        </div>
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
                                                                id="years"
                                                                name="years"
                                                                type="number"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter your Years"
                                                            />
                                                        </div>
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
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">Designation<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <Briefcase className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="designation"
                                                                    name="designation"
                                                                    type="text"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                    placeholder="Enter your Institution Designation"
                                                                />
                                                            </div>
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
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">From Date<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <CalendarDays className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="fromDate"
                                                                    name="fromDate"
                                                                    type="date"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-sm font-medium text-gray-700 mb-1">To Date<span className="text-red-500">*</span></label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                    <CalendarCheck2 className="h-5 w-5 text-gray-400" />
                                                                </div>
                                                                <Field
                                                                    id="toDate"
                                                                    name="toDate"
                                                                    type="date"
                                                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="flex justify-end gap-4">
                                            <button
                                                type="submit"
                                                className="bg-primary text-whiteColor px-6 py-1.5 rounded-md focus:outline-none font-medium"
                                            >
                                                Create Faculty
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