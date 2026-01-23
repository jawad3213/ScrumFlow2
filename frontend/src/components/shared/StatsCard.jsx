import React from 'react';

const StatsCard = ({ title, value, change, icon }) => (
    <div className="rounded-xl border border-neutral-200 bg-surface-card p-6 shadow-subtle hover:shadow-card transition-shadow">
        <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="tracking-tight text-sm font-medium text-neutral-500">{title}</h3>
            {icon}
        </div>
        <div className="pt-2">
            <div className="text-2xl font-bold text-neutral-900">{value}</div>
            <p className="text-xs text-neutral-500 mt-1">{change}</p>
        </div>
    </div>
);

export default StatsCard;
