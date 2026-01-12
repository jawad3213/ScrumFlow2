import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Users } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip, Legend);

const TeamCompositionWidget = ({ project }) => {
    // Robust data access
    const engineersRaw = project?.assigned_engineers || project?.assignedEngineers || [];
    const engineers = Array.isArray(engineersRaw) ? engineersRaw : Object.values(engineersRaw);

    // Group by Role
    const roleCounts = engineers.reduce((acc, eng) => {
        // Handle different possible structures of 'eng'
        const role = eng.specialization?.name || eng.role || 'Unknown';
        acc[role] = (acc[role] || 0) + 1;
        return acc;
    }, {});

    const sortedRoles = Object.entries(roleCounts)
        .sort(([, a], [, b]) => b - a);

    const chartData = {
        labels: sortedRoles.map(([role]) => role),
        datasets: [
            {
                data: sortedRoles.map(([, count]) => count),
                backgroundColor: [
                    '#5D5FEF', // Primary
                    '#10B981', // Emerald
                    '#F59E0B', // Amber
                    '#06B6D4', // Cyan
                    '#8B5CF6', // Violet
                    '#EC4899', // Pink
                    '#6366F1', // Indigo
                ],
                borderWidth: 0,
                hoverOffset: 4,
            },
        ],
    };

    const options = {
        cutout: '75%',
        plugins: {
            legend: {
                display: false, // Custom legend
            },
            tooltip: {
                callbacks: {
                    label: (context) => ` ${context.label}: ${context.raw}`,
                },
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#171717',
                bodyColor: '#525252',
                borderColor: '#e5e5e5',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
            }
        },
        maintainAspectRatio: false,
    };

    const totalMembers = engineers.length;

    return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-full flex flex-col">
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h4 className="text-neutral-900 font-bold text-sm">Team Composition</h4>
                    <p className="text-xs text-neutral-400 mt-1">Resource Allocation</p>
                </div>
                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                    <Users size={18} />
                </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Chart Container - Compact */}
                <div className="relative h-40 w-full shrink-0">
                    <Doughnut data={chartData} options={options} />
                    {/* Center Text */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                        <div className="text-2xl font-black text-neutral-900 leading-none">{totalMembers}</div>
                        <div className="text-[9px] font-bold text-neutral-400 uppercase tracking-wide mt-0.5">
                            Members
                        </div>
                    </div>
                </div>

                {/* Custom Legend - Scrollable Remaining Space */}
                <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar mt-4 pr-1 space-y-2">
                    {sortedRoles.map(([role, count], index) => (
                        <div key={role} className="flex items-center justify-between text-xs py-1 hover:bg-neutral-50 rounded-lg px-2 transition-colors">
                            <div className="flex items-center gap-2 overflow-hidden">
                                <div
                                    className="w-2.5 h-2.5 rounded-full ring-2 ring-white shadow-sm shrink-0"
                                    style={{ backgroundColor: chartData.datasets[0].backgroundColor[index % 7] }}
                                />
                                <span className="font-medium text-neutral-600 truncate" title={role}>
                                    {role}
                                </span>
                            </div>
                            <span className="font-bold text-neutral-900 ml-2">{count}</span>
                        </div>
                    ))}
                    {totalMembers === 0 && (
                        <p className="text-xs text-neutral-400 italic text-center w-full mt-4">No team data</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamCompositionWidget;
