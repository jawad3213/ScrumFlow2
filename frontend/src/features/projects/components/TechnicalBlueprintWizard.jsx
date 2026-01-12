import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Info, Rocket, FileText, TrendingUp, Clock, Users, DollarSign,
    ChevronRight, ChevronLeft, CheckCircle2, Loader2, Save
} from 'lucide-react';

import { analyzeBacklog } from '@/features/ai-analysis/api/ai';
import { updateProject } from '@/features/projects/api/projects';
import StorageService from '@/utils/storage';
import { cn } from '@/utils/utils';

// Components
import RequirementUpload from '@/features/ai-analysis/components/RequirementUpload';
import AIDashboard from '@/features/ai-analysis/components/AIDashboard';
import SiriOrb from '@/components/ui/SiriOrb';
import BacklogDashboard from './BacklogDashboard';

// --- Wizard Constants ---

const STEPS = [
    { id: 1, title: "Intro", icon: Info },
    { id: 2, title: "Baseline", icon: Rocket },
    { id: 3, title: "Scoping", icon: FileText },
    { id: 4, title: "Analysis", icon: TrendingUp }
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
    const [apiKey, setApiKey] = useState(StorageService.getGeminiKey() || '');
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
        StorageService.setGeminiKey(key);
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
            const data = await analyzeBacklog(formData);
            setStaffingData(data);
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
            {/* Super Header - Centered Professional Staging */}
            {showSteppers && (
                <div className="flex flex-col items-center justify-center space-y-3 pb-8 border-b border-neutral-100 text-center mb-8">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-7xl font-black text-neutral-900 tracking-tighter leading-none"
                    >
                        Technical <span className="text-brand-primary-500 italic">Analysis</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-400 font-bold text-[11px] uppercase tracking-[0.3em] max-w-3xl leading-relaxed"
                    >
                        Break requirements into backlog, user stories, epics, and tasks.
                    </motion.p>
                </div>
            )}
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


                                <div className="space-y-3">
                                    {STEPS.map((step) => {
                                        const isActive = currentStep === step.id;
                                        const isCompleted = currentStep > step.id;

                                        return (
                                            <motion.div
                                                key={step.id}
                                                onClick={() => {
                                                    // Allow free navigation between steps 1, 2, and 3
                                                    // Only block navigation to Step 4 if the necessary data hasn't been generated
                                                    if (step.id === 4 && !staffingData) return;

                                                    setDirection(step.id > currentStep ? 1 : -1);
                                                    setCurrentStep(step.id);
                                                    setValidationError(null);
                                                }}
                                                className={cn(
                                                    "relative flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 border border-transparent",
                                                    (step.id === 4 && !staffingData) ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:bg-neutral-100/30",
                                                    isActive ? "bg-white shadow-2xl shadow-neutral-900/5 text-neutral-900 border-neutral-100/50 opacity-100" : "text-neutral-400"
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
                                                                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Technical Analysis Generated</h3>
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
                                                                    {isStoring ? 'Storing...' : 'Commit Analysis'}
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

export default TechnicalBlueprintWizard;
