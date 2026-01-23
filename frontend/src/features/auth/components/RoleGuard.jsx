import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_ROLES } from '@/utils/constants';

const RoleGuard = ({ children, role }) => {
    const { userRole, isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return null; // Or a smaller loading spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // If a specific role is required
    if (role) {
        // Mapping 'admin' requirement to 'chef' role
        const requiredRole = role === 'admin' ? USER_ROLES.MANAGER : role;

        if (userRole !== requiredRole) {
            // Unauthorized access, redirect to dashboard or home
            return <Navigate to="/dashboard" replace />;
        }
    }

    return children;
};

export default RoleGuard;
