import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import StackChoicePage from './StackChoicePage';

// --- CONFIGURATION DE L'ENVIRONNEMENT ---

global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
};

HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
}));

// Mock du hook useProjectDetails
vi.mock('@/features/projects/api/useProjectsQuery.js', () => ({
    useProjectDetails: vi.fn(),
}));

import { useProjectDetails } from '@/features/projects/api/useProjectsQuery.js';

describe('Integration Test: StackChoicePage', () => {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false } },
    });

    beforeEach(() => {
        vi.clearAllMocks();
        queryClient.clear();
    });

    const renderWithProviders = (projectId = '456') => {
        return render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter initialEntries={[`/projects/${projectId}/stack`]}>
                    <Routes>
                        <Route path="/projects/:id/stack" element={<StackChoicePage />} />
                    </Routes>
                </MemoryRouter>
            </QueryClientProvider>
        );
    };

it('doit rendre la vue Technology Stack avec succès', async () => {
        // ARRANGE
        useProjectDetails.mockReturnValue({
            data: { id: '456', name: 'AI Project' },
            isLoading: false,
            error: null
        });

        renderWithProviders('456');

        // ASSERT
        // ✅ On cible spécifiquement le titre <h1> pour éviter les doublons avec le texte informatif
        await waitFor(() => {
            const heading = screen.getByRole('heading', { level: 1, name: /Technology Stack/i });
            expect(heading).toBeInTheDocument();
        });
        
        // On vérifie la présence de la description structurelle
        expect(screen.getByText(/Define the architectural foundation/i)).toBeInTheDocument();
        
        // On peut aussi vérifier que l'étape "Context" est visible
        expect(screen.getByText(/Context/i)).toBeInTheDocument();
    });

    it('doit afficher l\'état de chargement spécifique "Retrieving Strategy"', () => {
        // ARRANGE
        useProjectDetails.mockReturnValue({
            isLoading: true
        });

        renderWithProviders();

        // ASSERT
        // Correction du texte selon tes logs : "Retrieving Strategy..."
        expect(screen.getByText(/Retrieving Strategy/i)).toBeInTheDocument();
    });
});