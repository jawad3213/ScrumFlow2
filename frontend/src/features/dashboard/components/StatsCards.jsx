import React from 'react';
import { DollarSign, Users, CreditCard, Activity } from 'lucide-react';

import StatsCard from '@/components/shared/StatsCard';

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
                <StatsCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    change={stat.change}
                    icon={stat.icon}
                />
            ))}
        </div>
    );
};

export default StatsCards;
