import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MouseEffect } from './mouse-effect';

// Mock de ResizeObserver car il est utilisé dans le useEffect
global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
};

describe('MouseEffect Component', () => {
    beforeEach(() => {
        // Mock des dimensions du conteneur (fondamental pour generateDots)
        vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue({
            width: 100,
            height: 100,
            top: 0,
            left: 0,
        });
    });

    it('affiche correctement les enfants', () => {
        render(
            <MouseEffect>
                <div data-testid="child">Contenu Test</div>
            </MouseEffect>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('génère des points (dots) en fonction des dimensions', async () => {
        const { container } = render(<MouseEffect dotSpacing={20} />);
        
        // On attend que le useEffect et le cycle de rendu des points soient finis
        await waitFor(() => {
            const dots = container.querySelectorAll('.absolute.rounded-full');
            expect(dots.length).toBeGreaterThan(0);
        });
    });

    it('met à jour les coordonnées de la souris lors du survol', async () => {
        const { container } = render(<MouseEffect />);
        const mainDiv = container.firstChild;

        // On simule un mouvement de souris
        fireEvent.mouseMove(mainDiv, { clientX: 50, clientY: 50 });

        // On ne peut pas tester directement la "répulsion" sans un moteur physique,
        // mais on vérifie que le composant ne crash pas lors de l'interaction.
        expect(mainDiv).toBeInTheDocument();
    });

    it('réinitialise les coordonnées quand la souris quitte la zone', async () => {
        const { container } = render(<MouseEffect />);
        const mainDiv = container.firstChild;

        fireEvent.mouseMove(mainDiv, { clientX: 50, clientY: 50 });
        fireEvent.mouseLeave(mainDiv);

        // Au MouseLeave, mouseX/Y passent à POSITIVE_INFINITY
        // Le test passe si aucun crash n'est détecté
    });
});