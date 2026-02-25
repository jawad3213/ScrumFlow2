import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Info, Layers, FileJson, Server, Layout, Database,
    ChevronRight, ChevronLeft, CheckCircle2, Loader2, Save, Cpu,
    BookOpen, ChevronUp, ChevronDown, Bookmark, ListTodo,
    AlertTriangle, Zap, Lock, Briefcase, Target, Cloud,
    Lightbulb, GraduationCap, ArrowRight
} from 'lucide-react';

import { MagicCard } from '@/components/ui/magic-card';

import { analyzeStack } from '@/features/ai-analysis/api/ai';
import { useProjectDetails } from '@/features/projects/api/useProjectsQuery';
import { saveProjectStack } from '@/features/projects/api/projects';
import StorageService from '@/utils/storage';
import { cn } from '@/utils/utils';

// Unified loading for consistency
import LoadingAnimation from '@/components/ui/loading-animation';

const STEPS = [
    { id: 1, title: "Context", icon: Info },
    { id: 2, title: "Input", icon: FileJson },
    { id: 3, title: "Analysis", icon: Layers },
    { id: 4, title: "Strategy", icon: Server }
];

const slideVariants = {
    enter: (direction) => ({
        x: direction > 0 ? 20 : -20,
        opacity: 0
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1
    },
    exit: (direction) => ({
        zIndex: 0,
        x: direction < 0 ? 20 : -20,
        opacity: 0
    })
};

const cascadeContainer = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
};

const cascadeItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

// --- Shared Components from NotificationsPage ---

const AccordionCard = ({ title, subtitle, icon: Icon, children, defaultOpen = false, color = "neutral", className = "" }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={`bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm transition-shadow hover:shadow-md ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 bg-white hover:bg-neutral-50/50 transition-colors"
                type="button"
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

const StackChoiceView = ({ projectId }) => {
    const { data: project, isLoading: isProjectLoading } = useProjectDetails(projectId);

    // Check if backlog exists (mapped to epics in DB)
    const hasBacklog = Boolean(project?.epics && project.epics.length > 0);

    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [stackData, setStackData] = useState(null);
    const [error, setError] = useState(null);
    const [apiKey, setApiKey] = useState(StorageService.getGeminiKey() || '');
    const [isSaving, setIsSaving] = useState(false);
    // File state - Removed file upload as we use system data
    // const [selectedFile, setSelectedFile] = useState(null);
    // const [useSystemData, setUseSystemData] = useState(false); 

    // UI state for Backlog Accordion
    const [expandedEpics, setExpandedEpics] = useState({});

    // Prevent wizard flash: Show loader if loading OR if project has data but we haven't set state yet
    const shouldShowLoader = isProjectLoading || (project?.architecture_plan && !stackData);

    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (project?.stack_analysis_data) {
            setStackData(project.stack_analysis_data);
            setCurrentStep(4);
            setIsSaved(true);
        } else if (project?.architecture_plan && project?.recommended_stack) {
            // Legacy/Fallback support
            setStackData({
                analysis: project.architecture_plan.analysis || project.architecture_plan,
                primary_recommendation: project.recommended_stack,
                alternative_recommendation: null,
                risk_assessment: project.architecture_plan.risk_assessment || []
            });
            setCurrentStep(4);
            setIsSaved(true);
        }
    }, [project]);

    if (shouldShowLoader) {
        return (
            <div className="w-full h-[80vh] flex flex-col items-center justify-center">
                <LoadingAnimation
                    className="w-64"
                    message="Retrieving Strategy..."
                />
            </div>
        );
    }

    const handleSaveAnalysis = async () => {
        setIsSaving(true);
        try {
            await saveProjectStack(projectId, {
                stack_analysis_data: stackData, // Store the full rich data object
                architecture_plan: {
                    analysis: stackData.analysis,
                    risk_assessment: stackData.risk_assessment
                },
                recommended_stack: stackData.primary_recommendation, // Default to primary for legacy
                stack_name: stackData.primary_recommendation?.strategy_name || "AI Generated Stack"
            });
            alert("Full Analysis Context Saved Successfully!");
            setIsSaved(true);
        } catch (e) {
            console.error(e);
            alert("Failed to save: " + (e.message || "Unknown error"));
        } finally {
            setIsSaving(false);
        }
    };

    const toggleEpic = (epicId) => {
        setExpandedEpics(prev => ({ ...prev, [epicId]: !prev[epicId] }));
    };

    const handleNext = () => {
        if (!hasBacklog) return;
        // Step 2 is now just a review, so we can always proceed if backlog exists
        // if (currentStep === 2 && !selectedFile && !useSystemData && !isAnalyzing) return; 

        if (currentStep < 4) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
            setError(null);
        }
    };

    const runAnalysis = async () => {
        if (!hasBacklog) {
            setError("No project backlog found to analyze.");
            return;
        }

        if (!apiKey) {
            setError("API Key is missing.");
            return;
        }

        setIsAnalyzing(true);
        setError(null);

        const formData = new FormData();

        // Always use system backlog
        const backlogObj = { backlog: project.epics };
        const jsonBlob = new Blob([JSON.stringify(backlogObj)], { type: "application/json" });
        formData.append('file', jsonBlob, "system_backlog.json");

        formData.append('api_key', apiKey);

        try {
            const data = await analyzeStack(formData);
            setStackData(data);
            setDirection(1);
            setCurrentStep(4);
        } catch (err) {
            console.error(err);
            const errorMessage = err.response?.data?.detail || err.message || "Failed to analyze stack. Please check the data and try again.";
            setError(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    // --- RENDERERS ---

    const renderStep1 = () => (
        <motion.div variants={cascadeContainer} initial="hidden" animate="show" className="space-y-6 text-center max-w-2xl mx-auto py-10">
            <motion.div variants={cascadeItem} className="flex justify-center">
                <div className={`w-24 h-24 rounded-[32px] flex items-center justify-center border mb-6 ${hasBacklog ? 'bg-brand-primary-50 border-brand-primary-100' : 'bg-neutral-100 border-neutral-200'}`}>
                    <Layers className={`w-10 h-10 ${hasBacklog ? 'text-brand-primary-600' : 'text-neutral-400'}`} />
                </div>
            </motion.div>

            <motion.h3 variants={cascadeItem} className="text-3xl font-black text-neutral-900 tracking-tight">
                Architectural Strategy
            </motion.h3>

            <motion.div variants={cascadeItem} className="space-y-4">
                <p className="text-neutral-500 font-medium leading-relaxed max-w-lg mx-auto">
                    The technology analysis will be conducted using the <span className="text-neutral-900 font-bold">existing project backlog</span>.
                </p>

                {!isProjectLoading && (
                    <div className={`max-w-md mx-auto p-4 rounded-2xl border ${hasBacklog ? 'bg-emerald-50 border-emerald-100 text-emerald-800' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                        {hasBacklog ? (
                            <div className="flex items-center justify-center gap-2">
                                <CheckCircle2 size={18} />
                                <span className="text-xs font-bold uppercase tracking-wide">Backlog Detected & Ready</span>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <p className="text-sm font-bold">Backlog Not Found</p>
                                <p className="text-xs opacity-90">
                                    You must generate or define the project backlog first before the AI can recommend a technology stack.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </motion.div>

            <motion.div variants={cascadeItem} className="grid grid-cols-3 gap-4 mt-8 opacity-60 grayscale-[0.5]">
                {[
                    { label: "Frontend", icon: Layout },
                    { label: "Backend", icon: Server },
                    { label: "Data", icon: Database }
                ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex flex-col items-center gap-2">
                        <item.icon size={20} className="text-neutral-400" />
                        <span className="text-xs font-bold text-neutral-900 uppercase tracking-wide">{item.label}</span>
                    </div>
                ))}
            </motion.div>
        </motion.div>
    );

    const renderStep2 = () => {
        if (!project?.epics || !Array.isArray(project.epics)) {
            return (
                <div className="text-center py-10 text-neutral-500">
                    No backlog data available.
                </div>
            );
        }

        return (
            <motion.div variants={cascadeContainer} initial="hidden" animate="show" className="space-y-6 max-w-3xl mx-auto py-4">
                <div className="text-center">
                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Data Scope</h3>
                    <p className="text-sm text-neutral-500 font-medium mt-1">
                        Review the <span className="text-brand-primary-600 font-bold">{project.epics.length} Epics</span> and their User Stories.
                    </p>
                </div>

                <div className="bg-brand-primary-50 border border-brand-primary-100 rounded-2xl p-5 mb-4 shadow-sm">
                    <h4 className="flex items-center gap-2 text-brand-primary-800 font-bold text-[11px] uppercase tracking-wide mb-3">
                        <CheckCircle2 size={14} />
                        Full Context Analysis
                    </h4>
                    <p className="text-[11px] text-brand-primary-700 leading-relaxed mb-4">
                        The AI will process the complete project backlog structure. The following data points are included in the analysis payload:
                    </p>
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                        {[
                            "User Stories", "Acceptance Criteria",
                            "Story Points", "Implementation Tasks",
                            "Engineer Roles & Levels", "Estimated Hours"
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 text-[10px] font-bold text-brand-primary-900/60 uppercase tracking-wider">
                                <div className="w-1 h-1 rounded-full bg-brand-primary-500" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-3 max-h-[380px] overflow-y-auto custom-scrollbar pr-2 pb-2">
                    {project.epics.map((epic, epicIdx) => {
                        const storyCount = epic.stories?.length || 0;
                        const totalHours = epic.stories?.reduce((acc, s) => acc + (s.tasks?.reduce((tAcc, t) => tAcc + (t.hours || 0), 0) || 0), 0) || 0;

                        return (
                            <motion.div
                                key={epic.id || epicIdx}
                                variants={cascadeItem}
                            >
                                <div className="p-4 rounded-2xl border border-neutral-100 bg-white/80 backdrop-blur-md flex items-center gap-4 hover:border-brand-primary-200 transition-all hover:shadow-md group">
                                    <div className="p-3 bg-neutral-50 text-neutral-400 rounded-xl group-hover:bg-brand-primary-50 group-hover:text-brand-primary-500 transition-colors">
                                        <BookOpen size={18} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="text-sm font-bold text-neutral-900 tracking-tight truncate">{epic.title}</h4>
                                        <p className="text-[11px] text-neutral-500 font-medium line-clamp-1 mt-0.5">{epic.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4 border-l border-neutral-100 pl-4">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[10px] font-bold text-neutral-900 uppercase tracking-wider">{storyCount} Stories</span>
                                            {totalHours > 0 && <span className="text-[9px] text-neutral-400 font-medium">{totalHours}h Tasks</span>}
                                        </div>
                                        <div className="text-brand-primary-500 opacity-0 group-hover:opacity-100 transition-opacity transform scale-75 group-hover:scale-100">
                                            <CheckCircle2 size={20} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="flex justify-center pt-6">
                    <button
                        onClick={runAnalysis}
                        className="bg-neutral-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] hover:bg-brand-primary-500 transition-colors shadow-xl shadow-neutral-900/10 hover:shadow-brand-primary-500/20 flex items-center gap-3"
                    >
                        <Cpu size={20} />
                        Start AI Analysis
                    </button>
                </div>

                {error && (
                    <div className="text-red-500 text-sm font-bold text-center bg-red-50 p-3 rounded-xl">
                        {error}
                    </div>
                )}
            </motion.div>
        );
    };

    const renderAnalyzing = () => (
        <div className="flex flex-col items-center justify-center py-20 space-y-8">
            <LoadingAnimation message="Architecting Solution... Comparing 50+ Modern Tech Stacks" />
        </div>
    );

    const renderResults = () => {
        const alt = stackData?.alternative_recommendation;

        return (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto">


                {/* 1. First Choice (Primary Strategy) */}
                <AccordionCard
                    title={stackData.primary_recommendation.strategy_name}
                    subtitle="First Choice Technology • Premier Recommended Strategy"
                    icon={Zap}
                    color="amber"
                    defaultOpen={true}
                    className="border-brand-primary-200 ring-2 ring-brand-primary-50/50"
                >
                    <div className="mb-8 p-4 rounded-xl bg-neutral-50 border border-neutral-100 text-sm font-medium text-neutral-600 italic leading-relaxed">
                        "{stackData.primary_recommendation.synergy_explanation}"
                    </div>

                    <div className="space-y-10">
                        {/* Frontend */}
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                                <Layout size={14} /> Frontend Layer
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stackData.primary_recommendation.frontend.map((t, i) => <TechCard key={i} tech={t} />)}
                            </div>
                        </div>

                        {/* Backend */}
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                                <Server size={14} /> Backend & AI
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stackData.primary_recommendation.backend.map((t, i) => <TechCard key={i} tech={t} />)}
                            </div>
                        </div>

                        {/* Data */}
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                                <Database size={14} /> Data Layer
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stackData.primary_recommendation.database.map((t, i) => <TechCard key={i} tech={t} />)}
                            </div>
                        </div>

                        {/* DevOps */}
                        <div className="space-y-4">
                            <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-400 border-b border-neutral-100 pb-2">
                                <Cloud size={14} /> Infrastructure
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stackData.primary_recommendation.devops_infrastructure.map((t, i) => <TechCard key={i} tech={t} />)}
                            </div>
                        </div>
                    </div>
                </AccordionCard>

                {/* 2. Second Choice (Alternative Strategy) */}
                {alt && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        <AccordionCard
                            title="Second Choice Technology"
                            subtitle={`${alt.strategy_name} • Alternative Path`}
                            icon={ArrowRight}
                            color="neutral"
                        >
                            <p className="text-sm font-medium text-neutral-600 mb-6 italic">
                                An alternative high-performance approach focusing on:
                                <span className="text-neutral-900 font-bold ml-1">{alt.synergy_explanation.split('.')[0]}...</span>
                            </p>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {alt.backend.map((t, i) => (
                                    <div key={i} className="px-3 py-2 rounded-lg bg-neutral-100 text-xs font-bold text-neutral-600 text-center">
                                        {t.name}
                                    </div>
                                ))}
                                {alt.devops_infrastructure.map((t, i) => (
                                    <div key={i} className="px-3 py-2 rounded-lg bg-neutral-100 text-xs font-bold text-neutral-600 text-center">
                                        {t.name}
                                    </div>
                                ))}
                            </div>
                        </AccordionCard>
                    </motion.div>
                )}

                {/* 3. Analysis Context */}
                <AccordionCard
                    title="Project Analysis"
                    subtitle="Requirements, constraints, and complexity profile"
                    icon={Layers}
                    color="indigo"
                >
                    <AnalysisOverview analysis={stackData.analysis} />
                </AccordionCard>

                {/* 4. Risks & Guidance */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <AccordionCard
                        title="Risk Assessment"
                        subtitle={`${stackData.risk_assessment.length} Potential challenges identified`}
                        icon={AlertTriangle}
                        color="red"
                    >
                        <div className="space-y-4">
                            {stackData.risk_assessment.map((risk, i) => {
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
                            {stackData.junior_developer_tips && stackData.junior_developer_tips.map((tip, i) => (
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
            </motion.div>
        );
    }

    const showSteppers = !(currentStep === 4 && stackData);

    const headerTitle = currentStep === 4 ? "Strategy Recommendations" : "Technology Stack";
    const headerSubtitle = currentStep === 4
        ? "AI-driven architectural analysis based on your backlog."
        : "Define the architectural foundation of your future system.";

    return (
        <div className="flex flex-col h-full bg-surface-background p-8 overflow-y-auto">
            {/* Header Section */}
            <div className="flex flex-col mb-8 relative">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-black tracking-tight text-neutral-900">{headerTitle}</h1>
                        <p className="text-neutral-500 font-medium mt-2">
                            {headerSubtitle}
                        </p>
                    </div>

                    {/* Safe Button (Desktop) */}
                    {currentStep === 4 && !isSaved && (
                        <div className="hidden md:block">
                            <button
                                onClick={handleSaveAnalysis}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-6 py-3 bg-brand-primary-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-primary-700 transition-all shadow-lg shadow-brand-primary-500/30 hover:shadow-brand-primary-500/50 hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0"
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                                Save Analysis
                            </button>
                        </div>
                    )}
                </div>

                {/* Save Button (Mobile) */}
                {currentStep === 4 && !isSaved && (
                    <div className="md:hidden mt-4">
                        <button
                            onClick={handleSaveAnalysis}
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-brand-primary-600 text-white rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-brand-primary-700 transition-colors shadow-lg disabled:opacity-50"
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save Analysis
                        </button>
                    </div>
                )}
            </div>

            <div className="w-full flex-1 flex flex-col space-y-8 bg-none">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                    {/* Sidebar */}
                    <AnimatePresence mode="wait">
                        {showSteppers && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="lg:col-span-3 lg:border-r border-neutral-100 pr-8 hidden lg:block"
                            >
                                <div className="sticky top-8 space-y-3">
                                    {STEPS.map((step) => {
                                        const isActive = currentStep === step.id;
                                        const isCompleted = currentStep > step.id;
                                        return (
                                            <div
                                                key={step.id}
                                                className={cn(
                                                    "relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 border border-transparent",
                                                    isActive ? "bg-white shadow-xl shadow-neutral-900/5 text-neutral-900 border-neutral-100/50" : "text-neutral-400"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-300",
                                                    isActive ? "bg-brand-primary-500 text-white shadow-lg shadow-brand-primary-500/20" :
                                                        isCompleted ? "bg-emerald-50 text-emerald-500" : "bg-neutral-100/50 text-neutral-400"
                                                )}>
                                                    {isCompleted ? <CheckCircle2 size={20} /> : <step.icon size={20} />}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-0.5">Step 0{step.id}</span>
                                                    <span className="text-[13px] font-black uppercase tracking-widest">{step.title}</span>
                                                </div>
                                                {isActive && (
                                                    <motion.div layoutId="active-indicator" className="absolute left-0 w-1.5 h-8 bg-brand-primary-500 rounded-r-full" />
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Main Content */}
                    <div className={cn(
                        "relative transition-all duration-500",
                        showSteppers ? "lg:col-span-9" : "lg:col-span-12"
                    )}>
                        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden min-h-[600px] relative">
                            {/* Progress Bar */}
                            {showSteppers && (
                                <div className="absolute top-0 left-0 w-full h-[6px] bg-neutral-50 overflow-hidden z-20">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-brand-primary-500 via-indigo-600 to-brand-primary-500 bg-[length:200%_auto]"
                                        initial={{ width: "20%" }}
                                        animate={{
                                            width: `${(currentStep / 4) * 100}%`,
                                            backgroundPosition: ["0% center", "200% center"]
                                        }}
                                        transition={{
                                            width: { duration: 0.8 },
                                            backgroundPosition: { duration: 10, repeat: Infinity, ease: "linear" }
                                        }}
                                    />
                                </div>
                            )}

                            <div className="p-8 md:p-12">
                                <AnimatePresence mode="wait" custom={direction}>
                                    {isAnalyzing ? (
                                        <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                            {renderAnalyzing()}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={currentStep}
                                            variants={slideVariants}
                                            custom={direction}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="h-full"
                                        >
                                            {currentStep === 1 && renderStep1()}
                                            {currentStep === 2 && renderStep2()}
                                            {currentStep === 3 && renderAnalyzing()}
                                            {currentStep === 4 && renderResults()}

                                            {/* Nav Buttons */}
                                            {!isAnalyzing && currentStep !== 4 && (
                                                <div className="flex justify-between mt-12 pt-8 border-t border-neutral-100">
                                                    <button
                                                        onClick={handleBack}
                                                        disabled={currentStep === 1}
                                                        className={`flex items-center gap-3 text-neutral-400 hover:text-neutral-900 font-bold uppercase text-[11px] tracking-widest ${currentStep === 1 ? 'opacity-0 cursor-default' : ''}`}
                                                    >
                                                        <ChevronLeft size={16} /> Back
                                                    </button>

                                                    {currentStep !== 2 && (
                                                        <button
                                                            onClick={handleNext}
                                                            disabled={!hasBacklog}
                                                            className="flex items-center gap-3 bg-neutral-900 text-white px-8 py-3 rounded-full font-bold uppercase text-[11px] tracking-widest hover:bg-brand-primary-500 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {hasBacklog ? "Continue" : "Backlog Required"} <ChevronRight size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StackChoiceView;
