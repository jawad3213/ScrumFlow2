import React, { useRef } from 'react';
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
    const projectionsRaw = project?.roi_projections || [];
    const projections = Array.isArray(projectionsRaw) ? projectionsRaw : Object.values(projectionsRaw);

    // Sort by year
    const sortedProjections = [...projections].sort((a, b) => (a.year_number || a.yearNumber) - (b.year_number || b.yearNumber));

    const getValue = (p, keySnake, keyCamel) => parseFloat(p[keySnake] || p[keyCamel] || 0);

    const data = {
        labels: sortedProjections.map(p => `Year ${p.year_number || p.yearNumber}`),
        datasets: [
            {
                label: 'Cumulative Gains',
                data: sortedProjections.map(p => getValue(p, 'cumulative_gains', 'cumulativeGains')),
                borderColor: '#5D5FEF', // Brand Primary 500
                backgroundColor: 'rgba(93, 95, 239, 0.1)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Cumulative Costs',
                data: sortedProjections.map(p => getValue(p, 'cumulative_costs', 'cumulativeCosts')),
                borderColor: '#9CA3AF', // Neutral 400
                backgroundColor: 'rgba(156, 163, 175, 0.05)',
                fill: true,
                tension: 0.3,
                pointBackgroundColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
            {
                label: 'Net Cash Flow',
                data: sortedProjections.map(p => getValue(p, 'net_cash_flow', 'netCashFlow')),
                borderColor: '#8B5CF6', // Violet 500
                backgroundColor: 'rgba(139, 92, 246, 0.05)',
                borderDash: [5, 5],
                fill: false,
                tension: 0.3,
                pointBackgroundColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                top: 10,
                bottom: 10,
                left: 10,
                right: 10
            }
        },
        plugins: {
            legend: {
                position: 'top',
                align: 'end',
                labels: {
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 8,
                    padding: 20,
                    font: { family: "'Inter', sans-serif", size: 11, weight: '600' },
                    color: '#6B7280'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                titleColor: '#111827',
                bodyColor: '#4B5563',
                borderColor: '#E5E7EB',
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                titleFont: { family: "'Inter', sans-serif", size: 13, weight: 'bold' },
                bodyFont: { family: "'Inter', sans-serif", size: 12 },
                callbacks: {
                    label: (context) => {
                        let label = context.dataset.label || '';
                        if (label) {
                            label += ': ';
                        }
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('fr-FR', { maximumFractionDigits: 0 }).format(context.parsed.y) + ' MAD';
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: '#F3F4F6',
                    drawBorder: false,
                },
                ticks: {
                    font: { family: "'Inter', sans-serif", size: 11, weight: '500' },
                    color: '#9CA3AF',
                    padding: 10,
                    callback: (value) => (value / 1000).toFixed(0) + 'k'
                },
                title: {
                    display: true,
                    text: 'Amount (MAD)',
                    color: '#9CA3AF',
                    font: { size: 10, weight: '600' }
                }
            },
            x: {
                grid: {
                    display: false,
                    drawBorder: false
                },
                ticks: {
                    font: { family: "'Inter', sans-serif", size: 11, weight: '600' },
                    color: '#6B7280',
                    padding: 10
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
            <div className="flex-1 min-h-[250px] relative">
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
