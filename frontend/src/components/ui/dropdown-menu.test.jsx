import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuCheckboxItem,
} from './dropdown-menu';

// Mocks indispensables pour les composants Radix/Floating UI
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

window.HTMLElement.prototype.scrollIntoView = vi.fn();
window.HTMLElement.prototype.releasePointerCapture = vi.fn();

describe('DropdownMenu Component', () => {
    const TestComponent = ({ onSelect, checkboxChecked = false }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button>Ouvrir Menu</button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Mon Compte</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={onSelect}>
                    Profil
                </DropdownMenuItem>
                <DropdownMenuCheckboxItem checked={checkboxChecked}>
                    Afficher la barre d'état
                </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );

    it('affiche le contenu du menu après avoir cliqué sur le trigger', async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        const trigger = screen.getByRole('button', { name: /ouvrir menu/i });
        await user.click(trigger);

        await waitFor(() => {
            expect(screen.getByText('Mon Compte')).toBeInTheDocument();
            expect(screen.getByText('Profil')).toBeInTheDocument();
        });
    });

    it('appelle onSelect quand un item est cliqué', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        render(<TestComponent onSelect={onSelect} />);

        await user.click(screen.getByRole('button', { name: /ouvrir menu/i }));
        
        const item = await screen.findByText('Profil');
        await user.click(item);

        expect(onSelect).toHaveBeenCalledTimes(1);
    });

    it('affiche l\'icône de check dans le CheckboxItem quand il est coché', async () => {
        const user = userEvent.setup();
        render(<TestComponent checkboxChecked={true} />);

        await user.click(screen.getByRole('button', { name: /ouvrir menu/i }));

        // L'indicateur de CheckboxItem n'apparaît que si checked={true}
        // Il contient une icône Lucide "Check" (svg)
        const checkboxItem = screen.getByText(/afficher la barre d'état/i);
        expect(checkboxItem).toBeInTheDocument();
        
        // On vérifie la présence de l'icône dans l'indicateur
        const checkIcon = checkboxItem.querySelector('svg');
        expect(checkIcon).toBeInTheDocument();
    });

    it('ferme le menu en appuyant sur Escape', async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        await user.click(screen.getByRole('button', { name: /ouvrir menu/i }));
        expect(screen.getByText('Profil')).toBeInTheDocument();

        await user.keyboard('{Escape}');

        await waitFor(() => {
            expect(screen.queryByText('Profil')).not.toBeInTheDocument();
        });
    });
});