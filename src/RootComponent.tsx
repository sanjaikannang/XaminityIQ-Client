import { Route, Routes, BrowserRouter as Router, Navigate } from "react-router-dom"
import LandingPage from "./Landing/LandingPage"
import LoginLayout from "./Auth/Layout/LoginLayout"
import ResetPasswordLayout from "./Auth/Layout/ResetPassword"


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

                    {/* Catch all route - redirect to home */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </>
    )
}

export default RootComponent