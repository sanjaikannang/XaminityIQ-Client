import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { createFacultyValidationSchema } from "../formik/create-faculty.schema";
import { useCreateFacultyMutation } from "../../../../state/services/endpoints/faculty";
import FacultyPersonalFields from "../components/FacultyPersonalFields";
import FacultyContactFields from "../components/FacultyContactFields";
import FacultyEmploymentFields from "../components/FacultyEmploymentFields";

// Only identity + academic placement are collected here — everything else
// (marital status, profile photo, address, emergency contact, total
// experience, highest qualification, education history, work experience) is
// filled in by the faculty member themselves from their Dashboard Profile
// page after their first login.
const initialValues = {
    firstName: '', lastName: '', dateOfBirth: '', gender: '', religion: '',
    personalEmail: '', phoneNumber: '', alternatePhoneNumber: '',
    employeeId: '', designation: '', departmentId: '', employmentType: '',
};

const CreateFacultyPage = () => {
    const navigate = useNavigate();
    const [createFaculty, { isLoading }] = useCreateFacultyMutation();

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            const payload = {
                ...values,
                alternatePhoneNumber: values.alternatePhoneNumber || undefined,
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
                    <div className="flex items-start gap-2 rounded-md bg-bgSecondary border border-borderLight p-3 mb-6">
                        <Info className="w-4 h-4 text-textTertiary shrink-0 mt-0.5" />
                        <p className="text-xs text-textSecondary">
                            Only the details below are needed to create the account. Marital status, profile photo,
                            address, emergency contact, experience, qualification, education history, and work
                            experience are completed by the faculty member themselves from their Dashboard Profile
                            page after they log in.
                        </p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={createFacultyValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-10">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Personal Details</h3>
                                    <FacultyPersonalFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} mode="create" />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Contact Information</h3>
                                    <FacultyContactFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} mode="create" />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Employment Details</h3>
                                    <FacultyEmploymentFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} mode="create" />
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
