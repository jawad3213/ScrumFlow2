/**
 * @vitest-environment jsdom
 */
/* eslint-disable no-undef */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// 1. On crée le mock
const MockComponent = ({ children, ...props }) => React.createElement('div', props, children);

const motionMock = {
    div: MockComponent,
    h2: MockComponent,
    p: MockComponent,
    section: MockComponent,
    header: MockComponent,
    span: MockComponent,
};

// 2. On attache proprement au global pour éviter les erreurs de l'éditeur
Object.defineProperty(global, 'motion', { value: motionMock });

// 3. Mock du module
vi.mock('framer-motion', () => ({
    motion: motionMock,
    AnimatePresence: ({ children }) => children,
    useInView: () => [null, true],
}));

// 4. Imports des composants (On peut les laisser ici, Vitest gère le "hoisting")
import { render, screen } from '@testing-library/react';
import AIDashboard from './AIDashboard';

// Mocks des icônes (Simplifié)
vi.mock('lucide-react', () => ({
    Users: () => <div />, DollarSign: () => <div />, TrendingUp: () => <div />,
    Shield: () => <div />, Cloud: () => <div />, Info: () => <div />,
    ArrowUpRight: () => <div />, Clock: () => <div />, AlertTriangle: () => <div />,
    Target: () => <div />,
}));

// Mocks des composants UI (Regroupés pour la clarté)
vi.mock('@/components/ui/blur-reveal', () => ({ BlurReveal: ({ children }) => <div>{children}</div> }));
vi.mock('@/components/ui/mouse-effect', () => ({ MouseEffect: ({ children, className }) => <div className={className}>{children}</div> }));
vi.mock('@/components/shared/FinancialCard', () => ({ default: ({ title, value }) => <div>{title} {value}</div> }));
vi.mock('@/components/shared/SectionHeader', () => ({ default: ({ title }) => <h2>{title}</h2> }));
vi.mock('@/components/shared/SimpleTableRow', () => ({ default: ({ name, detail, cost }) => <div>{name} {detail} {cost}</div> }));

describe('AIDashboard Component', () => {
    const mockData = {
        estimated_duration_months: 12,
        total_project_cost: 500000,
        estimated_gains: [],
        roi_projections: {
            year_1: { roi_percentage: 10, cumulative_costs: 500000, cumulative_gains: 100000, net_cash_flow: -400000 },
            year_2: { roi_percentage: 45, cumulative_costs: 550000, cumulative_gains: 300000, net_cash_flow: -250000 },
            year_3: { roi_percentage: 120, cumulative_costs: 600000, cumulative_gains: 720000, net_cash_flow: 120000 }
        },
        selected_engineers: [{ role: 'Dev', level: 'Senior', months_assigned: 12, total_cost_mad: 300000 }],
        total_capex: 400000,
        total_opex: 10000,
        roi_analysis_summary: "Analyse OK"
    };

    it('doit s’afficher sans erreur', () => {
        render(<AIDashboard data={mockData} />);
        expect(screen.getByText(/Dev Duration/i)).toBeInTheDocument();
    });

    it('doit afficher les sections CAPEX et OPEX', () => {
        render(<AIDashboard data={mockData} />);
        expect(screen.getByText(/Initial Investment/i)).toBeInTheDocument();
    });
});