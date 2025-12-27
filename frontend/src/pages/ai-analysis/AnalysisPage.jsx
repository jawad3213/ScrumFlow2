import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Briefcase, FileText, ChevronRight, Rocket, Save,
    Sparkles, Key, Users, TrendingUp as TrendingUpIcon,
    History, FileUp, AlertCircle, CheckCircle
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';

// Components
import AIDashboard from './components/AIDashboard';
import GeminiAuth from './components/GeminiAuth';
import RequirementUpload from './components/RequirementUpload';
import ResourcePool from './components/ResourcePool';
import testData from './test_data.json';
import Toast from '@/components/ui/Toast';

const AnalysisPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // --- UI State ---
    const [subStep, setSubStep] = useState('config'); // config, auth, resources, upload, dashboard
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisData, setAnalysisData] = useState(null);
    const [isSyncing, setIsSyncing] = useState(false);
    const [showSyncToast, setShowSyncToast] = useState(false);
    const [hasSynced, setHasSynced] = useState(false);
    const [error, setError] = useState(null);

    // --- Data State ---
    const [projectData, setProjectData] = useState({
        name: 'Project Blueprint #' + (id || 'New'),
        description: '',
    });
    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [employeePool, setEmployeePool] = useState([
        { role: "Backend Developer", level: "Senior", salary: 30000 },
        { role: "Frontend Developer", level: "Mid-level", salary: 20000 },
        { role: "UI/UX Designer", level: "Junior", salary: 18000 },
    ]);

    const handleApiKeyChange = (key) => {
        setApiKey(key);
        localStorage.setItem('gemini_api_key', key);
    };

    const runAnalysis = async (file) => {
        setIsAnalyzing(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('pool_employes', JSON.stringify(employeePool));
            formData.append('api_key', apiKey);

            const response = await fetch('http://localhost:8001/analyze-direct', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Analysis failed');
            }

            const data = await response.json();
            setAnalysisData(data);
            setSubStep('dashboard');
        } catch (err) {
            console.error('Analysis Error:', err);

            const rawMsg = err.message || "";

            // Catch technical blocks like <failed_attempts> or API_KEY_INVALID
            const isAuthError = rawMsg.includes("API_KEY_INVALID") ||
                rawMsg.includes("API key not valid") ||
                rawMsg.includes("failed_attempts") ||
                rawMsg.includes("400");

            if (isAuthError) {
                setError({
                    type: 'AUTH',
                    title: 'Invalid API Configuration',
                    message: 'The Intelligence Engine could not verify your Gemini API key. It may be missing, expired, or mistyped.',
                    tip: 'Ensure your key is copied correctly from Google AI Studio. Check for trailing spaces.',
                    actionLabel: 'Verify API Key',
                    onAction: () => setSubStep('auth')
                });
            } else if (rawMsg.includes("quota") || rawMsg.includes("429")) {
                setError({
                    type: 'QUOTA',
                    title: 'System Saturated',
                    message: 'The AI model has reached its temporary processing limit for your API tier.',
                    tip: 'Waiting 60 seconds usually resolves this. High-resolution PDFs may require a moment to reset.',
                    actionLabel: 'Retry Analysis',
                    onAction: null
                });
            } else {
                setError({
                    type: 'ENGINE',
                    title: 'Analysis Interrupted',
                    message: 'A technical discrepancy occurred during the architectural synthesis.',
                    tip: 'Try refreshing or re-uploading. Ensure the PDF is not encrypted.',
                    actionLabel: null,
                    onAction: null
                });
            }
        } finally {
            setIsAnalyzing(false);
        }
    };

    const handleSync = async () => {
        if (!analysisData) return;
        setIsSyncing(true);
        setError(null);

        try {
            // Send data to Laravel backend
            const token = localStorage.getItem('auth_token');
            const response = await fetch('http://127.0.0.1:8000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    ...analysisData,
                    name: projectData.name,
                    description: projectData.description,
                    status: 'pending' // Initialize as pending
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Synchronization failed');
            }

            const result = await response.json();
            console.log('Project Synced:', result);

            // Notify success instead of navigating
            setShowSyncToast(true);
            setHasSynced(true);
            setIsSyncing(false);
        } catch (err) {
            console.error('Sync Error:', err);
            setError(err.message);
        } finally {
            setIsSyncing(false);
        }
    };

    const renderHeader = () => (
        <div className="space-y-4 mb-10">
            <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-brand-primary-50 rounded-full border border-brand-primary-100">
                    <span className="text-[10px] font-black text-brand-primary-600 uppercase tracking-widest">Analysis Engine</span>
                </div>
                {subStep !== 'config' && (
                    <button
                        onClick={() => setSubStep('config')}
                        className="text-[10px] font-black text-neutral-400 hover:text-neutral-900 uppercase tracking-widest flex items-center gap-1 transition-colors"
                    >
                        <History size={12} /> Reset to Config
                    </button>
                )}
            </div>
            <h1 className="text-4xl font-black text-neutral-900 tracking-tighter leading-none">
                {subStep === 'dashboard' ? 'Technical ' : 'Configure '}
                <span className="text-brand-primary-500 italic">{subStep === 'dashboard' ? 'Blueprint' : 'Genesis'}</span>
            </h1>
            <p className="text-neutral-400 font-medium text-sm max-w-sm">
                {subStep === 'dashboard'
                    ? "Verify the AI-generated architecture and financial projections."
                    : "Refine your project identity before initializing the intelligence engine."}
            </p>
        </div>
    );

    return (
        <div className="max-w-6xl mx-auto space-y-10 pb-20 pt-12 px-6">
            {renderHeader()}

            <AnimatePresence mode="wait">
                {subStep === 'config' && (
                    <motion.div
                        key="config"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white rounded-[40px] border border-neutral-100 shadow-super p-10 md:p-16 space-y-12"
                    >
                        <div className="space-y-8">
                            <div className="space-y-3 text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <Briefcase size={14} className="text-brand-primary-500" />
                                    <label className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase">Project Title</label>
                                </div>
                                <Input
                                    placeholder="e.g., Enterprise SaaS Platform v2.0"
                                    value={projectData.name}
                                    onChange={e => setProjectData({ ...projectData, name: e.target.value })}
                                    className="h-14 text-lg rounded-[20px] border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all px-6 font-bold shadow-subtle focus:ring-8 focus:ring-brand-primary-500/5"
                                />
                            </div>

                            <div className="space-y-3 text-left">
                                <div className="flex items-center gap-2 mb-2">
                                    <FileText size={14} className="text-brand-primary-500" />
                                    <label className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase">Mission Brief</label>
                                </div>
                                <Textarea
                                    placeholder="Describe the core problem and high-level objectives..."
                                    className="rounded-[24px] border-neutral-100 bg-neutral-50/50 focus:bg-white transition-all min-h-[200px] p-6 text-sm leading-relaxed shadow-subtle focus:ring-8 focus:ring-brand-primary-500/5 font-medium"
                                    value={projectData.description}
                                    onChange={e => setProjectData({ ...projectData, description: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-8 border-t border-neutral-50">
                            <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest italic">
                                Automation enabled for timeline and resource mapping
                            </p>
                            <Button
                                onClick={() => setSubStep('auth')}
                                disabled={!projectData.name || !projectData.description}
                                className="bg-brand-primary-500 hover:bg-neutral-900 text-white rounded-2xl px-10 h-14 font-black text-[10px] uppercase tracking-[0.3em] shadow-xl transition-all flex items-center gap-3"
                            >
                                Start Analysis
                                <ChevronRight size={18} />
                            </Button>
                        </div>
                    </motion.div>
                )}

                {subStep === 'auth' && (
                    <GeminiAuth
                        apiKey={apiKey}
                        onKeyChange={handleApiKeyChange}
                        onNext={() => setSubStep('resources')}
                    />
                )}

                {subStep === 'resources' && (
                    <div className="bg-white rounded-[40px] border border-neutral-100 shadow-super p-10">
                        <ResourcePool pool={employeePool} setPool={setEmployeePool} />
                        <div className="mt-10 flex justify-end">
                            <Button
                                onClick={() => setSubStep('upload')}
                                className="bg-brand-primary-500 hover:bg-neutral-900 text-white rounded-xl px-8 h-12 font-black text-[10px] uppercase tracking-[0.2em]"
                            >
                                Continue to Scoping <ChevronRight size={16} className="ml-2" />
                            </Button>
                        </div>
                    </div>
                )}

                {subStep === 'upload' && (
                    <RequirementUpload
                        onFileSelected={runAnalysis}
                        isLoading={isAnalyzing}
                        error={error}
                    />
                )}

                {subStep === 'dashboard' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="space-y-8"
                    >
                        {/* Status Bar */}
                        <div className="flex justify-between items-center bg-brand-primary-50/30 p-6 rounded-3xl border border-brand-primary-100 mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-white border border-brand-primary-100 flex items-center justify-center text-brand-primary-500 shadow-sm">
                                    <Rocket size={24} />
                                </div>
                                <div>
                                    <h3 className="text-sm font-black text-neutral-900 uppercase tracking-widest leading-none mb-1">Architecture Synthesized</h3>
                                    <p className="text-[10px] text-neutral-400 font-medium">Ready for deployment synchronization</p>
                                </div>
                            </div>
                            <Button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className="bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl px-6 h-12 font-black text-[10px] uppercase tracking-[0.2em] relative overflow-hidden"
                            >
                                {isSyncing ? (
                                    <span className="flex items-center gap-2">
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        >
                                            <Sparkles size={16} />
                                        </motion.div>
                                        Synchronizing...
                                    </span>
                                ) : hasSynced ? (
                                    <span className="flex items-center gap-2 text-emerald-400">
                                        <CheckCircle size={16} /> Data Committed
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Save size={16} /> Sync to Database
                                    </span>
                                )}
                            </Button>
                        </div>

                        {/* The Dashboard ready for the new schema */}
                        <AIDashboard data={analysisData || testData} />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Toast */}
            <Toast
                show={showSyncToast}
                message="Project blueprints synchronized to database"
                onClose={() => setShowSyncToast(false)}
            />
        </div>
    );
};

export default AnalysisPage;
