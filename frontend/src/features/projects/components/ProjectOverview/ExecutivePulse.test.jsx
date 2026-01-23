import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ExecutivePulse from './ExecutivePulse';

describe('ExecutivePulse Component', () => {
    const mockProject = {
        total_project_cost: "50000",
        estimated_gains: [
            { cost_mad: "15000" },
            { cost_mad: "5000" }
        ],
        break_even_point_months: "12.5",
        roi_percentage: "45",
        estimated_duration_months: 6,
        assigned_engineers: [{}, {}, {}] // 3 ingénieurs
    };

    it('calcule et affiche les bonnes valeurs à partir des props', () => {
        render(<ExecutivePulse project={mockProject} />);

        // Vérification de la durée
        expect(screen.getByText('6 Months')).toBeInTheDocument();

        // Vérification de l'investissement (formaté)
        // Note: .toLocaleString('fr-FR') peut utiliser des espaces insécables
        expect(screen.getByText(/50\s000,00 MAD/)).toBeInTheDocument();

        // Vérification des gains cumulés (15000 + 5000 = 20000)
        expect(screen.getByText(/20\s000,00 MAD/)).toBeInTheDocument();

        // Vérification du Break-even
        expect(screen.getByText('12.5 Months')).toBeInTheDocument();

        // Vérification du ROI
        expect(screen.getByText('45%')).toBeInTheDocument();

        // Vérification de la taille de l'équipe
        expect(screen.getByText('3 Engineers')).toBeInTheDocument();
    });

    it('affiche tous les titres de sections (insensible à la casse CSS)', () => {
        render(<ExecutivePulse project={mockProject} />);
        
        const titles = [
            /Dev Duration/i, 
            /Total Investment/i, 
            /Estimated Gains/i, 
            /Break-even Point/i, 
            /3-Year ROI/i, 
            /Team Dimension/i
        ];

        titles.forEach(title => {
            // .getByText avec une regex /i ignore si c'est en majuscule ou minuscule
            expect(screen.getByText(title)).toBeInTheDocument();
        });
    });

    it('utilise la couleur "rose" si le ROI est négatif ou nul', () => {
        const failingProject = { ...mockProject, roi_percentage: "-10" };
        const { container } = render(<ExecutivePulse project={failingProject} />);
        
        // On cherche la classe bg-rose-50 injectée par StatCard
        const roseElement = container.querySelector('.bg-rose-50');
        expect(roseElement).toBeInTheDocument();
    });
});