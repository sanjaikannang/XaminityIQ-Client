import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { Country } from "../../../../utils/enum";
import AddressSection from "../../../../common/form-sections/AddressSection";
import { editFacultyValidationSchema } from "../formik/edit-faculty.schema";
import { useGetFacultyByIdQuery, useUpdateFacultyMutation } from "../../../../state/services/endpoints/faculty";
import FacultyPersonalFields from "../components/FacultyPersonalFields";
import FacultyContactFields from "../components/FacultyContactFields";
import FacultyEducationHistoryFields from "../components/FacultyEducationHistoryFields";
import FacultyWorkExperienceFields from "../components/FacultyWorkExperienceFields";

const EditFacultyPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data, isLoading: isLoadingFaculty } = useGetFacultyByIdQuery(id as string, { skip: !id });
    const [updateFaculty, { isLoading: isUpdating }] = useUpdateFacultyMutation();

    if (isLoadingFaculty || !data?.data) {
        return (
            <>
                <PageHeader>Edit Faculty</PageHeader>
                <Container>
                    <div className="py-6 text-textSecondary">Loading faculty details...</div>
                </Container>
            </>
        );
    }

    const faculty = data.data;

    const initialValues = {
        firstName: faculty.personalDetails.firstName,
        lastName: faculty.personalDetails.lastName,
        gender: faculty.personalDetails.gender,
        dateOfBirth: faculty.personalDetails.dateOfBirth,
        maritalStatus: faculty.personalDetails.maritalStatus,
        profilePhotoUrl: faculty.personalDetails.profilePhotoUrl,
        religion: faculty.personalDetails.religion || '',

        personalEmail: faculty.contactDetails.personalEmail,
        phoneNumber: faculty.contactDetails.phoneNumber,
        alternatePhoneNumber: faculty.contactDetails.alternatePhoneNumber || '',
        emergencyContact: { ...faculty.contactDetails.emergencyContact },

        currentAddress: { ...faculty.addressDetails.currentAddress },
        sameAsCurrent: faculty.addressDetails.sameAsCurrent,
        permanentAddress: faculty.addressDetails.permanentAddress
            ? { ...faculty.addressDetails.permanentAddress }
            : { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' },

        educationHistory: faculty.educationHistory.length > 0
            ? faculty.educationHistory.map((edu) => ({
                level: edu.level,
                qualification: edu.qualification,
                boardOrUniversity: edu.boardOrUniversity,
                institutionName: edu.institutionName,
                yearOfPassing: edu.yearOfPassing,
                percentageOrCGPA: edu.percentageOrCGPA,
                specialization: edu.specialization || '',
            }))
            : [{ level: '', qualification: '', boardOrUniversity: '', institutionName: '', yearOfPassing: '', percentageOrCGPA: '', specialization: '' }],

        workExperience: faculty.workExperience.map((work) => ({
            organization: work.organization,
            role: work.role,
            department: work.department || '',
            fromDate: work.fromDate,
            toDate: work.toDate,
            experienceYears: work.experienceYears,
            jobDescription: work.jobDescription || '',
            reasonForLeaving: work.reasonForLeaving || '',
            isCurrent: work.isCurrent,
        })),
    };

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            const payload = {
                ...values,
                alternatePhoneNumber: values.alternatePhoneNumber || undefined,
                currentAddress: { ...values.currentAddress, country: Country.INDIA },
                permanentAddress: values.sameAsCurrent ? undefined : { ...values.permanentAddress, country: Country.INDIA },
                educationHistory: values.educationHistory.map((edu) => ({
                    ...edu,
                    yearOfPassing: Number(edu.yearOfPassing),
                    percentageOrCGPA: Number(edu.percentageOrCGPA),
                })),
                workExperience: values.workExperience.map((work) => ({
                    ...work,
                    experienceYears: Number(work.experienceYears),
                })),
            };

            const response = await updateFaculty({ id: id as string, data: payload as any }).unwrap();
            toast.success(response.message || 'Faculty updated successfully');
            navigate(`/super-admin/faculties/${id}`);
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to update faculty');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader>Edit Faculty</PageHeader>
            <Container>
                <div className="py-6 space-y-10">
                    <section className="space-y-2">
                        <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Employment Details (read-only)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div><span className="text-textTertiary">Employee ID:</span> <span className="text-textPrimary">{faculty.employmentDetails.employeeId}</span></div>
                            <div><span className="text-textTertiary">Designation:</span> <span className="text-textPrimary">{faculty.employmentDetails.designation}</span></div>
                            <div><span className="text-textTertiary">Department:</span> <span className="text-textPrimary">{faculty.employmentDetails.departmentName}</span></div>
                            <div><span className="text-textTertiary">Employment Type:</span> <span className="text-textPrimary">{faculty.employmentDetails.employmentType}</span></div>
                            <div><span className="text-textTertiary">Experience (years):</span> <span className="text-textPrimary">{faculty.employmentDetails.totalExperienceYears}</span></div>
                            <div><span className="text-textTertiary">Highest Qualification:</span> <span className="text-textPrimary">{faculty.employmentDetails.highestQualification}</span></div>
                            <div><span className="text-textTertiary">Status:</span> <span className="text-textPrimary">{faculty.employmentDetails.status}</span></div>
                        </div>
                    </section>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={editFacultyValidationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-10">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Personal Details</h3>
                                    <FacultyPersonalFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Contact Information</h3>
                                    <FacultyContactFields
                                        values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue}
                                        facultyEmail={faculty.contactDetails.facultyEmail}
                                    />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Address</h3>
                                    <AddressSection values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Education History</h3>
                                    <FacultyEducationHistoryFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Work Experience</h3>
                                    <FacultyWorkExperienceFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                                    <Button type="button" variant="outline" onClick={() => navigate(`/super-admin/faculties/${id}`)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" loading={isSubmitting || isUpdating} disabled={isSubmitting || isUpdating}>
                                        {isSubmitting || isUpdating ? '' : 'Save Changes'}
                                    </Button>
                                </div>
                            </Form>
                        )}
                    </Formik>
                </div>
            </Container>
        </>
    );
};

export default EditFacultyPage;
