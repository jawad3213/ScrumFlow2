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
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/utils/utils';
import { getAvailableEmployees } from '@/api';
import teamChecklistImg from '@/assets/login/team checklist-pana.png';
import team1Img from '@/assets/login/team1.png';
import LoadingAnimation from '@/components/ui/LoadingAnimation';

const steps = ["Project Info", "Team Strategy", "Team Roles", "Specifications", "AI Results"];

const NewProjectPage = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [teamStrategy, setTeamStrategy] = useState('available'); // 'available' or 'manual'

    // --- State ---
    const [projectData, setProjectData] = useState({
        name: '',
        description: '',
    });

    const [file, setFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const [roles, setRoles] = useState([
        { id: 1, name: 'Senior Developer', salary: 6500 },
        { id: 2, name: 'UI/UX Designer', salary: 4500 },
    ]);

    const [availableEmployees, setAvailableEmployees] = useState([]);
    const [fetchingEmployees, setFetchingEmployees] = useState(false);
    const [selectedEmployees, setSelectedEmployees] = useState([]);

    useEffect(() => {
        if (currentStep === 3 && teamStrategy === 'available') {
            fetchAvailable();
        }
    }, [currentStep, teamStrategy]);

    const fetchAvailable = async () => {
        setFetchingEmployees(true);
        try {
            const data = await getAvailableEmployees();
            setAvailableEmployees(data);
            // Auto-select all by default
            setSelectedEmployees(data.map(emp => emp.id));
        } catch (err) {
            console.error("Error fetching available employees:", err);
        } finally {
            setFetchingEmployees(false);
        }
    };

    const toggleEmployee = (empId) => {
        setSelectedEmployees(prev =>
            prev.includes(empId)
                ? prev.filter(id => id !== empId)
                : [...prev, empId]
        );
    };

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
        if (currentStep === 4) {
            // Prepare data for Gemini analysis
            const selectedTeam = teamStrategy === 'available'
                ? availableEmployees
                    .filter(emp => selectedEmployees.includes(emp.id))
                    .map(emp => ({
                        id: emp.id,
                        name: `${emp.first_name} ${emp.last_name}`,
                        specialization: emp.specialization?.name,
                        level: emp.specialization?.level,
                        salary: emp.specialization?.salary
                    }))
                : roles.map(role => ({
                    role: role.name,
                    salary: role.salary
                }));

            const finalData = {
                project: projectData,
                teamStrategy,
                selectedTeam,
                specificationFile: file ? { name: file.name, type: file.type } : null
            };

            console.log("Preparing analysis for Gemini:", finalData);

            setIsAnalyzing(true);
            setTimeout(() => {
                setIsAnalyzing(false);
                setCurrentStep(5);
            }, 3000);
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

    const renderStep1 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl mx-auto py-4">
            <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase ml-1">Project Name</label>
                <Input
                    placeholder="e.g., Enterprise SaaS Platform"
                    value={projectData.name}
                    onChange={e => setProjectData({ ...projectData, name: e.target.value })}
                    className="h-12 text-base rounded-xl border-neutral-200 bg-neutral-50/30 focus:bg-white transition-all px-4 font-normal shadow-subtle focus:ring-4 focus:ring-brand-primary-500/5 placeholder:text-neutral-300"
                />
            </div>
            <div className="space-y-3">
                <label className="text-[10px] font-black text-neutral-400 tracking-[0.2em] uppercase ml-1">Project Description</label>
                <Textarea
                    placeholder="Describe your project goals..."
                    className="rounded-2xl border-neutral-200 bg-neutral-50/30 focus:bg-white transition-all min-h-[160px] p-4 text-sm leading-relaxed shadow-subtle focus:ring-4 focus:ring-brand-primary-500/5 placeholder:text-neutral-300 font-normal"
                    value={projectData.description}
                    onChange={e => setProjectData({ ...projectData, description: e.target.value })}
                />
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 py-4 max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Option 1: Available Team */}
                <div
                    onClick={() => setTeamStrategy('available')}
                    className={cn(
                        "group relative bg-white rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                        teamStrategy === 'available'
                            ? "border-brand-primary-500 shadow-xl shadow-brand-primary-500/10 scale-[1.02]"
                            : "border-neutral-100 hover:border-brand-primary-200 grayscale opacity-80"
                    )}
                >
                    <div className="p-6 flex flex-col items-center text-center space-y-4">
                        <div className="w-full aspect-square bg-neutral-50 rounded-2xl overflow-hidden flex items-center justify-center p-4 group-hover:bg-brand-primary-50/50 transition-colors">
                            <img src={teamChecklistImg} alt="Available Team" className="max-h-full object-contain" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-neutral-900 text-base">Use Available Team</h3>
                            <p className="text-[10px] text-neutral-500 font-medium px-4">Leverage your existing staff members from the talent pool.</p>
                        </div>
                        <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            teamStrategy === 'available' ? "border-brand-primary-500 bg-brand-primary-500" : "border-neutral-200"
                        )}>
                            {teamStrategy === 'available' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                    </div>
                </div>

                {/* Option 2: Manual / Build Own */}
                <div
                    onClick={() => setTeamStrategy('manual')}
                    className={cn(
                        "group relative bg-white rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden",
                        teamStrategy === 'manual'
                            ? "border-brand-primary-500 shadow-xl shadow-brand-primary-500/10 scale-[1.02]"
                            : "border-neutral-100 hover:border-brand-primary-200 grayscale opacity-80"
                    )}
                >
                    <div className="p-6 flex flex-col items-center text-center space-y-4">
                        <div className="w-full aspect-square bg-neutral-50 rounded-2xl overflow-hidden flex items-center justify-center p-4 group-hover:bg-brand-primary-50/50 transition-colors">
                            <img src={team1Img} alt="Manual Roles" className="max-h-full object-contain" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="font-bold text-neutral-900 text-base">Choose Your Own Team</h3>
                            <p className="text-[10px] text-neutral-500 font-medium px-4">Define specific roles and requirements manually for this project.</p>
                        </div>
                        <div className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            teamStrategy === 'manual' ? "border-brand-primary-500 bg-brand-primary-500" : "border-neutral-200"
                        )}>
                            {teamStrategy === 'manual' && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderStep3 = () => {
        if (teamStrategy === 'available') {
            const sortedEmployees = [...availableEmployees].sort((a, b) =>
                (a.specialization?.name || "").localeCompare(b.specialization?.name || "")
            );

            const getSpecColor = (name) => {
                const colors = {
                    'Frontend Developer': 'bg-sky-50/70',
                    'Backend Developer': 'bg-emerald-50/70',
                    'Fullstack Developer': 'bg-indigo-50/70',
                    'UI/UX Designer': 'bg-fuchsia-50/70',
                    'DevOps Engineer': 'bg-amber-50/70',
                    'Project Manager': 'bg-violet-50/70',
                    'QA Engineer': 'bg-teal-50/70',
                };
                return colors[name] || 'bg-neutral-50/50';
            };

            return (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-4 max-w-3xl mx-auto">
                    <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-subtle min-h-[300px]">
                        {fetchingEmployees ? (
                            <div className="flex flex-col items-center justify-center py-10 bg-white">
                                <LoadingAnimation className="w-64 h-64" />
                                <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest -mt-10">Searching for perfect matches...</p>
                            </div>
                        ) : availableEmployees.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                <div className="h-16 w-16 rounded-full bg-neutral-50 flex items-center justify-center">
                                    <Users className="h-8 w-8 text-neutral-300" />
                                </div>
                                <div className="text-center space-y-1">
                                    <h3 className="text-sm font-bold text-neutral-900">No Employees Available</h3>
                                    <p className="text-[10px] text-neutral-500 font-medium">All team members are currently engaged in other projects.</p>
                                </div>
                            </div>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="bg-neutral-50/50 border-b border-surface-border">
                                    <tr>
                                        <th className="px-6 py-3 w-12 text-center">
                                            <Checkbox
                                                checked={selectedEmployees.length === sortedEmployees.length}
                                                onCheckedChange={(checked) => {
                                                    if (checked) setSelectedEmployees(sortedEmployees.map(e => e.id));
                                                    else setSelectedEmployees([]);
                                                }}
                                                className="rounded-[4px] border-neutral-300 data-[state=checked]:bg-brand-primary-500 data-[state=checked]:border-brand-primary-500"
                                            />
                                        </th>
                                        <th className="px-2 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-400">Employee Name</th>
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-400">Role</th>
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-400">Level</th>
                                        <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-400 text-right">Base Salary</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-surface-border/30">
                                    {sortedEmployees.map((emp) => (
                                        <tr
                                            key={emp.id}
                                            className={cn(
                                                "group transition-all cursor-pointer",
                                                getSpecColor(emp.specialization?.name),
                                                !selectedEmployees.includes(emp.id) && "bg-opacity-40 hover:bg-opacity-100"
                                            )}
                                            onClick={() => toggleEmployee(emp.id)}
                                        >
                                            <td className="px-6 py-4">
                                                <Checkbox
                                                    checked={selectedEmployees.includes(emp.id)}
                                                    onCheckedChange={() => toggleEmployee(emp.id)}
                                                    className="rounded-md"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold text-neutral-900">{emp.first_name} {emp.last_name}</span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-neutral-600 text-xs">
                                                {emp.specialization?.name}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className="bg-white text-neutral-900 border-neutral-200 font-bold px-2 py-0.5 text-[9px] uppercase tracking-tighter">
                                                    {emp.specialization?.level}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <span className="text-xs font-black text-neutral-900">{parseFloat(emp.specialization?.salary).toLocaleString()} MAD</span>
                                                <span className="text-[9px] text-neutral-400 block font-medium">/ month</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                    <div className="flex justify-between items-center px-2">
                        <p className="text-[10px] text-neutral-400 font-medium italic">
                            * Select members to assign them to this new project team.
                        </p>
                        <span className="text-[10px] font-black text-brand-primary-600 uppercase tracking-wider">
                            {selectedEmployees.length} Members Selected
                        </span>
                    </div>
                </div>
            );
        }

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-4 max-w-2xl mx-auto">
                <div className="bg-white rounded-2xl border border-surface-border overflow-hidden shadow-subtle">
                    <table className="w-full text-left">
                        <thead className="bg-neutral-50/50 border-b border-surface-border">
                            <tr>
                                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-400">Role Name</th>
                                <th className="px-6 py-3 text-[9px] font-black uppercase tracking-widest text-neutral-400">Monthly Salary (€)</th>
                                <th className="px-6 py-3 w-16"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-border">
                            {roles.map((role) => (
                                <tr key={role.id} className="group hover:bg-neutral-50/30 transition-colors">
                                    <td className="px-6 py-3">
                                        <Input
                                            value={role.name}
                                            onChange={e => updateRole(role.id, 'name', e.target.value)}
                                            className="border-none bg-transparent hover:bg-white focus:bg-white focus:ring-0 shadow-none px-0 font-bold text-neutral-900 h-8 text-sm"
                                            placeholder="Enter role..."
                                        />
                                    </td>
                                    <td className="px-6 py-3">
                                        <Input
                                            type="number"
                                            value={role.salary}
                                            onChange={e => updateRole(role.id, 'salary', e.target.value)}
                                            className="border-none bg-transparent hover:bg-white focus:bg-white focus:ring-0 shadow-none px-0 font-bold text-neutral-900 h-8 text-sm"
                                            placeholder="0.00"
                                        />
                                    </td>
                                    <td className="px-6 py-3">
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
                    <div className="p-3 bg-neutral-50/30">
                        <button
                            onClick={addRole}
                            className="flex items-center gap-2 text-brand-primary-600 hover:text-brand-primary-700 font-black text-[10px] uppercase tracking-wider px-2 py-1 transition-all"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add Custom Role
                        </button>
                    </div>
                </div>
                <p className="text-[10px] text-neutral-400 font-medium px-2 italic">
                    * These rates help Gemini estimate the total project budget.
                </p>
            </div>
        );
    };

    const renderStep4 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 py-4 max-w-2xl mx-auto">
            <div
                className={cn(
                    "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300",
                    file ? "border-success-500 bg-success-50/30" : "border-neutral-200 hover:border-brand-primary-500 hover:bg-brand-primary-50/10"
                )}
            >
                <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300",
                    file ? "bg-success-100 text-success-600 scale-110" : "bg-neutral-100 text-neutral-400 group-hover:scale-110"
                )}>
                    {file ? <FileText className="h-7 w-7" /> : <FileUp className="h-7 w-7" />}
                </div>

                <h3 className="text-sm font-black text-neutral-900 tracking-tight mb-1">
                    {file ? file.name : "Upload Technical Specs"}
                </h3>
                <p className="text-[11px] text-neutral-500 font-medium mb-6 text-center max-w-xs">
                    Drag and drop your PDF here to help Gemini understand the scope.
                </p>

                <input type="file" id="spec-upload" className="hidden" accept=".pdf" onChange={handleFileUpload} />
                <Button asChild variant={file ? "secondary" : "default"} className="rounded-xl px-6 h-10 text-xs font-bold font-sans">
                    <label htmlFor="spec-upload" className="cursor-pointer">{file ? "Change File" : "Select PDF"}</label>
                </Button>

                {file && (
                    <div className="w-full max-w-xs mt-6 space-y-1.5">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-wider text-neutral-400">
                            <span>Processing</span>
                            <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-success-500 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );

    const renderStep5 = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {[
                    { label: 'Total Estimated Cost', value: analysisResult.financials.totalCost, icon: TrendingUp, color: 'text-success-600', bg: 'bg-success-50' },
                    { label: 'Target ROI', value: analysisResult.financials.roi, icon: Clock, color: 'text-brand-primary-600', bg: 'bg-brand-primary-50' },
                    { label: 'Monthly Burn', value: analysisResult.financials.monthlyBurn, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((item, i) => (
                    <div key={i} className="bg-white rounded-2xl border border-surface-border p-5 shadow-subtle">
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">{item.label}</p>
                        <h4 className="text-xl font-black text-neutral-900 tracking-tight">{item.value}</h4>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle">
                    <h3 className="text-sm font-black text-neutral-900 tracking-tight mb-4 flex items-center gap-2">
                        <Users className="h-4 w-4 text-brand-primary-500" />
                        Team Sizing
                    </h3>
                    <div className="space-y-3">
                        {analysisResult.teamSizing.map((team, i) => (
                            <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-surface-background/50 border border-surface-border/50">
                                <span className="font-bold text-neutral-800 text-xs">{team.role}</span>
                                <Badge className="bg-white text-neutral-900 border-neutral-200 font-bold px-2 py-0.5 text-[10px]">
                                    {team.count} Pax
                                </Badge>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-surface-border p-6 shadow-subtle">
                    <h3 className="text-sm font-black text-neutral-900 tracking-tight mb-4 flex items-center gap-2">
                        <Clock className="h-4 w-4 text-brand-primary-500" />
                        Timeline
                    </h3>
                    <div className="space-y-5">
                        {analysisResult.phases.map((phase, i) => (
                            <div key={i} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold text-neutral-800">
                                    <span>{phase.name}</span>
                                    <span className="text-neutral-400 uppercase">{phase.duration}</span>
                                </div>
                                <div className="h-2 bg-neutral-100 rounded-full overflow-hidden">
                                    <div className={cn("h-full transition-all duration-1000", phase.color)} style={{ width: '100%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );

    const renderAnalyzing = () => (
        <div className="flex flex-col items-center justify-center py-20 space-y-8 animate-in zoom-in-95 duration-700 max-w-md mx-auto">
            <div className="relative">
                <div className="h-24 w-24 rounded-full border-4 border-brand-primary-100 flex items-center justify-center animate-pulse">
                    <Sparkles className="h-12 w-12 text-brand-primary-500 animate-spin-slow" />
                </div>
                <div className="absolute top-0 left-0 h-24 w-24 border-t-4 border-brand-primary-500 rounded-full animate-spin" />
            </div>

            <div className="text-center space-y-2">
                <h2 className="text-xl font-black text-neutral-900 tracking-tight uppercase">AI Generation In Progress</h2>
                <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                    Gemini Flash 1.5 is scanning your requirements to build a complete project roadmap.
                </p>
            </div>
        </div>
    );

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-20 pt-10 px-4">
            {/* Header Area */}
            <div className="text-center max-w-xl mx-auto space-y-3">
                <h1 className="text-3xl font-black text-neutral-900 tracking-tighter animate-in fade-in duration-700">
                    Create New Project
                </h1>
                <p className="text-neutral-500 font-medium text-sm animate-in fade-in duration-700 delay-200">
                    Follow the steps below to initialize your project with AI analysis.
                </p>
            </div>

            {/* Combined Stepper + Form Container */}
            <div className="bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-neutral-100 overflow-hidden">
                {/* Horizontal Stepper Top Center */}
                {!isAnalyzing && (
                    <div className="p-8 border-b border-neutral-50 flex justify-center">
                        <div className="flex items-center gap-2">
                            {steps.map((step, index) => {
                                const stepNumber = index + 1;
                                const isActive = stepNumber === currentStep;
                                const isCompleted = stepNumber < currentStep;

                                return (
                                    <React.Fragment key={index}>
                                        <div className="flex items-center gap-3 group">
                                            <div className={cn(
                                                "w-10 h-10 rounded-xl flex items-center justify-center border-2 transition-all duration-500 shrink-0",
                                                isActive
                                                    ? "bg-brand-primary-500 border-brand-primary-500 text-white scale-110 shadow-lg shadow-brand-primary-500/20"
                                                    : isCompleted
                                                        ? "bg-success-default border-success-default text-white"
                                                        : "bg-white border-neutral-100 text-neutral-400"
                                            )}>
                                                {isCompleted ? <CheckCircle2 className="h-5 w-5" /> : <span className="font-bold text-xs">{stepNumber}</span>}
                                            </div>
                                            <span className={cn(
                                                "text-[10px] font-black uppercase tracking-widest hidden md:block",
                                                isActive ? "text-neutral-900" : "text-neutral-400"
                                            )}>
                                                {step}
                                            </span>
                                        </div>
                                        {index < steps.length - 1 && (
                                            <div className="w-12 h-[2px] bg-neutral-200 mx-2" />
                                        )}
                                    </React.Fragment>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Form Body */}
                <div className="p-8 md:p-12">
                    {isAnalyzing ? (
                        renderAnalyzing()
                    ) : (
                        <div className="min-h-[300px]">
                            {currentStep === 1 && renderStep1()}
                            {currentStep === 2 && renderStep2()}
                            {currentStep === 3 && renderStep3()}
                            {currentStep === 4 && renderStep4()}
                            {currentStep === 5 && renderStep5()}

                            {/* Navigation */}
                            <div className={cn(
                                "mt-10 pt-8 border-t border-neutral-50 flex items-center justify-between",
                                currentStep === 1 ? "justify-end" : "justify-between"
                            )}>
                                {currentStep > 1 && currentStep < 6 && (
                                    <Button
                                        variant="ghost"
                                        onClick={handleBack}
                                        className="rounded-xl px-6 font-black text-[10px] uppercase tracking-widest h-10 hover:bg-neutral-50 transition-all text-neutral-400 hover:text-neutral-900"
                                    >
                                        Back
                                    </Button>
                                )}

                                <Button
                                    onClick={currentStep === 5 ? () => navigate('/dashboard') : handleNext}
                                    className="bg-brand-primary-500 hover:bg-neutral-900 text-white rounded-xl px-8 h-10 font-black text-[10px] uppercase tracking-[0.15em] shadow-lg shadow-brand-primary-500/10 transition-all duration-300"
                                >
                                    {currentStep === 5 ? "Finalize Project" : "Next Step"}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NewProjectPage;
