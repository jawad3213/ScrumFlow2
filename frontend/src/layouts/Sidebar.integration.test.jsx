import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Sidebar from './Sidebar';
import * as authHook from '@/features/auth/hooks/useAuth';
import * as projectHook from '@/features/projects/api/useProject';
import * as projectApi from '@/features/projects/api/projects';
import { USER_ROLES } from '@/utils/constants';

// 1. Mock de react-router-dom (version simplifiée pour éviter l'erreur undefined)
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => ({ pathname: '/' }),
    };
});

// 2. Mocks des Hooks et API
vi.mock('@/features/auth/hooks/useAuth', () => ({
    useAuth: vi.fn(),
}));
vi.mock('@/features/projects/api/useProject', () => ({
    useProject: vi.fn(),
}));
vi.mock('@/features/projects/api/projects', () => ({
    getProjects: vi.fn(),
}));

describe('Sidebar Integration', () => {
    const mockLogout = vi.fn();
    const mockSetCurrentProject = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        // Setup par défaut : Manager en vue globale
        authHook.useAuth.mockReturnValue({
            user: { first_name: 'John', last_name: 'Doe' },
            userRole: USER_ROLES.MANAGER,
            logout: mockLogout
        });

        projectHook.useProject.mockReturnValue({
            currentProject: 'global',
            setCurrentProject: mockSetCurrentProject
        });

        projectApi.getProjects.mockResolvedValue([
            { id: '1', name: 'Projet Test' }
        ]);

        // Mock ResizeObserver (nécessaire pour les composants Radix/Shadcn)
        global.ResizeObserver = vi.fn().mockImplementation(() => ({
            observe: vi.fn(),
            unobserve: vi.fn(),
            disconnect: vi.fn(),
        }));
    });

    it('affiche le menu "Main Menu" pour un Manager en vue globale', async () => {
        render(
            <MemoryRouter>
                <Sidebar collapsed={false} setCollapsed={vi.fn()} />
            </MemoryRouter>
        );

        expect(screen.getByText(/Main Menu/i)).toBeInTheDocument();
        expect(screen.getByText(/New Project/i)).toBeInTheDocument();
    });

    it('affiche le "Project Menu" quand un projet spécifique est sélectionné', async () => {
        projectHook.useProject.mockReturnValue({
            currentProject: '123',
            setCurrentProject: mockSetCurrentProject
        });

        render(
            <MemoryRouter>
                <Sidebar collapsed={false} setCollapsed={vi.fn()} />
            </MemoryRouter>
        );

        expect(screen.getByText(/Project Menu/i)).toBeInTheDocument();
        expect(screen.getByText(/Strategic Blueprint/i)).toBeInTheDocument();
    });

    it('ne doit pas afficher le switcher "Workspace" pour un utilisateur TEAM', () => {
        authHook.useAuth.mockReturnValue({
            userRole: USER_ROLES.TEAM,
            logout: mockLogout
        });

        render(
            <MemoryRouter>
                <Sidebar collapsed={false} setCollapsed={vi.fn()} />
            </MemoryRouter>
        );

        expect(screen.queryByText(/Workspace/i)).not.toBeInTheDocument();
        expect(screen.getByText(/Notifications/i)).toBeInTheDocument();
    });

    it('appelle logout et navigue vers l\'accueil lors du clic sur déconnexion', async () => {
        render(
            <MemoryRouter>
                <Sidebar collapsed={false} setCollapsed={vi.fn()} />
            </MemoryRouter>
        );

        // On cherche le bouton par son titre ou l'icône
        const logoutBtn = screen.getByRole('button', { name: /logout/i });
        fireEvent.click(logoutBtn);

        expect(mockLogout).toHaveBeenCalled();
        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});