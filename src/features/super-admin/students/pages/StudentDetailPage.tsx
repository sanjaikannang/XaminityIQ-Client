import Button from "../../../../common/ui/Button";
import Timeline from "../../../../common/ui/Timeline";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import StudentDetailSkeleton from "../components/StudentDetailSkeleton";
import { useGetStudentByIdQuery } from "../../../../state/services/endpoints/students";
import { BookOpen, Calendar, Flag, GraduationCap, MapPin, Phone, User, Users } from "lucide-react";

const StudentDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data, isLoading, error } = useGetStudentByIdQuery(id!);

    if (isLoading) {
        return (
            <>
                <PageHeader>Student Details</PageHeader>
                <Container>
                    <div className="mb-6">
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => navigate("/super-admin/students")}
                        >
                            ← Back to Students
                        </Button>
                    </div>
                    <StudentDetailSkeleton />
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
                <div className="mb-6">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate("/super-admin/students")}
                    >
                        ← Back to Students
                    </Button>
                </div>

                <div className="space-y-6 mb-6">
                    {/* Section 1: Profile Header with Status Badge */}
                    <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                        <div className="flex gap-8 items-start">
                            <div className="relative">
                                <img
                                    src={student.personalDetails.profilePhotoUrl}
                                    alt={fullName}
                                    className="w-40 h-40 rounded-xl object-contain border-4 border-primaryLighter"
                                    onError={(e) => {
                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&size=128&background=029de3`;
                                    }}
                                />
                            </div>

                            <div className="flex-1 self-center">
                                <div className="grid grid-cols-2 lg:grid-cols-3  gap-6">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Roll Number</p>
                                            <p className="text-sm font-semibold text-textPrimary">{student.academicDetails.rollNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <Calendar className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Date of Birth</p>
                                            <p className="text-sm font-semibold text-textPrimary">
                                                {new Date(student.personalDetails.dateOfBirth).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <Flag className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Nationality</p>
                                            <p className="text-sm font-semibold text-textPrimary">{student.personalDetails.nationality}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <Flag className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Status</p>
                                            <p className="text-sm font-semibold text-textPrimary">{student.academicDetails.status}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                            <User className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-textTertiary">Gender</p>
                                            <p className="text-sm font-semibold text-textPrimary">{student.personalDetails.gender}</p>
                                        </div>
                                    </div>

                                    {student.personalDetails.religion && (
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primaryLighter flex items-center justify-center flex-shrink-0">
                                                <BookOpen className="w-5 h-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-textTertiary">Religion</p>
                                                <p className="text-sm font-semibold text-textPrimary">{student.personalDetails.religion}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Academic & Contact Details */}
                    <div className="grid grid-cols-2 gap-6">
                        {/* Academic Details */}
                        <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-textPrimary">Academic Details</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Student ID</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.studentId}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Batch</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.academicDetails.batchName}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Course</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.academicDetails.courseName}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Department</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.academicDetails.departmentName}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Section</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.academicDetails.sectionName}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Current Semester</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.academicDetails.currentSemester}</span>
                                </div>
                                <div className="flex justify-between items-start py-3">
                                    <span className="text-sm text-textSecondary">Admission Type</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.academicDetails.admissionType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <Phone className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-textPrimary">Contact Details</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Personal Email</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.contactDetails.personalEmail}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Student Email</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.contactDetails.studentEmail}</span>
                                </div>
                                <div className="flex justify-between items-start py-3 border-b border-borderLight">
                                    <span className="text-sm text-textSecondary">Phone Number</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.contactDetails.phoneNumber}</span>
                                </div>
                                <div className="flex justify-between items-start py-3">
                                    <span className="text-sm text-textSecondary">Alternate Phone</span>
                                    <span className="text-sm font-semibold text-textPrimary">{student.contactDetails.alternatePhoneNumber}</span>
                                </div>
                            </div>

                            <div className="bg-bgSecondary border border-borderDefault rounded-xl p-3 mt-3">
                                <p className="text-sm font-semibold text-textSecondary mb-3">Emergency Contact</p>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-textTertiary">Name</span>
                                        <span className="text-sm font-semibold text-textPrimary">{student.contactDetails.emergencyContact.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-textTertiary">Relation</span>
                                        <span className="text-sm font-semibold text-textPrimary">{student.contactDetails.emergencyContact.relation}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-textTertiary">Phone</span>
                                        <span className="text-sm font-semibold text-textPrimary">{student.contactDetails.emergencyContact.phoneNumber}</span>
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
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-textPrimary">Education History</h2>
                            </div>

                            <div className="mt-6">
                                {student.educationHistory.map((edu, index) => (
                                    <Timeline
                                        key={index}
                                        type="education"
                                        data={edu}
                                        isLast={index === student.educationHistory.length - 1}
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
                                            {student.addressDetails.currentAddress.addressLine1}
                                            {student.addressDetails.currentAddress.addressLine2 && `, ${student.addressDetails.currentAddress.addressLine2}`}
                                            <br />
                                            {student.addressDetails.currentAddress.city},
                                            <br />
                                            {student.addressDetails.currentAddress.state} - {student.addressDetails.currentAddress.pincode}
                                            <br />
                                            {student.addressDetails.currentAddress.country}
                                        </p>
                                    </div>
                                </div>

                                {!student.addressDetails.sameAsCurrent && student.addressDetails.permanentAddress ? (
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <MapPin className="w-4 h-4 text-primary" />
                                            <h3 className="text-sm font-semibold text-textPrimary">Permanent Address</h3>
                                        </div>
                                        <div className="bg-bgSecondary rounded-xl p-4 border border-borderDefault">
                                            <p className="text-sm text-textSecondary leading-relaxed">
                                                {student.addressDetails.permanentAddress.addressLine1}
                                                {student.addressDetails.permanentAddress.addressLine2 && `, ${student.addressDetails.permanentAddress.addressLine2}`}
                                                <br />
                                                {student.addressDetails.permanentAddress.city},
                                                <br />
                                                {student.addressDetails.permanentAddress.state} - {student.addressDetails.permanentAddress.pincode}
                                                <br />
                                                {student.addressDetails.permanentAddress.country}
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

                    {/* Section 4: Parent Details */}
                    {student.parentDetails && (
                        <div className="bg-whiteColor rounded-xl border border-borderDefault p-4">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-primary" />
                                </div>
                                <h2 className="text-xl font-bold text-textPrimary">Parent/Guardian Details</h2>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                {student.parentDetails.father && (
                                    <div className="bg-bgSecondary rounded-xl p-5 border border-borderDefault">
                                        <h3 className="text-sm font-bold text-textPrimary mb-4 flex items-center gap-2">
                                            <User className="w-4 h-4 text-primary" />
                                            Father's Details
                                        </h3>
                                        <div className="space-y-3">
                                            {student.parentDetails.father.name && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Name</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.father.name}</span>
                                                </div>
                                            )}
                                            {student.parentDetails.father.phoneNumber && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Phone</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.father.phoneNumber}</span>
                                                </div>
                                            )}
                                            {student.parentDetails.father.email && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Email</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.father.email}</span>
                                                </div>
                                            )}
                                            {student.parentDetails.father.occupation && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Occupation</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.father.occupation}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {student.parentDetails.mother && (
                                    <div className="bg-bgSecondary rounded-xl p-5 border border-borderDefault">
                                        <h3 className="text-sm font-bold text-textPrimary mb-4 flex items-center gap-2">
                                            <User className="w-4 h-4 text-primary" />
                                            Mother's Details
                                        </h3>
                                        <div className="space-y-3">
                                            {student.parentDetails.mother.name && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Name</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.mother.name}</span>
                                                </div>
                                            )}
                                            {student.parentDetails.mother.phoneNumber && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Phone</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.mother.phoneNumber}</span>
                                                </div>
                                            )}
                                            {student.parentDetails.mother.email && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Email</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.mother.email}</span>
                                                </div>
                                            )}
                                            {student.parentDetails.mother.occupation && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Occupation</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.mother.occupation}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6">
                                {student.parentDetails.guardian && (
                                    <div className="bg-bgSecondary rounded-xl p-5 border border-borderDefault">
                                        <h3 className="text-sm font-bold text-textPrimary mb-4 flex items-center gap-2">
                                            <User className="w-4 h-4 text-primary" />
                                            Guardian's Details
                                        </h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            {student.parentDetails.guardian.name && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Name</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.guardian.name}</span>
                                                </div>
                                            )}
                                            {student.parentDetails.guardian.relation && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Relation</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.guardian.relation}</span>
                                                </div>
                                            )}
                                            {student.parentDetails.guardian.phoneNumber && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Phone</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.guardian.phoneNumber}</span>
                                                </div>
                                            )}
                                            {student.parentDetails.guardian.email && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Email</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.guardian.email}</span>
                                                </div>
                                            )}
                                            {student.parentDetails.guardian.occupation && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-textTertiary">Occupation</span>
                                                    <span className="text-sm font-semibold text-textPrimary">{student.parentDetails.guardian.occupation}</span>
                                                </div>
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