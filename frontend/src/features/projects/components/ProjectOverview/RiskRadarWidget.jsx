import React from 'react';
import { ShieldAlert, AlertTriangle, AlertCircle } from 'lucide-react';

const RiskRadarWidget = ({ project }) => {
    const risks = project?.risks || [];

    // Prioritize High/Critical risks
    // Assuming impact is a string "High", "Medium", "Low"
    const sortedRisks = [...risks].sort((a, b) => {
        const priority = { 'Critical': 3, 'High': 2, 'Medium': 1, 'Low': 0 };
        const pA = priority[a.impact] || 0;
        const pB = priority[b.impact] || 0;
        return pB - pA;
    }).slice(0, 5); // Top 5

    const getRiskColor = (impact) => {
        const i = impact?.toLowerCase() || '';
        if (i.includes('high') || i.includes('critical')) return 'text-rose-600 bg-rose-50 border-rose-100';
        if (i.includes('medium')) return 'text-amber-600 bg-amber-50 border-amber-100';
        return 'text-blue-600 bg-blue-50 border-blue-100';
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-neutral-900 font-bold text-sm">Risk Radar</h4>
                    <p className="text-xs text-neutral-400 mt-1">Found {risks.length} potential risks</p>
                </div>
                <div className="bg-rose-50 text-rose-600 p-2 rounded-lg">
                    <ShieldAlert size={18} />
                </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar max-h-[300px] pr-2">
                {sortedRisks.length > 0 ? (
                    sortedRisks.map((risk, idx) => (
                        <div key={idx} className="p-3 rounded-xl border border-neutral-100 hover:border-neutral-200 transition-colors bg-white group">
                            <div className="flex justify-between items-start mb-1">
                                <h5 className="text-xs font-bold text-neutral-800 line-clamp-1 group-hover:text-brand-primary-600 transition-colors">{risk.risk_name}</h5>
                                <span className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border ${getRiskColor(risk.impact)}`}>
                                    {risk.impact}
                                </span>
                            </div>
                            <p className="text-[10px] text-neutral-500 leading-relaxed line-clamp-2">
                                {risk.mitigation_strategy || "No mitigation strategy defined."}
                            </p>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-8">
                        <div className="bg-emerald-50 text-emerald-500 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                            <ShieldAlert size={20} />
                        </div>
                        <p className="text-sm font-bold text-neutral-900">All Clear</p>
                        <p className="text-xs text-neutral-400 mt-1">No risks identified for this project.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RiskRadarWidget;
