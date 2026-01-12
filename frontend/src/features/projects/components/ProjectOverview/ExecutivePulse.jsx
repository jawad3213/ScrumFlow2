import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Clock, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, trend, trendValue, colorClass }) => (
    <motion.div
        whileHover={{ y: -2 }}
        className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm relative overflow-hidden group"
    >
        <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${colorClass}`}>
            <Icon size={48} />
        </div>
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2.5 rounded-xl ${colorClass} bg-opacity-10 text-opacity-100`}>
                <Icon size={20} className={colorClass.replace('bg-', 'text-')} />
            </div>
            {trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${trend === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {trendValue}
                </div>
            )}
        </div>
        <div>
            <h4 className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
            <div className="text-2xl font-black text-neutral-900 tracking-tight">{value}</div>
            {subtext && <p className="text-[11px] text-neutral-400 font-medium mt-1">{subtext}</p>}
        </div>
    </motion.div>
);

const ExecutivePulse = ({ project }) => {
    // Calculations
    const totalCost = parseFloat(project.total_project_cost || 0);
    const totalGain = parseFloat(project.total_gain_value || 0);
    const roi = parseFloat(project.roi_percentage || 0);
    const efficiency = totalCost > 0 ? (totalGain / totalCost).toFixed(2) : "0.00";

    // Duration
    const startDate = new Date(project.start_date);
    const endDate = new Date(project.actual_end_date);
    const durationMonths = project.estimated_duration_months || 0;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
                title="Project ROI"
                value={`${roi}%`}
                subtext={`Break-even in ${project.break_even_point_months || '?'} months`}
                icon={TrendingUp}
                trend={roi > 0 ? 'up' : 'down'}
                trendValue="High Yield"
                colorClass="bg-brand-primary-500 text-brand-primary-500"
            />
            <StatCard
                title="Total Investment"
                value={`$${(totalCost / 1000).toFixed(1)}k`}
                subtext={`Capex: $${(project.total_capex / 1000).toFixed(0)}k | Opex: $${(project.total_opex / 1000).toFixed(0)}k`}
                icon={Wallet}
                colorClass="bg-violet-500 text-violet-500"
            />
            <StatCard
                title="Efficiency Score"
                value={`${efficiency}x`}
                subtext={`$${(totalGain / 1000).toFixed(1)}k Total Value Generated`}
                icon={Activity}
                trend="up"
                trendValue="Multiplier"
                colorClass="bg-emerald-500 text-emerald-500"
            />
            <StatCard
                title="Timeline"
                value={`${durationMonths} Mo`}
                subtext={`End: ${endDate.toLocaleDateString()}`}
                icon={Clock}
                colorClass="bg-amber-500 text-amber-500"
            />
        </div>
    );
};

export default ExecutivePulse;
