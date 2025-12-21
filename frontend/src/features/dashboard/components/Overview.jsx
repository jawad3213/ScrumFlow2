import React from 'react';

const Overview = () => {
    // Mock data for the chart
    const data = [
        { name: "Jan", total: 4500 },
        { name: "Feb", total: 3200 },
        { name: "Mar", total: 6000 },
        { name: "Apr", total: 4800 },
        { name: "May", total: 5500 },
        { name: "Jun", total: 7000 },
        { name: "Jul", total: 6200 },
        { name: "Aug", total: 7500 },
        { name: "Sep", total: 6800 },
        { name: "Oct", total: 5200 },
        { name: "Nov", total: 4900 },
        { name: "Dec", total: 6500 },
    ];

    const maxVal = Math.max(...data.map(d => d.total));

    return (
        <div className="rounded-xl border border-neutral-200 bg-surface-card text-neutral-900 shadow-subtle p-6 col-span-4">
            <div className="mb-6">
                <h3 className="font-semibold text-lg leading-none tracking-tight">Overview</h3>
                <p className="text-sm text-neutral-500 mt-1">Monthly revenue for the current year.</p>
            </div>
            <div className="h-[350px] w-full flex items-end justify-between gap-2 px-2">
                {data.map((item, index) => (
                    <div key={index} className="flex flex-col items-center gap-2 w-full group">
                        <div
                            className="w-full bg-brand-dark rounded-t-sm transition-all duration-300 hover:bg-brand-blue"
                            style={{ height: `${(item.total / maxVal) * 100}%` }}
                        ></div>
                        <span className="text-xs text-neutral-500">{item.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Overview;
