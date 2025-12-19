import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const PrivateLayout = () => {
    const authToken = localStorage.getItem('auth_token');

    if (!authToken) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-surface-background">
            <Sidebar />
            <div className="ml-[280px] flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PrivateLayout;
