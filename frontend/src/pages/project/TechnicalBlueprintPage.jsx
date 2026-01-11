import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
    Sparkles,
    Layout,
    Users,
    DollarSign,
    TrendingUp,
    Shield,
    Cloud,
    Settings,
    Info,
    Rocket,
    Clock,
    Target,
    BookOpen,
    Bookmark,
    ListTodo,
    FileText,
    CheckCircle2,
    Code,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    Loader2,
    RefreshCw,
    Save
} from 'lucide-react';

import { getProject, updateProject } from '@/api/projects';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { MouseEffect } from '@/components/ui/mouse-effect';
import { MagicCard } from '@/components/ui/magic-card';
import { cn } from '@/utils/utils';
import axios from 'axios';

// AI Analysis Components
import RequirementUpload from '../ai-analysis/components/RequirementUpload';
import AIDashboard from '../ai-analysis/components/AIDashboard';
import SiriOrb from '@/components/ui/SiriOrb';

// --- Shared Dashboard Components ---

const BacklogDashboard = ({ data }) => {
    // State to track expanded epics (default: all closed)
    const [expandedEpics, setExpandedEpics] = useState({});
    // State to track expanded user stories (default: all closed)
    const [expandedStories, setExpandedStories] = useState({});

    if (!data || !data.backlog) return (
        <div className="flex flex-col items-center justify-center h-64 text-neutral-400">
            <Layout size={48} className="mb-4 opacity-50" />
            <p>No backlog data available to display.</p>
        </div>
    );

    const toggleEpic = (epicId) => {
        setExpandedEpics(prev => ({ ...prev, [epicId]: !prev[epicId] }));
    };

    const toggleStory = (storyId) => {
        setExpandedStories(prev => ({ ...prev, [storyId]: !prev[storyId] }));
    };

    return (
        <div className="w-full space-y-4 pb-20">
            {data.backlog.map((epic, epicIdx) => {
                const isEpicExpanded = expandedEpics[epic.id];
                return (
                    <motion.div
                        key={epic.id || epicIdx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: epicIdx * 0.1 }}
                    >
                        <MagicCard className="rounded-3xl border border-neutral-100 shadow-xl overflow-hidden bg-white/50 backdrop-blur-xl transition-all duration-300">
                            <div
                                onClick={() => toggleEpic(epic.id)}
                                className="p-6 border-b border-neutral-100 bg-gradient-to-r from-brand-primary-50/50 to-transparent cursor-pointer hover:bg-neutral-50/50 transition-colors group"
                            >
                                <div className="flex items-start gap-5">
                                    <div className="p-3 bg-brand-primary-500 text-white rounded-2xl shadow-lg shadow-brand-primary-500/20 mt-1">
                                        <BookOpen size={24} />
                                    </div>
                                    <div className="space-y-2 flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="px-3 py-1 bg-brand-primary-100 text-brand-primary-700 text-[10px] font-black uppercase tracking-widest rounded-full">
                                                    {epic.external_id || epic.id || `E-${epicIdx + 1}`}
                                                </span>
                                                <h3 className="text-xl font-black text-neutral-900 tracking-tight">{epic.title}</h3>
                                            </div>
                                            <div className="p-2 bg-white rounded-full text-neutral-400 group-hover:text-brand-primary-500 shadow-sm transition-colors border border-neutral-100">
                                                {isEpicExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                            </div>
                                        </div>
                                        <p className="text-neutral-500 leading-relaxed font-medium text-sm pr-10">{epic.description}</p>
                                    </div>
                                </div>
                            </div>
                            {isEpicExpanded && (
                                <div className="p-6 space-y-4 bg-neutral-50/30 animate-in slide-in-from-top-4 fade-in duration-300">
                                    {epic.user_stories?.map((story, sIdx) => {
                                        const storyId = story.id || `${epic.id}-s-${sIdx}`;
                                        const isStoryExpanded = expandedStories[storyId];
                                        return (
                                            <div key={storyId} className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                                                <div
                                                    onClick={() => toggleStory(storyId)}
                                                    className="p-5 flex items-start gap-4 cursor-pointer hover:bg-neutral-50/50 transition-colors"
                                                >
                                                    <div className="mt-1 p-2 bg-indigo-50 text-indigo-500 rounded-lg">
                                                        <Bookmark size={18} />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{story.external_id || story.id || `US-${epicIdx + 1}.${sIdx + 1}`}</span>
                                                                <h4 className="text-base font-bold text-neutral-900 group-hover:text-indigo-600 transition-colors">{story.title}</h4>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <div className="flex items-center gap-1.5 px-3 py-1 bg-neutral-100 rounded-lg">
                                                                    <span className="text-[11px] font-black text-neutral-600">{story.story_points}</span>
                                                                    <span className="text-[9px] font-bold text-neutral-400 uppercase">Pts</span>
                                                                </div>
                                                                <div className="text-neutral-300 group-hover:text-indigo-500 transition-colors">{isStoryExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</div>
                                                            </div>
                                                        </div>
                                                        <p className="text-sm text-neutral-500 font-medium line-clamp-2 md:line-clamp-none">{story.description}</p>
                                                        {isStoryExpanded && (
                                                            <div className="pt-4 animate-in fade-in zoom-in-95 duration-200 cursor-auto" onClick={(e) => e.stopPropagation()}>
                                                                {story.acceptance_criteria && (
                                                                    <div className="mb-4 p-4 bg-emerald-50/50 rounded-xl space-y-2 border border-emerald-100/50">
                                                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2"><CheckCircle2 size={12} className="text-emerald-500" />Acceptance Criteria</p>
                                                                        <ul className="space-y-1.5">
                                                                            {Array.isArray(story.acceptance_criteria) ? story.acceptance_criteria.map((criteria, idx) => (
                                                                                <li key={idx} className="flex items-start gap-2 text-[11px] text-emerald-900/80 font-medium">
                                                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 shrink-0 shadow-sm shadow-emerald-200" />
                                                                                    <span className="leading-relaxed">{criteria}</span>
                                                                                </li>
                                                                            )) : null}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                                {story.tasks && story.tasks.length > 0 && (
                                                                    <div className="space-y-3 pt-2 border-t border-neutral-100">
                                                                        <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest flex items-center gap-2"><ListTodo size={12} />Technical Tasks</p>
                                                                        <div className="grid grid-cols-1 gap-3">
                                                                            {story.tasks.map((task, tIdx) => (
                                                                                <div key={task.id || tIdx} className="bg-white p-4 rounded-xl border border-neutral-100 shadow-sm flex items-start gap-4 hover:border-emerald-200 transition-colors">
                                                                                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><Code size={16} /></div>
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center justify-between mb-1">
                                                                                            <h5 className="text-[13px] font-bold text-neutral-900">{task.title}</h5>
                                                                                            <div className="flex items-center gap-2">
                                                                                                <span className="px-2 py-0.5 bg-neutral-100 text-neutral-500 text-[9px] font-bold rounded uppercase">{task.role}</span>
                                                                                                {task.level && <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] font-bold rounded uppercase">{task.level}</span>}
                                                                                                <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase flex items-center gap-1"><Clock size={10} />{task.hours}h</span>
                                                                                            </div>
                                                                                        </div>
                                                                                        <p className="text-[11px] text-neutral-500 leading-relaxed font-mono bg-neutral-50 p-2 rounded-lg border border-neutral-100 mt-2">
                                                                                            {task.instructions && typeof task.instructions === 'string' ? task.instructions.split(/(`[^`]+`)/g).map((part, idx) =>
                                                                                                part.startsWith('`') && part.endsWith('`') ? <span key={idx} className="font-black text-neutral-800">{part.slice(1, -1)}</span> : part
                                                                                            ) : task.instructions}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </MagicCard>
                    </motion.div>
                );
            })}
        </div>
    );
};

// --- Wizard Components and Logic ---

const STEPS = [
    { id: 1, title: "Intro", icon: Info },
    { id: 2, title: "Baseline", icon: Rocket },
    { id: 3, title: "Scoping", icon: FileText },
    { id: 4, title: "Blueprint", icon: TrendingUp }
];

const ANALYZE_API_URL = 'http://127.0.0.1:8001';

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
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const cascadeItem = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
};

const TechnicalBlueprintWizard = ({ initialData, projectId }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    // Form inputs
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [employeePool, setEmployeePool] = useState(
        (initialData?.assigned_engineers && initialData.assigned_engineers.length > 0)
            ? initialData.assigned_engineers
            : [
                { role: "Backend Developer", level: "Senior", salary: 30000 },
                { role: "Frontend Developer", level: "Mid-level", salary: 20000 },
                { role: "UI/UX Designer", level: "Junior", salary: 18000 },
            ]
    );
    const [staffingData, setStaffingData] = useState(null);

    // UI State
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isStoring, setIsStoring] = useState(false);
    const [storeMessage, setStoreMessage] = useState(null);

    // Update pool if initialData changes late
    useEffect(() => {
        if (initialData?.assigned_engineers && initialData.assigned_engineers.length > 0) {
            setEmployeePool(initialData.assigned_engineers);
        }
    }, [initialData]);

    const validateCurrentStep = () => {
        if (currentStep === 3) {
            if (!staffingData && !isAnalyzing) {
                setValidationError("Please upload the Scoping PDF to proceed.");
                return false;
            }
        }
        return true;
    };

    const handleNext = async () => {
        if (!validateCurrentStep()) return;

        if (currentStep < 4) {
            setDirection(1);
            setCurrentStep(prev => prev + 1);
            setValidationError(null);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setDirection(-1);
            setCurrentStep(prev => prev - 1);
            setValidationError(null);
        }
    };

    const handleApiKeyChange = (key) => {
        setApiKey(key);
        localStorage.setItem('gemini_api_key', key);
    };

    const handleAnalysis = async (file) => {
        if (!apiKey) {
            setError("Please enter your Google Gemini API Key first.");
            setDirection(-1);
            return;
        }

        setError(null);
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('pool_employes', JSON.stringify(employeePool));
        formData.append('dev_duration_months', initialData?.estimated_duration_months || 0);
        formData.append('total_budget', initialData?.total_project_cost || 0);
        formData.append('api_key', apiKey);

        try {
            const response = await axios.post(`${ANALYZE_API_URL}/analyze-backlog`, formData);
            setStaffingData(response.data);
            setDirection(1);
            setCurrentStep(4);
        } catch (err) {
            console.error("Analysis error:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Intelligence engine failed to process requirements.";
            setError(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleStoreInDatabase = async () => {
        if (!staffingData?.backlog) return;
        setIsStoring(true);
        setStoreMessage(null);
        try {
            await updateProject(projectId, { backlog: staffingData.backlog });
            setStoreMessage({ type: 'success', text: 'Backlog stored successfully!' });
            // Optional: Reload or update parent state. Reloading is simplest to refresh main view.
            window.location.reload();
        } catch (err) {
            console.error("Failed to store backlog:", err);
            setStoreMessage({ type: 'error', text: 'Failed to store backlog.' });
        } finally {
            setIsStoring(false);
        }
    };

    const renderStep1 = () => (
        <motion.div
            variants={cascadeContainer}
            initial="hidden"
            animate="show"
            className="space-y-4 max-w-2xl mx-auto py-2"
        >
            <motion.div variants={cascadeItem} className="space-y-3 text-center">
                <div className="flex justify-center mb-3">
                    <div className="w-20 h-20 bg-brand-primary-50 rounded-full flex items-center justify-center border border-brand-primary-100">
                        <Info className="w-8 h-8 text-brand-primary-600" />
                    </div>
                </div>

                <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Technical Analysis Initialization</h3>

                <p className="text-sm text-neutral-500 font-medium leading-relaxed max-w-xl mx-auto">
                    The following key parameters are derived from the <span className="text-neutral-900 font-bold">Project Analysis</span> you previously completed.
                </p>

                <div className="space-y-4 max-w-lg mx-auto text-left bg-neutral-50/50 p-5 rounded-[24px] border border-neutral-100 shadow-sm mt-4">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2 text-center">Derived Analysis Data</p>
                    <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-2xl bg-brand-primary-50 flex items-center justify-center shrink-0 border border-brand-primary-100">
                                <Clock size={16} className="text-brand-primary-600" />
                            </div>
                            <div className="pt-1">
                                <span className="text-neutral-900 font-bold block text-sm">Timeline Estimation</span>
                                <span className="text-[11px] text-neutral-500 font-medium leading-tight block mt-0.5">Project duration phases and critical path analysis based on complexity.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-2xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                                <DollarSign size={16} className="text-emerald-600" />
                            </div>
                            <div className="pt-1">
                                <span className="text-neutral-900 font-bold block text-sm">Budget & Financials</span>
                                <span className="text-[11px] text-neutral-500 font-medium leading-tight block mt-0.5">Approved budget allocation and resource cost projections.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                                <Users size={16} className="text-indigo-600" />
                            </div>
                            <div className="pt-1">
                                <span className="text-neutral-900 font-bold block text-sm">Staffing Pool</span>
                                <span className="text-[11px] text-neutral-500 font-medium leading-tight block mt-0.5">{employeePool.length} Engineers assigned from strategic planning.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <p className="text-xs text-neutral-500 font-bold leading-relaxed max-w-md mx-auto mt-4">
                    <span className="text-indigo-500 block mb-1 uppercase tracking-widest text-[9px]">Ensure Accuracy</span>
                    To validate this data and ensure the accuracy of the breakdown, you will need to upload the <span className="text-neutral-900 border-b border-neutral-200 pb-0.5">Scoping Document</span> in Step 3.
                </p>
            </motion.div>
        </motion.div>
    );

    const renderStep2 = () => {
        const toggleAccordion = (id) => {
            setActiveAccordion(activeAccordion === id ? null : id);
        };

        const AccordionItem = ({ id, title, value, subvalue, icon: Icon, children }) => {
            const isOpen = activeAccordion === id;
            return (
                <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`border transition-all duration-300 rounded-[28px] overflow-hidden ${isOpen ? 'bg-white border-brand-primary-200 shadow-active ring-4 ring-brand-primary-50' : 'bg-neutral-50/50 border-neutral-100 hover:border-neutral-200'}`}
                >
                    <button
                        onClick={() => toggleAccordion(id)}
                        className="w-full flex items-center justify-between p-6 text-left"
                    >
                        <div className="flex items-center gap-5">
                            <div className={`p-3 rounded-2xl transition-colors ${isOpen ? 'bg-brand-primary-500 text-white shadow-lg shadow-brand-primary-500/30' : 'bg-white text-neutral-400 border border-neutral-100'}`}>
                                <Icon size={24} />
                            </div>
                            <div>
                                <h4 className={`text-base font-bold transition-colors ${isOpen ? 'text-neutral-900' : 'text-neutral-600'}`}>{title}</h4>
                                <p className="text-xs text-neutral-400 font-medium mt-0.5">
                                    {isOpen ? 'Click to collapse details' : 'Click to view details'}
                                </p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="font-black text-lg text-neutral-900">{value}</div>
                            {subvalue && <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">{subvalue}</div>}
                        </div>
                    </button>
                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="p-6 pt-0 border-t border-neutral-100/50">
                                    {children}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            );
        };

        return (
            <motion.div variants={cascadeContainer} initial="hidden" animate="show" className="space-y-4 max-w-2xl mx-auto py-4">
                <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Project Baseline</h3>
                    <p className="text-sm text-neutral-500 font-medium mt-2">Review the foundational parameters.</p>
                </div>
                <AccordionItem
                    id="duration"
                    title="Estimated Duration"
                    value={`${initialData?.estimated_duration_months || 0} Months`}
                    subvalue="Timeline"
                    icon={Clock}
                >
                    <p className="text-sm text-neutral-500 leading-relaxed">The AI has estimated this duration based on the project complexity and typical velocity.</p>
                </AccordionItem>
                <AccordionItem
                    id="budget"
                    title="Total Budget"
                    value={`${Number(initialData?.total_project_cost || 0).toLocaleString()} MAD`}
                    subvalue="Investment"
                    icon={DollarSign}
                >
                    <p className="text-sm text-neutral-500 leading-relaxed">Comprehensive budget including CAPEX and OPEX.</p>
                </AccordionItem>
                <AccordionItem
                    id="staffing"
                    title="Technical Staffing"
                    value={`${employeePool.length} Engineers`}
                    subvalue="Resource Pool"
                    icon={Users}
                >
                    <div className="space-y-3">
                        <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest mb-3">Assigned Team Members</p>
                        <div className="grid grid-cols-1 gap-2">
                            {employeePool.map((emp, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-neutral-50 rounded-xl border border-neutral-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-white border border-neutral-200 flex items-center justify-center text-[10px] font-black text-neutral-500">
                                            {emp.role.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-neutral-900">{emp.role}</div>
                                            <div className="text-[10px] text-neutral-500 font-medium">{emp.level}</div>
                                        </div>
                                    </div>
                                    {emp.salary > 0 && (
                                        <div className="text-[11px] font-bold text-neutral-400">
                                            {Number(emp.salary).toLocaleString()} MAD
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </AccordionItem>
            </motion.div>
        );
    };

    const renderAnalyzing = () => (
        <div className="flex flex-col items-center justify-center py-24 space-y-10 max-w-md mx-auto">
            <div className="relative flex items-center justify-center">
                <SiriOrb size="192px" animationDuration={15} />
            </div>

            <div className="text-center space-y-3">
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight uppercase tracking-[0.1em]">AI Synthesis In Progress</h2>
                <p className="text-sm text-neutral-400 font-medium leading-relaxed font-mono">
                    Decomposing specifications into high-fidelity nodes...
                </p>
                <div className="flex justify-center gap-1.5 pt-4">
                    {[0, 1, 2].map(i => (
                        <motion.div
                            key={i}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                            transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.3 }}
                            className="w-2 h-2 rounded-full bg-brand-primary-500"
                        />
                    ))}
                </div>
            </div>
        </div>
    );

    const showSteppers = !(currentStep === 4 && staffingData);

    return (
        <div className="w-full h-full max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full">
                <AnimatePresence mode="wait">
                    {showSteppers && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="lg:col-span-3 lg:border-r border-neutral-100 pr-8 hidden lg:block"
                        >
                            <div className="sticky top-8 space-y-8">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Workflow</p>
                                    <h2 className="text-xl font-black text-neutral-900 tracking-tight">Blueprint Wizard</h2>
                                    <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                                        Guided process to generate technical specifications.
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    {STEPS.map((step) => {
                                        const isActive = currentStep === step.id;
                                        const isCompleted = currentStep > step.id;

                                        return (
                                            <motion.div
                                                key={step.id}
                                                className={cn(
                                                    "relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 border border-transparent",
                                                    isActive ? "bg-white shadow-2xl shadow-neutral-900/5 text-neutral-900 border-neutral-100/50" : "text-neutral-400 hover:bg-neutral-100/30"
                                                )}
                                            >
                                                <div className={cn(
                                                    "w-11 h-11 rounded-2xl flex items-center justify-center transition-colors duration-300",
                                                    isActive ? "bg-brand-primary-500 text-white shadow-xl shadow-brand-primary-500/20" :
                                                        isCompleted ? "bg-emerald-50 text-emerald-500" : "bg-neutral-100/50 text-neutral-400"
                                                )}>
                                                    {isCompleted ? <CheckCircle2 size={22} strokeWidth={2.5} /> : <step.icon size={22} strokeWidth={2.5} />}
                                                </div>

                                                <div className="flex flex-col">
                                                    <span className="text-[9px] font-black uppercase tracking-[0.2em] opacity-40 mb-0.5">Step 0{step.id}</span>
                                                    <span className="text-[13px] font-black uppercase tracking-widest">
                                                        {step.title}
                                                    </span>
                                                </div>

                                                {isActive && (
                                                    <motion.div
                                                        layoutId="vertical-indicator"
                                                        className="absolute left-0 w-1.5 h-8 bg-brand-primary-500 rounded-r-full"
                                                    />
                                                )}
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className={cn(
                    "relative transition-all duration-500",
                    showSteppers ? "lg:col-span-9" : "lg:col-span-12"
                )}>
                    <motion.div layout className="relative group">
                        <div className="bg-white rounded-[48px] border border-white shadow-super border-neutral-100 relative overflow-hidden backdrop-blur-md">
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
                                            width: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
                                            backgroundPosition: { duration: 10, repeat: Infinity, ease: "linear" }
                                        }}
                                    />
                                </div>
                            )}

                            <div className="p-12 md:p-20">
                                <AnimatePresence mode="wait" custom={direction}>
                                    {isAnalyzing ? (
                                        <motion.div
                                            key="analyzing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                        >
                                            {renderAnalyzing()}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key={currentStep}
                                            custom={direction}
                                            variants={slideVariants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                        >
                                            {currentStep === 1 && renderStep1()}
                                            {currentStep === 2 && renderStep2()}
                                            {currentStep === 3 && (
                                                <div className="space-y-8">
                                                    <div className="text-center mb-8">
                                                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Scoping</h3>
                                                        <p className="text-sm text-neutral-500 font-medium mt-2">Upload your scoping document.</p>
                                                    </div>
                                                    <RequirementUpload
                                                        onFileSelected={handleAnalysis}
                                                        isLoading={isAnalyzing}
                                                        error={error}
                                                    />
                                                </div>
                                            )}
                                            {currentStep === 4 && (
                                                <div className="space-y-10">
                                                    {staffingData?.backlog ? (
                                                        <div className="bg-white/50 p-6 rounded-3xl">
                                                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
                                                                <div>
                                                                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Technical Blueprint Generated</h3>
                                                                    <p className="text-sm text-neutral-500 font-medium mt-2">Breakdown of Epics and User Stories.</p>
                                                                </div>
                                                                <motion.button
                                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                                    whileTap={{ scale: 0.98 }}
                                                                    onClick={handleStoreInDatabase}
                                                                    disabled={isStoring}
                                                                    className="px-8 py-4 bg-brand-primary-500 hover:bg-brand-primary-600 text-white rounded-[20px] text-[11px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-primary-500/30 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                                                                >
                                                                    {isStoring ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                                                    {isStoring ? 'Storing...' : 'Commit Blueprint'}
                                                                </motion.button>
                                                            </div>
                                                            {storeMessage && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, y: -10 }}
                                                                    animate={{ opacity: 1, y: 0 }}
                                                                    className={`mb-6 p-4 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 ${storeMessage.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-red-50 text-red-600 border border-red-100'}`}
                                                                >
                                                                    {storeMessage.type === 'success' && <CheckCircle2 size={16} />}
                                                                    {storeMessage.text}
                                                                </motion.div>
                                                            )}
                                                            <BacklogDashboard data={staffingData} />
                                                        </div>
                                                    ) : (
                                                        <AIDashboard data={staffingData} />
                                                    )}
                                                </div>
                                            )}

                                            {currentStep < 4 && (
                                                <div className="border-t border-neutral-100 pt-12 mt-8">
                                                    <div className={cn(
                                                        "flex items-center gap-8",
                                                        currentStep === 1 ? "justify-end" : "justify-between"
                                                    )}>
                                                        {currentStep > 1 && (
                                                            <motion.button
                                                                whileHover={{ x: -4 }}
                                                                onClick={handleBack}
                                                                className="group flex items-center gap-4 text-neutral-400 hover:text-neutral-900 transition-all text-[11px] font-black uppercase tracking-[0.2em] h-12"
                                                            >
                                                                <div className="w-11 h-11 rounded-xl border border-neutral-100 group-hover:bg-neutral-50 transition-all flex items-center justify-center shadow-sm">
                                                                    <ChevronLeft size={18} />
                                                                </div>
                                                                Back to {STEPS[currentStep - 2].title}
                                                            </motion.button>
                                                        )}
                                                        <motion.button
                                                            whileHover={{ y: -4 }}
                                                            whileTap={{ scale: 0.96 }}
                                                            onClick={handleNext}
                                                            className="bg-neutral-900 hover:bg-brand-primary-500 text-white rounded-[24px] px-10 h-14 font-black text-[11px] uppercase tracking-[0.25em] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:shadow-brand-primary-500/25 transition-all flex items-center gap-4 group"
                                                        >
                                                            Progress to {STEPS[currentStep].title}
                                                            <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

const TechnicalBlueprintPage = () => {
    const { id } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProject(id);
                // Transform API response
                const transformedData = {
                    project_name: data.name,
                    estimated_duration_months: data.estimated_duration_months,
                    total_project_cost: data.total_project_cost,
                    total_capex: data.total_capex,
                    total_opex: data.total_opex,
                    roi_analysis_summary: data.roi_analysis_summary,
                    // Map assigned engineers for the pool
                    assigned_engineers: (data.assigned_engineers || []).map(e => ({
                        role: e.specialization?.name || e.role || 'Developer',
                        level: e.specialization?.level || e.level || 'Mid-level',
                        salary: e.specialization?.salary || e.monthly_salary_mad || 0,
                        count: 1 // Default to 1 if not specified
                    })),
                    backlog: data.epics ? data.epics.map(epic => ({
                        id: epic.id,
                        title: epic.title,
                        description: epic.description,
                        external_id: epic.external_id,
                        user_stories: epic.stories.map(story => ({
                            id: story.id,
                            title: story.title,
                            description: story.description,
                            story_points: story.story_points,
                            external_id: story.external_id,
                            acceptance_criteria: story.acceptance_criteria,
                            tasks: story.tasks.map(task => ({
                                id: task.id,
                                title: task.title,
                                role: task.role,
                                level: task.level,
                                hours: task.hours,
                                instructions: task.instructions,
                                external_id: task.external_id
                            }))
                        }))
                    })) : []
                };

                setProjectData(transformedData);
            } catch (err) {
                console.error("Failed to fetch project:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-surface-background">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-full w-full items-center justify-center bg-surface-background">
                <div className="text-center">
                    <p className="text-danger-default font-bold mb-2">Error loading project</p>
                    <p className="text-neutral-500 text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-surface-background p-8 overflow-y-auto">
            <div className="flex flex-col mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Technical Blueprint</h1>
                <p className="text-neutral-500">
                    Systematic breakdown and verified technical specifications for <span className="font-bold text-neutral-900">{projectData?.project_name}</span>.
                </p>
            </div>

            <div className="w-full flex-1 flex flex-col space-y-8">
                <div className="block animate-in fade-in zoom-in-95 duration-200">
                    {projectData?.backlog && projectData.backlog.length > 0 ? (
                        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm mt-4">
                            <div className="flex flex-col items-center justify-center mb-10 space-y-2">
                                <div className="p-3 bg-brand-primary-50 text-brand-primary-600 rounded-2xl mb-2">
                                    <Layout size={24} />
                                </div>
                                <h3 className="text-3xl font-black text-neutral-900 tracking-tight">Technical Blueprint</h3>
                                <p className="text-sm text-neutral-500 font-medium uppercase tracking-widest">Verified Backlog Architecture</p>
                            </div>
                            <BacklogDashboard data={projectData} />
                        </div>
                    ) : (
                        <TechnicalBlueprintWizard initialData={projectData} projectId={id} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechnicalBlueprintPage;
