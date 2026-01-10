import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import {
    Clock,
    DollarSign,
    TrendingUp,
    Shield,
    Cloud,
    AlertTriangle,
    Target,
    ArrowUpRight,
    Info,
    Loader2,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    Briefcase,
    Key,
    Users,
    FileText,
    Sparkles,
    Store,
    Rocket
} from 'lucide-react';

import { getProject } from '@/api/projects';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { MouseEffect } from '@/components/ui/mouse-effect';
import { MagicCard } from '@/components/ui/magic-card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { cn } from '@/utils/utils';
import axios from 'axios';

// Wizard Components
import GeminiAuth from '../ai-analysis/components/GeminiAuth';
import InternalResourcePool from '../ai-analysis/components/InternalResourcePool';
import DynamicResourcePool from '../ai-analysis/components/DynamicResourcePool';
import StaffingStrategy from '../ai-analysis/components/StaffingStrategy';
import RequirementUpload from '../ai-analysis/components/RequirementUpload';
import AIDashboard from '../ai-analysis/components/AIDashboard';

import teamChecklistImg from '@/assets/login/team checklist-pana.png';
import team1Img from '@/assets/login/team1.png';

// --- Shared Components from NotificationsPage ---

const SectionHeader = ({ title, icon: Icon, color }) => {
    const colorMap = {
        primary: 'brand-primary',
        brand: 'brand-primary',
        indigo: 'indigo',
        cyan: 'cyan',
        amber: 'amber',
        emerald: 'emerald',
        rose: 'rose'
    };
    const baseColor = colorMap[color] || 'brand-primary';

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 bg-${baseColor}-50 rounded-lg text-${baseColor}-500 shadow-sm border border-${baseColor}-100`}>
                <Icon size={18} />
            </div>
            <h2 className="text-sm font-black text-neutral-900 tracking-[0.05em] uppercase">{title}</h2>
        </div>
    );
};

const TableRow = ({ name, detail, cost, formula }) => (
    <div className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0 hover:bg-brand-primary-50/30 transition-all px-3 rounded-2xl group cursor-default">
        <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-bold text-neutral-900 leading-none">{name}</span>
            {detail && <span className="text-[10px] text-neutral-400 font-medium">{detail}</span>}
            {formula && (
                <div className="flex items-center gap-1.5 mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-3 h-[1px]" style={{ backgroundColor: '#5d5fef' }}></div>
                    <span className="text-[9px] font-mono italic" style={{ color: '#5d5fef' }}>{formula}</span>
                </div>
            )}
        </div>
        <div className="text-right">
            <div className="flex flex-col items-end">
                <span className="text-[13px] font-black text-neutral-900 group-hover:text-brand-primary-600 transition-colors tracking-tight">
                    {Number(cost).toLocaleString()} <span className="text-[9px] text-neutral-400 ml-0.5">MAD</span>
                </span>
            </div>
        </div>
    </div>
);

const NotificationFinancialCard = ({ title, value, icon: Icon, color, subtitle, isCurrency = true }) => {
    const colorMap = {
        primary: 'brand-primary',
        brand: 'brand-primary',
        amber: 'amber',
        cyan: 'cyan',
        emerald: 'emerald',
        rose: 'rose'
    };

    const baseColor = colorMap[color] || 'brand-primary';

    return (
        <MagicCard className="rounded-2xl shadow-subtle border border-neutral-100">
            <div className="p-6 relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 bg-${baseColor}-500/5 blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-${baseColor}-500/10`}></div>
                <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                        <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">{title}</p>
                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                            {isCurrency && <span className="text-[10px] font-bold text-neutral-400 ml-1">MAD</span>}
                        </h3>
                        {subtitle && <p className="text-[10px] text-neutral-400 font-medium leading-tight">{subtitle}</p>}
                    </div>
                    <div className={`p-3 bg-${baseColor}-50 rounded-xl text-${baseColor}-500`}>
                        <Icon size={20} />
                    </div>
                </div>
            </div>
        </MagicCard>
    );
};

const NotificationAnalysisDashboard = ({ data }) => {
    if (!data) return null;

    // Handle roi_projections either as array (backend) or object (test_data)
    let projections = [];
    if (Array.isArray(data.roi_projections)) {
        projections = data.roi_projections.map(p => ({
            year: p.year_number,
            ...p
        }));
    } else if (data.roi_projections) {
        projections = [
            { year: 1, ...data.roi_projections.year_1 },
            { year: 2, ...data.roi_projections.year_2 },
            { year: 3, ...data.roi_projections.year_3 }
        ];
    }

    // Safety check if projections is empty
    if (projections.length === 0) {
        // Fallback or empty state could go here, but for now we'll render with defaults
    }

    const finalRoi = projections.length > 0 ? projections[projections.length - 1].roi_percentage : 0;
    const roiColor = finalRoi > 0 ? 'emerald' : 'rose';

    // Calculate or use Break Event
    const breakEven = data.break_even_point_months || (data.roi_projections?.break_even_point_months) || 'N/A';

    // Calculate total gains if not directly available
    const totalGainsRaw = data.estimated_gains ? data.estimated_gains.reduce((acc, g) => acc + parseFloat(g.cost_mad), 0) : 0;

    return (
        <div className="w-full space-y-8 pb-10">
            {/* Header Summary with Magic Cards */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 md:grid-cols-5 gap-4"
            >
                <NotificationFinancialCard
                    title="Dev Duration"
                    value={data.estimated_duration_months ? `${data.estimated_duration_months} Months` : 'N/A'}
                    icon={Clock}
                    isCurrency={false}
                    color="primary"
                    subtitle="Estimated timeline"
                />
                <NotificationFinancialCard
                    title="Total Investment"
                    value={data.total_project_cost}
                    icon={DollarSign}
                    color="cyan"
                    subtitle="Initial CAPEX + Setup"
                />
                <NotificationFinancialCard
                    title="Estimated Gains"
                    value={totalGainsRaw}
                    icon={TrendingUp}
                    color="emerald"
                    subtitle="Annual Benefits"
                />
                <NotificationFinancialCard
                    title="Break-even"
                    value={breakEven !== 'N/A' ? `${breakEven} Months` : 'N/A'}
                    icon={Shield}
                    isCurrency={false}
                    color="amber"
                    subtitle="Recovery point"
                />
                <MagicCard className={`rounded-2xl shadow-subtle border border-neutral-100 border-b-4 border-b-${roiColor}-500`}>
                    <div className="p-6 relative overflow-hidden">
                        <div className="relative z-10">
                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-1">3-Year ROI</p>
                            <div className="flex items-baseline gap-2">
                                <h3 className={`text-2xl font-black text-${roiColor}-600 tracking-tighter`}>
                                    {Number(finalRoi).toFixed(1)}%
                                </h3>
                                <ArrowUpRight size={16} className={`text-${roiColor}-500`} />
                            </div>
                            <p className="text-[9px] text-neutral-400 mt-2 font-medium">Net Efficiency</p>
                        </div>
                    </div>
                </MagicCard>
            </motion.div>

            {/* ROI Projections Timeline */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary-500/10 rounded-xl text-brand-primary-500 border border-brand-primary-500/20">
                            <TrendingUp size={18} />
                        </div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">ROI Performance Forecast</h2>
                    </div>
                    <div className="h-[1px] flex-grow mx-8 bg-neutral-100"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {projections.map((proj, idx) => {
                        const isProfitable = proj.roi_percentage > 0;
                        const statusColor = proj.year === 1 ? 'rose' : proj.year === 2 ? 'amber' : 'emerald';

                        return (
                            <MagicCard key={idx} className="rounded-2xl border border-neutral-100 shadow-sm relative overflow-hidden group">
                                <div className={`absolute top-0 right-0 w-24 h-24 bg-${statusColor}-500/5 blur-2xl -mr-12 -mt-12 group-hover:bg-${statusColor}-500/10 transition-all`}></div>
                                <div className="p-5 relative z-10 space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className={`text-[9px] font-black text-${statusColor}-500 uppercase tracking-widest`}>Fiscal Year 0{proj.year}</span>
                                        <div className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-tighter ${isProfitable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                            {isProfitable ? 'Profit' : 'Investment'}
                                        </div>
                                    </div>

                                    <div className="space-y-0.5">
                                        <div className="flex items-baseline gap-1">
                                            <h3 className={`text-xl font-black tracking-tight ${isProfitable ? 'text-emerald-600' : 'text-neutral-900'}`}>
                                                {Number(proj.roi_percentage).toFixed(1)}%
                                            </h3>
                                            <ArrowUpRight size={14} className={isProfitable ? 'text-emerald-500' : 'text-rose-400'} />
                                        </div>
                                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest opacity-80">Net ROI Forecast</p>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-neutral-400 font-black uppercase tracking-tighter">Net Cash Flow</span>
                                            <span className={`text-[11px] font-black ${proj.net_cash_flow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {proj.net_cash_flow >= 0 ? '+' : ''}{Number(proj.net_cash_flow).toLocaleString()} <span className="text-[9px] opacity-50">MAD</span>
                                            </span>
                                        </div>
                                        <div className="w-16 h-1 bg-neutral-100 rounded-full overflow-hidden shrink-0">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${Math.min(Math.max(proj.roi_percentage + 100, 10), 100)}%` }}
                                                className={`h-full bg-${statusColor}-500`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </MagicCard>
                        );
                    })}
                </div>
            </motion.div>

            {/* Projected Annual Gains */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500 border border-emerald-500/20">
                            <TrendingUp size={18} />
                        </div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-500">Projected Annual Benefits</h2>
                    </div>
                    <div className="h-[1px] flex-grow mx-8 bg-neutral-100"></div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.estimated_gains && data.estimated_gains.map((gain, idx) => (
                        <MagicCard key={idx} className="rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
                            <div className="p-5 group flex flex-col justify-between h-full bg-white rounded-2xl relative">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/5 blur-2xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="px-2 py-0.5 bg-neutral-50 border border-neutral-100 rounded-md">
                                            <h5 className="text-[9px] font-black text-neutral-500 uppercase tracking-tight">{gain.item_name}</h5>
                                        </div>
                                        <div className="p-1.5 bg-neutral-50 rounded-lg text-neutral-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                            <TrendingUp size={12} />
                                        </div>
                                    </div>
                                    <p className="text-[11px] text-neutral-500 leading-relaxed mb-4 font-medium line-clamp-2">{gain.description}</p>
                                </div>

                                <div className="flex items-baseline gap-1.5 pt-4 border-t border-neutral-50 relative z-10">
                                    <span className="text-xl font-black text-neutral-900 tracking-tight">
                                        +{Number(gain.cost_mad).toLocaleString()}
                                    </span>
                                    <span className="text-[9px] font-bold uppercase text-neutral-400 tracking-widest">MAD / Yr</span>
                                </div>
                            </div>
                        </MagicCard>
                    ))}
                </div>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* CAPEX Section */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-white rounded-[32px] border border-neutral-100 shadow-subtle overflow-hidden"
                >
                    <MouseEffect className="p-8">
                        <SectionHeader title="Initial Investment (CAPEX)" icon={Shield} color="primary" />
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[9px] uppercase font-black text-neutral-400 mb-4 tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-4 h-[2px] bg-neutral-200"></div>
                                    Development Team
                                </h4>
                                <div className="space-y-1">
                                    {data.selected_engineers && data.selected_engineers.map((eng, idx) => (
                                        <TableRow
                                            key={idx}
                                            name={eng.role}
                                            detail={`${eng.level} • ${eng.months_assigned} months`}
                                            cost={eng.total_cost_mad}
                                            formula={`${Number(eng.monthly_salary_mad).toLocaleString()} MAD/mo • ${eng.months_assigned} mo`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[9px] uppercase font-black text-neutral-400 mb-4 tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-4 h-[2px] bg-neutral-200"></div>
                                    Setup & Infrastructure
                                </h4>
                                <div className="space-y-1">
                                    {data.licenses_and_apis && data.licenses_and_apis.map((item, idx) => (
                                        <TableRow
                                            key={idx}
                                            name={item.item_name}
                                            detail={item.description}
                                            cost={item.cost_mad}
                                            formula={item.formule}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-neutral-50 space-y-3 relative z-20">
                                <div className="flex justify-between items-center text-[10px] font-bold text-neutral-400">
                                    <span className="uppercase tracking-widest">Base Investment</span>
                                    <span>{(data.total_capex / (1 + (data.contingency_buffer_percentage || 15) / 100)).toLocaleString()} MAD</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-amber-500">
                                    <span className="uppercase tracking-widest">Contingency Buffer ({data.contingency_buffer_percentage || 15}%)</span>
                                    <span>{((data.total_capex / (1 + (data.contingency_buffer_percentage || 15) / 100)) * (data.contingency_buffer_percentage || 15) / 100).toLocaleString()} MAD</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-neutral-50">
                                    <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Total Capital Expense</span>
                                    <span className="text-lg font-black text-neutral-900 tracking-tight">{Number(data.total_capex).toLocaleString()} MAD</span>
                                </div>
                            </div>
                        </div>
                    </MouseEffect>
                </motion.div>

                {/* OPEX Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[32px] border border-neutral-100 shadow-subtle overflow-hidden"
                >
                    <MouseEffect className="p-8">
                        <SectionHeader title="Monthly Operations (OPEX)" icon={Cloud} color="amber" />
                        <div className="space-y-8">
                            <div>
                                <h4 className="text-[9px] uppercase font-black text-neutral-400 mb-4 tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-4 h-[2px] bg-neutral-200"></div>
                                    Support & Maintenance
                                </h4>
                                <div className="space-y-1">
                                    {data.maintenance_engineers && data.maintenance_engineers.map((eng, idx) => (
                                        <TableRow
                                            key={idx}
                                            name={eng.role}
                                            detail={`${eng.level} • Recurring`}
                                            cost={eng.total_cost_mad}
                                            formula={`${Number(eng.monthly_salary_mad).toLocaleString()} MAD/mo • ${eng.months_assigned} mo`}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[9px] uppercase font-black text-neutral-400 mb-4 tracking-[0.2em] flex items-center gap-2">
                                    <div className="w-4 h-[2px] bg-neutral-200"></div>
                                    Cloud Services
                                </h4>
                                <div className="space-y-1">
                                    {data.cloud_subscription && data.cloud_subscription.map((item, idx) => (
                                        <TableRow
                                            key={idx}
                                            name={item.item_name}
                                            detail={item.description}
                                            cost={item.cost_mad}
                                            formula={item.formule}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="pt-6 border-t border-neutral-50 flex justify-between items-center relative z-20">
                                <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Ongoing Monthly Cost</span>
                                <span className="text-lg font-black text-neutral-900 tracking-tight">{Number(data.total_opex).toLocaleString()} MAD</span>
                            </div>
                        </div>
                    </MouseEffect>
                </motion.div>
            </div>

            {/* Metrics & KPIs */}
            <div className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[32px] border border-neutral-100 p-8 shadow-subtle"
                >
                    <SectionHeader title="Non-Financial KPIs" icon={Target} color="cyan" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.kpis && data.kpis.map((kpi, idx) => (
                            <div key={idx} className="p-5 bg-cyan-50/30 rounded-2xl border border-cyan-100 flex items-center justify-between group hover:bg-cyan-50 transition-colors">
                                <div className="space-y-1">
                                    <h4 className="text-[13px] font-black text-neutral-900">{kpi.metric_name}</h4>
                                    <p className="text-[10px] text-neutral-400 font-medium">Method: {kpi.measurement_method}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-black text-cyan-600 tracking-tight group-hover:scale-110 transition-transform">{kpi.target_value}</div>
                                    <div className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">Target</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Strategy Insight */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                className="bg-neutral-900 p-10 rounded-[40px] text-white relative overflow-hidden"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-primary-500/10 blur-[100px] -mr-48 -mt-48"></div>
                <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand-primary-500/20 rounded-xl text-brand-primary-400 border border-brand-primary-500/30">
                            <Info size={18} />
                        </div>
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Executive Strategy Analysis</h2>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-sm">
                        <div className="text-base text-neutral-200 leading-relaxed font-medium italic">
                            {data.roi_analysis_summary?.split(' ').map((word, i) => (
                                <BlurReveal key={i} delay={0.1 + i * 0.02}>
                                    {word}&nbsp;
                                </BlurReveal>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// --- Wizard Components and Logic ---

const STEPS = [
    { id: 1, title: "Intro", icon: Info },
    { id: 2, title: "Baseline", icon: Rocket },
    { id: 3, title: "Intelligence", icon: Key },
    { id: 4, title: "Scoping", icon: FileText },
    { id: 5, title: "Blueprint", icon: TrendingUp }
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

const shakeVariant = {
    shake: {
        x: [-5, 5, -5, 5, 0],
        transition: { duration: 0.4 }
    }
};

const TechnicalBlueprintWizard = ({ initialData }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [direction, setDirection] = useState(0);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState(null);
    const [validationError, setValidationError] = useState(null);

    const [projectData, setProjectData] = useState({
        name: initialData?.project_name || '',
        description: '', // This will be filled by user
    });

    const [apiKey, setApiKey] = useState(localStorage.getItem('gemini_api_key') || '');
    const [employeePool, setEmployeePool] = useState([
        { role: "Backend Developer", level: "Senior", salary: 30000 },
        { role: "Frontend Developer", level: "Mid-level", salary: 20000 },
        { role: "UI/UX Designer", level: "Junior", salary: 18000 },
    ]);

    const [staffingStrategy, setStaffingStrategy] = useState('internal');
    const [staffingData, setStaffingData] = useState(null);
    const [activeAccordion, setActiveAccordion] = useState(null);
    const [isStoring, setIsStoring] = useState(false);
    const [storeMessage, setStoreMessage] = useState(null);

    const nameControls = useAnimation();
    const descControls = useAnimation();
    const apiControls = useAnimation();

    const validateCurrentStep = () => {
        if (currentStep === 1) {
            // Step 1 is now Intro (informational), no validation required.
            return true;
        }

        if (currentStep === 2) {
            // Step 2 is now informational (Baseline), no validation needed
            return true;
        }

        if (currentStep === 3) {
            if (!apiKey) {
                apiControls.start("shake");
                setValidationError("Gemini API Key is required");
                return false;
            }
        }
        if (currentStep === 4) {
            if (!staffingData) {
                setValidationError("Please upload the Scoping PDF to proceed.");
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
        localStorage.setItem('gemini_api_key', key);
    };

    const handleAnalysis = async (file) => {
        if (!apiKey) {
            setError("Please enter your Google Gemini API Key first.");
            setDirection(-1);
            // Stay on step 3 if key is missing
            return;
        }

        setError(null);
        setIsAnalyzing(true);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('pool_employes', JSON.stringify(employeePool));
        formData.append('api_key', apiKey);

        try {
            const response = await axios.post(`${ANALYZE_API_URL}/analyze-staffing`, formData);
            setStaffingData(response.data);
            setStaffingData(response.data);
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

    // Disabled storage logic for "frontend only" mode
    const handleStoreInDatabase = async () => {
        // Placeholder for future functionality
        console.log("Saving project blueprint...", staffingData);
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
                                <span className="text-[11px] text-neutral-500 font-medium leading-tight block mt-0.5">Detailed CAPEX/OPEX breakdown, ROI projections, and hidden costs.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-8 h-8 rounded-2xl bg-indigo-50 flex items-center justify-center shrink-0 border border-indigo-100">
                                <Users size={16} className="text-indigo-600" />
                            </div>
                            <div className="pt-1">
                                <span className="text-neutral-900 font-bold block text-sm">Team Composition</span>
                                <span className="text-[11px] text-neutral-500 font-medium leading-tight block mt-0.5">Precise role identification, seniority levels, and resource mapping.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                <p className="text-xs text-neutral-500 font-bold leading-relaxed max-w-md mx-auto mt-4">
                    <span className="text-indigo-500 block mb-1 uppercase tracking-widest text-[9px]">Ensure Accuracy</span>
                    To validate this data and ensure the accuracy of the breakdown, you will need to upload the <span className="text-neutral-900 border-b border-neutral-200 pb-0.5">Scoping Document</span> in Step 4.
                </p>
            </motion.div>
        </motion.div>
    );

    const renderStep2 = () => {
        // Data derived from initialData which comes from backend
        const duration = initialData?.estimated_duration_months || 0;
        const totalInvestment = initialData?.total_project_cost || 0;
        const totalCapex = initialData?.total_capex || 0;
        const setupCost = (initialData?.licenses_and_apis?.reduce((acc, item) => acc + parseFloat(item.cost_mad), 0)) || 0;
        const engineers = initialData?.selected_engineers || [];

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
                                <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${isOpen ? 'text-brand-primary-600' : 'text-neutral-400'}`}>{title}</h4>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-neutral-900 tracking-tight">{value}</span>
                                    {subvalue && <span className="text-xs font-bold text-neutral-400">{subvalue}</span>}
                                </div>
                            </div>
                        </div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-brand-primary-50 text-brand-primary-600 rotate-180' : 'bg-white text-neutral-300'}`}>
                            <ChevronRight size={20} />
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
                                <div className="p-6 pt-0 border-t border-brand-primary-50/50">
                                    <div className="pt-6">
                                        {children}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            );
        };

        return (
            <motion.div
                variants={cascadeContainer}
                initial="hidden"
                animate="show"
                className="space-y-4 max-w-2xl mx-auto py-2"
            >
                <motion.div variants={cascadeItem} className="text-center mb-8">
                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Project Baseline Analysis</h3>
                    <p className="text-sm text-neutral-500 font-medium mt-2">Verified data from initial estimation.</p>
                </motion.div>

                <AccordionItem
                    id="duration"
                    title="Dev Duration"
                    value={`${duration}`}
                    subvalue="Months"
                    icon={Clock}
                >
                    <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-100">
                        <p className="text-sm text-neutral-600 leading-relaxed">
                            Estimated timeline for the development phase, excluding maintenance and post-launch support.
                            <br /><br />
                            <span className="font-bold text-neutral-900 block">Phases Included:</span>
                        </p>
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {['Discovery', 'Design', 'Development', 'Testing', 'Deployment'].map((phase, i) => (
                                <span key={i} className="px-3 py-1 bg-white border border-neutral-100 rounded-lg text-[10px] font-bold text-neutral-500 uppercase tracking-wider">{phase}</span>
                            ))}
                        </div>
                    </div>
                </AccordionItem>

                <AccordionItem
                    id="investment"
                    title="Total Investment"
                    value={Number(totalInvestment).toLocaleString()}
                    subvalue="MAD"
                    icon={DollarSign}
                >
                    <div className="space-y-4">
                        <div className="flex justify-between items-center p-4 bg-emerald-50/50 rounded-xl border border-emerald-100/50">
                            <span className="text-xs font-bold text-emerald-700 uppercase tracking-wide">Initial CAPEX</span>
                            <span className="text-sm font-black text-emerald-800">{Number(totalCapex).toLocaleString()} MAD</span>
                        </div>
                        <div className="flex justify-between items-center p-4 bg-white rounded-xl border border-neutral-100">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Infrastructure & Setup</span>
                                <span className="text-[10px] text-neutral-400">Licenses, APIs, Environment</span>
                            </div>
                            <span className="text-sm font-bold text-neutral-700">{Number(setupCost).toLocaleString()} MAD</span>
                        </div>
                    </div>
                </AccordionItem>

                <AccordionItem
                    id="team"
                    title="Development Team"
                    value={engineers.length}
                    subvalue="Engineers"
                    icon={Users}
                >
                    <div className="space-y-2">
                        {engineers.length > 0 ? engineers.map((eng, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 bg-white border border-neutral-100 rounded-xl hover:border-brand-primary-200 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-brand-primary-50 text-brand-primary-600 rounded-lg flex items-center justify-center font-bold text-xs">
                                        {eng.role.charAt(0)}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-neutral-900">{eng.role}</span>
                                        <span className="text-[10px] text-neutral-400 font-medium">{eng.level} • {eng.months_assigned}m</span>
                                    </div>
                                </div>
                                <span className="text-xs font-black text-neutral-700">{Number(eng.total_cost_mad).toLocaleString()} MAD</span>
                            </div>
                        )) : (
                            <p className="text-sm text-neutral-400 italic p-4 text-center">No engineers assigned in this phase.</p>
                        )}
                    </div>
                </AccordionItem>
            </motion.div>
        );
    };
    const renderAnalyzing = () => (
        <div className="flex flex-col items-center justify-center py-24 space-y-10 max-w-md mx-auto">
            <div className="relative">
                <motion.div
                    animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="h-32 w-32 rounded-[40px] bg-brand-primary-50 flex items-center justify-center"
                >
                    <Sparkles className="h-14 w-14 text-brand-primary-500" />
                </motion.div>
                <div className="absolute -top-2 -left-2 h-36 w-36 border-2 border-brand-primary-500/20 rounded-[44px] animate-[spin_8s_linear_infinite]" />
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
                        Technical <span className="text-brand-primary-500 italic">Blueprint</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-neutral-400 font-bold text-[11px] uppercase tracking-[0.3em] max-w-2xl leading-relaxed"
                    >
                        Decompose specific requirements into Epics and User Stories using AI reasoning.
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
                                                        {step.id === 4 ? (staffingStrategy === 'internal' ? 'Talent Pool' : 'Resources') : step.title}
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
                                            {currentStep === 2 && renderStep2()}
                                            {currentStep === 3 && (
                                                <div className="space-y-8">
                                                    <div className="text-center mb-8">
                                                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Intelligence Engine</h3>
                                                        <p className="text-sm text-neutral-500 font-medium mt-2">Configure AI access to proceed.</p>
                                                    </div>

                                                    <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden max-w-xl mx-auto">
                                                        <GeminiAuth
                                                            apiKey={apiKey}
                                                            onKeyChange={handleApiKeyChange}
                                                            onNext={() => { }} // Managed by main navigation
                                                            validationError={validationError && !apiKey}
                                                            shakeControls={apiControls}
                                                            compact={true}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                            {currentStep === 4 && (
                                                <div className="space-y-8">
                                                    <div className="text-center mb-8">
                                                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Scoping</h3>
                                                        <p className="text-sm text-neutral-500 font-medium mt-2">Upload your scoping document.</p>
                                                    </div>
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.2 }}
                                                    >
                                                        <RequirementUpload
                                                            onFileSelected={handleAnalysis}
                                                            isLoading={isAnalyzing}
                                                            error={error}
                                                        />
                                                    </motion.div>
                                                </div>
                                            )}
                                            {currentStep === 5 && (
                                                <div className="space-y-10">
                                                    <AIDashboard data={staffingData} />
                                                </div>
                                            )}

                                            {/* Unified Navigation Controllers */}
                                            {currentStep < 5 && (
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

                                                        {/* Hide generic 'Progress' button on Step 4 (Upload) as upload triggers next, unless we want a skip or manual confirm? 
                                                            Usually upload components handle the action. 
                                                            But users might want to go next if they already uploaded? 
                                                            For now, let's keep it visible for Step 3 (Auth) and hide for Step 4 (Upload) if the component handles it. 
                                                            Wait, user logic: Step 4 is Upload.
                                                        */}
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

const ProjectDeepDive = () => {
    const { id } = useParams();
    const [projectData, setProjectData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const data = await getProject(id);
                // Transform API response to match NotificationAnalysisDashboard structure
                const transformedData = {
                    project_name: data.name,
                    estimated_duration_months: data.estimated_duration_months,
                    total_project_cost: data.total_project_cost,
                    total_capex: data.total_capex,
                    total_opex: data.total_opex,
                    roi_analysis_summary: data.roi_analysis_summary,
                    contingency_buffer_percentage: 15, // Default as it might be missing
                    selected_engineers: data.assigned_engineers
                        ?.filter(e => e.phase === 'development')
                        .map(e => ({
                            role: e.specialization?.name || 'Engineer',
                            level: e.specialization?.level || 'Mid',
                            months_assigned: e.months_assigned,
                            monthly_salary_mad: e.specialization?.salary || 0,
                            total_cost_mad: (e.specialization?.salary || 0) * e.months_assigned
                        })) || [],
                    maintenance_engineers: data.assigned_engineers
                        ?.filter(e => e.phase === 'maintenance')
                        .map(e => ({
                            role: e.specialization?.name || 'Engineer',
                            level: e.specialization?.level || 'Mid',
                            months_assigned: e.months_assigned, // usually 12 for maintenance
                            monthly_salary_mad: e.specialization?.salary || 0,
                            total_cost_mad: (e.specialization?.salary || 0) * e.months_assigned
                        })) || [],
                    licenses_and_apis: data.infrastructure_costs
                        ?.filter(i => i.type === 'capex') || [],
                    cloud_subscription: data.infrastructure_costs
                        ?.filter(i => i.type === 'opex') || [],
                    estimated_gains: data.estimated_gains || [],
                    roi_projections: data.roi_projections || [], // Array of objects, handled by component
                    kpis: data.kpis || [],
                    risk_assessment: data.risks || [],
                    break_even_point_months: data.break_even_point_months
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
                <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Project Hub</h1>
                <p className="text-neutral-500">
                    Deep dive into project details, technical blueprints, and financials for <span className="font-bold text-neutral-900">{projectData?.project_name}</span>.
                </p>
            </div>

            <div className="w-full flex-1 flex flex-col space-y-8">
                <div className="w-full max-w-md grid grid-cols-2 bg-neutral-100/50 p-1 rounded-xl">
                    <button
                        onClick={() => setActiveTab("overview")}
                        className={`py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === "overview"
                            ? "bg-white text-brand-primary-600 shadow-sm"
                            : "text-neutral-500 hover:text-neutral-700"
                            }`}
                    >
                        Strategic Overview
                    </button>
                    <button
                        onClick={() => setActiveTab("blueprint")}
                        className={`py-1.5 text-sm font-medium rounded-lg transition-all ${activeTab === "blueprint"
                            ? "bg-white text-brand-primary-600 shadow-sm"
                            : "text-neutral-500 hover:text-neutral-700"
                            }`}
                    >
                        Technical Blueprint
                    </button>
                </div>

                <div className={activeTab === "overview" ? "block animate-in fade-in zoom-in-95 duration-200" : "hidden"}>
                    <NotificationAnalysisDashboard data={projectData} />
                </div>

                <div className={activeTab === "blueprint" ? "block animate-in fade-in zoom-in-95 duration-200" : "hidden"}>
                    <TechnicalBlueprintWizard initialData={projectData} />
                </div>
            </div>
        </div>
    );
};

export default ProjectDeepDive;
