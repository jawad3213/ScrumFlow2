import React from 'react';
import { Layers, Database, Globe, Server, Code, Layout } from 'lucide-react';

const TechItem = ({ name, category }) => {
    // Simple icon mapping derived from category or name keywords
    let Icon = Code;
    if (category === 'Frontend') Icon = Layout;
    if (category === 'Backend') Icon = Server;
    if (category === 'Database') Icon = Database;
    if (category === 'DevOps') Icon = Globe;

    return (
        <div className="flex items-center gap-3 p-3 pl-4 pr-6 bg-neutral-50 rounded-xl border border-neutral-100 hover:border-brand-primary-200 hover:bg-brand-primary-50 transition-all duration-300 group min-w-[140px]">
            <div className="bg-white p-1.5 rounded-lg shadow-sm border border-neutral-100 group-hover:scale-110 transition-transform">
                <Icon size={14} className="text-neutral-500 group-hover:text-brand-primary-600" />
            </div>
            <div className="flex flex-col">
                <span className="text-[10px] font-bold text-neutral-900 uppercase tracking-wide group-hover:text-brand-primary-700">
                    {name}
                </span>
                <span className="text-[9px] text-neutral-400 font-medium">
                    {category}
                </span>
            </div>
        </div>
    );
};

const TechStackSnapshot = ({ project }) => {
    // 1. Get Stack Name
    const stackName = project.stack_name || 'Custom Stack';

    // 2. Extract Technologies strictly from stack_analysis_data if available
    const recommendation = project?.stack_analysis_data?.primary_recommendation || {};

    // Helper to get raw names
    const getTechNames = (list) => {
        if (!list) return [];
        return list.map(item => typeof item === 'string' ? item : item.name);
    };

    const frontend = getTechNames(recommendation.frontend || []);
    const backend = getTechNames(recommendation.backend || []);
    const database = getTechNames(recommendation.database || []);
    const devops = getTechNames(recommendation.devops || []);

    // Display more items since we have full width
    const technologies = [
        ...frontend.slice(0, 3).map(name => ({ name, category: 'Frontend' })),
        ...backend.slice(0, 3).map(name => ({ name, category: 'Backend' })),
        ...database.slice(0, 2).map(name => ({ name, category: 'Database' })),
        ...devops.slice(0, 2).map(name => ({ name, category: 'DevOps' })),
    ];

    if (technologies.length === 0 && !project.stack_name) {
        return null;
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-8">
            {/* Left Box: Identity */}
            <div className="flex flex-col gap-4 w-full md:w-auto md:min-w-[200px] md:border-r border-neutral-100 md:pr-8">
                <div className="flex items-center gap-3">
                    <div className="bg-violet-50 text-violet-600 p-2.5 rounded-xl">
                        <Layers size={20} />
                    </div>
                    <div>
                        <h4 className="text-neutral-900 font-bold text-sm">Tech Stack</h4>
                        <p className="text-[10px] text-neutral-400 font-medium">Core Architecture</p>
                    </div>
                </div>
                <div className="bg-neutral-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-neutral-200 text-center w-full">
                    {stackName}
                </div>
            </div>

            {/* Right Box: Floating Tech Items */}
            <div className="flex-1 w-full">
                <div className="flex flex-wrap gap-3">
                    {technologies.map((tech, idx) => (
                        <TechItem key={idx} name={tech.name} category={tech.category} />
                    ))}
                    {technologies.length === 0 && (
                        <p className="text-xs text-neutral-400 italic">No technologies defined</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TechStackSnapshot;
