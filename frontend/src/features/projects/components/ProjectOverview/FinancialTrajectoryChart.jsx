import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const FinancialTrajectoryChart = ({ project }) => {
    const projections = project?.roiProjections || [];
    // Sort by year
    const sortedProjections = [...projections].sort((a, b) => a.year_number - b.year_number);

    const data = {
        labels: sortedProjections.map(p => `Year ${p.year_number}`),
        datasets: [
            {
                label: 'Cumulative Gains',
                data: sortedProjections.map(p => p.cumulative_gains),
                borderColor: '#10b981', // Emerald 500
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Cumulative Costs',
                data: sortedProjections.map(p => p.cumulative_costs),
                borderColor: '#6366f1', // Indigo 500
                backgroundColor: 'rgba(99, 102, 241, 0.05)',
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    boxWidth: 8,
                    font: { family: "'Inter', sans-serif", size: 11 }
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                titleColor: '#171717',
                bodyColor: '#525252',
                borderColor: '#e5e5e5',
                borderWidth: 1,
                padding: 10,
                displayColors: true,
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                grid: {
                    color: '#f5f5f5',
                    drawBorder: false,
                },
                ticks: {
                    font: { family: "'Inter', sans-serif", size: 10 },
                    color: '#a3a3a3',
                    callback: (value) => '$' + value / 1000 + 'k'
                }
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: { family: "'Inter', sans-serif", size: 10 },
                    color: '#a3a3a3'
                }
            }
        },
        interaction: {
            mode: 'nearest',
            axis: 'x',
            intersect: false
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm h-full flex flex-col">
            <h4 className="text-neutral-900 font-bold text-sm mb-1">Financial Trajectory</h4>
            <p className="text-xs text-neutral-400 mb-6">Cumulative Costs vs Gains over 3 Years</p>
            <div className="flex-1 min-h-[250px]">
                {projections.length > 0 ? (
                    <Line data={data} options={options} />
                ) : (
                    <div className="h-full flex items-center justify-center text-neutral-400 text-sm">No projection data available</div>
                )}
            </div>
        </div>
    );
};

export default FinancialTrajectoryChart;
