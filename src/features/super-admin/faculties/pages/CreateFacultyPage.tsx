import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { Country } from "../../../../utils/enum";
import AddressSection from "../../../../common/form-sections/AddressSection";
import { createFacultyValidationSchema } from "../formik/create-faculty.schema";
import { useCreateFacultyMutation } from "../../../../state/services/endpoints/faculty";
import FacultyPersonalFields from "../components/FacultyPersonalFields";
import FacultyContactFields from "../components/FacultyContactFields";
import FacultyEmploymentFields from "../components/FacultyEmploymentFields";
import FacultyEducationHistoryFields from "../components/FacultyEducationHistoryFields";
import FacultyWorkExperienceFields from "../components/FacultyWorkExperienceFields";

const initialValues = {
    firstName: '', lastName: '', gender: '', dateOfBirth: '', maritalStatus: '', profilePhotoUrl: '', religion: '',
    personalEmail: '', phoneNumber: '', alternatePhoneNumber: '',
    emergencyContact: { name: '', relation: '', phoneNumber: '' },
    currentAddress: { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' },
    sameAsCurrent: true,
    permanentAddress: { addressLine1: '', addressLine2: '', city: '', state: '', pincode: '' },
    employeeId: '', designation: '', departmentId: '', employmentType: '', totalExperienceYears: '', highestQualification: '', remarks: '',
    educationHistory: [{ level: '', qualification: '', boardOrUniversity: '', institutionName: '', yearOfPassing: '', percentageOrCGPA: '', specialization: '' }],
    workExperience: [] as any[],
};

const CreateFacultyPage = () => {
    const navigate = useNavigate();
    const [createFaculty, { isLoading }] = useCreateFacultyMutation();

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            const payload = {
                ...values,
                alternatePhoneNumber: values.alternatePhoneNumber || undefined,
                totalExperienceYears: Number(values.totalExperienceYears),
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

            const response = await createFaculty(payload as any).unwrap();
            toast.success(response.message || 'Faculty created successfully');
            navigate('/super-admin/faculties');
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to create faculty');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader>Add Faculty</PageHeader>
            <Container>
                <div className="py-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={createFacultyValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-10">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Personal Details</h3>
                                    <FacultyPersonalFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Contact Information</h3>
                                    <FacultyContactFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Address</h3>
                                    <AddressSection values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Employment Details</h3>
                                    <FacultyEmploymentFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
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
                                    <Button type="button" variant="outline" onClick={() => navigate('/super-admin/faculties')}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" loading={isSubmitting || isLoading} disabled={isSubmitting || isLoading}>
                                        {isSubmitting || isLoading ? '' : 'Create Faculty'}
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

export default CreateFacultyPage;
