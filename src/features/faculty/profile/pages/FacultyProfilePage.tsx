import { User, Mail, MapPin, Briefcase, GraduationCap, Award, BookOpen } from "lucide-react";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import Chip from "../../../../common/ui/Chip";
import { formatEnumLabel, getChipVariant } from "../../../../utils/utils";
import { formatDate } from "../../../../utils/date";
import { useGetMyFacultyProfileQuery } from "../../../../state/services/endpoints/faculty-profile";

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

const FacultyProfilePage = () => {
    const { data, isLoading } = useGetMyFacultyProfileQuery();
    const profile = data?.data;

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

    return (
        <>
            <PageHeader>My Profile</PageHeader>
            <Container>
                <div className="space-y-6">
                    <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                        <div className="flex items-center gap-5 flex-wrap">
                            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-whiteColor font-semibold text-2xl shrink-0">
                                {initials}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-xl font-bold text-textPrimary">{fullName}</h1>
                                    <Chip
                                        label={profile.isActive ? "Active" : "Inactive"}
                                        variant={profile.isActive ? "green" : "gray"}
                                    />
                                </div>
                                <p className="text-sm text-textSecondary mt-1">
                                    {formatEnumLabel(profile.employmentDetails.designation)} · {profile.employmentDetails.departmentName}
                                </p>
                                <p className="text-xs text-textTertiary mt-1">Faculty ID: {profile.facultyId}</p>
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
                                <Field label="Marital Status" value={formatEnumLabel(profile.personalDetails.maritalStatus)} />
                                <Field label="Nationality" value={formatEnumLabel(profile.personalDetails.nationality)} />
                                {profile.personalDetails.religion && (
                                    <Field label="Religion" value={profile.personalDetails.religion} />
                                )}
                            </div>
                        </SectionCard>

                        <SectionCard icon={Mail} title="Contact Information">
                            <div className="grid grid-cols-2 gap-4">
                                <Field label="Faculty Email" value={profile.contactDetails.facultyEmail} />
                                <Field label="Personal Email" value={profile.contactDetails.personalEmail} />
                                <Field label="Phone Number" value={profile.contactDetails.phoneNumber} />
                                {profile.contactDetails.alternatePhoneNumber && (
                                    <Field label="Alternate Phone" value={profile.contactDetails.alternatePhoneNumber} />
                                )}
                                <Field
                                    label="Emergency Contact"
                                    value={`${profile.contactDetails.emergencyContact.name} (${formatEnumLabel(profile.contactDetails.emergencyContact.relation)}) — ${profile.contactDetails.emergencyContact.phoneNumber}`}
                                />
                            </div>
                        </SectionCard>
                    </div>

                    <SectionCard icon={MapPin} title="Address">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div>
                                <span className="text-xs font-semibold text-textSecondary uppercase tracking-wide">Current Address</span>
                                <p className="text-sm text-textPrimary mt-2">
                                    {profile.addressDetails.currentAddress.addressLine1}
                                    {profile.addressDetails.currentAddress.addressLine2 ? `, ${profile.addressDetails.currentAddress.addressLine2}` : ""}
                                    <br />
                                    {profile.addressDetails.currentAddress.city}, {profile.addressDetails.currentAddress.state} — {profile.addressDetails.currentAddress.pincode}
                                    <br />
                                    {profile.addressDetails.currentAddress.country}
                                </p>
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

                    <SectionCard icon={Briefcase} title="Employment Details">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            <Field label="Employee ID" value={profile.employmentDetails.employeeId} />
                            <Field label="Designation" value={formatEnumLabel(profile.employmentDetails.designation)} />
                            <Field label="Department" value={profile.employmentDetails.departmentName} />
                            <Field label="Employment Type" value={formatEnumLabel(profile.employmentDetails.employmentType)} />
                            <Field label="Date of Joining" value={formatDate(profile.employmentDetails.dateOfJoining)} />
                            <Field label="Experience" value={`${profile.employmentDetails.totalExperienceYears} years`} />
                            <Field label="Highest Qualification" value={formatEnumLabel(profile.employmentDetails.highestQualification)} />
                            <div>
                                <span className="text-sm text-textSecondary">Status</span>
                                <p className="mt-0.5">
                                    <Chip label={formatEnumLabel(profile.employmentDetails.status)} variant={getChipVariant(profile.employmentDetails.status)} />
                                </p>
                            </div>
                        </div>
                        {profile.employmentDetails.remarks && (
                            <div className="mt-4">
                                <Field label="Remarks" value={profile.employmentDetails.remarks} />
                            </div>
                        )}
                    </SectionCard>

                    {profile.educationHistory.length > 0 && (
                        <SectionCard icon={GraduationCap} title="Education History">
                            <div className="space-y-3">
                                {profile.educationHistory.map((edu, index) => (
                                    <div key={index} className="rounded-md border border-borderLight p-3">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <p className="font-medium text-textPrimary">{edu.qualification} — {edu.institutionName}</p>
                                            <Chip label={formatEnumLabel(edu.level)} variant={getChipVariant(edu.level)} />
                                        </div>
                                        <p className="text-sm text-textSecondary mt-1">
                                            {edu.boardOrUniversity} · Passed {edu.yearOfPassing} · {edu.percentageOrCGPA}%{edu.specialization ? ` · ${edu.specialization}` : ""}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    {profile.workExperience.length > 0 && (
                        <SectionCard icon={Award} title="Work Experience">
                            <div className="space-y-3">
                                {profile.workExperience.map((work, index) => (
                                    <div key={index} className="rounded-md border border-borderLight p-3">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <p className="font-medium text-textPrimary">{work.role} — {work.organization}</p>
                                            {work.isCurrent && <Chip label="Current" variant="green" />}
                                        </div>
                                        <p className="text-sm text-textSecondary mt-1">
                                            {work.department ? `${work.department} · ` : ""}{formatDate(work.fromDate)} – {work.isCurrent ? "Present" : formatDate(work.toDate)} · {work.experienceYears} years
                                        </p>
                                        {work.jobDescription && <p className="text-sm text-textSecondary mt-1">{work.jobDescription}</p>}
                                    </div>
                                ))}
                            </div>
                        </SectionCard>
                    )}

                    <SectionCard icon={BookOpen} title="Department Subjects">
                        {profile.departmentSubjects.length === 0 ? (
                            <p className="text-sm text-textSecondary">No subjects found for this department.</p>
                        ) : (
                            <div className="overflow-x-auto rounded-md border border-borderLight">
                                <table className="w-full text-sm">
                                    <thead className="bg-bgSecondary">
                                        <tr>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Code</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Subject</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Semester</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Credits</th>
                                            <th className="px-3 py-2 text-left font-medium text-textSecondary">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-borderLight">
                                        {profile.departmentSubjects.map((subject) => (
                                            <tr key={subject._id}>
                                                <td className="px-3 py-2 text-textPrimary">{subject.subjectCode}</td>
                                                <td className="px-3 py-2 text-textPrimary">{subject.subjectName}</td>
                                                <td className="px-3 py-2 text-textSecondary">{subject.semester}</td>
                                                <td className="px-3 py-2 text-textSecondary">{subject.credits}</td>
                                                <td className="px-3 py-2">
                                                    <Chip label={formatEnumLabel(subject.subjectType)} variant={getChipVariant(subject.subjectType)} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </SectionCard>
                </div>
            </Container>
        </>
    );
};

export default FacultyProfilePage;
