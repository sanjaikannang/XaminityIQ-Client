import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { createStudentValidationSchema } from "../formik/create-student.schema";
import { useCreateStudentMutation } from "../../../../state/services/endpoints/students";
import StudentPersonalFields from "../components/StudentPersonalFields";
import StudentContactFields from "../components/StudentContactFields";
import StudentAcademicFields from "../components/StudentAcademicFields";

// Only identity + academic placement are collected here — everything else
// (address, emergency contact, education history, parent/guardian, profile
// photo) is filled in by the student themselves from their Dashboard Profile
// page after their first login.
const initialValues = {
    firstName: '', lastName: '', gender: '', dateOfBirth: '', religion: '',
    personalEmail: '', phoneNumber: '', alternatePhoneNumber: '',
    batchId: '', courseId: '', departmentId: '', currentSemester: '', admissionType: '',
};

const CreateStudentPage = () => {
    const navigate = useNavigate();
    const [createStudent, { isLoading }] = useCreateStudentMutation();

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            const payload = {
                ...values,
                alternatePhoneNumber: values.alternatePhoneNumber || undefined,
                currentSemester: Number(values.currentSemester),
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
                    <div className="flex items-start gap-2 rounded-md bg-bgSecondary border border-borderLight p-3 mb-6">
                        <Info className="w-4 h-4 text-textTertiary shrink-0 mt-0.5" />
                        <p className="text-xs text-textSecondary">
                            Only the details below are needed to create the account. Address, emergency contact,
                            education history, parent/guardian details, and a profile photo are completed by the
                            student themselves from their Dashboard Profile page after they log in.
                        </p>
                    </div>

                    <Formik
                        initialValues={initialValues}
                        validationSchema={createStudentValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-10">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Personal Details</h3>
                                    <StudentPersonalFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} mode="create" />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Contact Information</h3>
                                    <StudentContactFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} mode="create" />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Academic Placement</h3>
                                    <StudentAcademicFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
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
