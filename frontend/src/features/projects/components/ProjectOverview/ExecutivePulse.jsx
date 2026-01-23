import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Wallet, Clock, Target, Users, Award } from 'lucide-react';

const StatCard = ({ title, value, subtext, icon: Icon, color }) => {
    const colorStyles = {
        primary: { bg: 'bg-brand-primary-50', text: 'text-brand-primary-600', blob: 'bg-brand-primary-500/5' },
        violet: { bg: 'bg-violet-50', text: 'text-violet-600', blob: 'bg-violet-500/5' },
        emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', blob: 'bg-emerald-500/5' },
        amber: { bg: 'bg-amber-50', text: 'text-amber-600', blob: 'bg-amber-500/5' },
        rose: { bg: 'bg-rose-50', text: 'text-rose-600', blob: 'bg-rose-500/5' },
        cyan: { bg: 'bg-cyan-50', text: 'text-cyan-600', blob: 'bg-cyan-500/5' },
    }[color] || { bg: 'bg-brand-primary-50', text: 'text-brand-primary-600', blob: 'bg-brand-primary-500/5' };

    return (
        <motion.div
            whileHover={{ y: -2 }}
            className="bg-white border border-neutral-100 rounded-2xl p-4 relative overflow-hidden group shadow-sm hover:shadow-md transition-all h-full"
        >
            <div className={`absolute top-0 right-0 w-24 h-24 ${colorStyles.blob} blur-2xl -mr-10 -mt-10 transition-all group-hover:bg-opacity-100`} />

            <div className="flex justify-between items-start relative z-10 gap-3">
                <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest truncate mb-1">{title}</p>
                    <h3 className="text-xl font-black text-neutral-900 tracking-tight leading-none truncate" title={value}>
                        {value}
                    </h3>
                    <p className="text-[10px] text-neutral-400 font-medium leading-tight mt-1.5 truncate" title={subtext}>{subtext}</p>
                </div>

                <div className={`p-2.5 rounded-xl ${colorStyles.bg} ${colorStyles.text} shrink-0`}>
                    <Icon size={18} strokeWidth={2.5} />
                </div>
            </div>
        </motion.div>
    );
};

const ExecutivePulse = ({ project }) => {
    // Calculations
    const totalCost = parseFloat(project.total_project_cost || 0);

    // Calculate Gains from items to match Hub page
    const estimatedGainsList = project.estimated_gains || project.estimatedGains || [];
    const totalGain = estimatedGainsList.length > 0
        ? estimatedGainsList.reduce((acc, item) => acc + parseFloat(item.cost_mad || 0), 0)
        : parseFloat(project.total_gain_value || 0);

    const breakEven = parseFloat(project.break_even_point_months || 0).toFixed(1);
    const roi = parseFloat(project.roi_percentage || 0);
    const duration = project.estimated_duration_months || 0;

    // Team Size Calc
    const engineers = project.assigned_engineers || project.assignedEngineers || [];
    const teamSize = Array.isArray(engineers) ? engineers.length : 0;

    // Formatting Helpers
    const formatCurrency = (val) => val.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' MAD';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <StatCard
                title="Dev Duration"
                value={`${duration} Months`}
                subtext="Estimated timeline"
                icon={Clock}
                color="cyan"
            />
            <StatCard
                title="Total Investment"
                value={formatCurrency(totalCost)}
                subtext="Initial CAPEX + Setup"
                icon={Wallet}
                color="violet"
            />
            <StatCard
                title="Estimated Gains"
                value={formatCurrency(totalGain)}
                subtext="Annual Benefits"
                icon={TrendingUp}
                color="emerald"
            />
            <StatCard
                title="Break-even Point"
                value={`${breakEven} Months`}
                subtext="Recovery point"
                icon={Target}
                color="amber"
            />
            <StatCard
                title="3-Year ROI"
                value={`${roi}%`}
                subtext="Net Efficiency"
                icon={Award}
                color={roi > 0 ? 'emerald' : 'rose'}
            />
            <StatCard
                title="Team Dimension"
                value={`${teamSize} Engineers`}
                subtext="Active members"
                icon={Users}
                color="primary"
            />
        </div>
    );
};
export default ExecutivePulse;
