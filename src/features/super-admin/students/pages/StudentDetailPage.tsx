import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Button from "../../../../common/ui/Button";
import { useGetStudentByIdQuery } from "../../../../state/services/endpoints/students";

const StudentDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetStudentByIdQuery(id!);

    if (isLoading) {
        return (
            <>
                <PageHeader>Student Details</PageHeader>
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
                <PageHeader>Student Details</PageHeader>
                <Container>
                    <div className="flex justify-center items-center h-96">
                        <div className="text-lg text-red-600">Failed to load student details</div>
                    </div>
                </Container>
            </>
        );
    }

    const student = data.data;
    const fullName = `${student.personalDetails.firstName} ${student.personalDetails.lastName}`;

    return (
        <>
            <PageHeader>Student Details</PageHeader>
            <Container>
                <div className="mb-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate("/super-admin/students")}
                    >
                        ← Back to Students
                    </Button>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                    {/* Personal Details Section */}
                    <div className="border-b pb-6">
                        <div className="flex items-start gap-6">
                            <img
                                src={student.personalDetails.profilePhotoUrl}
                                alt={fullName}
                                className="w-32 h-32 rounded-lg object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=128&background=random`;
                                }}
                            />
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold mb-2">{fullName}</h2>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-semibold">Student ID:</span> {student.studentId}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Gender:</span> {student.personalDetails.gender}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Date of Birth:</span>{" "}
                                        {new Date(student.personalDetails.dateOfBirth).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </div>
                                    <div>
                                        <span className="font-semibold">Nationality:</span> {student.personalDetails.nationality}
                                    </div>
                                    {student.personalDetails.religion && (
                                        <div>
                                            <span className="font-semibold">Religion:</span> {student.personalDetails.religion}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Academic Details Section */}
                    <div className="border-b pb-6">
                        <h3 className="text-xl font-bold mb-4">Academic Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">Roll Number:</span> {student.academicDetails.rollNumber}
                            </div>
                            <div>
                                <span className="font-semibold">Batch:</span> {student.academicDetails.batchName}
                            </div>
                            <div>
                                <span className="font-semibold">Course:</span> {student.academicDetails.courseName}
                            </div>
                            <div>
                                <span className="font-semibold">Department:</span> {student.academicDetails.departmentName}
                            </div>
                            <div>
                                <span className="font-semibold">Section:</span> {student.academicDetails.sectionName}
                            </div>
                            <div>
                                <span className="font-semibold">Current Semester:</span> {student.academicDetails.currentSemester}
                            </div>
                            <div>
                                <span className="font-semibold">Admission Type:</span> {student.academicDetails.admissionType}
                            </div>
                            <div>
                                <span className="font-semibold">Status:</span>{" "}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${student.academicDetails.status.toLowerCase() === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}>
                                    {student.academicDetails.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Details Section */}
                    <div className="border-b pb-6">
                        <h3 className="text-xl font-bold mb-4">Contact Details</h3>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="font-semibold">Personal Email:</span> {student.contactDetails.personalEmail}
                            </div>
                            <div>
                                <span className="font-semibold">Student Email:</span> {student.contactDetails.studentEmail}
                            </div>
                            <div>
                                <span className="font-semibold">Phone Number:</span> {student.contactDetails.phoneNumber}
                            </div>
                            {student.contactDetails.alternatePhoneNumber && (
                                <div>
                                    <span className="font-semibold">Alternate Phone:</span> {student.contactDetails.alternatePhoneNumber}
                                </div>
                            )}
                        </div>
                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">Emergency Contact</h4>
                            <div className="grid grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="font-semibold">Name:</span> {student.contactDetails.emergencyContact.name}
                                </div>
                                <div>
                                    <span className="font-semibold">Relation:</span> {student.contactDetails.emergencyContact.relation}
                                </div>
                                <div>
                                    <span className="font-semibold">Phone:</span> {student.contactDetails.emergencyContact.phoneNumber}
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
                                    {student.addressDetails.currentAddress.addressLine1}
                                    {student.addressDetails.currentAddress.addressLine2 && `, ${student.addressDetails.currentAddress.addressLine2}`}
                                    <br />
                                    {student.addressDetails.currentAddress.city}, {student.addressDetails.currentAddress.state} - {student.addressDetails.currentAddress.pincode}
                                    <br />
                                    {student.addressDetails.currentAddress.country}
                                </p>
                            </div>
                            {!student.addressDetails.sameAsCurrent && student.addressDetails.permanentAddress && (
                                <div>
                                    <h4 className="font-semibold mb-2">Permanent Address</h4>
                                    <p className="text-sm">
                                        {student.addressDetails.permanentAddress.addressLine1}
                                        {student.addressDetails.permanentAddress.addressLine2 && `, ${student.addressDetails.permanentAddress.addressLine2}`}
                                        <br />
                                        {student.addressDetails.permanentAddress.city}, {student.addressDetails.permanentAddress.state} - {student.addressDetails.permanentAddress.pincode}
                                        <br />
                                        {student.addressDetails.permanentAddress.country}
                                    </p>
                                </div>
                            )}
                            {student.addressDetails.sameAsCurrent && (
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
                            {student.educationHistory.map((edu, index) => (
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
                                        {edu.remarks && (
                                            <div className="col-span-2">
                                                <span className="font-semibold">Remarks:</span> {edu.remarks}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Parent Details Section */}
                    {student.parentDetails && (
                        <div>
                            <h3 className="text-xl font-bold mb-4">Parent/Guardian Details</h3>
                            <div className="space-y-4">
                                {student.parentDetails.father && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Father's Details</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {student.parentDetails.father.name && (
                                                <div><span className="font-semibold">Name:</span> {student.parentDetails.father.name}</div>
                                            )}
                                            {student.parentDetails.father.phoneNumber && (
                                                <div><span className="font-semibold">Phone:</span> {student.parentDetails.father.phoneNumber}</div>
                                            )}
                                            {student.parentDetails.father.email && (
                                                <div><span className="font-semibold">Email:</span> {student.parentDetails.father.email}</div>
                                            )}
                                            {student.parentDetails.father.occupation && (
                                                <div><span className="font-semibold">Occupation:</span> {student.parentDetails.father.occupation}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {student.parentDetails.mother && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Mother's Details</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {student.parentDetails.mother.name && (
                                                <div><span className="font-semibold">Name:</span> {student.parentDetails.mother.name}</div>
                                            )}
                                            {student.parentDetails.mother.phoneNumber && (
                                                <div><span className="font-semibold">Phone:</span> {student.parentDetails.mother.phoneNumber}</div>
                                            )}
                                            {student.parentDetails.mother.email && (
                                                <div><span className="font-semibold">Email:</span> {student.parentDetails.mother.email}</div>
                                            )}
                                            {student.parentDetails.mother.occupation && (
                                                <div><span className="font-semibold">Occupation:</span> {student.parentDetails.mother.occupation}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {student.parentDetails.guardian && (
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-semibold mb-2">Guardian's Details</h4>
                                        <div className="grid grid-cols-2 gap-2 text-sm">
                                            {student.parentDetails.guardian.name && (
                                                <div><span className="font-semibold">Name:</span> {student.parentDetails.guardian.name}</div>
                                            )}
                                            {student.parentDetails.guardian.relation && (
                                                <div><span className="font-semibold">Relation:</span> {student.parentDetails.guardian.relation}</div>
                                            )}
                                            {student.parentDetails.guardian.phoneNumber && (
                                                <div><span className="font-semibold">Phone:</span> {student.parentDetails.guardian.phoneNumber}</div>
                                            )}
                                            {student.parentDetails.guardian.email && (
                                                <div><span className="font-semibold">Email:</span> {student.parentDetails.guardian.email}</div>
                                            )}
                                            {student.parentDetails.guardian.occupation && (
                                                <div><span className="font-semibold">Occupation:</span> {student.parentDetails.guardian.occupation}</div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Container>
        </>
    );
};

export default StudentDetailPage;