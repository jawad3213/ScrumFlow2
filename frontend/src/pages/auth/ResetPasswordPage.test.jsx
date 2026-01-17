import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // <--- Import indispensable
import { describe, it, expect, vi } from 'vitest';
import ResetPasswordPage from './ResetPasswordPage';
import "@testing-library/jest-dom/vitest";

// On mocke le formulaire
vi.mock('@/features/auth/components/ResetPasswordForm', () => ({
    default: ({ onSuccess }) => (
        <button onClick={onSuccess} data-testid="mock-reset-button">
            Simulate Success
        </button>
    )
}));

// Mock de ResetPasswordSuccess au cas où il contient des <Link> ou useNavigate
vi.mock('@/features/auth/components/ResetPasswordSuccess', () => ({
    default: () => <div>Password Reset Successful</div>
}));

// On mocke le layout
vi.mock('@/features/auth/components/AuthLayout', () => ({
    default: ({ children, title }) => (
        <div>
            {title && <h1>{title}</h1>}
            {children}
        </div>
    )
}));

describe('ResetPasswordPage Integration', () => {
    it('affiche le formulaire au début, puis la vue succès après réussite', async () => {
        render(
            <MemoryRouter> 
                <ResetPasswordPage />
            </MemoryRouter>
        );

        // 1. État initial
        expect(screen.getByText(/Set New Password/i)).toBeInTheDocument();

        // 2. Action
        const button = screen.getByTestId('mock-reset-button');
        fireEvent.click(button);

        // 3. Vérification du changement d'état
        await waitFor(() => {
            expect(screen.getByText(/Password Reset Successful/i)).toBeInTheDocument();
        });
        
        // Le titre initial doit avoir disparu
        expect(screen.queryByText(/Set New Password/i)).not.toBeInTheDocument();
    });
});