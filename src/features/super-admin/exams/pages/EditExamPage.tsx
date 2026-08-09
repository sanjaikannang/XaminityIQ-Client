import toast from "react-hot-toast";
import { Formik, Form } from 'formik';
import { useNavigate, useParams } from 'react-router-dom';
import Button from "../../../../common/ui/Button";
import { Container } from "../../../../common/ui/Container";
import { PageHeader } from "../../../../common/ui/PageHeader";
import { ExamStatus } from "../../../../utils/enum";
import { createExamValidationSchema } from "../formik/create-exam.schema";
import { useGetExamQuery, useUpdateExamMutation } from "../../../../state/services/endpoints/exams";
import ExamBasicFields from "../components/ExamBasicFields";
import ExamHierarchyFields from "../components/ExamHierarchyFields";
import ExamScheduleFields from "../components/ExamScheduleFields";
import ExamSecurityFields from "../components/ExamSecurityFields";

const EditExamPage = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { data, isLoading: isExamLoading } = useGetExamQuery(id as string, { skip: !id });
    const [updateExam, { isLoading }] = useUpdateExamMutation();

    const exam = data?.data;
    const isPublished = exam?.status === ExamStatus.PUBLISHED;

    if (isExamLoading || !exam) {
        return (
            <>
                <PageHeader>Edit Exam</PageHeader>
                <Container>
                    <div className="py-10 text-center text-textSecondary">Loading...</div>
                </Container>
            </>
        );
    }

    const initialValues = {
        name: exam.name,
        description: exam.description || '',
        mode: exam.mode,
        batchId: exam.batchId,
        courseId: exam.courseId,
        departmentId: exam.departmentId,
        sectionId: exam.sectionId,
        semester: exam.semester,
        subjectId: exam.subjectId,
        durationMinutes: exam.durationMinutes,
        totalMarks: exam.totalMarks,
        passingMarks: exam.passingMarks,
        startDate: exam.startDate.slice(0, 10),
        endDate: exam.endDate.slice(0, 10),
        startTime: exam.startTime || '',
        endTime: exam.endTime || '',
        securitySettings: {
            shuffleQuestions: exam.securitySettings?.shuffleQuestions ?? false,
            shuffleOptions: exam.securitySettings?.shuffleOptions ?? false,
            disableCopyPaste: exam.securitySettings?.disableCopyPaste ?? true,
            disableRightClick: exam.securitySettings?.disableRightClick ?? true,
            requireFullScreenThroughout: exam.securitySettings?.requireFullScreenThroughout ?? true,
            blockBackwardNavigation: exam.securitySettings?.blockBackwardNavigation ?? false,
            tabSwitchViolationThreshold: exam.securitySettings?.tabSwitchViolationThreshold ?? 3,
            fullScreenExitViolationThreshold: exam.securitySettings?.fullScreenExitViolationThreshold ?? 3,
            connectionLossGracePeriodMinutes: exam.securitySettings?.connectionLossGracePeriodMinutes ?? 2,
            cameraMicLossGracePeriodMinutes: exam.securitySettings?.cameraMicLossGracePeriodMinutes ?? 2,
            faceDetectionEnabled: exam.securitySettings?.faceDetectionEnabled ?? false,
        },
    };

    const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
        try {
            const payload = isPublished
                ? { description: values.description }
                : {
                    ...values,
                    semester: Number(values.semester),
                    durationMinutes: Number(values.durationMinutes),
                    totalMarks: Number(values.totalMarks),
                    passingMarks: Number(values.passingMarks),
                    startTime: values.mode === 'PROCTORING' ? values.startTime : undefined,
                    endTime: values.mode === 'PROCTORING' ? values.endTime : undefined,
                };

            const response = await updateExam({ id: id as string, data: payload as any }).unwrap();
            toast.success(response.message || 'Exam updated successfully');
            navigate(`/super-admin/exams/${id}`);
        } catch (error: any) {
            toast.error(error.data?.message || 'Failed to update exam');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <PageHeader>Edit Exam</PageHeader>
            <Container>
                <div className="mb-6">
                    <Button variant="primary" size="sm" onClick={() => navigate(`/super-admin/exams/${id}`)}>
                        ← Back to Exam
                    </Button>
                </div>

                {isPublished && (
                    <p className="mb-4 text-sm text-textSecondary">
                        This exam is published — only the Description can be updated.
                    </p>
                )}

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
                                    <ExamBasicFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} setFieldValue={setFieldValue} disabled={isPublished} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Academic Hierarchy</h3>
                                    <ExamHierarchyFields values={values} errors={errors} touched={touched} setFieldValue={setFieldValue} disabled={isPublished} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Schedule & Marks</h3>
                                    <ExamScheduleFields values={values} errors={errors} touched={touched} handleChange={handleChange} handleBlur={handleBlur} disabled={isPublished} />
                                </section>

                                <section className="space-y-4">
                                    <h3 className="text-lg font-semibold text-textPrimary border-b border-borderLight pb-2">Security & Shuffling</h3>
                                    <ExamSecurityFields values={values} setFieldValue={setFieldValue} handleChange={handleChange} handleBlur={handleBlur} disabled={isPublished} />
                                </section>

                                <div className="flex justify-end gap-3 pt-4 border-t border-borderLight">
                                    <Button type="button" variant="outline" onClick={() => navigate(`/super-admin/exams/${id}`)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="primary" loading={isSubmitting || isLoading} disabled={isSubmitting || isLoading}>
                                        {isSubmitting || isLoading ? '' : 'Save Changes'}
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

export default EditExamPage;
