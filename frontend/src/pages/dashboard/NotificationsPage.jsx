import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layout,
    CheckCircle2,
    Database,
    Server,
    AlertTriangle,
    Zap,
    Cpu,
    Lock,
    Layers,
    ChevronRight,
    ChevronDown,
    Briefcase,
    Target,
    Cloud,
    Lightbulb,
    GraduationCap,
    ArrowRight
} from 'lucide-react';
import { TEST_STACK_DATA } from '../../data/testStackData';

// --- Shared Components ---

const AccordionCard = ({ title, subtitle, icon: Icon, children, defaultOpen = false, color = "neutral", className = "" }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-neutral-50/50 transition-colors"
            >
                <div className="flex items-center gap-4 text-left">
                    <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600 border border-${color}-100`}>
                        <Icon size={24} />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-neutral-900 leading-tight">{title}</h3>
                        {subtitle && <p className="text-sm font-medium text-neutral-500 mt-0.5">{subtitle}</p>}
                    </div>
                </div>
                <div className={`p-2 rounded-full text-neutral-400 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-neutral-100' : ''}`}>
                    <ChevronDown size={20} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <div className="p-6 pt-0 border-t border-neutral-50">
                            <div className="pt-6">
                                {children}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const TechCard = ({ tech }) => {
    return (
        <div className="relative p-5 rounded-xl border border-neutral-200 bg-white shadow-sm h-full flex flex-col">
            <div className="flex items-start justify-between mb-3">
                <h4 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                    {tech.name}
                    {tech.category === 'Tooling' && <span className="px-1.5 py-0.5 rounded text-[9px] bg-neutral-100 text-neutral-500 uppercase">Tool</span>}
                </h4>
            </div>
            <p className="text-xs text-neutral-600 leading-relaxed font-medium mb-4 flex-grow">
                {tech.justification}
            </p>

            <div className="space-y-2 pt-3 border-t border-neutral-100 mt-auto">
                {tech.pros.map((pro, i) => (
                    <div key={`pro-${i}`} className="flex items-start gap-2 text-[10px] text-emerald-600 font-medium">
                        <CheckCircle2 size={12} className="shrink-0 mt-0.5" />
                        <span className="leading-tight">{pro}</span>
                    </div>
                ))}
                {tech.cons && tech.cons.map((con, i) => (
                    <div key={`con-${i}`} className="flex items-start gap-2 text-[10px] text-amber-600 font-medium">
                        <AlertTriangle size={12} className="shrink-0 mt-0.5" />
                        <span className="leading-tight">{con}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const AnalysisOverview = ({ analysis }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100/50">
                <div className="flex items-center gap-2 mb-3 text-indigo-700">
                    <Briefcase size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Profile</span>
                </div>
                <div className="space-y-4">
                    <div>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase">Type</span>
                        <p className="text-lg font-bold text-neutral-900">{analysis.project_type}</p>
                    </div>
                    <div>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase">Complexity</span>
                        <div className="flex items-center gap-2">
                            <div className="w-full h-1.5 bg-white rounded-full overflow-hidden flex-1">
                                <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${analysis.complexity_score * 10}%` }}></div>
                            </div>
                            <span className="text-xs font-black text-indigo-600">{analysis.complexity_score}/10</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100/50 lg:col-span-2">
                <div className="flex items-center gap-2 mb-3 text-emerald-700">
                    <Target size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Key Requirements</span>
                </div>
                <div className="flex flex-wrap gap-2">
                    {analysis.key_features_summary.slice(0, 6).map((f, i) => (
                        <span key={i} className="px-2.5 py-1.5 rounded-lg bg-white border border-emerald-100 text-[11px] font-bold text-neutral-600 shadow-sm leading-tight">
                            {f}
                        </span>
                    ))}
                    {analysis.key_features_summary.length > 6 && (
                        <span className="px-2.5 py-1.5 rounded-lg bg-emerald-100/50 text-[11px] font-bold text-emerald-600">
                            +{analysis.key_features_summary.length - 6} more
                        </span>
                    )}
                </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50/50 border border-rose-100/50 lg:col-span-3">
                <div className="flex items-center gap-2 mb-3 text-rose-700">
                    <Lock size={16} />
                    <span className="text-xs font-black uppercase tracking-widest">Core Constraints</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                    {analysis.primary_constraints.map((c, i) => (
                        <div key={i} className="flex items-center gap-2 text-xs font-medium text-neutral-600">
                            <div className="w-1 h-1 rounded-full bg-rose-400 shrink-0" />
                            {c}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const NotificationsPage = () => {
    const data = TEST_STACK_DATA;

    return (
        <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 font-sans selection:bg-brand-primary-100">
            <div className="max-w-5xl mx-auto px-6 py-12 space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between"
                >
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-neutral-900 flex items-center justify-center text-white shadow-lg">
                            <Cpu size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight text-neutral-900">Stack Strategy Ready</h1>
                            <p className="text-sm font-medium text-neutral-500">AI Architectural Analysis • <span className="text-green-600">Completed just now</span></p>
                        </div>
                    </div>
                </motion.div>

                {/* 1. First Choice (Primary Strategy) */}
                <AccordionCard
                    title={data.primary_recommendation.strategy_name}
                    subtitle="First Choice Technology • Premier Recommended Strategy"
                    icon={Zap}
                    color="amber"
                    defaultOpen={true}
                    className="border-brand-primary-200 ring-2 ring-brand-primary-50/50"
                >
                    <div className="mb-8 p-4 rounded-xl bg-neutral-50 border border-neutral-100 text-sm font-medium text-neutral-600 italic leading-relaxed">
                        "{data.primary_recommendation.synergy_explanation}"
                    </div>

                    <div className="space-y-10">
                        {/* Frontend */}
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                                <Layout size={14} /> Frontend Layer
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.primary_recommendation.frontend.map((t, i) => <TechCard key={i} tech={t} />)}
                            </div>
                        </div>

                        {/* Backend */}
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                                <Server size={14} /> Backend & AI
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.primary_recommendation.backend.map((t, i) => <TechCard key={i} tech={t} />)}
                            </div>
                        </div>

                        {/* Data */}
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                                <Database size={14} /> Data Layer
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.primary_recommendation.database.map((t, i) => <TechCard key={i} tech={t} />)}
                            </div>
                        </div>

                        {/* DevOps */}
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                                <Cloud size={14} /> Infrastructure
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.primary_recommendation.devops_infrastructure.map((t, i) => <TechCard key={i} tech={t} />)}
                            </div>
                        </div>
                    </div>
                </AccordionCard>

                {/* 2. Second Choice (Alternative Strategy) */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <AccordionCard
                        title="Second Choice Technology"
                        subtitle={`${data.alternative_recommendation.strategy_name} • Alternative Path`}
                        icon={ArrowRight}
                        color="neutral"
                    >
                        <p className="text-sm font-medium text-neutral-600 mb-6 italic">
                            An alternative high-performance approach focusing on:
                            <span className="text-neutral-900 font-bold ml-1">{data.alternative_recommendation.synergy_explanation.split('.')[0]}...</span>
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {data.alternative_recommendation.backend.map((t, i) => (
                                <div key={i} className="px-3 py-2 rounded-lg bg-neutral-100 text-xs font-bold text-neutral-600 text-center">
                                    {t.name}
                                </div>
                            ))}
                            {data.alternative_recommendation.devops_infrastructure.map((t, i) => (
                                <div key={i} className="px-3 py-2 rounded-lg bg-neutral-100 text-xs font-bold text-neutral-600 text-center">
                                    {t.name}
                                </div>
                            ))}
                        </div>
                    </AccordionCard>
                </motion.div>

                {/* 3. Analysis Context */}
                <AccordionCard
                    title="Project Analysis"
                    subtitle="Requirements, constraints, and complexity profile"
                    icon={Layers}
                    color="indigo"
                >
                    <AnalysisOverview analysis={data.analysis} />
                </AccordionCard>

                {/* 4. Risks & Guidance (Accordion Group) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <AccordionCard
                        title="Risk Assessment"
                        subtitle={`${data.risk_assessment.length} Potential challenges identified`}
                        icon={AlertTriangle}
                        color="red"
                    >
                        <div className="space-y-4">
                            {data.risk_assessment.map((risk, i) => {
                                const [title, ...descParts] = risk.split(':');
                                const description = descParts.join(':');
                                return (
                                    <div key={i} className="flex gap-3 items-start">
                                        <div className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                            {i + 1}
                                        </div>
                                        <div className="text-xs text-neutral-600 leading-relaxed">
                                            <strong className="block text-red-700 mb-1">{title}</strong>
                                            {description}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </AccordionCard>

                    <AccordionCard
                        title="Junior Tips"
                        subtitle="Implementation guidance for the team"
                        icon={GraduationCap}
                        color="blue"
                    >
                        <div className="space-y-4">
                            {data.junior_developer_tips.map((tip, i) => (
                                <div key={i} className="flex gap-3 items-start">
                                    <div className="w-5 h-5 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                                        <Lightbulb size={12} />
                                    </div>
                                    <p className="text-xs font-medium text-neutral-600 leading-relaxed">
                                        {tip}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </AccordionCard>
                </div>

            </div>
        </div>
    );
};

export default NotificationsPage;