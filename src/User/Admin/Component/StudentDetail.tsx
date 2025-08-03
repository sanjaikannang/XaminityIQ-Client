import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetStudentResponse } from '../../../Types/admin.types';
import { setSelectedStudent, setStudentError, setStudentLoading } from '../../../State/Slices/adminSlice';
import { getStudent } from '../../../Services/Admin/adminAPI';
import { StudentDetailSkeleton } from './StudentDetailSkeleton';
import { InfoCard } from '../../../Common/UI/InfoCard';
import { InfoItem } from '../../../Common/UI/InfoItem';
import { FamilyMemberCard } from '../../../Common/UI/FamilyMemberCard';

const StudentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const [studentData, setStudentData] = useState<GetStudentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch student details
  const fetchStudentDetails = async () => {
    if (!id) return;

    try {
      setLoading(true);
      dispatch(setStudentLoading(true));

      const response = await getStudent(id);
      setStudentData(response);

      // Update Redux state if needed
      if (response.success && response.data.students.length > 0) {
        dispatch(setSelectedStudent(response.data.students[0]));
      }

    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to fetch student details';
      setError(errorMessage);
      dispatch(setStudentError(errorMessage));
    } finally {
      setLoading(false);
      dispatch(setStudentLoading(false));
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [id]);

  // Show skeleton while loading
  if (loading) {
    return <StudentDetailSkeleton />;
  }

  // Show error state
  if (error) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Student</h3>
              <p className="text-red-600 mb-4">{error}</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Show no data state
  if (!studentData || !studentData.data.students.length) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Student Found</h3>
              <p className="text-gray-600">The requested student could not be found.</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  const student = studentData.data.students[0];
  const { personalInfo, contactInfo, familyInfo, academicInfo, userId } = student;


  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <div className="flex flex-col items-center">
                  <img
                    src={personalInfo.photo || ''}
                    alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-100 mb-4"
                  />
                  <h2 className="text-xl font-bold text-gray-900 text-center">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h2>
                  <p className="text-green-600 font-medium mb-2">{academicInfo.course} - {academicInfo.branch}</p>
                  <p className="text-gray-600 text-sm mb-4">Semester {academicInfo.semester} | Section {academicInfo.section}</p>

                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Student ID</span>
                      <span className="text-sm font-medium">{student.studentId}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Roll Number</span>
                      <span className="text-sm font-medium">{student.rollNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`text-sm font-medium px-2 py-1 rounded-full ${student.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {student.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-500">Batch</span>
                      <span className="text-sm font-medium">{academicInfo.batch}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500">Age</span>
                      {/* <span className="text-sm font-medium">{personalInfo.dateOfBirth}</span> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Cards */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Information */}
              <InfoCard
                title="Personal Information"
                icon={
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                }
              >
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="First Name" value={personalInfo.firstName} />
                  <InfoItem label="Last Name" value={personalInfo.lastName} />
                  {/* <InfoItem
                    label="Date of Birth"
                    value={personalInfo.dateOfBirth ? formatDate(personalInfo.dateOfBirth) : null}
                  />
                  <InfoItem label="Age" value={`${calculateAge(personalInfo.dateOfBirth)} years`} /> */}
                  <InfoItem label="Gender" value={personalInfo.gender} />
                  <InfoItem label="Nationality" value={personalInfo.nationality} />
                  <InfoItem label="Religion" value={personalInfo.religion} />
                </dl>
              </InfoCard>

              {/* Academic Information */}
              <InfoCard
                title="Academic Information"
                icon={
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                  </svg>
                }
              >
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="Course" value={academicInfo.course} />
                  <InfoItem label="Branch" value={academicInfo.branch} />
                  <InfoItem label="Semester" value={academicInfo.semester?.toString()} />
                  <InfoItem label="Section" value={academicInfo.section} />
                  <InfoItem label="Batch" value={academicInfo.batch} />
                  <InfoItem label="Admission Year" value={academicInfo.admissionYear?.toString()} />
                  <InfoItem label="Expected Graduation" value={academicInfo.expectedGraduationYear?.toString()} />
                </dl>
              </InfoCard>

              {/* Contact Information */}
              <InfoCard
                title="Contact Information"
                icon={
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                  </svg>
                }
              >
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

              {/* Family Information */}
              <InfoCard
                title="Family Information"
                icon={
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                  </svg>
                }
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Father */}
                  <FamilyMemberCard
                    title="Father"
                    member={familyInfo.father}
                    icon={
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    }
                  />

                  {/* Mother */}
                  <FamilyMemberCard
                    title="Mother"
                    member={familyInfo.mother}
                    icon={
                      <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                      </svg>
                    }
                  />
                </div>

                {/* Guardian */}
                {familyInfo.guardian && familyInfo.guardian.name && (
                  <div className="mt-4">
                    <FamilyMemberCard
                      title="Guardian"
                      member={familyInfo.guardian}
                      icon={
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                      }
                    />
                  </div>
                )}
              </InfoCard>

              {/* Account Information */}
              <InfoCard
                title="Account Information"
                icon={
                  <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                }
              >
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="User Role" value={userId.role} />
                  <InfoItem label="Account Status" value={userId.isActive ? 'Active' : 'Inactive'} />
                  <InfoItem label="Email Verified" value={userId.isEmailVerified ? 'Yes' : 'No'} />
                  {/* <InfoItem label="Last Login" value={userId.lastLogin ? formatDate(userId.lastLogin) : 'Never'} />
                  <InfoItem label="Account Created" value={formatDate(userId.createdAt)} /> */}
                </dl>
              </InfoCard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentDetail;