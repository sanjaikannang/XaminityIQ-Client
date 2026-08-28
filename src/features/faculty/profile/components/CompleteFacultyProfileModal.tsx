import toast from "react-hot-toast";
import { Formik, Form } from "formik";
import Modal from "../../../../common/ui/Modal";
import Button from "../../../../common/ui/Button";
import InputField from "../../../../common/ui/Input";
import Select from "../../../../common/ui/Select";
import AddressSection from "../../../../common/form-sections/AddressSection";
import EmergencyContactFields from "../../../../common/form-sections/EmergencyContactFields";
import FacultyEducationHistoryFields from "../../../../features/super-admin/faculties/components/FacultyEducationHistoryFields";
import FacultyWorkExperienceFields from "../../../../features/super-admin/faculties/components/FacultyWorkExperienceFields";
import { MaritalStatus, HighestQualification } from "../../../../utils/enum";
import { toEnumOptions } from "../../../../utils/utils";
import { FacultyProfileData } from "../../../../types/faculty-types";
import { useUpdateMyFacultyProfileMutation } from "../../../../state/services/endpoints/faculty-profile";

interface CompleteFacultyProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    profile: FacultyProfileData;
}

const maritalStatusOptions = toEnumOptions(MaritalStatus);
const highestQualificationOptions = toEnumOptions(HighestQualification);

const CompleteFacultyProfileModal = ({ isOpen, onClose, profile }: CompleteFacultyProfileModalProps) => {
    const [updateMyProfile, { isLoading }] = useUpdateMyFacultyProfileMutation();

    const initialValues = {
        profilePhotoUrl: profile.personalDetails.profilePhotoUrl || '',
        maritalStatus: profile.personalDetails.maritalStatus || '',
        emergencyContact: profile.contactDetails.emergencyContact || { name: '', relation: '', phoneNumber: '' },
        currentAddress: profile.addressDetails.currentAddress || { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'INDIA' },
        sameAsCurrent: profile.addressDetails.sameAsCurrent || false,
        permanentAddress: profile.addressDetails.permanentAddress || { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'INDIA' },
        totalExperienceYears: profile.employmentDetails.totalExperienceYears || '',
        highestQualification: profile.employmentDetails.highestQualification || '',
        educationHistory: profile.educationHistory.length > 0 ? profile.educationHistory : [],
        workExperience: profile.workExperience.length > 0 ? profile.workExperience : [],
    };

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            const payload: any = {};
            if (values.profilePhotoUrl) payload.profilePhotoUrl = values.profilePhotoUrl;
            if (values.maritalStatus) payload.maritalStatus = values.maritalStatus;
            if (values.emergencyContact.name && values.emergencyContact.phoneNumber) payload.emergencyContact = values.emergencyContact;
            if (values.currentAddress.addressLine1) {
                payload.currentAddress = values.currentAddress;
                payload.sameAsCurrent = values.sameAsCurrent;
                if (!values.sameAsCurrent && values.permanentAddress.addressLine1) payload.permanentAddress = values.permanentAddress;
            }
            if (values.totalExperienceYears !== '') payload.totalExperienceYears = Number(values.totalExperienceYears);
            if (values.highestQualification) payload.highestQualification = values.highestQualification;

            const validEducation = values.educationHistory.filter((e: any) => e.institutionName && e.level && e.qualification);
            if (validEducation.length > 0) payload.educationHistory = validEducation.map((e: any) => ({ ...e, yearOfPassing: Number(e.yearOfPassing), percentageOrCGPA: Number(e.percentageOrCGPA) }));

            const validWork = values.workExperience.filter((w: any) => w.organization && w.role && w.fromDate && w.toDate);
            if (validWork.length > 0) payload.workExperience = validWork.map((w: any) => ({ ...w, experienceYears: Number(w.experienceYears) }));

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
                            <h3 className="text-sm font-bold text-textPrimary border-b border-borderLight pb-2">Personal</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    id="profilePhotoUrl"
                                    name="profilePhotoUrl"
                                    label="Profile Photo URL"
                                    placeholder="https://..."
                                    value={values.profilePhotoUrl}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Select
                                    id="maritalStatus"
                                    name="maritalStatus"
                                    label="Marital Status"
                                    options={maritalStatusOptions}
                                    value={values.maritalStatus}
                                    onChange={(value) => setFieldValue('maritalStatus', value)}
                                />
                            </div>
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
                            <h3 className="text-sm font-bold text-textPrimary border-b border-borderLight pb-2">Qualification & Experience</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <InputField
                                    id="totalExperienceYears"
                                    name="totalExperienceYears"
                                    type="number"
                                    label="Total Experience (years)"
                                    value={values.totalExperienceYears}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                <Select
                                    id="highestQualification"
                                    name="highestQualification"
                                    label="Highest Qualification"
                                    options={highestQualificationOptions}
                                    value={values.highestQualification}
                                    onChange={(value) => setFieldValue('highestQualification', value)}
                                />
                            </div>
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-textPrimary border-b border-borderLight pb-2">Education History</h3>
                            <FacultyEducationHistoryFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                        </section>

                        <section className="space-y-3">
                            <h3 className="text-sm font-bold text-textPrimary border-b border-borderLight pb-2">Work Experience</h3>
                            <FacultyWorkExperienceFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
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

export default CompleteFacultyProfileModal;
