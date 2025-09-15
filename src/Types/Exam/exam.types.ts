import { ExamMode } from "../../Utils/enum";

export interface Section {
    id: string;
    name: string;
    order: string;
    marks: string;
    questionType: string;
    totalQuestions: string;
    timeLimit: string;
    isOptional: boolean;
    instructions: string[];
    isExpanded: boolean;
}

export interface ExamInfoFormData {
    examMode: ExamMode;
    examTitle: string;
    subject: string;
    totalMarks: number | '';
    passingMarks: number | '';
    duration: number | '';
    examDescription: string;
    generalInstructions: string[];
}

export interface FormValidationState {
    examInfo: boolean;
    targetAudience: boolean;
    schedule: boolean;
    examStructure: boolean;
    questions: boolean;
}