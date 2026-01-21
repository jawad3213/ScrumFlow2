import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import OverviewDashboard from './OverviewDashboard';
import { useProjectDetails } from '@/features/projects/api/useProjectsQuery';
import { deleteProject } from '@/features/projects/api/projects';

// 1. Mock de useNavigate (React Router)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return { 
        ...actual, 
        useNavigate: () => mockNavigate,
        useParams: () => ({ id: '1' }) // <--- Force l'ID à '1' pour le test
    };
});

// 2. Mock des APIs de données
vi.mock('@/features/projects/api/useProjectsQuery');
vi.mock('@/features/projects/api/projects');

// 3. SOLUTION AUX ERREURS : Mock des composants qui utilisent Canvas ou IntersectionObserver
vi.mock('@/components/ui/LoadingAnimation', () => ({
    default: ({ message }) => <div data-testid="loading-stub">{message}</div>
}));

vi.mock('./FinancialTrajectoryChart', () => ({
    default: () => <div data-testid="chart-stub">Chart Component</div>
}));

// Mock également les autres widgets pour plus de stabilité
vi.mock('./TeamCompositionWidget', () => ({ default: () => <div>Team Widget</div> }));
vi.mock('./TechStackSnapshot', () => ({ default: () => <div>Tech Widget</div> }));
vi.mock('./ProjectProgressStepper', () => ({ default: () => <div>Stepper</div> }));

describe('OverviewDashboard Component', () => {
    const mockProject = { id: '1', name: 'Apollo Mission', status: 'active' };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('affiche l\'animation de chargement au début', () => {
        useProjectDetails.mockReturnValue({ isLoading: true });
        render(<OverviewDashboard />, { wrapper: MemoryRouter });
        
        // On vérifie notre "stub" de chargement plutôt que le vrai composant Lottie
        expect(screen.getByTestId('loading-stub')).toBeInTheDocument();
        expect(screen.getByText(/Setting up your mission control/i)).toBeInTheDocument();
    });

    it('gère le cycle complet de suppression d\'un projet', async () => {
        useProjectDetails.mockReturnValue({ data: mockProject, isLoading: false });
        deleteProject.mockResolvedValueOnce({});

        render(<OverviewDashboard />, { wrapper: MemoryRouter });

        // Ouvrir la modal
        fireEvent.click(screen.getByRole('button', { name: /delete project/i }));

        // Confirmer la suppression
        const confirmBtn = screen.getByText('Delete Permanently');
        fireEvent.click(confirmBtn);

        await waitFor(() => {
            expect(deleteProject).toHaveBeenCalledWith('1');
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('affiche les données du projet après chargement', () => {
        useProjectDetails.mockReturnValue({ data: mockProject, isLoading: false });
        render(<OverviewDashboard />, { wrapper: MemoryRouter });

        expect(screen.getByText('Apollo Mission')).toBeInTheDocument();
        expect(screen.getByTestId('chart-stub')).toBeInTheDocument();
    });
});