import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { Country } from "../../../../utils/enum";
import AddressSection from "../../../../common/form-sections/AddressSection";
import { createStudentValidationSchema } from "../formik/create-student.schema";
import { useCreateStudentMutation } from "../../../../state/services/endpoints/students";
import StudentPersonalFields from "../components/StudentPersonalFields";
import StudentContactFields from "../components/StudentContactFields";
import StudentAcademicFields from "../components/StudentAcademicFields";
import StudentParentGuardianFields from "../components/StudentParentGuardianFields";
import StudentEducationHistoryFields from "../components/StudentEducationHistoryFields";

const emptyParent = { name: '', phoneNumber: '', email: '', occupation: '' };
const emptyGuardian = { ...emptyParent, relation: '' };

const initialValues = {
    firstName: '', lastName: '', gender: '', dateOfBirth: '', profilePhotoUrl: '', religion: '',
    personalEmail: '', phoneNumber: '', alternatePhoneNumber: '',
    emergencyContact: { name: '', relation: '', phoneNumber: '' },
    currentAddress: { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' },
    sameAsCurrent: true,
    permanentAddress: { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' },
    batchId: '', courseId: '', departmentId: '', currentSemester: '', admissionType: '',
    father: { ...emptyParent },
    mother: { ...emptyParent },
    guardian: { ...emptyGuardian },
    educationHistory: [{ level: '', qualification: '', boardOrUniversity: '', institutionName: '', yearOfPassing: '', percentageOrCGPA: '' }],
};

function isBlankGroup(group: Record<string, any>) {
    return Object.values(group).every((value) => !value);
}

const CreateStudentPage = () => {
    const navigate = useNavigate();
    const [createStudent, { isLoading }] = useCreateStudentMutation();

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            const hasCurrentAddress = !isBlankGroup(values.currentAddress);
            const validEducation = values.educationHistory.filter((edu) => edu.institutionName && edu.level && edu.qualification);

            const payload = {
                ...values,
                profilePhotoUrl: values.profilePhotoUrl || undefined,
                alternatePhoneNumber: values.alternatePhoneNumber || undefined,
                currentSemester: Number(values.currentSemester),
                emergencyContact: isBlankGroup(values.emergencyContact) ? undefined : values.emergencyContact,
                currentAddress: hasCurrentAddress ? { ...values.currentAddress, country: Country.INDIA } : undefined,
                sameAsCurrent: hasCurrentAddress ? values.sameAsCurrent : undefined,
                permanentAddress: (hasCurrentAddress && !values.sameAsCurrent && !isBlankGroup(values.permanentAddress))
                    ? { ...values.permanentAddress, country: Country.INDIA }
                    : undefined,
                father: isBlankGroup(values.father) ? undefined : values.father,
                mother: isBlankGroup(values.mother) ? undefined : values.mother,
                guardian: isBlankGroup(values.guardian) ? undefined : values.guardian,
                educationHistory: validEducation.length > 0
                    ? validEducation.map((edu) => ({
                        ...edu,
                        yearOfPassing: Number(edu.yearOfPassing),
                        percentageOrCGPA: Number(edu.percentageOrCGPA),
                    }))
                    : undefined,
            };

            const response = await createStudent(payload as any).unwrap();
            toast.success(response.message || 'Student created successfully');
            navigate('/super-admin/students');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to create student');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader>Add Student</PageHeader>
            <Container>
                <div className="py-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={createStudentValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-10">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Personal Details</h3>
                                    <StudentPersonalFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Contact Information</h3>
                                    <StudentContactFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">
                                        Address <span className="text-sm font-normal text-textTertiary">(optional — student can complete this later)</span>
                                    </h3>
                                    <AddressSection values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Academic Placement</h3>
                                    <StudentAcademicFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Parent / Guardian Details</h3>
                                    <StudentParentGuardianFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">
                                        Education History <span className="text-sm font-normal text-textTertiary">(optional — student can complete this later)</span>
                                    </h3>
                                    <StudentEducationHistoryFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                                    <Button type="button" variant="outline" onClick={() => navigate('/super-admin/students')}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" loading={isSubmitting || isLoading} disabled={isSubmitting || isLoading}>
                                        {isSubmitting || isLoading ? '' : 'Create Student'}
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

export default CreateStudentPage;
