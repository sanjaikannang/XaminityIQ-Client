import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { Country } from "../../../../utils/enum";
import AddressSection from "../../../../common/form-sections/AddressSection";
import { editStudentValidationSchema } from "../formik/edit-student.schema";
import { useGetStudentByIdQuery, useUpdateStudentMutation } from "../../../../state/services/endpoints/students";
import StudentPersonalFields from "../components/StudentPersonalFields";
import StudentContactFields from "../components/StudentContactFields";
import StudentParentGuardianFields from "../components/StudentParentGuardianFields";
import StudentEducationHistoryFields from "../components/StudentEducationHistoryFields";

const emptyParent = { name: '', phoneNumber: '', email: '', occupation: '' };
const emptyGuardian = { ...emptyParent, relation: '' };

function isBlankGroup(group: Record<string, any>) {
    return Object.values(group).every((value) => !value);
}

const EditStudentPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data, isLoading: isLoadingStudent } = useGetStudentByIdQuery(id as string, { skip: !id });
    const [updateStudent, { isLoading: isUpdating }] = useUpdateStudentMutation();

    if (isLoadingStudent || !data?.data) {
        return (
            <>
                <PageHeader>Edit Student</PageHeader>
                <Container>
                    <div className="py-6 text-textSecondary">Loading student details...</div>
                </Container>
            </>
        );
    }

    const student = data.data;

    const initialValues = {
        firstName: student.personalDetails.firstName,
        lastName: student.personalDetails.lastName,
        gender: student.personalDetails.gender,
        dateOfBirth: student.personalDetails.dateOfBirth,
        profilePhotoUrl: student.personalDetails.profilePhotoUrl,
        religion: student.personalDetails.religion || '',

        personalEmail: student.contactDetails.personalEmail,
        phoneNumber: student.contactDetails.phoneNumber,
        alternatePhoneNumber: student.contactDetails.alternatePhoneNumber || '',
        emergencyContact: { ...student.contactDetails.emergencyContact },

        currentAddress: { ...student.addressDetails.currentAddress },
        sameAsCurrent: student.addressDetails.sameAsCurrent,
        permanentAddress: student.addressDetails.permanentAddress
            ? { ...student.addressDetails.permanentAddress }
            : { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' },

        father: student.parentDetails?.father ? { ...emptyParent, ...student.parentDetails.father } : { ...emptyParent },
        mother: student.parentDetails?.mother ? { ...emptyParent, ...student.parentDetails.mother } : { ...emptyParent },
        guardian: student.parentDetails?.guardian ? { ...emptyGuardian, ...student.parentDetails.guardian } : { ...emptyGuardian },

        educationHistory: student.educationHistory.length > 0
            ? student.educationHistory.map((edu) => ({
                level: edu.level,
                qualification: edu.qualification,
                boardOrUniversity: edu.boardOrUniversity,
                institutionName: edu.institutionName,
                yearOfPassing: edu.yearOfPassing,
                percentageOrCGPA: edu.percentageOrCGPA,
            }))
            : [{ level: '', qualification: '', boardOrUniversity: '', institutionName: '', yearOfPassing: '', percentageOrCGPA: '' }],
    };

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            const payload = {
                ...values,
                alternatePhoneNumber: values.alternatePhoneNumber || undefined,
                currentAddress: { ...values.currentAddress, country: Country.INDIA },
                permanentAddress: values.sameAsCurrent ? undefined : { ...values.permanentAddress, country: Country.INDIA },
                father: isBlankGroup(values.father) ? undefined : values.father,
                mother: isBlankGroup(values.mother) ? undefined : values.mother,
                guardian: isBlankGroup(values.guardian) ? undefined : values.guardian,
                educationHistory: values.educationHistory.map((edu) => ({
                    ...edu,
                    yearOfPassing: Number(edu.yearOfPassing),
                    percentageOrCGPA: Number(edu.percentageOrCGPA),
                })),
            };

            const response = await updateStudent({ id: id as string, data: payload as any }).unwrap();
            toast.success(response.message || 'Student updated successfully');
            navigate(`/super-admin/students/${id}`);
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to update student');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader>Edit Student</PageHeader>
            <Container>
                <div className="py-6 space-y-10">
                    <section className="space-y-2">
                        <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Academic Placement (read-only)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div><span className="text-textTertiary">Roll Number:</span> <span className="text-textPrimary">{student.academicDetails.rollNumber}</span></div>
                            <div><span className="text-textTertiary">Batch:</span> <span className="text-textPrimary">{student.academicDetails.batchName}</span></div>
                            <div><span className="text-textTertiary">Course:</span> <span className="text-textPrimary">{student.academicDetails.courseName}</span></div>
                            <div><span className="text-textTertiary">Department:</span> <span className="text-textPrimary">{student.academicDetails.departmentName}</span></div>
                            <div><span className="text-textTertiary">Section:</span> <span className="text-textPrimary">{student.academicDetails.sectionName}</span></div>
                            <div><span className="text-textTertiary">Semester:</span> <span className="text-textPrimary">{student.academicDetails.currentSemester}</span></div>
                            <div><span className="text-textTertiary">Admission Type:</span> <span className="text-textPrimary">{student.academicDetails.admissionType}</span></div>
                            <div><span className="text-textTertiary">Status:</span> <span className="text-textPrimary">{student.academicDetails.status}</span></div>
                        </div>
                    </section>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={editStudentValidationSchema}
                        onSubmit={handleSubmit}
                        enableReinitialize
                    >
                        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-10">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Personal Details</h3>
                                    <StudentPersonalFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Contact Information</h3>
                                    <StudentContactFields
                                        values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue}
                                        studentEmail={student.contactDetails.studentEmail}
                                    />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Address</h3>
                                    <AddressSection values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Parent / Guardian Details</h3>
                                    <StudentParentGuardianFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Education History</h3>
                                    <StudentEducationHistoryFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                                    <Button type="button" variant="outline" onClick={() => navigate(`/super-admin/students/${id}`)}>
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

export default EditStudentPage;
