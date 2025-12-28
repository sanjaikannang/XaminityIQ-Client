import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Button from "../../../../common/ui/Button";
import { useGetFacultyByIdQuery } from "../../../../state/services/endpoints/faculty";

const FacultyDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetFacultyByIdQuery(id!);

    if (isLoading) {
        return (
            <>
                <PageHeader>Faculty Details</PageHeader>
                <Container>
                    <div className="flex justify-center items-center h-96">
                        <div className="text-lg">Loading...</div>
                    </div>
                </Container>
            </>
        );
    }

    if (error || !data?.data) {
        return (
            <>
                <PageHeader>Faculty Details</PageHeader>
                <Container>
                    <div className="flex justify-center items-center h-96">
                        <div className="text-lg text-red-600">Failed to load faculty details</div>
                    </div>
                </Container>
            </>
        );
    }

    const faculty = data.data;
    const fullName = `${faculty.personalDetails.firstName} ${faculty.personalDetails.lastName}`;

    return (
        <>
            <PageHeader>Faculty Details</PageHeader>
            <Container>
                <div className="mb-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate("/super-admin/faculties")}
                    >
                        ← Back to Faculty
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Personal Details Section */}
                    <div className="border-b pb-6">
                        <div className="flex items-start gap-6">
                            <img
                                src={faculty.personalDetails.profilePhotoUrl}
                                alt={fullName}
                                className="w-32 h-32 rounded-lg object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=128&background=random`;
                                }}
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h2 className="text-2xl font-bold">{fullName}</h2>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${faculty.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                        {faculty.isActive ? "Active" : "Inactive"}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-semibold">Faculty ID:</span> {faculty.facultyId}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Gender:</span> {faculty.personalDetails.gender}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Date of Birth:</span>{" "}
                                        {new Date(faculty.personalDetails.dateOfBirth).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Marital Status:</span> {faculty.personalDetails.maritalStatus}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Nationality:</span> {faculty.personalDetails.nationality}
                                    </div>
                                    {faculty.personalDetails.religion && (
                                        <div>
                                            <span className="font-semibold">Religion:</span> {faculty.personalDetails.religion}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Employment Details Section */}
                    <div className="border-b pb-6">
                        <h3 className="text-xl font-bold mb-4">Employment Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">Employee ID:</span> {faculty.employmentDetails.employeeId}
                            </div>
                            <div>
                                <span className="font-semibold">Designation:</span> {faculty.employmentDetails.designation}
                            </div>
                            <div>
                                <span className="font-semibold">Department:</span> {faculty.employmentDetails.departmentName}
                            </div>
                            <div>
                                <span className="font-semibold">Employment Type:</span> {faculty.employmentDetails.employmentType}
                            </div>
                            <div>
                                <span className="font-semibold">Date of Joining:</span>{" "}
                                {new Date(faculty.employmentDetails.dateOfJoining).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                            {faculty.employmentDetails.dateOfLeaving && (
                                <div>
                                    <span className="font-semibold">Date of Leaving:</span>{" "}
                                    {new Date(faculty.employmentDetails.dateOfLeaving).toLocaleDateString("en-US", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                    })}
                                </div>
                            )}
                            <div>
                                <span className="font-semibold">Total Experience:</span> {faculty.employmentDetails.totalExperienceYears} years
                            </div>
                            <div>
                                <span className="font-semibold">Highest Qualification:</span> {faculty.employmentDetails.highestQualification}
                            </div>
                            <div>
                                <span className="font-semibold">Status:</span>{" "}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${faculty.employmentDetails.status.toLowerCase() === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                    {faculty.employmentDetails.status}
                                </span>
                            </div>
                            {faculty.employmentDetails.basicSalary && (
                                <div>
                                    <span className="font-semibold">Basic Salary:</span> ₹{faculty.employmentDetails.basicSalary.toLocaleString()}
                                </div>
                            )}
                            {faculty.employmentDetails.remarks && (
                                <div className="col-span-2">
                                    <span className="font-semibold">Remarks:</span> {faculty.employmentDetails.remarks}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Details Section */}
                    <div className="border-b pb-6">
                        <h3 className="text-xl font-bold mb-4">Contact Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">Personal Email:</span> {faculty.contactDetails.personalEmail}
                            </div>
                            <div>
                                <span className="font-semibold">Faculty Email:</span> {faculty.contactDetails.facultyEmail}
                            </div>
                            <div>
                                <span className="font-semibold">Phone Number:</span> {faculty.contactDetails.phoneNumber}
                            </div>
                            {faculty.contactDetails.alternatePhoneNumber && (
                                <div>
                                    <span className="font-semibold">Alternate Phone:</span> {faculty.contactDetails.alternatePhoneNumber}
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Emergency Contact</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold">Name:</span> {faculty.contactDetails.emergencyContact.name}
                                </div>
                                <div>
                                    <span className="font-semibold">Relation:</span> {faculty.contactDetails.emergencyContact.relation}
                                </div>
                                <div>
                                    <span className="font-semibold">Phone:</span> {faculty.contactDetails.emergencyContact.phoneNumber}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Address Details Section */}
                    <div className="border-b pb-6">
                        <h3 className="text-xl font-bold mb-4">Address Details</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold mb-2">Current Address</h4>
                                <p className="text-sm">
                                    {faculty.addressDetails.currentAddress.addressLine1}
                                    {faculty.addressDetails.currentAddress.addressLine2 && `, ${faculty.addressDetails.currentAddress.addressLine2}`}
                                    <br />
                                    {faculty.addressDetails.currentAddress.city}, {faculty.addressDetails.currentAddress.state} - {faculty.addressDetails.currentAddress.pincode}
                                    <br />
                                    {faculty.addressDetails.currentAddress.country}
                                </p>
                            </div>
                            {!faculty.addressDetails.sameAsCurrent && faculty.addressDetails.permanentAddress && (
                                <div>
                                    <h4 className="font-semibold mb-2">Permanent Address</h4>
                                    <p className="text-sm">
                                        {faculty.addressDetails.permanentAddress.addressLine1}
                                        {faculty.addressDetails.permanentAddress.addressLine2 && `, ${faculty.addressDetails.permanentAddress.addressLine2}`}
                                        <br />
                                        {faculty.addressDetails.permanentAddress.city}, {faculty.addressDetails.permanentAddress.state} - {faculty.addressDetails.permanentAddress.pincode}
                                        <br />
                                        {faculty.addressDetails.permanentAddress.country}
                                    </p>
                                </div>
                            )}
                            {faculty.addressDetails.sameAsCurrent && (
                                <div>
                                    <p className="text-sm text-gray-600 italic">Permanent address is same as current address</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Education History Section */}
                    <div className="border-b pb-6">
                        <h3 className="text-xl font-bold mb-4">Education History</h3>
                        <div className="space-y-4">
                            {faculty.educationHistory.map((edu, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <h4 className="font-semibold mb-2">{edu.level} - {edu.qualification}</h4>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div>
                                            <span className="font-semibold">Board/University:</span> {edu.boardOrUniversity}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Institution:</span> {edu.institutionName}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Year of Passing:</span> {edu.yearOfPassing}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Percentage/CGPA:</span> {edu.percentageOrCGPA}
                                        </div>
                                        {edu.specialization && (
                                            <div className="col-span-2">
                                                <span className="font-semibold">Specialization:</span> {edu.specialization}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Work Experience Section */}
                    <div>
                        <h3 className="text-xl font-bold mb-4">Work Experience</h3>
                        <div className="space-y-4">
                            {faculty.workExperience.map((work, index) => (
                                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-2">
                                        <h4 className="font-semibold">{work.role} at {work.organization}</h4>
                                        {work.isCurrent && (
                                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Current
                                            </span>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {work.department && (
                                            <div>
                                                <span className="font-semibold">Department:</span> {work.department}
                                            </div>
                                        )}
                                        <div>
                                            <span className="font-semibold">Duration:</span>{" "}
                                            {new Date(work.fromDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })} -{" "}
                                            {work.isCurrent ? "Present" : new Date(work.toDate).toLocaleDateString("en-US", { year: "numeric", month: "short" })}
                                        </div>
                                        <div>
                                            <span className="font-semibold">Experience:</span> {work.experienceYears} years
                                        </div>
                                        {work.jobDescription && (
                                            <div className="col-span-2">
                                                <span className="font-semibold">Job Description:</span> {work.jobDescription}
                                            </div>
                                        )}
                                        {work.reasonForLeaving && !work.isCurrent && (
                                            <div className="col-span-2">
                                                <span className="font-semibold">Reason for Leaving:</span> {work.reasonForLeaving}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default FacultyDetailPage;