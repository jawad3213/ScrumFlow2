import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { MagicCard } from './magic-card';

describe('MagicCard Component', () => {
    // Mock de getBoundingClientRect car JSDOM ne gère pas les dimensions réelles
    beforeEach(() => {
        Element.prototype.getBoundingClientRect = vi.fn(() => ({
            width: 400,
            height: 200,
            top: 0,
            left: 0,
            bottom: 200,
            right: 400,
        }));
    });

    it('affiche correctement ses enfants', () => {
        render(<MagicCard>Contenu de la carte</MagicCard>);
        expect(screen.getByText('Contenu de la carte')).toBeInTheDocument();
    });

    it('met à jour les coordonnées lors du mouvement de la souris', async () => {
        const { container } = render(<MagicCard gradientSize={200}>Card</MagicCard>);
        const card = container.firstChild;

        // On s'assure que l'élément a des dimensions pour le calcul
        // (Le mock dans beforeEach devrait déjà s'en charger)
        
        // Déclenchement de l'événement
        fireEvent.pointerMove(card, {
            clientX: 200,
            clientY: 100,
            pointerId: 1,
            buttons: 1,
        });

        // On utilise waitFor car Framer Motion traite les MotionValues 
        // en dehors du cycle de rendu React standard pour la performance
        await waitFor(() => {
            const gradientOverlay = container.querySelector('.pointer-events-none');
            const style = gradientOverlay.style.background;
            
            // On vérifie que la valeur n'est plus la valeur initiale (-200px)
            expect(style).not.toContain('-200px');
            expect(style).toContain('200px');
            expect(style).toContain('100px');
        }, { timeout: 1000 });
    });

    it('réinitialise les coordonnées quand la souris quitte la carte', () => {
        const gradientSize = 250;
        const { container } = render(<MagicCard gradientSize={gradientSize}>Card</MagicCard>);
        const card = container.firstChild;

        // On entre puis on sort
        fireEvent.pointerMove(card, { clientX: 100, clientY: 100 });
        fireEvent.pointerLeave(card);

        const gradientOverlay = card.querySelector('.pointer-events-none');
        // La position de réinitialisation est -gradientSize
        expect(gradientOverlay.style.background).toContain('-250px');
    });

    it('nettoie les écouteurs d\'événements globaux au démontage', () => {
        const removeSpy = vi.spyOn(window, 'removeEventListener');
        const { unmount } = render(<MagicCard>Card</MagicCard>);
        
        unmount();

        expect(removeSpy).toHaveBeenCalledWith('pointerout', expect.any(Function));
        expect(removeSpy).toHaveBeenCalledWith('blur', expect.any(Function));
        removeSpy.mockRestore();
    });

    it('réinitialise la position lors du "blur" de la fenêtre', () => {
        const { container } = render(<MagicCard gradientSize={200}>Card</MagicCard>);
        
        // Simuler un mouvement
        fireEvent.pointerMove(container.firstChild, { clientX: 50, clientY: 50 });
        
        // Simuler la perte de focus de la fenêtre (Alt+Tab)
        fireEvent(window, new Event('blur'));

        const gradientOverlay = container.querySelector('.pointer-events-none');
        expect(gradientOverlay.style.background).toContain('-200px');
    });
});