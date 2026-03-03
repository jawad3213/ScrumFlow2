import { vi, expect, it, describe, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// --- 1. MOCK DE L'API ---
vi.mock('@/features/projects/api/projects', () => ({
    getProject: vi.fn(),
}));

// --- 2. MOCK DES COMPOSANTS ENFANTS (Pour éviter les effets de bord complexes) ---
vi.mock('@/features/projects/components/BacklogDashboard', () => ({
    default: ({ data }) => <div data-testid="backlog-dashboard">Backlog for {data?.project_name}</div>,
}));

vi.mock('@/features/projects/components/ScrumMasterBlueprintWizard', () => ({
    default: ({ projectId }) => <div data-testid="blueprint-wizard">Wizard for ID: {projectId}</div>,
}));

vi.mock('@/components/ui/loading-animation', () => ({
    default: ({ message }) => <div>{message}</div>,
}));

// Mock de Framer Motion (souvent utilisé dans les dashboards/wizards)
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => children,
}));

import { getProject } from '@/features/projects/api/projects';
import ScrumMasterBlueprintPage from './ScrumMasterBlueprintPage';

describe('Integration Test: Scrum Master Blueprint Page', () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithProviders = (id = '123') => {
        return render(
            <MemoryRouter initialEntries={[`/project/${id}/scrum-master-blueprint`]}>
                <Routes>
                    <Route path="/project/:id/scrum-master-blueprint" element={<ScrumMasterBlueprintPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

    it('doit afficher le Dashboard si un backlog existe déjà', async () => {
        // ARRANGE : Données avec un backlog existant
        const mockData = {
            name: 'Tech Alpha',
            epics: [{ id: 1, title: 'Epic 1', stories: [] }]
        };
        getProject.mockResolvedValue(mockData);

        renderWithProviders('123');

        // ASSERT : État de chargement
        expect(screen.getByText(/Retrieving scrum master specifications/i)).toBeInTheDocument();

        // ACT & ASSERT : Rendu final du Dashboard
        await waitFor(() => {
            expect(screen.getByText('Scrum Master Blueprint')).toBeInTheDocument();
            expect(screen.getByTestId('backlog-dashboard')).toHaveTextContent('Tech Alpha');
        });
    });

    it('doit afficher le Wizard si le backlog est vide', async () => {
        // ARRANGE : Données sans epics (backlog vide)
        const mockData = {
            name: 'New Project',
            epics: null // ou []
        };
        getProject.mockResolvedValue(mockData);

        renderWithProviders('456');

        // ACT & ASSERT : Rendu du Wizard
        await waitFor(() => {
            expect(screen.getByTestId('blueprint-wizard')).toHaveTextContent('Wizard for ID: 456');
            // Le titre "Scrum Master Blueprint" ne s'affiche pas si backlog vide selon ton code
            expect(screen.queryByText('Scrum Master Blueprint')).not.toBeInTheDocument();
        });
    });

    it('doit gérer les erreurs de chargement API', async () => {
        // ARRANGE
        getProject.mockRejectedValue(new Error("Network Failure"));

        renderWithProviders();

        // ASSERT
        await waitFor(() => {
            expect(screen.getByText(/Error loading project/i)).toBeInTheDocument();
            expect(screen.getByText(/Network Failure/i)).toBeInTheDocument();
        });
    });
});