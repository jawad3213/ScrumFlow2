import React from 'react';
import { Users, UserCog, Briefcase } from 'lucide-react';

const TeamCompositionWidget = ({ project }) => {
    const engineers = project?.assignedEngineers || [];

    // Group by Role
    const roleCounts = engineers.reduce((acc, eng) => {
        const role = eng.specialization?.name || 'Unknown';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
    }, {});

    // Sort roles by count
    const sortedRoles = Object.entries(roleCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5); // Top 5

    // Level breakdown
    const seniorCount = engineers.filter(e => e.specialization?.level?.toLowerCase().includes('senior')).length;
    const midCount = engineers.filter(e => e.specialization?.level?.toLowerCase().includes('mid') || e.specialization?.level?.toLowerCase().includes('intermediate')).length;
    const otherCount = engineers.length - seniorCount - midCount;

    return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h4 className="text-neutral-900 font-bold text-sm">Team Composition</h4>
                    <p className="text-xs text-neutral-400 mt-1">Talent Allocation & Seniority</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <Users size={18} />
                </div>
            </div>

            <div className="flex-1 space-y-6">
                {/* Total Stats */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 bg-neutral-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-black text-neutral-900">{engineers.length}</div>
                        <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Members</div>
                    </div>
                    <div className="flex-1 bg-neutral-50 rounded-xl p-3 text-center">
                        <div className="text-2xl font-black text-neutral-900">{seniorCount}</div>
                        <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Seniors</div>
                    </div>
                </div>

                {/* Role List */}
                <div className="space-y-3">
                    <h5 className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-2">Top Roles</h5>
                    {sortedRoles.map(([role, count], idx) => (
                        <div key={idx} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 text-xs font-bold group-hover:bg-brand-primary-50 group-hover:text-brand-primary-600 transition-colors">
                                    {role.charAt(0)}
                                </div>
                                <span className="text-xs font-medium text-neutral-700">{role}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 bg-neutral-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-primary-500 rounded-full"
                                        style={{ width: `${(count / engineers.length) * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-neutral-900 w-4 text-right">{count}</span>
                            </div>
                        </div>
                    ))}
                    {engineers.length === 0 && (
                        <p className="text-xs text-neutral-400 italic text-center py-4">No team data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamCompositionWidget;
