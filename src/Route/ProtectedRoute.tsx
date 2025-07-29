import React from 'react';
import { useAppSelector } from '../State/hooks';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
    redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
    children,
    allowedRoles = [],
    redirectTo = '/login'
}: ProtectedRouteProps) => {

    const { isAuthenticated, user, isLoading } = useAppSelector((state) => state.auth);

    // Show loading state while auth is being processed
    if (isLoading) {
        return (
            <>
                <div>Loading...</div>
            </>
        )
    }

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
        return <Navigate to={redirectTo} replace />;
    }

    // Check if user has required role
    if (
        allowedRoles.length > 0 &&
        (!user.role || !allowedRoles.includes(user.role.toLowerCase()))
    ) {
        // Redirect to appropriate dashboard based on user's actual role
        const userRole = user.role ? user.role.toLowerCase() : '';
        switch (userRole) {
            case 'admin':
                return <Navigate to="/admin" replace />;
            case 'faculty':
                return <Navigate to="/faculty" replace />;
            case 'student':
                return <Navigate to="/student" replace />;
            default:
                return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default ProtectedRoute;