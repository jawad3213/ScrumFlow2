import React from 'react';
import { Link } from 'react-router-dom';
import {
    CheckCircle2,
    Circle,
    Coins,
    TrendingUp,
    User,
    ArrowRight,
    Layers
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/utils';

const phases = [
    { key: 'has_strategic', label: 'Strategic' },
    { key: 'has_technical', label: 'Technical' },
    { key: 'has_stack', label: 'Stack' },
];

const ProjectCard = ({ project }) => {
    const completedCount = phases.filter(p => project[p.key]).length;
    const progressPercent = Math.round((completedCount / phases.length) * 100);

    return (
        <Link to={`/project/${project.id}`}>
            <motion.div
                whileHover={{ y: -2, boxShadow: '0 8px 30px rgba(0,0,0,0.08)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group relative w-full bg-white border border-neutral-100 rounded-2xl overflow-hidden hover:border-brand-primary-200 transition-colors duration-300"
            >
                {/* Left accent bar */}
                <div className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-500",
                    progressPercent === 100
                        ? "bg-gradient-to-b from-emerald-400 to-emerald-600"
                        : progressPercent > 0
                            ? "bg-gradient-to-b from-brand-primary-400 to-brand-primary-600"
                            : "bg-neutral-200"
                )} />

                <div className="flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-0 p-5 pl-6">

                    {/* === Section 1: Project Identity === */}
                    <div className="flex items-center gap-4 lg:w-[240px] lg:shrink-0">
                        {/* Project icon */}
                        <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            progressPercent === 100
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-brand-primary-50 text-brand-primary-600"
                        )}>
                            <Layers className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm font-black text-neutral-900 tracking-tight truncate">
                                {project.name}
                            </h3>
                            <p className="text-xs text-neutral-400 font-semibold flex items-center gap-1.5 mt-0.5">
                                <User className="w-3 h-3" />
                                <span className="truncate">{project.chef}</span>
                            </p>
                        </div>
                    </div>

                    {/* === Section 2: Analysis Phases === */}
                    <div className="flex items-center gap-6 lg:flex-1 lg:justify-center lg:px-6">
                        {/* Phase badges */}
                        <div className="flex items-center gap-2 flex-wrap">
                            {phases.map((phase) => {
                                const done = project[phase.key];
                                return (
                                    <div
                                        key={phase.key}
                                        className={cn(
                                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300",
                                            done
                                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                                : "bg-neutral-50 text-neutral-400 border border-neutral-100"
                                        )}
                                    >
                                        {done ? (
                                            <CheckCircle2 className="w-3.5 h-3.5" />
                                        ) : (
                                            <Circle className="w-3.5 h-3.5" />
                                        )}
                                        {phase.label}
                                    </div>
                                );
                            })}
                        </div>

                        {/* Progress bar */}
                        <div className="hidden xl:flex items-center gap-3 min-w-[140px]">
                            <div className="flex-1 h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercent}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className={cn(
                                        "h-full rounded-full",
                                        progressPercent === 100
                                            ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                                            : "bg-gradient-to-r from-brand-primary-400 to-brand-primary-500"
                                    )}
                                />
                            </div>
                            <span className={cn(
                                "text-xs font-black tabular-nums",
                                progressPercent === 100 ? "text-emerald-600" : "text-brand-primary-600"
                            )}>
                                {progressPercent}%
                            </span>
                        </div>
                    </div>

                    {/* === Section 3: Metrics === */}
                    <div className="flex items-center gap-4 lg:gap-6 lg:shrink-0">
                        {/* Cost */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50/60 rounded-xl border border-amber-100/60">
                            <Coins className="w-4 h-4 text-amber-500" />
                            <div>
                                <span className="text-[10px] font-bold text-amber-600/70 uppercase tracking-wider block leading-none">Cost</span>
                                <span className="text-sm font-black text-neutral-900 leading-tight">
                                    {new Intl.NumberFormat('fr-MA', {
                                        style: 'currency',
                                        currency: 'MAD',
                                        maximumFractionDigits: 0,
                                        notation: 'compact'
                                    }).format(project.cost || 0)}
                                </span>
                            </div>
                        </div>

                        {/* ROI */}
                        <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50/60 rounded-xl border border-emerald-100/60">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <div>
                                <span className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider block leading-none">ROI</span>
                                <span className="text-sm font-black text-neutral-900 leading-tight">
                                    {project.roi}%
                                </span>
                            </div>
                        </div>

                        {/* Arrow CTA */}
                        <div className="hidden sm:flex w-9 h-9 rounded-xl bg-neutral-50 border border-neutral-100 items-center justify-center group-hover:bg-brand-primary-500 group-hover:border-brand-primary-500 group-hover:text-white text-neutral-400 transition-all duration-300 shrink-0">
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default ProjectCard;
