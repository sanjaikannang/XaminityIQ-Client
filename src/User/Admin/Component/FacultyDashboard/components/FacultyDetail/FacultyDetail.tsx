import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { GetFacultyResponse } from "../../../../../../Types/admin.types";
import { setFacultyError, setFacultyLoading, setSelectedFaculty } from "../../../../../../State/Slices/adminSlice";
import { getFaculty } from "../../../../../../Services/Admin/adminAPI";
import { FacultyDetailSkeleton } from "./FacultyDetailSkeleton";
import { InfoCard } from "../../../../../../Common/UI/InfoCard";
import { InfoItem } from "../../../../../../Common/UI/InfoItem";

const FacultyDetail = () => {

    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const [facultyData, setFacultyData] = useState<GetFacultyResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch Faculty details
    const fetchFacultyDetails = async () => {
        if (!id) return;

        try {
            setLoading(true);
            dispatch(setFacultyLoading(true));

            const response = await getFaculty(id);
            setFacultyData(response);

            // Update Redux state if needed
            if (response.success && response.data.faculty.length > 0) {
                dispatch(setSelectedFaculty(response.data.faculty[0]));
            }

        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch student details';
            setError(errorMessage);
            dispatch(setFacultyError(errorMessage));
        } finally {
            setLoading(false);
            dispatch(setFacultyLoading(false));
        }
    };

    useEffect(() => {
        fetchFacultyDetails();
    }, [id]);

    if (loading) {
        return <FacultyDetailSkeleton />;
    }

    // Show error state
    if (error) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Faculty</h3>
                            <p className="text-red-600 mb-4">{error}</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    // Show no data state
    if (!facultyData || !facultyData.data.faculty.length) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
                        <div className="text-center">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Faculty Found</h3>
                            <p className="text-gray-600">The requested faculty member could not be found.</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const faculty = facultyData.data.faculty[0];
    const { personalInfo, contactInfo, professionalInfo, userId } = faculty;

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-9xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        {/* Profile Card */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-md border border-gray-300 p-4 sticky top-4">
                                <div className="flex flex-col items-center">
                                    <img
                                        src={personalInfo.photo || ''}
                                        alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                                        className="w-32 h-32 rounded-full object-cover border-4 border-scecondary mb-4"
                                    />
                                    <h2 className="text-xl font-bold text-gray-900 text-center">
                                        {personalInfo.firstName} {personalInfo.lastName}
                                    </h2>
                                    <p className="text-primary font-medium mb-2">{professionalInfo.designation}</p>
                                    <p className="text-gray-600 text-sm mb-4">{professionalInfo.department} Department</p>

                                    <div className="w-full space-y-2">
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-gray-500">Faculty ID</span>
                                            <span className="text-sm">{faculty.facultyId}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-gray-500">Employee ID</span>
                                            <span className="text-sm">{professionalInfo.employeeId}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-gray-500">Status</span>
                                            <span className={`text-sm px-4 rounded-sm ${faculty.status === 'Active'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {faculty.status}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-sm text-gray-500">Joining Date</span>
                                            <span className="text-sm">
                                                {new Date(faculty.joiningDate).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Cards */}
                        <div className="lg:col-span-2 space-y-4 py-4">
                            <InfoCard title="Personal Information">
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="First Name" value={personalInfo.firstName} />
                                    <InfoItem label="Last Name" value={personalInfo.lastName} />
                                    <InfoItem
                                        label="Date of Birth"
                                        value={personalInfo.dateOfBirth
                                            ? new Date(personalInfo.dateOfBirth).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })
                                            : null}
                                    />
                                    <InfoItem label="Gender" value={personalInfo.gender} />
                                    <InfoItem label="Nationality" value={personalInfo.nationality} />
                                    <InfoItem label="Religion" value={personalInfo.religion} />
                                    <InfoItem label="Marital Status" value={personalInfo.maritalStatus} />
                                </dl>
                            </InfoCard>

                            {/* Contact Information */}
                            <InfoCard title="Contact Information">
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="Phone" value={contactInfo.phone} />
                                    <InfoItem label="Email" value={userId.email} />
                                    <InfoItem
                                        label="Permanent Address"
                                        value={contactInfo.permanentAddress ?
                                            `${contactInfo.permanentAddress.street}, ${contactInfo.permanentAddress.city}, ${contactInfo.permanentAddress.state} - ${contactInfo.permanentAddress.zipCode}, ${contactInfo.permanentAddress.country}`
                                            : null
                                        }
                                        fullWidth
                                    />
                                    <InfoItem
                                        label="Current Address"
                                        value={contactInfo.currentAddress ?
                                            `${contactInfo.currentAddress.street}, ${contactInfo.currentAddress.city}, ${contactInfo.currentAddress.state} - ${contactInfo.currentAddress.zipCode}, ${contactInfo.currentAddress.country}`
                                            : null
                                        }
                                        fullWidth
                                    />
                                </dl>
                            </InfoCard>

                            {/* Professional Information */}
                            <InfoCard title="Professional Information">
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="Department" value={professionalInfo.department} />
                                    <InfoItem label="Designation" value={professionalInfo.designation} />
                                    <InfoItem label="Employee ID" value={professionalInfo.employeeId} />
                                    <InfoItem label="Total Experience" value={professionalInfo.experience?.totalYears ? `${professionalInfo.experience.totalYears} years` : null} />
                                </dl>
                            </InfoCard>

                            {/* Qualifications */}
                            {professionalInfo.qualification && professionalInfo.qualification.length > 0 && (
                                <InfoCard title="Educational Qualifications">
                                    <div className="space-y-4">
                                        {professionalInfo.qualification.map((qual, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <InfoItem label="Degree" value={qual.degree} />
                                                    <InfoItem label="Institution" value={qual.institution} />
                                                    <InfoItem label="Year" value={qual.year?.toString()} />
                                                    <InfoItem label="Percentage" value={qual.percentage ? `${qual.percentage}%` : null} />
                                                </dl>
                                            </div>
                                        ))}
                                    </div>
                                </InfoCard>
                            )}

                            {/* Previous Experience */}
                            {professionalInfo.experience?.previousInstitutions && professionalInfo.experience.previousInstitutions.length > 0 && (
                                <InfoCard title="Previous Experience">
                                    <div className="space-y-4">
                                        {professionalInfo.experience.previousInstitutions.map((inst, index) => (
                                            <div key={index} className="bg-gray-50 rounded-lg p-4">
                                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <InfoItem label="Institution" value={inst.institutionName} />
                                                    <InfoItem label="Designation" value={inst.designation} />
                                                    <InfoItem label="Duration" value={inst.duration ? `${inst.duration} years` : null} />
                                                    <InfoItem
                                                        label="From"
                                                        value={inst.from
                                                            ? new Date(inst.from).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })
                                                            : null}
                                                    />
                                                    <InfoItem
                                                        label="To"
                                                        value={inst.to
                                                            ? new Date(inst.to).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                            })
                                                            : null}
                                                    />
                                                </dl>
                                            </div>
                                        ))}
                                    </div>
                                </InfoCard>
                            )}

                            {/* Account Information */}
                            <InfoCard title="Account Information">
                                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <InfoItem label="User Role" value={userId.role} />
                                    <InfoItem label="Account Status" value={userId.isActive ? 'Active' : 'Inactive'} />
                                    <InfoItem label="Email Verified" value={userId.isEmailVerified ? 'Yes' : 'No'} />
                                    <InfoItem
                                        label="Last Login"
                                        value={userId.lastLogin
                                            ? new Date(userId.lastLogin).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })
                                            : 'Never'}
                                    />
                                    <InfoItem
                                        label="Account Created"
                                        value={new Date(userId.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    />
                                </dl>
                            </InfoCard>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default FacultyDetail