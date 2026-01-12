import React from 'react';
import { useParams } from 'react-router-dom';
import { useProjectDetails } from '@/features/projects/api/useProjectsQuery';
import ExecutivePulse from './ExecutivePulse';
import FinancialTrajectoryChart from './FinancialTrajectoryChart';
import TeamCompositionWidget from './TeamCompositionWidget';
import RiskRadarWidget from './RiskRadarWidget';
import { motion } from 'framer-motion';
import { LayoutDashboard, Loader2 } from 'lucide-react';

const OverviewDashboard = () => {
    const { projectId } = useParams();
    const { data: project, isLoading, error } = useProjectDetails(projectId);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-400">
                <Loader2 size={32} className="animate-spin mb-4 text-brand-primary-500" />
                <p className="text-sm font-medium">Loading Project Insight...</p>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] text-neutral-400">
                <p className="text-sm font-medium text-rose-500">Failed to load project data.</p>
                <div className="text-xs text-neutral-400 mt-2 p-4 bg-neutral-50 rounded-lg max-w-md text-center">
                    {error?.message || "Project not found or server error."}
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <div className="bg-brand-primary-100 text-brand-primary-600 p-1.5 rounded-lg">
                            <LayoutDashboard size={18} />
                        </div>
                        <h2 className="text-2xl font-black text-neutral-900 tracking-tight">Mission Control</h2>
                    </div>
                    <p className="text-sm text-neutral-500 font-medium">
                        Strategic overview for <span className="font-bold text-brand-primary-600">{project.name}</span>
                    </p>
                </div>
                <div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${project.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                            project.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {project.status || 'Pending'}
                    </span>
                </div>
            </div>

            {/* Top Row: Executive Pulse */}
            <ExecutivePulse project={project} />

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 auto-rows-[400px]">
                {/* Main Graph: Spans 2 columns */}
                <div className="lg:col-span-2">
                    <FinancialTrajectoryChart project={project} />
                </div>

                {/* Risk Radar: 1 column */}
                <div className="lg:col-span-1">
                    <RiskRadarWidget project={project} />
                </div>

                {/* Team Comp: 1 column */}
                <div className="lg:col-span-1">
                    <TeamCompositionWidget project={project} />
                </div>

                {/* Empty/Future Widget Area: 2 columns */}
                <div className="lg:col-span-2 bg-gradient-to-br from-neutral-50 to-white border border-dashed border-neutral-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center group hover:border-brand-primary-200 transition-colors">
                    <div className="p-4 bg-white rounded-full shadow-sm mb-4 group-hover:scale-110 transition-transform duration-300">
                        <LayoutDashboard size={24} className="text-neutral-300 group-hover:text-brand-primary-400" />
                    </div>
                    <h4 className="text-neutral-900 font-bold text-sm mb-1">Backlog Analytics</h4>
                    <p className="text-xs text-neutral-400 max-w-xs mx-auto">
                        Detailed breakdown of Epics, User Stories, and Velocity projections coming next.
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default OverviewDashboard;
