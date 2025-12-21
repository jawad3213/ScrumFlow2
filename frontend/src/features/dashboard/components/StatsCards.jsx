import React from 'react';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';

const StatsCards = () => {
    const stats = [
        {
            title: "Total Revenue",
            value: "$45,231.89",
            change: "+20.1% from last month",
            icon: <DollarSign className="h-4 w-4 text-brand-secondary" />,
        },
        {
            title: "Subscriptions",
            value: "+2350",
            change: "+180.1% from last month",
            icon: <Users className="h-4 w-4 text-brand-blue" />,
        },
        {
            title: "Sales",
            value: "+12,234",
            change: "+19% from last month",
            icon: <CreditCard className="h-4 w-4 text-brand-primary" />,
        },
        {
            title: "Active Now",
            value: "+573",
            change: "+201 since last hour",
            icon: <Activity className="h-4 w-4 text-emerald-500" />,
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <div key={index} className="rounded-xl border border-neutral-200 bg-surface-card p-6 shadow-subtle hover:shadow-card transition-shadow">
                    <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <h3 className="tracking-tight text-sm font-medium text-neutral-500">{stat.title}</h3>
                        {stat.icon}
                    </div>
                    <div className="pt-2">
                        <div className="text-2xl font-bold text-neutral-900">{stat.value}</div>
                        <p className="text-xs text-neutral-500 mt-1">{stat.change}</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
