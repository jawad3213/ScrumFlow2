import { vi, expect, it, describe, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// --- 1. MOCK DE L'API ---
vi.mock('@/features/projects/api/projects', () => ({
    getProject: vi.fn(),
}));

// --- 2. MOCK DU DASHBOARD (Le coupable du crash motion) ---
// On remplace AIDashboard par une version ultra-simple pour isoler le test de la page
vi.mock('@/features/ai-analysis/components/AIDashboard', () => ({
    default: ({ data }) => (
        <div data-testid="ai-dashboard">
            Dashboard for {data?.name}
        </div>
    ),
}));

// --- 3. MOCK DU LOADER ---
vi.mock('@/components/ui/loading-animation', () => ({
    default: ({ message }) => <div>{message}</div>,
}));

import { getProject } from '@/features/projects/api/projects';
import FinancialBlueprintPage from './FinancialBlueprintPage';

// --- 4. MOCKS TECHNIQUES ---
global.IntersectionObserver = class {
    constructor() { }
    observe() { } unobserve() { } disconnect() { }
};

HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    clearRect: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
}));

describe('Integration Test: Financial Blueprint Page', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithProviders = (id = '789') => {
        return render(
            <MemoryRouter initialEntries={[`/project/${id}/financial-blueprint`]}>
                <Routes>
                    <Route path="/project/:id/financial-blueprint" element={<FinancialBlueprintPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('doit rendre la vue stratégique avec succès après le chargement', async () => {
        // ARRANGE
        const mockProjectData = {
            id: '789',
            name: 'Strategic Alpha',
            roi_projections: [],
            assigned_engineers: [],
            infrastructure_costs: [],
            estimated_gains: [],
            kpis: [],
            roi_analysis_summary: 'Summary content'
        };

        getProject.mockResolvedValue(mockProjectData);

        renderWithProviders('789');

        // ASSERT : Le message de chargement est là
        expect(screen.getByText(/Retrieving financial blueprint/i)).toBeInTheDocument();

        // ACT & ASSERT : Attendre que le titre de la page apparaisse
        // Note: Le titre est dans StrategicBlueprintView.jsx, pas dans le dashboard
        await waitFor(() => {
            expect(screen.getByText('Financial Blueprint')).toBeInTheDocument();
        }, { timeout: 3000 });

        // Vérifier que notre mock de dashboard est bien là avec le nom du projet
        expect(screen.getByTestId('ai-dashboard')).toHaveTextContent('Strategic Alpha');
    });

    it('doit afficher une erreur si l\'appel API échoue', async () => {
        getProject.mockRejectedValue(new Error("API Error"));
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText(/Error loading project/i)).toBeInTheDocument();
        });
    });
});