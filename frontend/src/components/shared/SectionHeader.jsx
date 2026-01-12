import React from 'react';

const SectionHeader = ({ title, icon: Icon, color }) => {
    const colorMap = {
        primary: 'brand-primary',
        brand: 'brand-primary',
        indigo: 'indigo',
        cyan: 'cyan',
        amber: 'amber',
        emerald: 'emerald'
    };
    const baseColor = colorMap[color] || 'brand-primary';

    return (
        <div className="flex items-center gap-3 mb-6">
            <div className={`p-2 bg-${baseColor}-50 rounded-lg text-${baseColor}-500 shadow-sm border border-${baseColor}-100`}>
                <Icon size={18} />
            </div>
            <h2 className="text-sm font-black text-neutral-900 tracking-[0.05em] uppercase">{title}</h2>
        </div>
    );
};

export default SectionHeader;
