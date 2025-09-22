import { useState } from 'react';
import ExamInfo from './ExamInfo';
import Schedule from './Schedule';
import ExamAssignment from './ExamAssignment';
import { ExamMode } from '../../../../../../Utils/enum';
import StepForm, { StepConfig } from '../../../../../../Common/UI/StepForm';


const CreateExam = () => {
    const [currentExamMode, setCurrentExamMode] = useState<ExamMode>(ExamMode.AUTO);

    // State to track form validation for each step
    const [examInfoValid, setExamInfoValid] = useState(false);
    const [targetAudienceValid, setTargetAudienceValid] = useState(false);
    const [scheduleValid, setScheduleValid] = useState(false);    

    const [examInfoData, setExamInfoData] = useState(null);
    const [targetAudienceData, setTargetAudienceData] = useState(null);
    const [scheduleData, setScheduleData] = useState(null);

    const handleExamModeChange = (mode: ExamMode) => {
        setCurrentExamMode(mode);
    };

    const handleExamInfoDataChange = (values: any, isValid: boolean) => {
        setExamInfoData(values);
        setExamInfoValid(isValid);
    };

    const handleTargetAudienceDataChange = (values: any, isValid: boolean) => {
        setTargetAudienceData(values);
        setTargetAudienceValid(isValid);
    };

    const handleScheduleDataChange = (values: any, isValid: boolean) => {
        setScheduleData(values);
        setScheduleValid(isValid);
    };

    const steps: StepConfig[] = [
        {
            id: 'exam-info',
            title: 'Exam Information',
            description: 'Configure basic exam details and settings',
            isValid: examInfoValid,
            component: (
                <ExamInfo
                    onExamModeChange={handleExamModeChange}
                    onFormDataChange={handleExamInfoDataChange}
                    initialData={examInfoData}
                />
            )
        },
        {
            id: 'target-audience',
            title: 'Target Audience',
            description: 'Select batches, courses, and sections',
            isValid: targetAudienceValid,
            component: (
                <ExamAssignment
                    examMode={currentExamMode}
                    onFormDataChange={handleTargetAudienceDataChange}
                    initialData={targetAudienceData}
                />
            )
        },
        {
            id: 'schedule',
            title: 'Schedule',
            description: 'Set exam dates, times, and buffer periods',
            isValid: scheduleValid,
            component: (
                <Schedule
                    examMode={currentExamMode}
                    onFormDataChange={handleScheduleDataChange}
                    initialData={scheduleData}
                />
            )
        },       
    ];

    return (
        <div className="p-4 h-screen">
            <div className="h-full max-w-full mx-auto">
                <StepForm
                    steps={steps}
                    className="h-full"
                    sidebarWidth="w-12 md:w-16"
                    allowSkip={false}
                    showValidationIndicator={true}
                />
            </div>
        </div>
    );
};

export default CreateExam;


    // {
    //     const baseExamData = {
    //         examTitle: ,
    //         examDescription: ,
    //         subject:,
    //         totalMarks: ,
    //         passingMarks:,
    //         duration: ,
    //         examMode: ,
    //         generalInstructions:,
    //         batchId:,
    //         courseId:,
    //         branchId: ,
    //         sectionIds: ,
    //         examSections: 
    // };

    //     if (currentExamMode === ExamMode.AUTO) {
    //         // AUTO mode - uses date range
    //         return {
    //             ...baseExamData,
    //             scheduleDetails: {
    //                 startDate:,
    //                 endDate: ,
    //                 bufferTime: {
    //                     beforeExam:,
    //                     afterExam: 
    //             }
    //             }
    //         };
    //     } else {
    //         // PROCTORING mode - uses specific date and time with assigned faculty
    //         return {
    //             ...baseExamData,
    //             scheduleDetails: {
    //                 examDate: ,
    //                 startTime: ,
    //                 endTime: ,
    //                 bufferTime: {
    //                     beforeExam: ,
    //                     afterExam: 
    //             }
    //             },
    //             assignedFacultyIds: 
    //     };
    //     }
    // }