import React, { useState, useEffect } from 'react';
import {
    ChevronRight,
    ChevronLeft,
    Plus,
    Trash2,
    FileUp,
    FileText,
    Sparkles,
    TrendingUp,
    Users,
    Clock,
    AlertTriangle,
    CheckCircle2,
    X,
    Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Stepper } from '@/components/ui/Stepper';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/utils/utils';

const steps = ["General Info", "Technical Specs", "Budget & Team", "AI Analysis"];

const NewProjectPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    // --- Step 1 State ---
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
    });

    // --- Step 2 State ---
    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // --- Step 3 State ---
    const [roles, setRoles] = useState([
        { id: 1, name: 'Scrum Master', salary: 5500 },
        { id: 2, name: 'Business Analyst', salary: 4800 },
        { id: 3, name: 'Senior Developer', salary: 6500 },
        { id: 4, name: 'Junior Developer', salary: 3200 },
        { id: 5, name: 'UI/UX Designer', salary: 4500 },
    ]);

    // --- Step 4 (AI Analysis Mock) ---
    const analysisResult = {
        teamSizing: [
            { role: 'Backend Dev', count: 2, confidence: 95 },
            { role: 'Frontend Dev', count: 2, confidence: 90 },
            { role: 'QA Engineer', count: 1, confidence: 85 },
        ],
        financials: {
            totalCost: '€142,500',
            roi: '14 months',
            monthlyBurn: '€24,000'
        },
        phases: [
            { name: 'Discovery', duration: '2 weeks', color: 'bg-blue-500' },
            { name: 'Development', duration: '12 weeks', color: 'bg-brand-primary-500' },
            { name: 'Testing', duration: '3 weeks', color: 'bg-purple-500' },
        ],
        epics: [
            { title: 'User Authentication', stories: 5 },
            { title: 'Task Dashboard', stories: 12 },
            { title: 'AI Integration', stories: 8 },
        ]
    };

    const handleNext = () => {
        if (currentStep === 3) {
            setIsAnalyzing(true);
            // Simulate AI Processing
            setTimeout(() => {
                setIsAnalyzing(false);
                setCurrentStep(4);
            }, 3500);
        } else {
            setCurrentStep(prev => Math.min(prev + 1, steps.length));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            // Simulate progress
            let progress = 0;
            const interval = setInterval(() => {
                progress += 10;
                setUploadProgress(progress);
                if (progress >= 100) clearInterval(interval);
            }, 100);
        }
    };

    const addRole = () => {
        const newId = roles.length > 0 ? Math.max(...roles.map(r => r.id)) + 1 : 1;
        setRoles([...roles, { id: newId, name: '', salary: 0 }]);
    };

    const updateRole = (id, field, value) => {
        setRoles(roles.map(role => role.id === id ? { ...role, [field]: value } : role));
    };

    const removeRole = (id) => {
        setRoles(roles.filter(role => role.id !== id));
    };

    // --- Renderers ---

    const renderStep1 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="space-y-2">
                <label className="text-sm font-black text-neutral-700 tracking-tight uppercase ml-1">Project Name</label>
                <Input
                    placeholder="e.g., TaskFlow 2.0 Redesign"
                    value={projectData.name}
                    onChange={e => setProjectData({ ...projectData, name: e.target.value })}
                    className="h-14 text-lg rounded-2xl border-surface-border/50 focus:ring-brand-primary-500/10"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-black text-neutral-700 tracking-tight uppercase ml-1">Project Description</label>
                <Textarea
                    placeholder="Describe the main objectives and scope of the project..."
                    className="rounded-2xl border-surface-border/50 min-h-[160px] p-4 text-base"
                    value={projectData.description}
                    onChange={e => setProjectData({ ...projectData, description: e.target.value })}
                />
            </div>
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-black text-neutral-700 tracking-tight uppercase ml-1">Start Date</label>
                    <Input
                        type="date"
                        value={projectData.startDate}
                        onChange={e => setProjectData({ ...projectData, startDate: e.target.value })}
                        className="h-12 rounded-xl"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-black text-neutral-700 tracking-tight uppercase ml-1">Est. End Date</label>
                    <Input
                        type="date"
                        value={projectData.endDate}
                        onChange={e => setProjectData({ ...projectData, endDate: e.target.value })}
                        className="h-12 rounded-xl"
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <div
                className={cn(
                    "border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center transition-all duration-300",
                    file ? "border-success-500 bg-success-50/30" : "border-neutral-200 hover:border-brand-primary-500 hover:bg-brand-primary-50/10"
                )}
            >
                <div className={cn(
                    "w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform duration-300",
                    file ? "bg-success-100 text-success-600 scale-110" : "bg-neutral-100 text-neutral-400 group-hover:scale-110"
                )}>
                    {file ? <FileText className="h-10 w-10" /> : <FileUp className="h-10 w-10" />}
                </div>

                <h3 className="text-xl font-black text-neutral-900 tracking-tight mb-2">
                    {file ? file.name : "Upload Technical Specifications"}
                </h3>
                <p className="text-neutral-500 font-medium mb-8 text-center max-w-sm">
                    Drag and drop your PDF file here, or click to browse. Technical analysis works best with detailed CDC documents.
                </p>

                <input
                    type="file"
                    id="spec-upload"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleFileUpload}
                />

                <Button
                    asChild
                    variant={file ? "secondary" : "default"}
                    className="rounded-xl px-8 h-12 font-bold transition-all"
                >
                    <label htmlFor="spec-upload" className="cursor-pointer">
                        {file ? "Change File" : "Select PDF"}
                    </label>
                </Button>

                {file && (
                    <div className="w-full max-w-md mt-10 space-y-2">
                        <div className="flex justify-between text-xs font-black uppercase tracking-wider text-neutral-400">
                            <span>Uploading & Scanning</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-success-500 transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-brand-primary-50/50 border border-brand-primary-100 rounded-2xl p-4 flex gap-4 items-center">
                <Sparkles className="h-5 w-5 text-brand-primary-500 shrink-0" />
                <p className="text-sm font-medium text-brand-primary-700">
                    Our AI (Gemini Flash) will automatically extract roles, features, and timeline estimates from your uploaded document.
                </p>
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
            <div className="bg-white rounded-3xl border border-surface-border overflow-hidden shadow-subtle">
                <table className="w-full text-left">
                    <thead className="bg-neutral-50/50 border-b border-surface-border">
                        <tr>
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-neutral-400">Role Name</th>
                            <th className="px-6 py-4 text-[11px] font-black uppercase tracking-widest text-neutral-400">Monthly Salary (€)</th>
                            <th className="px-6 py-4 w-16"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-border">
                        {roles.map((role) => (
                            <tr key={role.id} className="group hover:bg-neutral-50/30 transition-colors">
                                <td className="px-6 py-4">
                                    <Input
                                        value={role.name}
                                        onChange={e => updateRole(role.id, 'name', e.target.value)}
                                        className="border-none bg-transparent hover:bg-white focus:bg-white focus:ring-0 shadow-none px-0 font-bold text-neutral-900 h-8"
                                        placeholder="Enter role..."
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <Input
                                        type="number"
                                        value={role.salary}
                                        onChange={e => updateRole(role.id, 'salary', e.target.value)}
                                        className="border-none bg-transparent hover:bg-white focus:bg-white focus:ring-0 shadow-none px-0 font-bold text-neutral-900 h-8"
                                        placeholder="0.00"
                                    />
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => removeRole(role.id)}
                                        className="text-neutral-300 hover:text-danger-default transition-colors p-2 rounded-lg"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="p-4 bg-neutral-50/30">
                    <button
                        onClick={addRole}
                        className="flex items-center gap-2 text-brand-primary-600 hover:text-brand-primary-700 font-black text-xs uppercase tracking-wider px-2 py-1 transition-all"
                    >
                        <Plus className="h-4 w-4" />
                        Add Custom Role
                    </button>
                </div>
            </div>
            <p className="text-xs text-neutral-400 font-medium px-2">
                * These rates will be used by Gemini to calculate the total project budget and ROI.
            </p>
        </div>
    );

    const renderStep4 = () => (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Top Cards: Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                    { label: 'Total Estimated Cost', value: analysisResult.financials.totalCost, icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-50' },
                    { label: 'Target ROI', value: analysisResult.financials.roi, icon: Clock, color: 'text-brand-primary-600', bg: 'bg-brand-primary-50' },
                    { label: 'Monthly Burn', value: analysisResult.financials.monthlyBurn, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((item, i) => (
                    <div key={i} className="bg-white rounded-3xl border border-surface-border p-6 shadow-subtle group hover:scale-[1.02] transition-transform duration-300">
                        <div className={cn("inline-flex p-3 rounded-2xl mb-4", item.bg)}>
                            <item.icon className={cn("h-6 w-6", item.color)} />
                        </div>
                        <p className="text-xs font-black text-neutral-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <h4 className="text-2xl font-black text-neutral-900 tracking-tight">{item.value}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Team Sizing */}
                <div className="bg-white rounded-3xl border border-surface-border p-8 shadow-subtle">
                    <h3 className="text-lg font-black text-neutral-900 tracking-tight mb-6 flex items-center gap-2">
                        <Users className="h-5 w-5 text-brand-primary-500" />
                        Optimal Team Sizing
                    </h3>
                    <div className="space-y-4">
                        {analysisResult.teamSizing.map((team, i) => (
                            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-background/50 border border-surface-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-white shadow-sm font-black text-neutral-900 border border-surface-border">
                                        {team.count}
                                    </div>
                                    <span className="font-bold text-neutral-700">{team.role}</span>
                                </div>
                                <Badge className="bg-success-50 text-success-700 border-success-100 font-bold px-3 py-1">
                                    {team.confidence}% Match
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Phases */}
                <div className="bg-white rounded-3xl border border-surface-border p-8 shadow-subtle">
                    <h3 className="text-lg font-black text-neutral-900 tracking-tight mb-6 flex items-center gap-2">
                        <Clock className="h-5 w-5 text-brand-primary-500" />
                        Project Timeline Phases
                    </h3>
                    <div className="space-y-6">
                        {analysisResult.phases.map((phase, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-sm font-bold text-neutral-700">
                                    <span>{phase.name}</span>
                                    <span className="text-neutral-400">{phase.duration}</span>
                                </div>
                                <div className="h-3 bg-neutral-100 rounded-full overflow-hidden">
                                    <div className={cn("h-full transition-all duration-1000", phase.color)} style={{ width: '100%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Backlog Preview */}
            <div className="bg-white rounded-3xl border border-surface-border p-8 shadow-subtle">
                <h3 className="text-lg font-black text-neutral-900 tracking-tight mb-6 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-brand-primary-500" />
                    Generated Epics & Stories
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {analysisResult.epics.map((epic, i) => (
                        <div key={i} className="p-5 rounded-2xl bg-neutral-50/50 border border-neutral-200/50 hover:bg-white hover:shadow-md transition-all cursor-default">
                            <h5 className="font-black text-neutral-900 tracking-tight mb-2">{epic.title}</h5>
                            <div className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                                <div className="h-2 w-2 rounded-full bg-brand-primary-500" />
                                {epic.stories} user stories generated
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );

    const renderAnalyzing = () => (
        <div className="flex flex-col items-center justify-center py-24 space-y-8 animate-in zoom-in-95 duration-500">
            <div className="relative">
                <div className="h-32 w-32 rounded-full border-4 border-brand-primary-100 flex items-center justify-center animate-pulse">
                    <Sparkles className="h-16 w-16 text-brand-primary-500 animate-spin-slow" />
                </div>
                <div className="absolute top-0 left-0 h-32 w-32 border-t-4 border-brand-primary-500 rounded-full animate-spin" />
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-2xl font-black text-neutral-900 tracking-tight">AI Analysis in Progress</h2>
                <p className="text-neutral-500 font-medium max-w-sm mx-auto">
                    Gemini Flash 1.5 is scanning your specifications, matching roles to salaries, and calculating the optimal project roadmap.
                </p>
            </div>

            <div className="w-full max-w-xs space-y-4">
                {[
                    "Parsing technical requirements...",
                    "Generating backlog epics...",
                    "Estimating development timeline...",
                    "Calculating budget & ROI..."
                ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left-4 fade-in" style={{ animationDelay: `${i * 800}ms` }}>
                        <div className="h-2 w-2 rounded-full bg-brand-primary-500" />
                        <span className="text-sm font-bold text-neutral-600">{text}</span>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-10 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tighter">
                        Create New Project
                    </h1>
                    <p className="text-neutral-500 font-medium text-lg mt-1">
                        AI-Powered project initialization and estimation.
                    </p>
                </div>
                {!isAnalyzing && <Stepper steps={steps} currentStep={currentStep} />}
            </div>

            <div className="bg-white/50 backdrop-blur-sm rounded-[40px] border border-white/40 p-1 md:p-1.5 shadow-2xl">
                <div className="bg-white rounded-[34px] p-8 md:p-12 shadow-inner border border-surface-border/50">
                    {isAnalyzing ? (
                        renderAnalyzing()
                    ) : (
                        <>
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                            {currentStep === 4 && renderStep4()}

                            {/* Navigation */}
                            <div className="mt-12 pt-8 border-t border-surface-border flex justify-between">
                                <Button
                                    variant="ghost"
                                    onClick={handleBack}
                                    disabled={currentStep === 1 || currentStep === 4}
                                    className="rounded-xl px-6 font-bold h-12"
                                >
                                    <ChevronLeft className="h-4 w-4 mr-2" />
                                    Back
                                </Button>

                                <Button
                                    onClick={currentStep === 4 ? () => navigate('/dashboard') : handleNext}
                                    className="bg-[#605BFF] hover:bg-[#605BFF]/90 text-white rounded-xl px-8 font-bold h-12 shadow-lg shadow-brand-primary-500/20"
                                >
                                    {currentStep === 4 ? (
                                        <>Done & Create Project <CheckCircle2 className="ml-2 h-4 w-4" /></>
                                    ) : (
                                        <>Next Step <ChevronRight className="ml-2 h-4 w-4" /></>
                                    )}
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewProjectPage;
