import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogFooter,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogAction,
    AlertDialogCancel,
} from './alert-dialog';

// Mock de ResizeObserver car Radix UI en a besoin pour positionner les éléments
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

describe('AlertDialog Component', () => {
    const TestComponent = ({ onAction, onCancel }) => (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button>Ouvrir le dialogue</button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Cette action est irréversible.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Annuler</AlertDialogCancel>
                    <AlertDialogAction onClick={onAction}>Continuer</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );

    it('should open the dialog when trigger is clicked', async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        const trigger = screen.getByRole('button', { name: /ouvrir le dialogue/i });
        await user.click(trigger);

        // On utilise waitFor car il y a des animations d'ouverture
        await waitFor(() => {
            expect(screen.getByText('Êtes-vous sûr ?')).toBeInTheDocument();
            expect(screen.getByText('Cette action est irréversible.')).toBeInTheDocument();
        });
    });

    it('should call onAction and close when continue is clicked', async () => {
        const user = userEvent.setup();
        const onAction = vi.fn();
        render(<TestComponent onAction={onAction} />);

        await user.click(screen.getByRole('button', { name: /ouvrir le dialogue/i }));
        
        const actionBtn = screen.getByRole('button', { name: /continuer/i });
        await user.click(actionBtn);

        expect(onAction).toHaveBeenCalledTimes(1);
        
        // Le dialogue doit disparaître
        await waitFor(() => {
            expect(screen.queryByText('Êtes-vous sûr ?')).not.toBeInTheDocument();
        });
    });

    it('should call onCancel and close when cancel is clicked', async () => {
        const user = userEvent.setup();
        const onCancel = vi.fn();
        render(<TestComponent onCancel={onCancel} />);

        await user.click(screen.getByRole('button', { name: /ouvrir le dialogue/i }));
        
        const cancelBtn = screen.getByRole('button', { name: /annuler/i });
        await user.click(cancelBtn);

        expect(onCancel).toHaveBeenCalledTimes(1);
        
        await waitFor(() => {
            expect(screen.queryByText('Êtes-vous sûr ?')).not.toBeInTheDocument();
        });
    });

    it('applies the correct classes for variants (ButtonVariants mock)', async () => {
        render(<TestComponent />);
        await userEvent.click(screen.getByRole('button', { name: /ouvrir le dialogue/i }));

        const cancelBtn = screen.getByRole('button', { name: /annuler/i });
        // Vérifie que la classe "mt-2 sm:mt-0" de AlertDialogCancel est présente
        expect(cancelBtn).toHaveClass('mt-2', 'sm:mt-0');
    });
});