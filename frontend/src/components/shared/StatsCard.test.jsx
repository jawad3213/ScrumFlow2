import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import StatsCard from './StatsCard';
import { Users } from 'lucide-react';

describe('StatsCard Component', () => {
    const defaultProps = {
        title: 'Utilisateurs Actifs',
        value: '1,234',
        change: '+12% par rapport au mois dernier',
        icon: <Users data-testid="stats-icon" />
    };

    it('renders all provided props correctly', () => {
        render(<StatsCard {...defaultProps} />);

        // Vérification du titre
        expect(screen.getByText('Utilisateurs Actifs')).toBeInTheDocument();
        
        // Vérification de la valeur
        expect(screen.getByText('1,234')).toBeInTheDocument();
        
        // Vérification du texte de changement
        expect(screen.getByText('+12% par rapport au mois dernier')).toBeInTheDocument();
        
        // Vérification de l'icône
        expect(screen.getByTestId('stats-icon')).toBeInTheDocument();
    });

    it('has the correct layout classes for styling', () => {
        const { container } = render(<StatsCard {...defaultProps} />);
        
        // Le premier div (wrapper) doit avoir les classes de bordure et de fond
        const cardWrapper = container.firstChild;
        expect(cardWrapper).toHaveClass('rounded-xl', 'border', 'bg-surface-card');
        
        // Vérifie que le titre a les classes de texte spécifiques
        const titleElement = screen.getByText('Utilisateurs Actifs');
        expect(titleElement).toHaveClass('text-sm', 'text-neutral-500');
    });

    it('renders even if change prop is empty', () => {
        render(<StatsCard {...defaultProps} change="" />);
        
        const valueElement = screen.getByText('1,234');
        expect(valueElement).toBeInTheDocument();
        
        // Le paragraphe de "change" doit être vide mais présent (ou absent selon le rendu souhaité)
        const changeElement = screen.queryByText('+12% par rapport au mois dernier');
        expect(changeElement).not.toBeInTheDocument();
    });
});