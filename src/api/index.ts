import { auth } from "./auth.api";
import { academics } from "./academics.api";
import { students } from "./students.api";
import { faculty } from "./faculty.api";
import { subjects } from "./subjects.api";
import { exams } from "./exams.api";
import { studentExams } from "./student-exams.api";
import { studentProctoring } from "./student-proctoring.api";
import { facultyProctoring } from "./faculty-proctoring.api";
import { writtenAnswer } from "./written-answer.api";
import { evaluation } from "./evaluation.api";
import { dashboard } from "./dashboard.api";

export const api = {
    auth,
    academics,
    students,
    faculty,
    subjects,
    exams,
    studentExams,
    studentProctoring,
    facultyProctoring,
    writtenAnswer,
    evaluation,
    dashboard
};
