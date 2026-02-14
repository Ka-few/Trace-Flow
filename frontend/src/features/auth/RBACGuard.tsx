import React from 'react';
import { useAuth } from './AuthContext';
import type { UserRole } from '../../types/auth';

interface RBACGuardProps {
    children: React.ReactNode;
    allowedRoles: UserRole[];
    fallback?: React.ReactNode;
}

const RBACGuard: React.FC<RBACGuardProps> = ({ children, allowedRoles, fallback = null }) => {
    const { hasRole } = useAuth();

    if (hasRole(allowedRoles)) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
};

export default RBACGuard;
