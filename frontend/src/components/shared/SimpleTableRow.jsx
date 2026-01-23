import React from 'react';

const SimpleTableRow = ({ name, detail, cost, formula }) => (
    <div className="flex items-center justify-between py-4 border-b border-neutral-50 last:border-0 hover:bg-brand-primary-50/30 transition-all px-3 rounded-2xl group cursor-default">
        <div className="flex flex-col gap-0.5">
            <span className="text-[13px] font-bold text-neutral-900 leading-none">{name}</span>
            {detail && <span className="text-[10px] text-neutral-400 font-medium">{detail}</span>}
            {formula && (
                <div className="flex items-center gap-1.5 mt-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                    <div className="w-3 h-[1px]" style={{ backgroundColor: '#5d5fef' }}></div>
                    <span className="text-[9px] font-mono italic" style={{ color: '#5d5fef' }}>{formula}</span>
                </div>
            )}
        </div>
        <div className="text-right">
            <div className="flex flex-col items-end">
                <span className="text-[13px] font-black text-neutral-900 group-hover:text-brand-primary-600 transition-colors tracking-tight">
                    {Number(cost).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-[9px] text-neutral-400 ml-0.5">MAD</span>
                </span>
            </div>
        </div>
    </div>
);

export default SimpleTableRow;
