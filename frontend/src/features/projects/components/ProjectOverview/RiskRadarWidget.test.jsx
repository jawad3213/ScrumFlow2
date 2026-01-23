import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import RiskRadarWidget from './RiskRadarWidget';

describe('RiskRadarWidget Component', () => {
    const mockRisks = [
        { risk_name: 'Low Risk', impact: 'Low', mitigation_strategy: 'Strategy L' },
        { risk_name: 'Critical Risk', impact: 'Critical', mitigation_strategy: 'Strategy C' },
        { risk_name: 'High Risk', impact: 'High', mitigation_strategy: 'Strategy H' },
    ];

    it('affiche le nombre total de risques identifiés', () => {
        render(<RiskRadarWidget project={{ risks: mockRisks }} />);
        expect(screen.getByText(/Found 3 potential risks/i)).toBeInTheDocument();
    });

    it('trie les risques par priorité (Critical en premier)', () => {
        render(<RiskRadarWidget project={{ risks: mockRisks }} />);
        
        const riskTitles = screen.getAllByRole('heading', { level: 5 });
        // Critical (3) devrait être avant High (2) et Low (0)
        expect(riskTitles[0].textContent).toBe('Critical Risk');
        expect(riskTitles[1].textContent).toBe('High Risk');
    });

    it('affiche un état "All Clear" quand il n\'y a pas de risques', () => {
        render(<RiskRadarWidget project={{ risks: [] }} />);
        
        expect(screen.getByText('All Clear')).toBeInTheDocument();
        expect(screen.getByText(/No risks identified/i)).toBeInTheDocument();
    });

    it('applique les bonnes classes de couleur selon l\'impact', () => {
        render(<RiskRadarWidget project={{ risks: [mockRisks[1]] }} />); // Critical
        
        const badge = screen.getByText('Critical');
        // Vérifie la présence des classes de couleur pour High/Critical (rose)
        expect(badge).toHaveClass('text-rose-600', 'bg-rose-50');
    });

    it('affiche un message par défaut si aucune stratégie de mitigation n\'est fournie', () => {
        const riskWithoutStrategy = [{ risk_name: 'Mystery Risk', impact: 'Medium' }];
        render(<RiskRadarWidget project={{ risks: riskWithoutStrategy }} />);
        
        expect(screen.getByText('No mitigation strategy defined.')).toBeInTheDocument();
    });

    it('ne limite l\'affichage qu\'aux 5 premiers risques les plus importants', () => {
        const manyRisks = Array.from({ length: 10 }, (_, i) => ({
            risk_name: `Risk ${i}`,
            impact: 'High'
        }));
        render(<RiskRadarWidget project={{ risks: manyRisks }} />);
        
        const renderedRisks = screen.getAllByRole('heading', { level: 5 });
        expect(renderedRisks).toHaveLength(5);
    });
});