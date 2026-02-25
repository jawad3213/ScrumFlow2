import React from 'react';

const PlaceholderPage = ({ title, description }) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 animate-in fade-in duration-700">
            <div className="p-6 rounded-full bg-brand-primary-50 text-brand-primary-500">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight">{title}</h1>
            <p className="text-neutral-500 font-medium max-w-md text-center">{description}</p>
            <div className="mt-8 px-6 py-2 bg-white border border-surface-border rounded-xl text-xs font-bold text-neutral-400 uppercase tracking-widest">
                Coming Soon
            </div>
        </div>
    );
};

export default PlaceholderPage;
