import React, { useState, useEffect, useRef } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Sparkles,
    Briefcase,
    FileText,
    Key,
    Users,
    TrendingUp,
    Store,
    Rocket,
    AlertCircle,
    Target
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { motion, AnimatePresence, useAnimation } from 'framer-motion';

import client from '@/api/client';
import { analyzeStaffing } from '@/api/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/utils';
import StorageService from '@/utils/storage';

// New Modular Components
import ResourcePool from './components/ResourcePool';
import InternalResourcePool from './components/InternalResourcePool';
import DynamicResourcePool from './components/DynamicResourcePool';
import StaffingStrategy from './components/StaffingStrategy';
import RequirementUpload from './components/RequirementUpload';
import AIDashboard from './components/AIDashboard';

import teamChecklistImg from '@/assets/NormalSelction.png';
import team1Img from '@/assets/AgenceSelection.png';
import SiriOrb from '@/components/ui/SiriOrb';

const STEPS = [
    { id: 1, title: "Identity", icon: Briefcase },
    { id: 2, title: "Strategy", icon: Target },
    { id: 3, title: "Resources", icon: Users },
    { id: 4, title: "Scoping", icon: FileText },
    { id: 5, title: "Blueprint", icon: TrendingUp }
];



// --- Animation Variants ---
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

const shakeVariant = {
    shake: {
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.4 }
    }
};

const NewProjectPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    // --- State ---
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
    });

    const [apiKey, setApiKey] = useState(StorageService.getGeminiKey() || '');
    const [employeePool, setEmployeePool] = useState([
        { role: "Backend Developer", level: "Senior", salary: 30000 },
        { role: "Frontend Developer", level: "Mid-level", salary: 20000 },
        { role: "UI/UX Designer", level: "Junior", salary: 18000 },
    ]);

    const [staffingStrategy, setStaffingStrategy] = useState('internal'); // 'internal' or 'custom'

    const [staffingData, setStaffingData] = useState(null);
    const [isStoring, setIsStoring] = useState(false);
    const [storeMessage, setStoreMessage] = useState(null);

    const nameControls = useAnimation();
    const descControls = useAnimation();
    const apiControls = useAnimation();

    const validateCurrentStep = () => {
        if (currentStep === 1) {
            let hasError = false;
            if (!projectData.name) {
                nameControls.start("shake");
                hasError = true;
            }
            if (!projectData.description) {
                descControls.start("shake");
                hasError = true;
            }
            if (hasError) {
                setValidationError("Required fields are missing");
                return false;
            }
        }
        return true;
    };

    const handleNext = async () => {
        if (!validateCurrentStep()) return;

        if (currentStep < 5) {
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
            setError("Please configure your Google Gemini API Key in Settings first.");
            return;
        }

        setError(null);
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('pool_employes', JSON.stringify(employeePool));
        formData.append('api_key', apiKey);

        try {
            const data = await analyzeStaffing(formData);
            setStaffingData(data);
            setDirection(1);
            setCurrentStep(5);
        } catch (err) {
            console.error("Analysis error:", err);
            const errorMessage = err.response?.data?.detail || err.message || "Intelligence engine failed to process requirements.";
            setError(errorMessage);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleStoreInDatabase = async () => {
        if (!staffingData) return;
        setIsStoring(true);
        setStoreMessage(null);
        try {
            const payload = {
                ...staffingData,
                name: projectData.name,
                description: projectData.description,
                status: 'active'
            };

            if (!payload.name) {
                throw new Error("Project name is required. You must enter it in Step 1.");
            }

            await client('/projects', { body: payload });
            setStoreMessage({ type: 'success', text: 'Project blueprint synchronized successfully!' });

            setTimeout(() => {
                navigate('/dashboard/projects');
            }, 2000);
        } catch (err) {
            console.error('Store error:', err);
            const errorMsg = err.response?.data?.message || 'Failed to synchronize with central database.';
            setStoreMessage({ type: 'error', text: errorMsg });
        } finally {
            setIsStoring(false);
        }
    };

    const renderStep1 = () => (
        <motion.div
            variants={cascadeContainer}
            initial="hidden"
            animate="show"
            className="space-y-8 max-w-2xl mx-auto py-8"
        >
            <motion.div variants={cascadeItem} className="space-y-3 text-left">
                <label className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase ml-1 flex items-center justify-between">
                    Project Name
                    {validationError && !projectData.name && <span className="text-red-500 normal-case tracking-normal">Required</span>}
                </label>
                <motion.div animate={nameControls} variants={shakeVariant}>
                    <Input
                        placeholder="e.g., Enterprise SaaS Platform v2.0"
                        value={projectData.name}
                        onChange={e => setProjectData({ ...projectData, name: e.target.value })}
                        className={cn(
                            "h-14 text-lg rounded-[20px] border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all px-6 font-bold shadow-subtle focus:ring-8 focus:ring-brand-primary-500/5 placeholder:text-neutral-300",
                            validationError && !projectData.name && "border-red-200 bg-red-50/10"
                        )}
                    />
                </motion.div>
            </motion.div>
            <motion.div variants={cascadeItem} className="space-y-3 text-left">
                <label className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase ml-1 flex items-center justify-between">
                    Mission Brief
                    {validationError && !projectData.description && <span className="text-red-500 normal-case tracking-normal">Required</span>}
                </label>
                <motion.div animate={descControls} variants={shakeVariant}>
                    <Textarea
                        placeholder="What is the primary objective of this project? Describe the core problem we are solving..."
                        className={cn(
                            "rounded-[24px] border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all min-h-[220px] p-6 text-sm leading-relaxed shadow-subtle focus:ring-8 focus:ring-brand-primary-500/5 placeholder:text-neutral-300 font-medium",
                            validationError && !projectData.description && "border-red-200 bg-red-50/10"
                        )}
                        value={projectData.description}
                        onChange={e => setProjectData({ ...projectData, description: e.target.value })}
                    />
                </motion.div>
            </motion.div>
        </motion.div>
    );

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

    const showSteppers = !(currentStep === 5 && staffingData);

    return (
        <div className="max-w-7xl mx-auto space-y-6 pb-20 pt-4 px-6 overflow-x-hidden">
            {/* Super Header - Centered Professional Staging */}
            {showSteppers && (
                <div className="flex flex-col items-center justify-center space-y-3 pb-8 border-b border-neutral-100 text-center">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-7xl font-black text-neutral-900 tracking-tighter leading-none"
                    >
                        Project <span className="text-brand-primary-500 italic">Analysis</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-400 font-bold text-[11px] uppercase tracking-[0.3em] max-w-3xl leading-relaxed"
                    >
                        Instantiate high-fidelity project plans using advanced LLM reasoning and resource mapping.
                    </motion.p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <AnimatePresence>
                    {showSteppers && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="lg:col-span-3 space-y-6 sticky top-12"
                        >
                            <div className="bg-neutral-50/50 p-4 rounded-[40px] border border-neutral-100 shadow-sm">
                                <div className="space-y-3">
                                    {STEPS.map((step, idx) => {
                                        const isActive = currentStep === step.id;
                                        const isCompleted = currentStep > step.id;
                                        return (
                                            <motion.div
                                                key={step.id}
                                                whileHover={{ x: 4 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    // Only validate if trying to move forward
                                                    if (step.id > currentStep) {
                                                        if (!validateCurrentStep()) return;
                                                    }

                                                    setDirection(step.id > currentStep ? 1 : -1);
                                                    setCurrentStep(step.id);
                                                    setValidationError(null);
                                                }}
                                                className={cn(
                                                    "flex items-center gap-4 px-6 py-5 rounded-3xl relative group cursor-pointer border border-transparent transition-all duration-300",
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
                                                        {step.id === 3 ? (staffingStrategy === 'internal' ? 'Talent Pool' : 'Resources') : step.title}
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

                {/* Main Content Stage */}
                <div className={cn(
                    "relative transition-all duration-500",
                    showSteppers ? "lg:col-span-9" : "lg:col-span-12"
                )}>
                    <motion.div
                        layout
                        className="relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary-500/10 to-indigo-500/10 rounded-[48px] blur-2xl opacity-20 pointer-events-none"></div>
                        <div className="bg-white rounded-[48px] border border-white shadow-super border-neutral-100 relative overflow-hidden backdrop-blur-md">
                            {/* Horizontal Internal Progress Line */}
                            {showSteppers && (
                                <div className="absolute top-0 left-0 w-full h-[6px] bg-neutral-50 overflow-hidden z-20">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-brand-primary-500 via-indigo-600 to-brand-primary-500 bg-[length:200%_auto]"
                                        initial={{ width: "20%" }}
                                        animate={{
                                            width: `${(currentStep / 5) * 100}%`,
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
                                            transition={{
                                                x: { type: "spring", stiffness: 200, damping: 25 },
                                                opacity: { duration: 0.4 }
                                            }}
                                        >
                                            {currentStep === 1 && renderStep1()}
                                            {currentStep === 2 && (
                                                <StaffingStrategy
                                                    selected={staffingStrategy}
                                                    onSelect={setStaffingStrategy}
                                                    team1Img={team1Img}
                                                    teamChecklistImg={teamChecklistImg}
                                                />
                                            )}
                                            {currentStep === 3 && (
                                                staffingStrategy === 'internal' ? (
                                                    <InternalResourcePool onSync={setEmployeePool} />
                                                ) : (
                                                    <DynamicResourcePool onSync={setEmployeePool} />
                                                )
                                            )}
                                            {currentStep === 4 && (
                                                <RequirementUpload
                                                    onFileSelected={handleAnalysis}
                                                    isLoading={isAnalyzing}
                                                    error={error}
                                                />
                                            )}
                                            {currentStep === 5 && (
                                                <div className="space-y-10">
                                                    <div className="flex flex-col md:flex-row justify-between items-center bg-brand-primary-50/20 p-8 md:p-10 rounded-[40px] border border-brand-primary-100/50 mb-10 gap-8">
                                                        <div className="flex items-center gap-6">
                                                            <div className="w-16 h-16 rounded-[24px] bg-white border border-brand-primary-100 flex items-center justify-center text-brand-primary-500 shadow-xl">
                                                                <Rocket size={32} />
                                                            </div>
                                                            <div>
                                                                <h3 className="text-base font-black text-neutral-900 uppercase tracking-widest leading-none mb-2">Architectural Validation</h3>
                                                                <p className="text-xs text-neutral-400 font-bold uppercase tracking-widest">Verify analysis and commit to central registry</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-6">
                                                            {storeMessage && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className={cn(
                                                                        "px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg border",
                                                                        storeMessage.type === 'success' ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-red-50 text-red-600 border-red-100"
                                                                    )}
                                                                >
                                                                    {storeMessage.text}
                                                                </motion.div>
                                                            )}
                                                            <motion.button
                                                                whileHover={{ y: -4, shadow: "0 25px 30px -10px rgb(0 0 0 / 0.15)" }}
                                                                whileTap={{ scale: 0.96 }}
                                                                onClick={handleStoreInDatabase}
                                                                disabled={isStoring}
                                                                className="px-8 py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white rounded-[20px] text-[10px] font-black uppercase tracking-[0.25em] transition-all flex items-center gap-3 shadow-3xl"
                                                            >
                                                                {isStoring ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : <Store size={18} />}
                                                                Commit Project
                                                            </motion.button>
                                                        </div>
                                                    </div>
                                                    <AIDashboard data={staffingData} />
                                                </div>
                                            )}

                                            {/* Unified Navigation Controllers */}
                                            {currentStep < 5 && (
                                                <div className={cn(
                                                    "mt-16 flex items-center border-t border-neutral-100 pt-12 gap-8",
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

                                                    {currentStep !== 4 && (
                                                        <motion.button
                                                            whileHover={{ y: -4 }}
                                                            whileTap={{ scale: 0.96 }}
                                                            onClick={handleNext}
                                                            className="bg-neutral-900 hover:bg-brand-primary-500 text-white rounded-[24px] px-10 h-14 font-black text-[11px] uppercase tracking-[0.25em] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.2)] hover:shadow-brand-primary-500/25 transition-all flex items-center gap-4 group"
                                                        >
                                                            Progress to {STEPS[currentStep].title}
                                                            <ChevronRight size={20} className="group-hover:translate-x-2 transition-transform duration-300" />
                                                        </motion.button>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Success Celebration Element (Hidden until complete) */}
                <AnimatePresence>
                    {storeMessage?.type === 'success' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                        >
                            <motion.div
                                initial={{ strokeDashoffset: 100 }}
                                animate={{ strokeDashoffset: 0 }}
                                className="bg-white/80 backdrop-blur-xl p-20 rounded-full shadow-super"
                            >
                                <CheckCircle2 size={120} className="text-emerald-500" strokeWidth={3} />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default NewProjectPage;
