import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Popover, PopoverTrigger, PopoverContent } from './popover';

// Ces mocks sont essentiels pour Radix UI (déjà présents dans votre setup global si configuré)
global.ResizeObserver = class {
    observe() {} unobserve() {} disconnect() {}
};

describe('Popover Component', () => {
    const TestPopover = () => (
        <Popover>
            <PopoverTrigger asChild>
                <button>Ouvrir le Popover</button>
            </PopoverTrigger>
            <PopoverContent>
                <div data-testid="popover-content">
                    <h3>Informations</h3>
                    <p>Contenu détaillé ici.</p>
                </div>
            </PopoverContent>
        </Popover>
    );

    it('affiche le contenu lors du clic sur le déclencheur', async () => {
        const user = userEvent.setup();
        render(<TestPopover />);

        const trigger = screen.getByRole('button', { name: /ouvrir le popover/i });
        
        // Avant le clic, le contenu ne doit pas être visible ou présent
        expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();

        await user.click(trigger);

        // Radix utilise des Portals et des animations, waitFor est nécessaire
        await waitFor(() => {
            expect(screen.getByTestId('popover-content')).toBeInTheDocument();
            expect(screen.getByText('Informations')).toBeInTheDocument();
        });
    });

    it('ferme le popover lors d\'un clic à l\'extérieur', async () => {
        const user = userEvent.setup();
        render(
            <div>
                <div data-testid="outside">Extérieur</div>
                <TestPopover />
            </div>
        );

        await user.click(screen.getByRole('button', { name: /ouvrir le popover/i }));
        await waitFor(() => expect(screen.getByTestId('popover-content')).toBeInTheDocument());

        // Clic sur l'élément extérieur
        await user.click(screen.getByTestId('outside'));

        await waitFor(() => {
            expect(screen.queryByTestId('popover-content')).not.toBeInTheDocument();
        });
    });

    it('applique les classes personnalisées au contenu', async () => {
        const user = userEvent.setup();
        const customClass = "bg-red-500";
        
        render(
            <Popover>
                <PopoverTrigger>Ouvrir</PopoverTrigger>
                <PopoverContent className={customClass}>Content</PopoverContent>
            </Popover>
        );

        await user.click(screen.getByText('Ouvrir'));
        
        const content = await screen.findByText('Content');
        // Radix applique la classe sur l'élément qui a le rôle 'dialog' ou l'attribut data-state
        expect(content.closest('[data-state]')).toHaveClass(customClass);
    });
});