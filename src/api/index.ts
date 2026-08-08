import { auth } from "./auth.api";
import { academics } from "./academics.api";
import { students } from "./students.api";
import { faculty } from "./faculty.api";
import { subjects } from "./subjects.api";
import { exams } from "./exams.api";
import { studentExams } from "./student-exams.api";

export const api = {
    auth,
    academics,
    students,
    faculty,
    subjects,
    exams,
    studentExams
};
