import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjectDetails } from '@/features/projects/api/useProjectsQuery';
import { deleteProject } from '@/features/projects/api/projects';
import ExecutivePulse from './ExecutivePulse';
import FinancialTrajectoryChart from './FinancialTrajectoryChart';
import TeamCompositionWidget from './TeamCompositionWidget';
import TechStackSnapshot from './TechStackSnapshot';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Trash2, AlertTriangle } from 'lucide-react';
import ProjectProgressStepper from './ProjectProgressStepper';
import LoadingAnimation from '@/components/ui/LoadingAnimation';

const OverviewDashboard = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: project, isLoading, error } = useProjectDetails(id);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteProject(id);
            navigate('/'); // Redirect to projects list
        } catch (err) {
            console.error("Failed to delete project:", err);
            setIsDeleting(false);
            // Optional: Add toast error handling here
        }
    };

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh]">
                <LoadingAnimation
                    className="w-64"
                    message="Setting up your mission control..."
                />
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
                <div className="flex flex-col">
                    <h1 className="text-3xl font-black tracking-tight text-neutral-900">Mission Control</h1>
                    <p className="text-neutral-500 font-medium mt-2">
                        Strategic overview for <span className="font-bold text-neutral-900">{project.name}</span>
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${project.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        project.status === 'active' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-amber-50 text-amber-600 border-amber-100'
                        }`}>
                        {project.status || 'Pending'}
                    </span>

                    <button
                        onClick={() => setIsDeleteModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-100 rounded-lg transition-colors"
                        title="Delete Project"
                    >
                        <Trash2 size={14} />
                        Delete Project
                    </button>
                </div>
            </div>

            {/* Progress Stepper */}
            <ProjectProgressStepper project={project} />

            {/* Cards: Duration, Team, Cost */}
            <ExecutivePulse project={project} />

            {/* Main Content Grid - Top Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Financial Trajectory */}
                <div className="lg:col-span-2 h-[400px]">
                    <FinancialTrajectoryChart project={project} />
                </div>

                {/* Right Column: Team Composition */}
                <div className="h-[400px]">
                    <TeamCompositionWidget project={project} />
                </div>
            </div>

            {/* Bottom Row: Tech Stack - Full Width */}
            <div className="w-full mt-8">
                <TechStackSnapshot project={project} />
            </div>

            {/* Delete Confirmation Modal */}
            <AnimatePresence>
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-neutral-100"
                        >
                            <div className="flex items-center gap-4 mb-4">
                                <div className="bg-rose-100 text-rose-600 p-3 rounded-full">
                                    <AlertTriangle size={24} />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-neutral-900">Delete Project?</h3>
                                    <p className="text-xs text-neutral-500">This action cannot be undone.</p>
                                </div>
                            </div>

                            <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
                                Are you sure you want to delete <span className="font-bold text-neutral-900">{project.name}</span>?
                                <br /><br />
                                All associated data including <span className="text-rose-600 font-medium">Financial Projections</span>,
                                <span className="text-rose-600 font-medium"> Tech Stack Analysis</span>, and
                                <span className="text-rose-600 font-medium"> Team Configurations</span> will be permanently removed.
                            </p>

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-50 rounded-xl transition-colors"
                                    disabled={isDeleting}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={isDeleting}
                                    className="px-4 py-2 text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-sm shadow-rose-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isDeleting ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin" />
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} />
                                            Delete Permanently
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default OverviewDashboard;
