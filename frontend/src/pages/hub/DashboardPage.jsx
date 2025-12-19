import React from 'react';
import StatsCards from '../../components/dashboard/StatsCards';
import Overview from '../../components/dashboard/Overview';
import RecentSales from '../../components/dashboard/RecentSales';
import { Download } from 'lucide-react';

const DashboardPage = () => {
    return (
        <div className="flex-1 space-y-4 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard</h2>
                <div className="flex items-center space-x-2">
                    {/* DateRangePicker Placeholder */}
                    <div className="hidden md:flex items-center rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500 shadow-sm">
                        <span>Jan 20, 2024 - Feb 09, 2024</span>
                    </div>
                    <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-primary text-white hover:bg-brand-primary/90 h-10 px-4 py-2">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex items-center space-x-1 rounded-lg bg-neutral-100 p-1 w-fit">
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-white text-neutral-950 shadow-sm">
                    Overview
                </button>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-neutral-500 hover:text-neutral-900">
                    Analytics
                </button>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-neutral-500 hover:text-neutral-900">
                    Reports
                </button>
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-neutral-500 hover:text-neutral-900">
                    Notifications
                </button>
            </div>

            <div className="space-y-4">
                <StatsCards />
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                    <Overview />
                    <RecentSales />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
