import { useState } from "react";
import { User, Mail, MapPin, GraduationCap, BookOpen, Users } from "lucide-react";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Chip from "../../../../common/ui/Chip";
import ProfileCompletionBar from "../../../../common/ui/ProfileCompletionBar";
import { formatEnumLabel, getChipVariant } from "../../../../utils/utils";
import { formatDate } from "../../../../utils/date";
import { useGetMyStudentProfileQuery } from "../../../../state/services/endpoints/student-profile";
import CompleteStudentProfileModal from "../components/CompleteStudentProfileModal";

const SectionCard = ({
    icon: Icon,
    title,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    children: React.ReactNode;
}) => (
    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
        <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-lg font-bold text-textPrimary">{title}</h2>
        </div>
        {children}
    </section>
);

const Field = ({ label, value }: { label: string; value?: React.ReactNode }) => (
    <div>
        <span className="text-sm text-textSecondary">{label}</span>
        <p className="font-medium text-textPrimary">{value || value === 0 ? value : "—"}</p>
    </div>
);

const StudentProfilePage = () => {
    const { data, isLoading } = useGetMyStudentProfileQuery();
    const profile = data?.data;
    const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

    if (isLoading || !profile) {
        return (
            <>
                <PageHeader>My Profile</PageHeader>
                <Container>
                    <div className="py-10 text-center text-textSecondary">Loading...</div>
                </Container>
            </>
        );
    }

    const fullName = `${profile.personalDetails.firstName} ${profile.personalDetails.lastName}`;
    const initials = `${profile.personalDetails.firstName.charAt(0)}${profile.personalDetails.lastName.charAt(0)}`.toUpperCase();
    const parents = profile.parentDetails;

    return (
        <>
            <PageHeader>My Profile</PageHeader>
            <Container>
                <div className="space-y-6">
                    <ProfileCompletionBar
                        percentage={profile.profileCompletionPercentage}
                        onCompleteClick={() => setIsCompleteModalOpen(true)}
                    />

                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <div className="flex items-center gap-5 flex-wrap">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-whiteColor font-semibold text-2xl shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-xl font-bold text-textPrimary">{fullName}</h1>
                                    <Chip
                                        label={formatEnumLabel(profile.academicDetails.status)}
                                        variant={getChipVariant(profile.academicDetails.status)}
                                    />
                                </div>
                                <p className="text-sm text-textSecondary mt-1">
                                    {profile.academicDetails.courseName} · {profile.academicDetails.departmentName} · Semester {profile.academicDetails.currentSemester}
                                </p>
                                <p className="text-xs text-textTertiary mt-1">Student ID: {profile.studentId} · Roll No: {profile.academicDetails.rollNumber}</p>
                            </div>
                        </div>
                    </section>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <SectionCard icon={User} title="Personal Information">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="First Name" value={profile.personalDetails.firstName} />
                                <Field label="Last Name" value={profile.personalDetails.lastName} />
                                <Field label="Gender" value={formatEnumLabel(profile.personalDetails.gender)} />
                                <Field label="Date of Birth" value={formatDate(profile.personalDetails.dateOfBirth)} />
                                <Field label="Nationality" value={formatEnumLabel(profile.personalDetails.nationality)} />
                                {profile.personalDetails.religion && (
                                    <Field label="Religion" value={profile.personalDetails.religion} />
                                )}
                            </div>
                        </SectionCard>

                        <SectionCard icon={Mail} title="Contact Information">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Student Email" value={profile.contactDetails.studentEmail} />
                                <Field label="Personal Email" value={profile.contactDetails.personalEmail} />
                                <Field label="Phone Number" value={profile.contactDetails.phoneNumber} />
                                {profile.contactDetails.alternatePhoneNumber && (
                                    <Field label="Alternate Phone" value={profile.contactDetails.alternatePhoneNumber} />
                                )}
                                <Field
                                    label="Emergency Contact"
                                    value={profile.contactDetails.emergencyContact
                                        ? `${profile.contactDetails.emergencyContact.name} (${formatEnumLabel(profile.contactDetails.emergencyContact.relation)}) — ${profile.contactDetails.emergencyContact.phoneNumber}`
                                        : undefined}
                                />
                            </div>
                        </SectionCard>
                    </div>

                    <SectionCard icon={GraduationCap} title="Academic Details">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Field label="Roll Number" value={profile.academicDetails.rollNumber} />
                            <Field label="Batch" value={profile.academicDetails.batchName} />
                            <Field label="Course" value={profile.academicDetails.courseName} />
                            <Field label="Department" value={profile.academicDetails.departmentName} />
                            <Field label="Section" value={profile.academicDetails.sectionName} />
                            <Field label="Current Semester" value={profile.academicDetails.currentSemester} />
                            <Field label="Admission Type" value={formatEnumLabel(profile.academicDetails.admissionType)} />
                            <div>
                                <span className="text-sm text-textSecondary">Status</span>
                                <p className="mt-0.5">
                                    <Chip label={formatEnumLabel(profile.academicDetails.status)} variant={getChipVariant(profile.academicDetails.status)} />
                                </p>
                            </div>
                        </div>
                    </SectionCard>

                    <SectionCard icon={MapPin} title="Address">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">Current Address</span>
                                {profile.addressDetails.currentAddress ? (
                                    <p className="text-sm text-textPrimary mt-2">
                                        {profile.addressDetails.currentAddress.addressLine1}
                                        {profile.addressDetails.currentAddress.addressLine2 ? `, ${profile.addressDetails.currentAddress.addressLine2}` : ""}
                                        <br />
                                        {profile.addressDetails.currentAddress.city}, {profile.addressDetails.currentAddress.state} — {profile.addressDetails.currentAddress.pincode}
                                        <br />
                                        {profile.addressDetails.currentAddress.country}
                                    </p>
                                ) : (
                                    <p className="text-sm text-textTertiary mt-2 italic">Not provided</p>
                                )}
                            </div>
                            <div>
                                <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">Permanent Address</span>
                                {profile.addressDetails.sameAsCurrent || !profile.addressDetails.permanentAddress ? (
                                    <p className="text-sm text-textSecondary mt-2 italic">Same as current address</p>
                                ) : (
                                    <p className="text-sm text-textPrimary mt-2">
                                        {profile.addressDetails.permanentAddress.addressLine1}
                                        {profile.addressDetails.permanentAddress.addressLine2 ? `, ${profile.addressDetails.permanentAddress.addressLine2}` : ""}
                                        <br />
                                        {profile.addressDetails.permanentAddress.city}, {profile.addressDetails.permanentAddress.state} — {profile.addressDetails.permanentAddress.pincode}
                                        <br />
                                        {profile.addressDetails.permanentAddress.country}
                                    </p>
                                )}
                            </div>
                        </div>
                    </SectionCard>

                    {profile.educationHistory.length > 0 && (
                        <SectionCard icon={BookOpen} title="Education History">
                            <div className="space-y-3">
                                {profile.educationHistory.map((edu, index) => (
                                    <div key={index} className="rounded-md border border-borderLight p-3">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <p className="font-medium text-textPrimary">{edu.qualification} — {edu.institutionName}</p>
                                            <Chip label={formatEnumLabel(edu.level)} variant={getChipVariant(edu.level)} />
                                        </div>
                                        <p className="text-sm text-textSecondary mt-1">
                                            {edu.boardOrUniversity} · Passed {edu.yearOfPassing} · {edu.percentageOrCGPA}%
                                        </p>
                                        {edu.remarks && <p className="text-sm text-textSecondary mt-1">{edu.remarks}</p>}
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {parents && (parents.father || parents.mother || parents.guardian) && (
                        <SectionCard icon={Users} title="Parent / Guardian Details">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                {parents.father && (
                                    <div className="rounded-md border border-borderLight p-3">
                                        <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">Father</span>
                                        <p className="font-medium text-textPrimary mt-1">{parents.father.name || "—"}</p>
                                        <p className="text-sm text-textSecondary">{parents.father.phoneNumber}</p>
                                        <p className="text-sm text-textSecondary">{parents.father.email}</p>
                                        {parents.father.occupation && <p className="text-sm text-textSecondary">{parents.father.occupation}</p>}
                                    </div>
                                )}
                                {parents.mother && (
                                    <div className="rounded-md border border-borderLight p-3">
                                        <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">Mother</span>
                                        <p className="font-medium text-textPrimary mt-1">{parents.mother.name || "—"}</p>
                                        <p className="text-sm text-textSecondary">{parents.mother.phoneNumber}</p>
                                        <p className="text-sm text-textSecondary">{parents.mother.email}</p>
                                        {parents.mother.occupation && <p className="text-sm text-textSecondary">{parents.mother.occupation}</p>}
                                    </div>
                                )}
                                {parents.guardian && (
                                    <div className="rounded-md border border-borderLight p-3">
                                        <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">Guardian</span>
                                        <p className="font-medium text-textPrimary mt-1">
                                            {parents.guardian.name || "—"}{parents.guardian.relation ? ` (${formatEnumLabel(parents.guardian.relation)})` : ""}
                                        </p>
                                        <p className="text-sm text-textSecondary">{parents.guardian.phoneNumber}</p>
                                        <p className="text-sm text-textSecondary">{parents.guardian.email}</p>
                                        {parents.guardian.occupation && <p className="text-sm text-textSecondary">{parents.guardian.occupation}</p>}
                                    </div>
                                )}
                            </div>
                        </SectionCard>
                    )}
                </div>
            </Container>

            <CompleteStudentProfileModal
                isOpen={isCompleteModalOpen}
                onClose={() => setIsCompleteModalOpen(false)}
                profile={profile}
            />
        </>
    );
};

export default StudentProfilePage;
