import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { GetStudentResponse } from '../../../../../../Types/admin.types';
import { setSelectedStudent, setStudentError, setStudentLoading } from '../../../../../../State/Slices/adminSlice';
import { getStudent } from '../../../../../../Services/Admin/adminAPI';
import { InfoCard } from '../../../../../../Common/UI/InfoCard';
import { InfoItem } from '../../../../../../Common/UI/InfoItem';
import { FamilyMemberCard } from '../../../../../../Common/UI/FamilyMemberCard';
import { StudentDetailSkeleton } from './StudentDetailSkeleton';

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
        <div className="max-w-9xl mx-auto px-4 py-6">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-md border border-gray-300 p-6 sticky top-6">
                <div className="flex flex-col items-center">
                  <img
                    src={personalInfo.photo || ''}
                    alt={`${personalInfo.firstName} ${personalInfo.lastName}`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary mb-4"
                  />
                  <h2 className="text-xl font-medium text-gray-900 text-center">
                    {personalInfo.firstName} {personalInfo.lastName}
                  </h2>
                  <p className="text-primary font-medium mb-2">{academicInfo.course} - {academicInfo.branch}</p>
                  <p className="text-gray-600 text-sm mb-4">Semester {academicInfo.semester} | Section {academicInfo.section}</p>

                  <div className="w-full space-y-2">
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500">Student ID</span>
                      <span className="text-sm">{student.studentId}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500">Roll Number</span>
                      <span className="text-sm">{student.rollNumber}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500">Status</span>
                      <span className={`text-sm px-4 rounded-sm ${student.status === 'Active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {student.status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-gray-500">Batch</span>
                      <span className="text-sm">{academicInfo.batch}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Details Cards */}
            <div className="lg:col-span-2 space-y-4">
              <InfoCard title="Personal Information">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="First Name" value={personalInfo.firstName} />
                  <InfoItem label="Last Name" value={personalInfo.lastName} />
                  <InfoItem label="Gender" value={personalInfo.gender} />
                  <InfoItem label="Nationality" value={personalInfo.nationality} />
                  <InfoItem label="Religion" value={personalInfo.religion} />
                </dl>
              </InfoCard>

              {/* Academic Information */}
              <InfoCard title="Academic Information">
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

              {/* Family Information */}
              <InfoCard title="Family Information">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Father */}
                  <FamilyMemberCard
                    title="Father"
                    member={familyInfo.father} />

                  {/* Mother */}
                  <FamilyMemberCard
                    title="Mother"
                    member={familyInfo.mother} />
                </div>

                {/* Guardian */}
                {familyInfo.guardian && familyInfo.guardian.name && (
                  <div className="mt-4">
                    <FamilyMemberCard
                      title="Guardian"
                      member={familyInfo.guardian} />
                  </div>
                )}
              </InfoCard>

              {/* Account Information */}
              <InfoCard title="Account Information">
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoItem label="User Role" value={userId.role} />
                  <InfoItem label="Account Status" value={userId.isActive ? 'Active' : 'Inactive'} />
                  <InfoItem label="Email Verified" value={userId.isEmailVerified ? 'Yes' : 'No'} />
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