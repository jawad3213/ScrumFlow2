import React, { useState } from 'react';
import {
    ChevronDown,
    ChevronUp,
    CheckCircle2,
    Clock,
    Coins,
    User,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/utils';

const ProjectCard = ({ project }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <motion.div
            layout
            className="group relative bg-white/40 backdrop-blur-xl border border-white/40 rounded-[32px] overflow-hidden shadow-elevation hover:shadow-2xl transition-all duration-500"
        >
            <div className="p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <h3 className="text-xl font-black text-neutral-900 tracking-tight">{project.name}</h3>
                        </div>
                        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            <User className="w-3 h-3" /> {project.chef}
                        </p>
                    </div>
                </div>

                {/* Analysis Progress Stepper */}
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Analysis Progress</span>
                    </div>

                    <div className="relative flex justify-between items-center px-2">
                        {/* Background line */}
                        <div className="absolute top-[14px] left-0 w-full h-[1px] bg-neutral-100 z-0" />

                        {[
                            { id: 1, label: 'Strategic', done: project.has_strategic },
                            { id: 2, label: 'Technical', done: project.has_technical },
                            { id: 3, label: 'Stack', done: project.has_stack },
                        ].map((step, idx) => {
                            const isDone = step.done;
                            const isNext = !isDone && (idx === 0 || [
                                project.has_strategic,
                                project.has_technical,
                                project.has_stack
                            ][idx - 1]);

                            return (
                                <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                                    <div className={cn(
                                        "w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-white",
                                        isDone ? "bg-brand-primary-500 border-brand-primary-500 text-white shadow-lg shadow-brand-primary-500/20" :
                                            isNext ? "border-brand-primary-500 text-brand-primary-500" : "border-neutral-100 text-neutral-300"
                                    )}>
                                        {isDone ? (
                                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                <CheckCircle2 size={14} strokeWidth={3} />
                                            </motion.div>
                                        ) : (
                                            <span className="text-[10px] font-black">{step.id}</span>
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-[8px] font-black uppercase tracking-tighter transition-colors duration-500",
                                        isDone ? "text-neutral-900" : "text-neutral-400"
                                    )}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-neutral-50/50 rounded-2xl p-4 border border-neutral-100/50">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Project Cost</span>
                        <div className="flex items-center gap-1.5">
                            <Coins className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-sm font-bold text-neutral-900">{new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(project.cost || 0)}</span>
                        </div>
                    </div>
                    <div className="bg-neutral-50/50 rounded-2xl p-4 border border-neutral-100/50">
                        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Proj. ROI</span>
                        <div className="flex items-center gap-1.5">
                            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-sm font-bold text-neutral-900">{project.roi}%</span>
                        </div>
                    </div>
                </div>

                {/* Steps Trigger */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full py-4 border-t border-neutral-100 flex items-center justify-between text-[11px] font-black text-neutral-400 uppercase tracking-[0.2em] hover:text-brand-primary-600 transition-colors group/btn"
                >
                    Project Steps
                    {isExpanded ? <ChevronUp size={16} className="text-neutral-300" /> : <ChevronDown size={16} className="text-neutral-300" />}
                </button>

                {/* Steps Content */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-6 space-y-6">
                                {project.steps && project.steps.length > 0 ? project.steps.map((step, idx) => (
                                    <div key={idx} className="relative pl-6 pb-2 border-l border-neutral-100">
                                        <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-brand-primary-500 border-4 border-white shadow-sm" />
                                        <h4 className="text-[11px] font-black text-neutral-900 uppercase tracking-widest mb-3">{step.title}</h4>
                                        <div className="space-y-2">
                                            {step.stories.map((story, sIdx) => (
                                                <div key={sIdx} className="flex items-start gap-2 bg-neutral-50/30 p-2.5 rounded-xl border border-neutral-100/30">
                                                    <CheckCircle2 className="w-3.5 h-3.5 text-neutral-300 mt-0.5" />
                                                    <span className="text-[11px] font-medium text-neutral-600">{story}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-4 bg-neutral-50/50 rounded-2xl">
                                        <p className="text-[10px] font-black text-neutral-400 uppercase">Analysis Pending</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default ProjectCard;
