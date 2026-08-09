import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { createExamValidationSchema } from "../formik/create-exam.schema";
import { useCreateExamMutation } from "../../../../state/services/endpoints/exams";
import ExamBasicFields from "../components/ExamBasicFields";
import ExamHierarchyFields from "../components/ExamHierarchyFields";
import ExamScheduleFields from "../components/ExamScheduleFields";
import ExamSecurityFields from "../components/ExamSecurityFields";

const initialValues = {
    name: '', description: '', mode: '',
    batchId: '', courseId: '', departmentId: '', sectionId: '', semester: '', subjectId: '',
    durationMinutes: '', totalMarks: '', passingMarks: '',
    startDate: '', endDate: '', startTime: '', endTime: '',
    securitySettings: {
        shuffleQuestions: false,
        shuffleOptions: false,
        disableCopyPaste: true,
        disableRightClick: true,
        requireFullScreenThroughout: true,
        blockBackwardNavigation: false,
        tabSwitchViolationThreshold: 3,
        fullScreenExitViolationThreshold: 3,
        connectionLossGracePeriodMinutes: 2,
        cameraMicLossGracePeriodMinutes: 2,
        faceDetectionEnabled: false,
    },
};

const CreateExamPage = () => {
    const navigate = useNavigate();
    const [createExam, { isLoading }] = useCreateExamMutation();

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            const payload = {
                ...values,
                semester: Number(values.semester),
                durationMinutes: Number(values.durationMinutes),
                totalMarks: Number(values.totalMarks),
                passingMarks: Number(values.passingMarks),
                startTime: values.mode === 'PROCTORING' ? values.startTime : undefined,
                endTime: values.mode === 'PROCTORING' ? values.endTime : undefined,
            };

            const response = await createExam(payload as any).unwrap();
            toast.success(response.message || 'Exam created successfully');
            navigate(`/super-admin/exams/${response.examId}`);
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to create exam');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader>Create Exam</PageHeader>
            <Container>
                <div className="py-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={createExamValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-10">
                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Basic Info</h3>
                                    <ExamBasicFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Academic Hierarchy</h3>
                                    <ExamHierarchyFields values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Schedule & Marks</h3>
                                    <ExamScheduleFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Security & Shuffling</h3>
                                    <ExamSecurityFields values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} />
                                </section>

                                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                                    <Button type="button" variant="outline" onClick={() => navigate('/super-admin/exams')}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" loading={isSubmitting || isLoading} disabled={isSubmitting || isLoading}>
                                        {isSubmitting || isLoading ? '' : 'Create Exam'}
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

export default CreateExamPage;
