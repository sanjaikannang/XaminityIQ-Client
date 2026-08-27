import toast from "react-hot-toast";
import { Formik, Form } from "formik";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import InputField from "../../../../common/ui/Input";
import AddressSection from "../../../../common/form-sections/AddressSection";
import EmergencyContactFields from "../../../../common/form-sections/EmergencyContactFields";
import StudentEducationHistoryFields from "../../../../features/super-admin/students/components/StudentEducationHistoryFields";
import StudentParentGuardianFields from "../../../../features/super-admin/students/components/StudentParentGuardianFields";
import { StudentData } from "../../../../types/students-types";
import { useUpdateMyStudentProfileMutation } from "../../../../state/services/endpoints/student-profile";

interface CompleteStudentProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: StudentData;
}

const emptyEducationRecord = { level: "", qualification: "", boardOrUniversity: "", institutionName: "", yearOfPassing: "", percentageOrCGPA: "" };

const CompleteStudentProfileModal = ({ isOpen, onClose, profile }: CompleteStudentProfileModalProps) => {
    const [updateMyProfile, { isLoading }] = useUpdateMyStudentProfileMutation();

    const initialValues = {
        profilePhotoUrl: profile.personalDetails.profilePhotoUrl || '',
        emergencyContact: profile.contactDetails.emergencyContact || { name: '', relation: '', phoneNumber: '' },
        currentAddress: profile.addressDetails.currentAddress || { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'INDIA' },
        sameAsCurrent: profile.addressDetails.sameAsCurrent || false,
        permanentAddress: profile.addressDetails.permanentAddress || { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'INDIA' },
        educationHistory: profile.educationHistory.length > 0 ? profile.educationHistory : [emptyEducationRecord],
        father: profile.parentDetails?.father || { name: '', phoneNumber: '', email: '', occupation: '' },
        mother: profile.parentDetails?.mother || { name: '', phoneNumber: '', email: '', occupation: '' },
        guardian: profile.parentDetails?.guardian || { name: '', relation: '', phoneNumber: '', email: '', occupation: '' },
    };

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            // Only send sections the student actually filled in — an empty
            // section (e.g. no institution name yet) is dropped rather than
            // saved as a half-empty record.
            const payload: any = {};
            if (values.profilePhotoUrl) payload.profilePhotoUrl = values.profilePhotoUrl;
            if (values.emergencyContact.name && values.emergencyContact.phoneNumber) payload.emergencyContact = values.emergencyContact;
            if (values.currentAddress.addressLine1) {
                payload.currentAddress = values.currentAddress;
                payload.sameAsCurrent = values.sameAsCurrent;
                if (!values.sameAsCurrent && values.permanentAddress.addressLine1) payload.permanentAddress = values.permanentAddress;
            }
            const validEducation = values.educationHistory.filter((e: any) => e.institutionName && e.level && e.qualification);
            if (validEducation.length > 0) payload.educationHistory = validEducation.map((e: any) => ({ ...e, yearOfPassing: Number(e.yearOfPassing), percentageOrCGPA: Number(e.percentageOrCGPA) }));
            if (values.father.name) payload.father = values.father;
            if (values.mother.name) payload.mother = values.mother;
            if (values.guardian.name) payload.guardian = values.guardian;

            const response = await updateMyProfile(payload).unwrap();
            toast.success(response.message || 'Profile updated successfully');
            onClose();
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to update profile');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Complete Your Profile" size="xl">
            <Formik initialValues={initialValues} onSubmit={handleSubmit} enableReinitialize>
                {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                    <Form className="space-y-8 max-h-[70vh] overflow-y-auto pr-1">
                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-textPrimary border-b border-borderLight pb-2">Profile Photo</h3>
                            <InputField
                                id="profilePhotoUrl"
                                name="profilePhotoUrl"
                                label="Profile Photo URL"
                                placeholder="https://..."
                                value={values.profilePhotoUrl}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-textPrimary border-b border-borderLight pb-2">Emergency Contact</h3>
                            <EmergencyContactFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-textPrimary border-b border-borderLight pb-2">Address</h3>
                            <AddressSection values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-textPrimary border-b border-borderLight pb-2">Education History</h3>
                            <StudentEducationHistoryFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-textPrimary border-b border-borderLight pb-2">Parent / Guardian Details</h3>
                            <StudentParentGuardianFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                        </section>

                        <div className="flex justify-end gap-3 pt-2 sticky bottom-0 bg-whiteColor">
                            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                            <Button type="submit" variant="primary" loading={isSubmitting || isLoading} disabled={isSubmitting || isLoading}>
                                {isSubmitting || isLoading ? '' : 'Save'}
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
};

export default CompleteStudentProfileModal;
