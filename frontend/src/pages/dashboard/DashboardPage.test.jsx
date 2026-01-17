import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DashboardPage from './DashboardPage';
import "@testing-library/jest-dom/vitest";

// 1. Mocks des composants complexes pour isoler la structure de la page
vi.mock('@/features/dashboard/components/StatsCards', () => ({
    default: () => <div data-testid="stats-cards">Stats Cards Section</div>
}));

vi.mock('@/features/dashboard/components/Overview', () => ({
    default: () => <div data-testid="overview-chart">Overview Chart Section</div>
}));

vi.mock('@/features/dashboard/components/RecentSales', () => ({
    default: () => <div data-testid="recent-sales">Recent Sales Section</div>
}));

describe('DashboardPage Integration', () => {
    
    it('affiche correctement tous les éléments du tableau de bord', () => {
        render(<DashboardPage />);

        // --- Vérification du Header ---
        expect(screen.getByRole('heading', { name: /dashboard/i, level: 2 })).toBeInTheDocument();
        expect(screen.getByText(/Jan 20, 2024 - Feb 09, 2024/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();

        // --- Vérification des Onglets (Navigation locale) ---
        expect(screen.getByRole('button', { name: /overview/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /analytics/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /reports/i })).toBeInTheDocument();

        // --- Vérification de l'intégration des composants de données ---
        // On vérifie que les conteneurs sont bien rendus là où ils devraient être
        expect(screen.getByTestId('stats-cards')).toBeInTheDocument();
        expect(screen.getByTestId('overview-chart')).toBeInTheDocument();
        expect(screen.getByTestId('recent-sales')).toBeInTheDocument();
    });

    it('vérifie que la mise en page (layout) utilise la grille correcte', () => {
        const { container } = render(<DashboardPage />);
        
        // On cherche le conteneur de la grille pour Overview et RecentSales
        const gridContainer = container.querySelector('.grid');
        
        expect(gridContainer).toHaveClass('md:grid-cols-2');
        expect(gridContainer).toHaveClass('lg:grid-cols-7');
    });
});