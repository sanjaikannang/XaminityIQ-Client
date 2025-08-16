import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Formik, Form } from 'formik';
import { CreateExamFormValues } from '../../../../../Types/admin.types';
import StepForm, { Step } from '../../../../../Common/UI/StepForm';
import { ExamMode, ExamStatus } from '../../../../../Utils/enum';
import { createExam } from '../../../../../Services/Admin/adminAPI';
import ExamInfoStep from './Component/ExamInfoStep';
import ExamAssignmentStep from './Component/ExamAssignmentStep';
import ScheduleStep from './Component/ScheduleStep';
import ExamStructureStep from './Component/ExamStructureStep';
import QuestionsStep from './Component/QuestionsStep';
import {
    createExamValidationSchema,
    examAssignmentValidationSchema,
    examInfoValidationSchema,
    scheduleValidationSchema
} from '../../../FormikSchema/create-exam.schema';


const CreateExam: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps: Step[] = [
        { id: 1, title: 'Exam Info', description: 'Basic Exam Information' },
        { id: 2, title: 'Exam Assignment', description: 'Target Audience & Assignment' },
        { id: 3, title: 'Schedule & Timing', description: 'Schedule & Timing' },
        { id: 4, title: 'Exam Structure & Sections', description: 'Exam Structure & Sections' },
        { id: 5, title: 'Questions & Answers', description: 'Questions & Answers' },
    ];

    const initialValues: CreateExamFormValues = {
        examStatus: ExamStatus.DRAFT,
        examTitle: '',
        examDescription: '',
        subject: '',
        totalMarks: 0,
        passingMarks: 0,
        duration: 0,
        examMode: ExamMode.AUTO,
        generalInstructions: [],
        batchId: '',
        courseId: '',
        branchId: '',
        sectionIds: [],
        scheduleDetails: {
            examDate: '',
            startTime: '',
            endTime: '',
            startDate: '',
            endDate: '',
            bufferTime: {
                beforeExam: 0,
                afterExam: 0
            }
        },
        assignedFacultyIds: [],
        examSections: []
    };

    const getStepValidationSchema = (step: number) => {
        switch (step) {
            case 1:
                return examInfoValidationSchema;
            case 2:
                return examAssignmentValidationSchema;
            case 3:
                return scheduleValidationSchema;
            case 4:
            case 5:
                return createExamValidationSchema;
            default:
                return createExamValidationSchema;
        }
    };

    const handleStepChange = (step: number) => {
        setCurrentStep(step);
    };

    const handleNext = async (values: CreateExamFormValues, validateForm: Function) => {
        try {
            const validationSchema = getStepValidationSchema(currentStep);
            await validationSchema.validate(values, { abortEarly: false, context: { examMode: values.examMode } });

            if (currentStep < steps.length) {
                setCurrentStep(currentStep + 1);
            }
        } catch (error: any) {
            if (error.errors) {
                toast.error(`Please fix the following errors: ${error.errors.join(', ')}`);
            } else {
                toast.error('Please fill in all required fields correctly');
            }
        }
    };

    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (values: CreateExamFormValues) => {
        try {
            setIsSubmitting(true);

            // Final validation
            await createExamValidationSchema.validate(values, {
                abortEarly: false,
                context: { examMode: values.examMode }
            });

            const response = await createExam(values);

            if (response.success) {
                toast.success(response.message);
                // Reset form or redirect
                console.log('Exam created successfully:', response.data);
                // You can navigate to exam list or reset the form here
            } else {
                toast.error(response.message);
            }
        } catch (error: any) {
            console.error('Error creating exam:', error);
            if (error.errors) {
                toast.error(`Validation errors: ${error.errors.join(', ')}`);
            } else {
                toast.error(error.message || 'Failed to create exam');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = (values: CreateExamFormValues, errors: any, touched: any, setFieldValue: Function) => {
        switch (currentStep) {
            case 1:
                return (
                    <ExamInfoStep
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                    />
                );
            case 2:
                return (
                    <ExamAssignmentStep
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                    />
                );
            case 3:
                return (
                    <ScheduleStep
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                    />
                );
            case 4:
                return (
                    <ExamStructureStep
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                    />
                );
            case 5:
                return (
                    <QuestionsStep
                        values={values}
                        errors={errors}
                        touched={touched}
                        setFieldValue={setFieldValue}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={createExamValidationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
            >
                {({ values, errors, touched, setFieldValue, validateForm }) => (
                    <Form>
                        <StepForm
                            title="Create Exam"
                            steps={steps}
                            currentStep={currentStep}
                            onStepChange={handleStepChange}
                            onComplete={() => handleSubmit(values)}
                            onNext={() => handleNext(values, validateForm)}
                            onPrevious={handlePrevious}
                            submitButtonText={isSubmitting ? "Creating..." : "Create Exam"}
                            allowStepNavigation={false} // Disable free navigation to ensure validation
                        >
                            {renderStepContent(values, errors, touched, setFieldValue)}
                        </StepForm>
                    </Form>
                )}
            </Formik>
        </>
    );
};

export default CreateExam;