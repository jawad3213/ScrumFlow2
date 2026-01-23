import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogFooter,
    DialogTitle,
    DialogDescription,
} from './dialog';

// Mocks nécessaires pour Radix UI et JSDOM
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

window.HTMLElement.prototype.scrollIntoView = vi.fn();
// Requis pour la gestion du focus Radix
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

describe('Dialog Component', () => {
    const TestComponent = () => (
        <Dialog>
            <DialogTrigger asChild>
                <button>Ouvrir le dialogue</button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Titre du Dialogue</DialogTitle>
                    <DialogDescription>
                        Ceci est une description de test.
                    </DialogDescription>
                </DialogHeader>
                <div>Contenu principal</div>
                <DialogFooter>
                    <button>Valider</button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );

    it('devrait ouvrir le dialogue au clic sur le trigger', async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        const trigger = screen.getByRole('button', { name: /ouvrir le dialogue/i });
        await user.click(trigger);

        // Radix utilise des Portals, on cherche dans screen (body)
        await waitFor(() => {
            expect(screen.getByText('Titre du Dialogue')).toBeInTheDocument();
            expect(screen.getByText('Ceci est une description de test.')).toBeInTheDocument();
        });
    });

    it('devrait fermer le dialogue en cliquant sur le bouton X', async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        // Ouvrir
        await user.click(screen.getByRole('button', { name: /ouvrir le dialogue/i }));
        
        // Trouver le bouton de fermeture (le span "Close" est en sr-only)
        const closeBtn = screen.getByRole('button', { name: /close/i });
        await user.click(closeBtn);

        await waitFor(() => {
            expect(screen.queryByText('Titre du Dialogue')).not.toBeInTheDocument();
        });
    });

    it('devrait fermer le dialogue en appuyant sur la touche Escape', async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        await user.click(screen.getByRole('button', { name: /ouvrir le dialogue/i }));
        
        // Simuler la touche Escape
        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(screen.queryByText('Titre du Dialogue')).not.toBeInTheDocument();
        });
    });

    it('devrait avoir les attributs d\'accessibilité corrects', async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        await user.click(screen.getByRole('button', { name: /ouvrir le dialogue/i }));

        const content = screen.getByRole('dialog');
        expect(content).toHaveAttribute('aria-describedby');
        expect(content).toHaveAttribute('aria-labelledby');
    });
});