import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom"
import LandingPage from "./Landing/LandingPage"
import LoginLayout from "./Auth/Layout/LoginLayout"
import ResetPasswordLayout from "./Auth/Layout/ResetPassword"
import AdminLayout from "./User/Admin/AdminLayout"
import FacultyLayout from "./User/Faculty/FacultyLayout"
import StudentLayout from "./User/Student/StudentLayout"
import ProtectedRoute from "./Route/ProtectedRoute"


const RootComponent = () => {

    return (
        <>
            <Router>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/login" element={<LoginLayout />} />
                    <Route path="/change-password" element={<ResetPasswordLayout />} />

                    {/* Protected Routes */}
                    <Route path="/admin/*" element={<ProtectedRoute allowedRoles={['admin']}><AdminLayout /></ProtectedRoute>} />
                    <Route path="/faculty/*" element={<ProtectedRoute allowedRoles={['faculty']}><FacultyLayout /></ProtectedRoute>} />
                    <Route path="/student/*" element={<ProtectedRoute allowedRoles={['student']}><StudentLayout /></ProtectedRoute>} />

                    {/* Catch all route - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </>
    )
}

export default RootComponent