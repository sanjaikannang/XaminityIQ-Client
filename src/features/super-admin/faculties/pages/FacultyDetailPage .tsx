import Button from "../../../../common/ui/Button";
import Timeline from "../../../../common/ui/Timeline";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import FacultyDetailSkeleton from "../components/FacultyDetailSkeleton";
import { useGetFacultyByIdQuery } from "../../../../state/services/endpoints/faculty";
import { Calendar, Flag, GraduationCap, MapPin, Phone, User, Users, Briefcase } from "lucide-react";

const FacultyDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetFacultyByIdQuery(id!);

    if (isLoading) {
        return (
            <>
                <PageHeader>Faculty Details</PageHeader>
                <Container>
                    <div className="mb-6">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate("/super-admin/faculties")}
                        >
                            ← Back to Faculty
                        </Button>
                    </div>
                    <FacultyDetailSkeleton />
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
                <div className="mb-6">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate("/super-admin/faculties")}
                    >
                        ← Back to Faculty
                    </Button>
                </div>

                <div className="space-y-6 mb-6">
                    {/* Section 1: Profile Header with Status Badge */}
                    <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="flex gap-8 items-start">
                            <div className="relative">
                                <img
                                    src={faculty.personalDetails.profilePhotoUrl}
                                    alt={fullName}
                                    className="w-40 h-40 rounded-xl object-contain border-4 border-primaryLighter"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=128&background=029de3`;
                                    }}
                                />
                            </div>

                            <div className="flex-1 self-center">
                                <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Employee  ID</p>
                                            <p className="text-sm font-semibold text-textPrimary">{faculty.employmentDetails.employeeId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Date of Birth</p>
                                            <p className="text-sm font-semibold text-textPrimary">
                                                {new Date(faculty.personalDetails.dateOfBirth).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <Flag className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Nationality</p>
                                            <p className="text-sm font-semibold text-textPrimary">{faculty.personalDetails.nationality}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <Flag className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Status</p>
                                            <p className="text-sm font-semibold text-textPrimary">{faculty.isActive ? "Active" : "Inactive"}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Gender</p>
                                            <p className="text-sm font-semibold text-textPrimary">{faculty.personalDetails.gender}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <Users className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Marital Status</p>
                                            <p className="text-sm font-semibold text-textPrimary">{faculty.personalDetails.maritalStatus}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Employment & Contact Details */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Employment Details */}
                        <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-textPrimary">Employment Details</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Faculty ID</span>
                                    <span className="text-sm font-semibold text-textPrimary">{faculty.facultyId}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Designation</span>
                                    <span className="text-sm font-semibold text-textPrimary">{faculty.employmentDetails.designation}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Department</span>
                                    <span className="text-sm font-semibold text-textPrimary">{faculty.employmentDetails.departmentName}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Employment Type</span>
                                    <span className="text-sm font-semibold text-textPrimary">{faculty.employmentDetails.employmentType}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Date of Joining</span>
                                    <span className="text-sm font-semibold text-textPrimary">
                                        {new Date(faculty.employmentDetails.dateOfJoining).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                                {faculty.employmentDetails.dateOfLeaving && (
                                    <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                        <span className="text-sm text-textSecondary">Date of Leaving</span>
                                        <span className="text-sm font-semibold text-textPrimary">
                                            {new Date(faculty.employmentDetails.dateOfLeaving).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Total Experience</span>
                                    <span className="text-sm font-semibold text-textPrimary">{faculty.employmentDetails.totalExperienceYears} years</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Qualification</span>
                                    <span className="text-sm font-semibold text-textPrimary">{faculty.employmentDetails.highestQualification}</span>
                                </div>
                                {faculty.employmentDetails.basicSalary && (
                                    <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                        <span className="text-sm text-textSecondary">Basic Salary</span>
                                        <span className="text-sm font-semibold text-textPrimary">₹{faculty.employmentDetails.basicSalary.toLocaleString()}</span>
                                    </div>
                                )}
                                {faculty.employmentDetails.remarks && (
                                    <div className="pt-3">
                                        <p className="text-xs text-textTertiary italic">{faculty.employmentDetails.remarks}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-textPrimary">Contact Details</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Personal Email</span>
                                    <span className="text-sm font-semibold text-textPrimary">{faculty.contactDetails.personalEmail}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Faculty Email</span>
                                    <span className="text-sm font-semibold text-textPrimary">{faculty.contactDetails.facultyEmail}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Phone Number</span>
                                    <span className="text-sm font-semibold text-textPrimary">{faculty.contactDetails.phoneNumber}</span>
                                </div>
                                {faculty.contactDetails.alternatePhoneNumber && (
                                    <div className="flex justify-between items-start py-3">
                                        <span className="text-sm text-textSecondary">Alternate Phone</span>
                                        <span className="text-sm font-semibold text-textPrimary">{faculty.contactDetails.alternatePhoneNumber}</span>
                                    </div>
                                )}
                            </div>

                            <div className="bg-bgSecondary border border-borderDefault rounded-xl p-3 mt-3">
                                <p className="text-sm font-semibold text-textSecondary mb-3">Emergency Contact</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-textTertiary">Name</span>
                                        <span className="text-sm font-semibold text-textPrimary">{faculty.contactDetails.emergencyContact.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-textTertiary">Relation</span>
                                        <span className="text-sm font-semibold text-textPrimary">{faculty.contactDetails.emergencyContact.relation}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-textTertiary">Phone</span>
                                        <span className="text-sm font-semibold text-textPrimary">{faculty.contactDetails.emergencyContact.phoneNumber}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Education History & Address */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Education History with Timeline */}
                        <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-textPrimary">Education History</h2>
                            </div>

                            <div className="mt-6">
                                {faculty.educationHistory.map((edu, index) => (
                                    <Timeline
                                        key={index}
                                        type="education"
                                        data={edu}
                                        isLast={index === faculty.educationHistory.length - 1}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Address Details */}
                        <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-textPrimary">Address Details</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <h3 className="text-sm font-semibold text-textPrimary">Current Address</h3>
                                    </div>
                                    <div className="bg-bgSecondary rounded-xl p-4 border border-borderDefault">
                                        <p className="text-sm text-textSecondary leading-relaxed">
                                            {faculty.addressDetails.currentAddress.addressLine1}
                                            {faculty.addressDetails.currentAddress.addressLine2 && `, ${faculty.addressDetails.currentAddress.addressLine2}`}
                                            <br />
                                            {faculty.addressDetails.currentAddress.city},
                                            <br />
                                            {faculty.addressDetails.currentAddress.state} - {faculty.addressDetails.currentAddress.pincode}
                                            <br />
                                            {faculty.addressDetails.currentAddress.country}
                                        </p>
                                    </div>
                                </div>

                                {!faculty.addressDetails.sameAsCurrent && faculty.addressDetails.permanentAddress ? (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <h3 className="text-sm font-semibold text-textPrimary">Permanent Address</h3>
                                        </div>
                                        <div className="bg-bgSecondary rounded-xl p-4 border border-borderDefault">
                                            <p className="text-sm text-textSecondary leading-relaxed">
                                                {faculty.addressDetails.permanentAddress.addressLine1}
                                                {faculty.addressDetails.permanentAddress.addressLine2 && `, ${faculty.addressDetails.permanentAddress.addressLine2}`}
                                                <br />
                                                {faculty.addressDetails.permanentAddress.city},
                                                <br />
                                                {faculty.addressDetails.permanentAddress.state} - {faculty.addressDetails.permanentAddress.pincode}
                                                <br />
                                                {faculty.addressDetails.permanentAddress.country}
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="bg-primaryLighter rounded-xl p-4 border border-primary/20">
                                        <p className="text-sm text-primary font-medium">
                                            Permanent address is same as current address
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Section 4: Work Experience */}
                    <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Briefcase className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold text-textPrimary">Work Experience</h2>
                        </div>

                        <div className="mt-6">
                            {faculty.workExperience.map((work, index) => (
                                <Timeline
                                    key={index}
                                    type="work"
                                    data={work}
                                    isLast={index === faculty.workExperience.length - 1}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default FacultyDetailPage;