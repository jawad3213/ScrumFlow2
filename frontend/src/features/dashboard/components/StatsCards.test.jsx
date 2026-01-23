import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StatsCards from './StatsCards';

describe('StatsCards Component', () => {
    it('affiche toutes les cartes de statistiques avec leurs titres', () => {
        render(<StatsCards />);
        
        // Vérification des titres (uniques)
        expect(screen.getByText('Total Revenue')).toBeInTheDocument();
        expect(screen.getByText('Subscriptions')).toBeInTheDocument();
        expect(screen.getByText('Sales')).toBeInTheDocument();
        expect(screen.getByText('Active Now')).toBeInTheDocument();
    });

    it('affiche les valeurs correctes pour chaque statistique', () => {
        render(<StatsCards />);
        
        // Vérification des valeurs numériques
        expect(screen.getByText('$45,231.89')).toBeInTheDocument();
        expect(screen.getByText('+2350')).toBeInTheDocument();
        expect(screen.getByText('+12,234')).toBeInTheDocument();
        expect(screen.getByText('+573')).toBeInTheDocument();
    });

    it('affiche les messages de variation (change text)', () => {
        render(<StatsCards />);
        
        // Utilisation de regex pour être plus souple sur les espaces ou le texte
        expect(screen.getByText(/\+20.1% from last month/i)).toBeInTheDocument();
        expect(screen.getByText(/\+180.1% from last month/i)).toBeInTheDocument();
        expect(screen.getByText(/\+201 since last hour/i)).toBeInTheDocument();
    });

    it('rend exactement 4 composants StatsCard', () => {
        const { container } = render(<StatsCards />);
        
        // On cherche le nombre de conteneurs générés par la grille
        // StatsCards utilise "grid", on peut compter les enfants directs du wrapper
        const cards = container.firstChild.childNodes;
        expect(cards.length).toBe(4);
    });
});