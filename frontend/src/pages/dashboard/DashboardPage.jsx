import React, { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, Users as UsersIcon } from 'lucide-react';
import client from '@/lib/axios';
import ProjectCard from '@/features/dashboard/components/ProjectCard';
import { motion } from 'framer-motion';
import { cn } from '@/utils/utils';


import LoadingAnimation from '@/components/ui/LoadingAnimation';


const DashboardPage = () => {
    const [data, setData] = useState({ stats: null, projects: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await client('/projects/dashboard');
                setData(response);
            } catch (error) {
                console.error("Dashboard fetch error:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <LoadingAnimation message="Accessing portfolio analytics..." />
            </div>
        );
    }

    const { stats, projects } = data;

    return (
        <div className="flex-1 space-y-10 pt-8 pb-16">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-5 h-5 text-brand-primary-500" />
                        <span className="text-[10px] font-black text-brand-primary-500 uppercase tracking-[0.3em]">System Intelligence</span>
                    </div>
                    <h2 className="text-4xl font-black tracking-tighter text-neutral-900 uppercase">Portfolio Command</h2>
                </div>


            </div>

            {/* Global Stats Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <StatWidget
                    title="Portfolio Balance"
                    value={stats?.total_projects}
                    subtitle="Strategic Engagements"
                    icon={<TrendingUp className="w-5 h-5" />}
                    color="brand"
                />
                <StatWidget
                    title="Portfolio Budget"
                    value={new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD', maximumFractionDigits: 0 }).format(stats?.total_budget || 0)}
                    subtitle={`Avg. ROI: ${stats?.average_roi}%`}
                    icon={<Sparkles className="w-5 h-5" />}
                    color="emerald"
                />
                <StatWidget
                    title="Talent Matrix"
                    value={stats?.engineer_count}
                    subtitle={`${stats?.talent_utilization}% utilization`}
                    icon={<UsersIcon className="w-5 h-5" />}
                    color="indigo"
                />
            </div>

            {/* Projects Grid */}
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-black text-neutral-900 tracking-tight uppercase">Active Engagements</h3>
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">Real-time execution status & roadmap steps</p>
                    </div>

                </div>

                <div className="flex flex-col gap-3">
                    {projects.map((project) => (
                        <ProjectCard key={project.id} project={project} />
                    ))}
                    {projects.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white/50 border-2 border-dashed border-neutral-100 rounded-[32px]">
                            <p className="text-neutral-400 font-bold uppercase tracking-widest">No active projects found</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const StatWidget = ({ title, value, subtitle, icon, color }) => {
    const colors = {
        brand: "bg-brand-primary-500 text-white shadow-brand-primary-500/20",
        emerald: "bg-emerald-500 text-white shadow-emerald-500/20",
        indigo: "bg-indigo-500 text-white shadow-indigo-500/20",
        amber: "bg-amber-500 text-white shadow-amber-500/20"
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white/60 backdrop-blur-xl border border-white/40 p-6 rounded-[32px] shadow-elevation flex flex-col gap-4"
        >
            <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg", colors[color])}>
                {icon}
            </div>
            <div>
                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest block mb-1">{title}</span>
                <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-neutral-900">{value}</span>
                </div>
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mt-1 block">{subtitle}</span>
            </div>
        </motion.div>
    );
};

export default DashboardPage;
