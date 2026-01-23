import { render, screen, within } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TeamCompositionWidget from './TeamCompositionWidget';

vi.mock('react-chartjs-2', () => ({
    Doughnut: () => <div data-testid="mock-doughnut" />
}));

describe('TeamCompositionWidget Component', () => {
    const mockProject = {
        assigned_engineers: [
            { specialization: { name: 'Frontend' } },
            { specialization: { name: 'Frontend' } },
            { specialization: { name: 'Backend' } },
            { role: 'Designer' },
            { id: 5 }
        ]
    };

    it('affiche le nombre total de membres au centre', () => {
        render(<TeamCompositionWidget project={mockProject} />);
        
        // On cible spécifiquement la div qui contient le texte "Members" pour trouver le chiffre au-dessus
        const totalContainer = screen.getByText(/Members/i).parentElement;
        expect(within(totalContainer).getByText('5')).toBeInTheDocument();
    });

    it('regroupe et affiche correctement les rôles dans la légende', () => {
    render(<TeamCompositionWidget project={mockProject} />);

    // On cherche l'élément qui contient "Frontend"
    const frontendLabel = screen.getByText('Frontend');
    
    // On remonte jusqu'au conteneur qui englobe à la fois le nom ET le chiffre
    // Dans votre code, c'est la div avec "justify-between"
    const frontendRow = frontendLabel.closest('.flex.justify-between');
    
    // Maintenant within(frontendRow) verra bien le chiffre "2"
    expect(within(frontendRow).getByText('2')).toBeInTheDocument();

    const backendRow = screen.getByText('Backend').closest('.flex.justify-between');
    expect(within(backendRow).getByText('1')).toBeInTheDocument();
});
    it('gère les données au format camelCase (assignedEngineers)', () => {
        const camelProject = {
            assignedEngineers: [{ specialization: { name: 'DevOps' } }]
        };
        render(<TeamCompositionWidget project={camelProject} />);
        
        expect(screen.getByText('DevOps')).toBeInTheDocument();
        
        // Au lieu de chercher globalement '1', on cherche dans la légende
        // ou on vérifie simplement que le total est correct
        const membersBadge = screen.getByText(/Members/i).parentElement;
        expect(within(membersBadge).getByText('1')).toBeInTheDocument();
    });
});