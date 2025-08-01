import { BookOpen, Briefcase, Calendar, CalendarCheck, CalendarClock, CalendarRange, Flag, Globe, Hash, Home, Landmark, Layers, LayoutGrid, ListOrdered, Mail, Map, MapPin, Package, Phone, User, UserCheck, Users, VenusAndMars } from "lucide-react"

const CreateStudent = () => {
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
                            <form>
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
                                                        <input
                                                            id="email"
                                                            name="email"
                                                            type="email"
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                            placeholder="Enter your email"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number<span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Hash className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            id="rollNumber"
                                                            name="rollNumber"
                                                            type="text"
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                            placeholder="Enter your Roll Number"
                                                        />
                                                    </div>
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
                                                        <input
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
                                                        <input
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
                                                        <input
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
                                                        <select
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none"
                                                        >
                                                            <option value="">Select Gender</option>
                                                            <option value="MALE">Male</option>
                                                            <option value="FEMALE">Female</option>
                                                            <option value="OTHER">Other</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Nationality<span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Globe className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
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
                                                        <input
                                                            id="religion"
                                                            name="religion"
                                                            type="text"
                                                            placeholder="Enter Religion"
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1">Photo URL<span className="text-red-500">*</span></label>
                                                <input
                                                    type="url"
                                                    className="w-full py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                />
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
                                                    <input
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
                                                            <input
                                                                id="street"
                                                                name="street"
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
                                                            <input
                                                                id="city"
                                                                name="city"
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
                                                            <input
                                                                id="state"
                                                                name="state"
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
                                                            <input
                                                                id="zipCode"
                                                                name="zipCode"
                                                                type="number"
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
                                                            <input
                                                                id="country"
                                                                name="country"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Country"
                                                            />
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
                                                            <input
                                                                id="street"
                                                                name="street"
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
                                                            <input
                                                                id="city"
                                                                name="city"
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
                                                            <input
                                                                id="state"
                                                                name="state"
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
                                                            <input
                                                                id="zipCode"
                                                                name="zipCode"
                                                                type="number"
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
                                                            <input
                                                                id="country"
                                                                name="country"
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
                                                            <input
                                                                id="name"
                                                                name="name"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Occupation<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Briefcase className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                id="occupation"
                                                                name="occupation"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Occupation"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Phone className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                id="phone"
                                                                name="phone"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Phone"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Mail className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Email"
                                                            />
                                                        </div>
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
                                                            <input
                                                                id="name"
                                                                name="name"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Occupation<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Briefcase className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                id="occupation"
                                                                name="occupation"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Occupation"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Phone className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                id="phone"
                                                                name="phone"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Phone"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Mail className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Email"
                                                            />
                                                        </div>
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
                                                            <input
                                                                id="name"
                                                                name="name"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Name"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Relationship<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Users className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                id="relationship"
                                                                name="relationship"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Relationship"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Phone className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                id="phone"
                                                                name="phone"
                                                                type="text"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Phone"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">Email<span className="text-red-500">*</span></label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                                <Mail className="h-5 w-5 text-gray-400" />
                                                            </div>
                                                            <input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                                placeholder="Enter Your Email"
                                                            />
                                                        </div>
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
                                                        <input
                                                            id="course"
                                                            name="course"
                                                            type="text"
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                            placeholder="Enter Your Course"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Branch<span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <Layers className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            id="branch"
                                                            name="branch"
                                                            type="text"
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                            placeholder="Enter Your Branch"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Semester<span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <ListOrdered className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            id="semester"
                                                            name="semester"
                                                            type="number"
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                            placeholder="Enter Your Semester"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Section<span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <LayoutGrid className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            id="section"
                                                            name="section"
                                                            type="text"
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                            placeholder="Enter Your Section"
                                                        />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Batch<span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <CalendarRange className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            id="batch"
                                                            name="batch"
                                                            type="date"
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                            placeholder="Enter Your Batch"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Admission Year<span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <CalendarCheck className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            id="admissionYear"
                                                            name="admissionYear"
                                                            type="date"
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                            placeholder="Enter Your Admission Year"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation Year<span className="text-red-500">*</span></label>
                                                    <div className="relative">
                                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                            <CalendarClock className="h-5 w-5 text-gray-400" />
                                                        </div>
                                                        <input
                                                            id="expectedGraduationYear"
                                                            name="expectedGraduationYear"
                                                            type="date"
                                                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none duration-200 text-gray-900 placeholder-gray-500"
                                                            placeholder="Enter Your Expected Graduation Year"
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
                                        className="bg-primary text-whiteColor px-6 py-1.5 rounded-md focus:outline-none font-medium cursor-pointer"
                                    >
                                        Create Faculty
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateStudent