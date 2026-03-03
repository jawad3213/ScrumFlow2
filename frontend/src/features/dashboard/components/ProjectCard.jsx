import React from 'react';
import { Link } from 'react-router-dom';
import {
    TrendingUp,
    ArrowRight,
    Layers,
    Navigation,
    Layout
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/utils';

const phases = [
    { key: 'has_strategic', label: 'Financial' },
    { key: 'has_technical', label: 'Scrum Master' },
    { key: 'has_stack', label: 'Tech Stack' },
];

const ProjectCard = ({ project }) => {
    const completedCount = phases.filter(p => project[p.key]).length;
    const progressPercent = Math.round((completedCount / phases.length) * 100);

    const getStatusColor = (status) => {
        switch (status) {
            case 'Ready to Execute': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            case 'Blueprint Analysis': return 'bg-brand-primary-500/10 text-brand-primary-500 border-brand-primary-500/20';
            case 'Stack Defined': return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
            default: return 'bg-neutral-500/10 text-neutral-500 border-neutral-500/20';
        }
    };

    return (
        <Link to={`/project/${project.id}`} className="block">
            <motion.div
                whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(0,0,0,0.06)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                className="group relative w-full bg-white border border-neutral-100 rounded-[32px] overflow-hidden transition-all duration-500 shadow-sm"
            >
                {/* Visual Accent Layer */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-brand-primary-500/5 to-transparent rounded-full -mr-32 -mt-32 blur-3xl" />

                <div className="p-8 relative">
                    <div className="flex flex-col xl:flex-row gap-8">

                        {/* Section 1: Project Identity & Metrics */}
                        <div className="flex flex-col gap-6 xl:w-[300px] shrink-0">
                            <div className="flex items-start gap-5">
                                <div className={cn(
                                    "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform group-hover:scale-110 duration-500",
                                    progressPercent === 100
                                        ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                        : "bg-brand-primary-50 text-brand-primary-600 border border-brand-primary-100"
                                )}>
                                    <Layers className="w-7 h-7" />
                                </div>
                                <div className="min-w-0 pt-1">
                                    <h3 className="text-base font-black text-neutral-900 tracking-tight uppercase truncate">
                                        {project.name}
                                    </h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <div className={cn(
                                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border",
                                            getStatusColor(project.status)
                                        )}>
                                            {project.status}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">ROI Potential</span>
                                    <span className="text-xl font-black text-neutral-900 flex items-center gap-1.5">
                                        {project.roi || 0}%
                                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                                    </span>
                                </div>
                                <div className="w-px h-8 bg-neutral-100" />
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Budget</span>
                                    <span className="text-xl font-black text-neutral-900">
                                        {new Intl.NumberFormat('fr-MA', {
                                            style: 'currency',
                                            currency: 'MAD',
                                            maximumFractionDigits: 0,
                                            notation: 'compact'
                                        }).format(project.cost || 0)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Strategic Roadmap Visualization */}
                        <div className="flex-1 min-w-0 bg-neutral-50/50 rounded-[28px] p-6 border border-neutral-100 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Navigation className="w-4 h-4 text-brand-primary-500" />
                                    <span className="text-[11px] font-black text-neutral-700 uppercase tracking-widest">Financial Roadmap Preview</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {project.roadmap && project.roadmap.length > 0 ? (
                                    project.roadmap.slice(0, 3).map((step, idx) => (
                                        <div key={idx} className="bg-white p-4 rounded-2xl border border-neutral-100 shadow-sm transition-colors group-hover:border-brand-primary-100/50">
                                            <div className="text-[11px] font-black text-neutral-900 truncate uppercase tracking-tight mb-2">
                                                {step.title}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Layout className="w-3 h-3 text-neutral-300" />
                                                <span className="text-[10px] font-bold text-neutral-400">{step.story_count} user stories</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full py-4 flex flex-col items-center justify-center gap-2 text-neutral-400">
                                        <p className="text-[10px] font-black uppercase tracking-widest">Initializing Scrum Master Blueprint</p>
                                    </div>
                                )}
                            </div>

                            {/* Phase Progress Bar */}
                            <div className="mt-auto pt-4 border-t border-neutral-100/50">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Execution Progress</span>
                                    <span className="text-[10px] font-black text-brand-primary-600">{progressPercent}%</span>
                                </div>
                                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden p-0.5">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        className={cn(
                                            "h-full rounded-full transition-all duration-500",
                                            progressPercent === 100 ? "bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.3)]" : "bg-brand-primary-500 shadow-[0_0_12px_rgba(59,130,246,0.3)]"
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Arrow CTA */}
                        <div className="xl:w-16 flex items-center justify-center shrink-0 border-l border-neutral-100/50 pl-4">
                            <div className="w-12 h-12 rounded-2xl bg-neutral-50 border border-neutral-100 text-neutral-400 flex items-center justify-center group-hover:bg-brand-primary-500 group-hover:text-white group-hover:shadow-lg group-hover:shadow-brand-primary-500/20 transition-all duration-500">
                                <ArrowRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Phase Line */}
                <div className="grid grid-cols-3 h-1">
                    {phases.map(phase => (
                        <div
                            key={phase.key}
                            className={cn(
                                "transition-colors duration-1000",
                                project[phase.key] ? "bg-emerald-500" : "bg-neutral-50"
                            )}
                        />
                    ))}
                </div>
            </motion.div>
        </Link>
    );
};

export default ProjectCard;
