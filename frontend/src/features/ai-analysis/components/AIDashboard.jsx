import React from 'react';
import { Users, DollarSign, TrendingUp, Shield, Cloud, Settings, Info, ArrowUpRight, Clock, AlertTriangle, Target } from 'lucide-react';
import { motion } from 'framer-motion';
import { BlurReveal } from '@/components/ui/blur-reveal';
import { MouseEffect } from '@/components/ui/mouse-effect';
import FinancialCard from '@/components/shared/FinancialCard';
import SectionHeader from '@/components/shared/SectionHeader';
import SimpleTableRow from '@/components/shared/SimpleTableRow';



const AIDashboard = ({ data }) => {
    if (!data) return null;

    const projections = [
        { year: 1, ...data.roi_projections.year_1 },
        { year: 2, ...data.roi_projections.year_2 },
        { year: 3, ...data.roi_projections.year_3 }
    ];

    const finalRoi = data.roi_projections.year_3.roi_percentage;
    const roiColor = finalRoi > 0 ? 'emerald' : 'rose';

    return (
        <div className="w-full space-y-8 pb-10">
            {/* Header Summary - 5 Columns Single Line */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
            >
                <FinancialCard
                    title="Dev Duration"
                    value={data.estimated_duration_months ? `${data.estimated_duration_months} Months` : 'N/A'}
                    icon={Clock}
                    isCurrency={false}
                    color="primary"
                    subtitle="Estimated timeline"
                />
                <FinancialCard
                    title="Total Investment"
                    value={data.total_project_cost}
                    icon={DollarSign}
                    color="cyan"
                    subtitle="Initial CAPEX + Setup"
                    precision={0}
                />
                <FinancialCard
                    title="Estimated Gains"
                    value={data.estimated_gains.reduce((acc, g) => acc + Number(g.cost_mad), 0)}
                    icon={TrendingUp}
                    color="emerald"
                    subtitle="Annual Benefits"
                    precision={0}
                />
                <FinancialCard
                    title="Break-even"
                    value={data.roi_projections.break_even_point_months ? `${Number(data.roi_projections.break_even_point_months).toFixed(1)} Months` : 'N/A'}
                    icon={Shield}
                    isCurrency={false}
                    color="amber"
                    subtitle="Recovery point"
                />
                <div className={`bg-white border border-neutral-100 rounded-2xl p-6 relative overflow-hidden shadow-subtle border-b-4 border-b-${roiColor}-500`}>
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
            </motion.div>

            {/* Projections Visuals */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-neutral-100 rounded-[32px] p-8 shadow-subtle"
            >
                <SectionHeader title="3-Year Financial Trajectory" icon={TrendingUp} color="brand" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                    {projections.map((proj, idx) => (
                        <div key={idx} className="bg-neutral-50/50 border border-neutral-100 rounded-2xl p-6 hover:border-brand-primary-200 transition-all hover:translate-y-[-4px] duration-300">
                            <div className="flex justify-between items-center mb-5">
                                <span className="px-3 py-1 bg-brand-primary-500 font-black text-[9px] rounded-full text-white uppercase tracking-widest">Year {proj.year}</span>
                                <span className={`text-sm font-black ${proj.roi_percentage > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {Number(proj.roi_percentage).toFixed(1)}%
                                </span>
                            </div>
                            <div className="space-y-3.5">
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-neutral-500 font-medium">Cumulative Cost</span>
                                    <span className="text-neutral-900 font-black tracking-tight">{Number(proj.cumulative_costs).toLocaleString('fr-FR')}</span>
                                </div>
                                <div className="flex justify-between text-[11px]">
                                    <span className="text-neutral-500 font-medium">Cumulative Gain</span>
                                    <span className="text-emerald-600 font-black tracking-tight">+{Number(proj.cumulative_gains).toLocaleString('fr-FR')}</span>
                                </div>
                                <div className="pt-4 mt-1 border-t border-neutral-100 flex justify-between items-center text-xs font-black">
                                    <span className="text-neutral-400 uppercase tracking-widest text-[9px]">Net Flow</span>
                                    <span className={proj.net_cash_flow > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                        {proj.net_cash_flow > 0 ? '+' : ''}{Number(proj.net_cash_flow).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
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

                <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {data.estimated_gains.map((gain, idx) => (
                        <div key={idx} className="bg-white p-8 rounded-[32px] border border-neutral-100 group hover:border-brand-primary-500/30 transition-all hover:shadow-2xl hover:shadow-brand-primary-500/5 flex flex-col justify-between h-full">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="px-3 py-1 bg-brand-primary-50 rounded-lg">
                                        <h5 className="text-[10px] font-black text-brand-primary-600 uppercase tracking-tight">{gain.item_name}</h5>
                                    </div>
                                    <div className="p-2 bg-neutral-50 rounded-full group-hover:bg-brand-primary-500 group-hover:text-white transition-colors">
                                        <ArrowUpRight size={16} />
                                    </div>
                                </div>
                                <p className="text-xs text-neutral-500 leading-relaxed mb-6 font-medium">{gain.description}</p>
                            </div>
                            <div className="flex items-baseline gap-2 pt-4 border-t border-neutral-50">
                                <span className="text-3xl font-black text-neutral-900 tracking-tighter">
                                    +{Number(gain.cost_mad).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}
                                </span>
                                <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-widest">MAD / Year</span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Main Sections */}
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
                                    {Array.isArray(data.selected_engineers) && data.selected_engineers.map((eng, idx) => (
                                        <SimpleTableRow
                                            key={idx}
                                            name={eng.role}
                                            detail={`${eng.level} • ${eng.months_assigned} months`}
                                            cost={eng.total_cost_mad}
                                            formula={`${(eng.monthly_salary_mad || 0).toLocaleString()} MAD/mo • ${eng.months_assigned} mo`}
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
                                    {Array.isArray(data.licenses_and_apis) && data.licenses_and_apis.map((item, idx) => (
                                        <SimpleTableRow
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
                                    <span>{Number((data.total_capex || 0) / (1 + (data.contingency_buffer_percentage || 15) / 100)).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} MAD</span>
                                </div>
                                <div className="flex justify-between items-center text-[10px] font-bold text-amber-500">
                                    <span className="uppercase tracking-widest">Contingency Buffer ({data.contingency_buffer_percentage || 15}%)</span>
                                    <span>{Number(((data.total_capex || 0) / (1 + (data.contingency_buffer_percentage || 15) / 100)) * (data.contingency_buffer_percentage || 15) / 100).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} MAD</span>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-neutral-50">
                                    <span className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Total Capital Expense</span>
                                    <span className="text-lg font-black text-neutral-900 tracking-tight">{Number(data.total_capex || 0).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} MAD</span>
                                </div>
                            </div>
                        </div>
                    </MouseEffect>
                </motion.div>

                {/* OPEX Section */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
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
                                    {Array.isArray(data.maintenance_engineers) && data.maintenance_engineers.map((eng, idx) => (
                                        <SimpleTableRow
                                            key={idx}
                                            name={eng.role}
                                            detail={`${eng.level} • Recurring`}
                                            cost={eng.total_cost_mad}
                                            formula={`${(eng.monthly_salary_mad || 0).toLocaleString()} MAD/mo • ${eng.months_assigned} mo`}
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
                                    {Array.isArray(data.cloud_subscription) && data.cloud_subscription.map((item, idx) => (
                                        <SimpleTableRow
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
                                <span className="text-lg font-black text-neutral-900 tracking-tight">{Number(data.total_opex || 0).toLocaleString('fr-FR', { maximumFractionDigits: 2 })} MAD</span>
                            </div>
                        </div>
                    </MouseEffect>
                </motion.div>
            </div>

            {/* Success Metrics (KPIs) */}
            <div className="w-full">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
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

            {/* Strategy Insight - Full Width Horizontal */}
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
                        <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Executive Financial Analysis</h2>
                    </div>
                    <div className="bg-white/5 border border-white/10 p-8 rounded-[32px] backdrop-blur-sm">
                        <div className="text-base text-neutral-200 leading-relaxed font-medium italic">
                            {data.roi_analysis_summary.replace(/\.\s*-/g, '. __BR__ -').split(' ').map((word, i) => (
                                word === '__BR__' ? (
                                    <div key={i} className="h-4 w-full" />
                                ) : (
                                    <BlurReveal key={i} delay={0.1 + i * 0.02}>
                                        {word}&nbsp;
                                    </BlurReveal>
                                )
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

export default AIDashboard;
