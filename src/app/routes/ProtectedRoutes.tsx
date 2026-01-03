import type { RouteObject } from "react-router-dom";
import { withAuthGuard } from "../../hoc/withAuthGuard";
import { withScreenGuard } from "../../hoc/withScreenGuard";
import { FacultyLayout } from "../../layouts/faculty/FacultyLayout";
import { StudentLayout } from "../../layouts/student/StudentLayout";
import { facultyRoutes } from "../../features/faculty/routes/facultyRoutes";
import { studentRoutes } from "../../features/student/routes/studentRoutes";
import { SuperAdminLayout } from "../../layouts/super-admin/SuperAdminLayout";
import { superAdminRoutes } from "../../features/super-admin/routes/superAdminRoutes";

const ProtectedSuperAdminLayout = withAuthGuard(withScreenGuard(SuperAdminLayout));
const ProtectedFacultyLayout = withAuthGuard(withScreenGuard(FacultyLayout));
const ProtectedStudentLayout = withAuthGuard(withScreenGuard(StudentLayout));

export const protectedRoutes: RouteObject[] = [
    {
        element: <ProtectedSuperAdminLayout />,
        children: superAdminRoutes
    },
    {
        element: <ProtectedFacultyLayout />,
        children: facultyRoutes
    },
    {
        element: <ProtectedStudentLayout />,
        children: studentRoutes,
    }
];