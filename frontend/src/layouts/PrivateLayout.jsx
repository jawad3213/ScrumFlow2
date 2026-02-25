import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { cn } from '../utils/utils';

import LoadingAnimation from '@/components/ui/loading-animation';
import { useAuth } from '@/features/auth/hooks/useAuth';

const PrivateLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-surface-background">
                <LoadingAnimation message="Securing your session..." />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-surface-background">
            <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
            <div
                className={cn(
                    "flex-1 flex flex-col transition-all duration-300 ease-soft",
                    sidebarCollapsed ? "ml-[80px]" : "ml-[280px]"
                )}
            >
                <Navbar />
                <main className="flex-1 p-8">
                    <ErrorBoundary>
                        <Outlet />
                    </ErrorBoundary>
                </main>
            </div>
        </div>
    );
};

export default PrivateLayout;
