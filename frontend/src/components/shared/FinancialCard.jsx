import React from 'react';

const FinancialCard = ({ title, value, icon: Icon, color, subtitle, isCurrency = true, precision = 2 }) => {
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
        <div className="bg-white border border-neutral-100 rounded-2xl p-6 relative overflow-hidden group shadow-subtle">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-${baseColor}-500/5 blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-${baseColor}-500/10`}></div>
            <div className="flex justify-between items-start relative z-10 gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                    <p className="text-[9px] font-black text-neutral-400 uppercase tracking-widest truncate">{title}</p>
                    <h3 className="text-2xl font-black text-neutral-900 tracking-tight leading-tight">
                        {typeof value === 'number' ? value.toLocaleString('fr-FR', { minimumFractionDigits: precision, maximumFractionDigits: precision }) : value}
                        {isCurrency && <span className="text-[10px] font-bold text-neutral-400 ml-1">MAD</span>}
                    </h3>
                    {subtitle && <p className="text-[10px] text-neutral-400 font-medium leading-tight truncate">{subtitle}</p>}
                </div>
                <div className={`p-3 bg-${baseColor}-50 rounded-xl text-${baseColor}-500 shrink-0`}>
                    <Icon size={20} />
                </div>
            </div>
        </div>
    );
};

export default FinancialCard;
