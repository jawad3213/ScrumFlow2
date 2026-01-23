window.HTMLElement.prototype.scrollIntoView = vi.fn();
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from './command';

// SOLUTION : Mock de ResizeObserver
global.ResizeObserver = class ResizeObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
};

describe('Command Component', () => {
    // On s'assure que le contenu est rendu de manière synchrone pour les tests simples
    const TestComponent = () => (
        <Command label="Command Menu">
            <CommandInput placeholder="Rechercher..." />
            <CommandList>
                <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                <CommandGroup heading="Suggestions">
                    <CommandItem>Profil</CommandItem>
                    <CommandItem>Paramètres</CommandItem>
                    <CommandItem>Déconnexion</CommandItem>
                </CommandGroup>
            </CommandList>
        </Command>
    );

    it('affiche correctement tous les éléments au rendu initial', () => {
        render(<TestComponent />);
        expect(screen.getByPlaceholderText('Rechercher...')).toBeInTheDocument();
        expect(screen.getByText('Profil')).toBeInTheDocument();
    });

    it('filtre les éléments en fonction de la saisie utilisateur', async () => {
        const user = userEvent.setup();
        render(<TestComponent />);

        const input = screen.getByPlaceholderText('Rechercher...');
        
        // On tape une recherche qui ne correspond qu'à "Profil"
        await user.type(input, 'Prof');

        // "Profil" doit toujours être là
        expect(screen.getByText('Profil')).toBeInTheDocument();
        
        // "Paramètres" doit avoir disparu du DOM
        await waitFor(() => {
            const parametres = screen.queryByText('Paramètres');
            expect(parametres).not.toBeInTheDocument();
        });
    });

    it('gère la sélection d\'un élément au clic', async () => {
        const user = userEvent.setup();
        const onSelect = vi.fn();
        
        render(
            <Command>
                <CommandList>
                    <CommandItem onSelect={onSelect}>Action Test</CommandItem>
                </CommandList>
            </Command>
        );

        const item = screen.getByText('Action Test');
        await user.click(item);

        expect(onSelect).toHaveBeenCalled();
    });
});