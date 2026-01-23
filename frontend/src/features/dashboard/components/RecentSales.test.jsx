import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RecentSales from './RecentSales';

describe('RecentSales Component', () => {
    it('affiche le titre et le résumé des ventes', () => {
        render(<RecentSales />);
        expect(screen.getByText('Recent Sales')).toBeInTheDocument();
    });

    it('affiche correctement les informations des clients (gestion des doublons)', () => {
        render(<RecentSales />);
        
        // Pour les textes uniques, getByText est parfait
        expect(screen.getByText('Olivia Martin')).toBeInTheDocument();
        expect(screen.getByText('jackson.lee@email.com')).toBeInTheDocument();

        // Pour le montant +$39.00 qui apparaît 2 fois :
        // On utilise getAllByText qui retourne un tableau
        const thirtyNineDollars = screen.getAllByText('+$39.00');
        expect(thirtyNineDollars).toHaveLength(2); 

        // Alternative encore plus précise : vérifier qu'il y a un $39.00 
        // spécifiquement pour Sofia Davis en cherchant l'élément parent
        const sofiaRow = screen.getByText('Sofia Davis').closest('div.flex');
        expect(sofiaRow).toHaveTextContent('+$39.00');
    });

    it('affiche la liste complète des 5 ventes', () => {
        const { container } = render(<RecentSales />);
        // On compte les bulles d'initiales (OM, JL, IN, WK, SD)
        const initialBubbles = container.querySelectorAll('.h-9.w-9');
        expect(initialBubbles.length).toBe(5);
    });
});