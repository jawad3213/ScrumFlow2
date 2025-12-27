import React from 'react';
import { motion } from 'framer-motion';
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
    ArrowUpRight,
    Clock,
    AlertTriangle,
    Target
} from 'lucide-react';
import testData from '../ai-analysis/test_data.json';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { MouseEffect } from '@/components/ui/mouse-effect';
import { MagicCard } from '@/components/ui/magic-card';

// --- Re-implementing Dashboard with Magic Effects for Notifications Page ---

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
                    {cost.toLocaleString()} <span className="text-[9px] text-neutral-400 ml-0.5">MAD</span>
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

    const projections = data.roi_projections ? [
        { year: 1, ...data.roi_projections.year_1 },
        { year: 2, ...data.roi_projections.year_2 },
        { year: 3, ...data.roi_projections.year_3 }
    ] : [];

    const finalRoi = data.roi_projections?.year_3?.roi_percentage || 0;
    const roiColor = finalRoi > 0 ? 'emerald' : 'rose';

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
                    value={data.estimated_gains ? data.estimated_gains.reduce((acc, g) => acc + g.cost_mad, 0) : 0}
                    icon={TrendingUp}
                    color="emerald"
                    subtitle="Annual Benefits"
                />
                <NotificationFinancialCard
                    title="Break-even"
                    value={data.roi_projections?.break_even_point_months ? `${data.roi_projections.break_even_point_months} Months` : 'N/A'}
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
                                    {finalRoi.toFixed(1)}%
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
                                                {proj.roi_percentage.toFixed(1)}%
                                            </h3>
                                            <ArrowUpRight size={14} className={isProfitable ? 'text-emerald-500' : 'text-rose-400'} />
                                        </div>
                                        <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-widest opacity-80">Net ROI Forecast</p>
                                    </div>

                                    <div className="pt-4 border-t border-neutral-50 flex items-center justify-between">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-neutral-400 font-black uppercase tracking-tighter">Net Cash Flow</span>
                                            <span className={`text-[11px] font-black ${proj.net_cash_flow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                                {proj.net_cash_flow >= 0 ? '+' : ''}{proj.net_cash_flow.toLocaleString()} <span className="text-[9px] opacity-50">MAD</span>
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

            {/* Projected Annual Gains - Separate Section */}
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
                                        +{gain.cost_mad.toLocaleString()}
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
                                            formula={`${eng.monthly_salary_mad.toLocaleString()} MAD/mo • ${eng.months_assigned} mo`}
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
                                    <span className="text-lg font-black text-neutral-900 tracking-tight">{data.total_capex.toLocaleString()} MAD</span>
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
                                            formula={`${eng.monthly_salary_mad.toLocaleString()} MAD/mo • ${eng.months_assigned} mo`}
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
                                <span className="text-lg font-black text-neutral-900 tracking-tight">{data.total_opex.toLocaleString()} MAD</span>
                            </div>
                        </div>
                    </MouseEffect>
                </motion.div>
            </div>

            {/* Risks & KPIs */}
            <div className="grid lg:grid-cols-2 gap-8">
                {/* Risk Assessment */}
                <MagicCard className="rounded-[32px] border border-neutral-100 shadow-subtle">
                    <div className="p-8">
                        <SectionHeader title="Risk Assessment Matrix" icon={AlertTriangle} color="amber" />
                        <div className="space-y-4">
                            {data.risk_assessment && data.risk_assessment.map((risk, idx) => {
                                const impactColors = {
                                    Critical: 'bg-red-500',
                                    High: 'bg-orange-500',
                                    Medium: 'bg-amber-500',
                                    Low: 'bg-blue-500'
                                };
                                return (
                                    <div key={idx} className="p-4 bg-neutral-50/50 rounded-2xl border border-neutral-100 flex gap-4">
                                        <div className={`w-1 shrink-0 rounded-full ${impactColors[risk.impact] || 'bg-neutral-300'}`}></div>
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h4 className="text-[13px] font-black text-neutral-900">{risk.risk_name}</h4>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase text-white ${impactColors[risk.impact] || 'bg-neutral-300'}`}>
                                                    {risk.impact} Impact
                                                </span>
                                            </div>
                                            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed">
                                                <span className="text-brand-primary-500 font-bold">Mitigation:</span> {risk.mitigation_strategy}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </MagicCard>

                {/* Success Metrics (KPIs) */}
                <MagicCard className="rounded-[32px] border border-neutral-100 shadow-subtle">
                    <div className="p-8">
                        <SectionHeader title="Non-Financial KPIs" icon={Target} color="cyan" />
                        <div className="grid grid-cols-1 gap-4">
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
                    </div>
                </MagicCard>
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

const NotificationsPage = () => {
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 min-h-screen bg-neutral-50/30">
            {/* Sandbox Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-neutral-100">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-brand-primary-500 font-black text-[10px] uppercase tracking-[0.2em] mb-2">
                        <Sparkles size={14} />
                        <span>UI Sandbox</span>
                    </div>
                    <h1 className="text-4xl font-black text-neutral-900 tracking-tight flex items-center gap-3">
                        AI Blueprint Preview
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 text-[10px] rounded-full">Development Mode</span>
                    </h1>
                    <p className="text-neutral-500 text-sm font-medium">
                        Live preview of the AI Analysis Engine output for <span className="text-brand-primary-600 font-bold">{testData.project_name}</span>.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="bg-white p-4 rounded-2xl border border-neutral-100 flex items-center gap-4 shadow-sm">
                        <div className="w-10 h-10 rounded-xl bg-neutral-900 flex items-center justify-center text-white">
                            <Layout size={20} />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Target Resolution</p>
                            <p className="text-xs font-bold text-neutral-900">Responsive Dashboard</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Injected Analysis Dashboard (Specialized with Magic Cards) */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <NotificationAnalysisDashboard data={testData} />
            </motion.div>
        </div>
    );
};

export default NotificationsPage;
