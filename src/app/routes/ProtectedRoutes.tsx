import type { RouteObject } from "react-router-dom";
import { withAuthGuard } from "../../hoc/withAuthGuard";
import { RootLayout } from "../../layouts/root/RootLayout";
import { withScreenGuard } from "../../hoc/withScreenGuard";
import { ExamRoomLayout } from "../../layouts/exam-room/ExamRoomLayout";
import { facultyRoutes } from "../../features/faculty/routes/facultyRoutes";
import { studentRoutes } from "../../features/student/routes/studentRoutes";
import { examRoomRoutes } from "../../features/student/exams/routes/examRoomRoutes";
import { superAdminRoutes } from "../../features/super-admin/routes/superAdminRoutes";

const ProtectedRootLayout = withAuthGuard(withScreenGuard(RootLayout));
// Exam-taking pages need auth + the desktop-only screen guard, but NOT the
// sidebar/header shell — a distraction-free surface, per the exam spec.
const ExamRoomProtectedLayout = withAuthGuard(withScreenGuard(ExamRoomLayout));

export const protectedRoutes: RouteObject[] = [
    {
        element: <ProtectedRootLayout />,
        children: [
            ...superAdminRoutes,
            ...facultyRoutes,
            ...studentRoutes,
        ],
    },
    {
        element: <ExamRoomProtectedLayout />,
        children: [
            ...examRoomRoutes,
        ],
    },
];