import { useGetMyStudentProfileQuery } from "../../../../state/services/endpoints/student-profile";

// Sub-header shown just below the exam-room header — the student's own
// identity + academic placement, so proctors/records reviewing a screen
// recording (and the student themselves) can confirm whose attempt this is.
const ExamStudentInfoBar = () => {
    const { data } = useGetMyStudentProfileQuery();
    const profile = data?.data;

    if (!profile) return null;

    const fullName = `${profile.personalDetails.firstName} ${profile.personalDetails.lastName}`;
    const academic = profile.academicDetails;

    return (
        <div className="bg-bgSecondary border-b border-borderLight px-4 sm:px-6 py-2 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-textSecondary flex-shrink-0">
            <span className="font-semibold text-textPrimary">{fullName}</span>
            <span>Roll No: <span className="text-textPrimary font-medium">{academic.rollNumber}</span></span>
            <span>Batch: <span className="text-textPrimary font-medium">{academic.batchName}</span></span>
            <span>Course: <span className="text-textPrimary font-medium">{academic.courseName}</span></span>
            <span>Department: <span className="text-textPrimary font-medium">{academic.departmentName}</span></span>
            <span>Section: <span className="text-textPrimary font-medium">{academic.sectionName}</span></span>
            <span>Semester: <span className="text-textPrimary font-medium">{academic.currentSemester}</span></span>
        </div>
    );
};

export default ExamStudentInfoBar;
