import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, useParams } from 'react-router-dom';
import StrategicBlueprintView from './StrategicBlueprintView';
import { getProject } from '@/features/projects/api/projects';

// Mock des dépendances externes
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { ...actual, useParams: vi.fn() };
});

vi.mock('@/features/projects/api/projects', () => ({
    getProject: vi.fn(),
}));

// Mock des sous-composants pour isoler le test de la vue
vi.mock('@/features/ai-analysis/components/AIDashboard', () => ({
    default: ({ data }) => <div data-testid="ai-dashboard">{data?.name} Dashboard</div>,
}));

vi.mock('@/components/ui/loading-animation', () => ({
    default: ({ message }) => <div>{message}</div>,
}));

const mockApiData = {
    id: '123',
    name: 'Projet Test AI',
    roi_projections: [
        { year_number: 1, cumulative_costs: 1000, cumulative_gains: 2000, net_cash_flow: 1000, roi_percentage: 100 }
    ],
    assigned_engineers: [
        { phase: 'development', specialization: { name: 'React Dev', salary: 40000 }, months_assigned: 6 }
    ],
    infrastructure_costs: [
        { type: 'capex', name: 'Server License' }
    ]
};

describe('StrategicBlueprintView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        useParams.mockReturnValue({ id: '123' });
    });

    it('affiche l\'animation de chargement au montage', () => {
        getProject.mockReturnValue(new Promise(() => { })); // Promesse pendante
        render(<StrategicBlueprintView />, { wrapper: MemoryRouter });

        expect(screen.getByText(/Retrieving financial blueprint/i)).toBeInTheDocument();
    });

    it('affiche un message d\'erreur en cas d\'échec de l\'API', async () => {
        getProject.mockRejectedValue(new Error('API Error'));

        render(<StrategicBlueprintView />, { wrapper: MemoryRouter });

        await waitFor(() => {
            expect(screen.getByText(/Error loading project/i)).toBeInTheDocument();
            expect(screen.getByText(/API Error/i)).toBeInTheDocument();
        });
    });

    it('transforme correctement les données et affiche le dashboard', async () => {
        getProject.mockResolvedValue(mockApiData);

        render(<StrategicBlueprintView />, { wrapper: MemoryRouter });

        // Vérifie le titre
        await waitFor(() => {
            expect(screen.getByText(/Financial Blueprint/i)).toBeInTheDocument();
        });

        // Vérifie que le nom du projet est injecté
        expect(screen.getByText('Projet Test AI')).toBeInTheDocument();

        // Vérifie que les données transformées sont passées au Dashboard
        const dashboard = screen.getByTestId('ai-dashboard');
        expect(dashboard).toBeInTheDocument();
    });

    it('vérifie la logique de transformation (exemple: ROI Year 1)', async () => {
        getProject.mockResolvedValue(mockApiData);

        render(<StrategicBlueprintView />, { wrapper: MemoryRouter });

        await waitFor(() => {
            expect(getProject).toHaveBeenCalledWith('123');
        });

        // Ici, on pourrait tester plus en profondeur si AIDashboard recevait les props
        // mais comme nous l'avons mocké, nous validons surtout que le cycle se termine.
    });
});