import React from 'react';

const RecentSales = () => {
    const sales = [
        {
            name: "Olivia Martin",
            email: "olivia.martin@email.com",
            amount: "+$1,999.00",
            initials: "OM",
        },
        {
            name: "Jackson Lee",
            email: "jackson.lee@email.com",
            amount: "+$39.00",
            initials: "JL",
        },
        {
            name: "Isabella Nguyen",
            email: "isabella.nguyen@email.com",
            amount: "+$299.00",
            initials: "IN",
        },
        {
            name: "William Kim",
            email: "will@email.com",
            amount: "+$99.00",
            initials: "WK",
        },
        {
            name: "Sofia Davis",
            email: "sofia.davis@email.com",
            amount: "+$39.00",
            initials: "SD",
        },
    ];

    return (
        <div className="rounded-xl border border-neutral-200 bg-surface-card text-neutral-900 shadow-subtle p-6 col-span-3">
            <div className="mb-6">
                <h3 className="font-semibold text-lg leading-none tracking-tight">Recent Sales</h3>
                <p className="text-sm text-neutral-500 mt-1">You made 265 sales this month.</p>
            </div>
            <div className="space-y-8">
                {sales.map((sale, index) => (
                    <div key={index} className="flex items-center">
                        <div className="h-9 w-9 rounded-full bg-brand-muted flex items-center justify-center text-sm font-medium text-brand-dark">
                            {sale.initials}
                        </div>
                        <div className="ml-4 space-y-1">
                            <p className="text-sm font-medium leading-none">{sale.name}</p>
                            <p className="text-sm text-neutral-500">{sale.email}</p>
                        </div>
                        <div className="ml-auto font-medium text-neutral-900">{sale.amount}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentSales;
