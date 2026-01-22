import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Recommandé pour Radix/Shadcn
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import ProfilePage from './ProfilePage';
import "@testing-library/jest-dom/vitest";

// Mocks
vi.mock('@/features/auth/components/ProfileHeader', () => ({
    default: () => <div data-testid="profile-header">Header Mock</div>
}));
vi.mock('@/features/auth/components/UpdateProfileForm', () => ({
    default: () => <div>Formulaire Informations Personnelles</div>
}));
vi.mock('@/features/auth/components/UpdatePasswordForm', () => ({
    default: () => <div>Formulaire Sécurité Mot de Passe</div>
}));

describe('ProfilePage Integration', () => {
    // Mock indispensable pour Radix UI Tabs
    global.ResizeObserver = vi.fn().mockImplementation(() => ({
        observe: vi.fn(),
        unobserve: vi.fn(),
        disconnect: vi.fn(),
    }));

    it('bascule correctement entre les onglets', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <ProfilePage />
            </MemoryRouter>
        );

        // 1. Vérification initiale
        expect(screen.getByText(/Formulaire Informations Personnelles/i)).toBeInTheDocument();

        // 2. Action : Clic sur l'onglet Security
        // Note : On utilise le nom exact qui apparaît dans le composant TabsTrigger
        const securityTab = screen.getByRole('tab', { name: /security/i });
        await user.click(securityTab);

        // 3. Vérification avec waitFor (crucial pour les changements de Tabs)
        await waitFor(() => {
            expect(screen.getByText(/Formulaire Sécurité Mot de Passe/i)).toBeInTheDocument();
        });

        // 4. Vérifier que l'ancien contenu est caché
        expect(screen.queryByText(/Formulaire Informations Personnelles/i)).not.toBeInTheDocument();
    });
});