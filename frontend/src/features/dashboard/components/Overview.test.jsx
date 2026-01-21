import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Overview from './Overview';

describe('Overview Component', () => {
    it('affiche le titre et la description du graphique', () => {
        render(<Overview />);
        
        // Vérifie que le titre est présent
        expect(screen.getByText('Overview')).toBeInTheDocument();
        
        // Vérifie que la description est présente
        expect(screen.getByText(/Monthly revenue for the current year/i)).toBeInTheDocument();
    });

    it('affiche tous les mois de l année sur l axe X', () => {
        render(<Overview />);
        
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        months.forEach(month => {
            expect(screen.getByText(month)).toBeInTheDocument();
        });
    });

    it('rend le bon nombre de barres de graphique', () => {
        const { container } = render(<Overview />);
        
        // On cherche les div qui ont la classe de couleur de fond de la barre
        // Votre code utilise "bg-brand-dark"
        const bars = container.querySelectorAll('.bg-brand-dark');
        
        expect(bars.length).toBe(12);
    });

    it('calcule correctement la hauteur relative des barres', () => {
        const { container } = render(<Overview />);
        const bars = container.querySelectorAll('.bg-brand-dark');
        
        // Le mois d'août (Aug) est le max (7500), il devrait être à 100% de hauteur
        // Dans le tableau c'est l'index 7 (0-indexed)
        const augBar = bars[7];
        expect(augBar.style.height).toBe('100%');
        
        // Janvier est à 4500. Max est 7500. (4500/7500)*100 = 60%
        const janBar = bars[0];
        expect(janBar.style.height).toBe('60%');
    });
});