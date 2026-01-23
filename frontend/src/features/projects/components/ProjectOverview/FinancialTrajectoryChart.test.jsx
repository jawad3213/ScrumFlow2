import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FinancialTrajectoryChart from './FinancialTrajectoryChart';

// On mock react-chartjs-2 car le Canvas ne peut pas être rendu dans JSDOM
vi.mock('react-chartjs-2', () => ({
    Line: () => <div data-testid="mock-line-chart" />
}));

describe('FinancialTrajectoryChart Component', () => {
    const mockProject = {
        roi_projections: [
            { year_number: 1, cumulative_gains: 10000, cumulative_costs: 5000, net_cash_flow: 5000 },
            { year_number: 2, cumulative_gains: 25000, cumulative_costs: 8000, net_cash_flow: 17000 },
            { year_number: 3, cumulative_gains: 45000, cumulative_costs: 10000, net_cash_flow: 35000 },
        ]
    };

    it('affiche le titre et la description du graphique', () => {
        render(<FinancialTrajectoryChart project={mockProject} />);
        
        expect(screen.getByText('Financial Trajectory')).toBeInTheDocument();
        expect(screen.getByText(/Cumulative Costs vs Gains over 3 Years/i)).toBeInTheDocument();
    });

    it('rend le graphique lorsque les données sont présentes', () => {
        render(<FinancialTrajectoryChart project={mockProject} />);
        
        // On vérifie que notre mock du graphique est bien dans le document
        expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
    });

    it('affiche un message d erreur si les données de projection sont vides', () => {
        const emptyProject = { roi_projections: [] };
        render(<FinancialTrajectoryChart project={emptyProject} />);
        
        expect(screen.getByText(/No projection data available/i)).toBeInTheDocument();
        expect(screen.queryByTestId('mock-line-chart')).not.toBeInTheDocument();
    });

    it('gère correctement les données au format objet (non-tableau)', () => {
        const objectProject = {
            roi_projections: {
                0: { yearNumber: 1, cumulativeGains: 1000 },
                1: { yearNumber: 2, cumulativeGains: 2000 }
            }
        };
        render(<FinancialTrajectoryChart project={objectProject} />);
        
        expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
    });
});