import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { useNavigate } from 'react-router-dom';
import { Info, GraduationCap, CalendarClock, ShieldCheck } from 'lucide-react';
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
        minTimePerQuestionSeconds: 0,
        minTimePerExamMinutes: 0,
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
                <div className="mb-6">
                    <Button variant="primary" size="sm" onClick={() => navigate('/super-admin/exams')}>
                        ← Back to Exams
                    </Button>
                </div>

                <div className="py-6">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={createExamValidationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ values, errors, touched, handleChange, handleBlur, setFieldValue, isSubmitting }) => (
                            <Form className="space-y-6">
                                <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <Info className="w-5 h-5 text-primary" />
                                        </div>
                                        <h2 className="text-lg font-bold text-textPrimary">Basic Info</h2>
                                    </div>
                                    <ExamBasicFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} />
                                </section>

                                <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <GraduationCap className="w-5 h-5 text-primary" />
                                        </div>
                                        <h2 className="text-lg font-bold text-textPrimary">Academic Hierarchy</h2>
                                    </div>
                                    <ExamHierarchyFields values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} />
                                </section>

                                <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <CalendarClock className="w-5 h-5 text-primary" />
                                        </div>
                                        <h2 className="text-lg font-bold text-textPrimary">Schedule & Marks</h2>
                                    </div>
                                    <ExamScheduleFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} />
                                </section>

                                <section className="bg-whiteColor rounded-xl border border-borderDefault p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                        </div>
                                        <h2 className="text-lg font-bold text-textPrimary">Security & Shuffling</h2>
                                    </div>
                                    <ExamSecurityFields values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} />
                                </section>

                                <div className="flex justify-end gap-3 pt-2">
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
