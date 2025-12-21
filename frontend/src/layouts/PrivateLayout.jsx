import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import { cn } from '../utils/utils';

import { useAuth } from '@/hooks/useAuth';

const PrivateLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-surface-background">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-primary-500"></div>
        </div>;
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
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PrivateLayout;
