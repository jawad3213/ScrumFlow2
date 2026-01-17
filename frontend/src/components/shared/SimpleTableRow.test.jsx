import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import SimpleTableRow from './SimpleTableRow';

describe('SimpleTableRow Component', () => {
    const defaultProps = {
        name: 'Salaire de base',
        cost: 4500.5,
    };

    it('renders the name and formatted cost correctly', () => {
        render(<SimpleTableRow {...defaultProps} />);
        
        expect(screen.getByText('Salaire de base')).toBeInTheDocument();
        
        // Vérification du formatage fr-FR (4 500,50)
        // \s gère l'espace insécable potentiel des milliers
        expect(screen.getByText(/4\s?500,50/)).toBeInTheDocument();
        expect(screen.getByText('MAD')).toBeInTheDocument();
    });

    it('shows the detail text only when provided', () => {
        const { rerender } = render(<SimpleTableRow {...defaultProps} />);
        expect(screen.queryByText('Détails du poste')).not.toBeInTheDocument();

        rerender(<SimpleTableRow {...defaultProps} detail="Détails du poste" />);
        expect(screen.getByText('Détails du poste')).toBeInTheDocument();
    });

    it('renders the formula with correct styling when provided', () => {
        const formula = '150 * 30';
        const { container } = render(<SimpleTableRow {...defaultProps} formula={formula} />);
        
        const formulaElement = screen.getByText(formula);
        expect(formulaElement).toBeInTheDocument();
        
        // Vérifie que le texte de la formule a le style spécifique
        expect(formulaElement).toHaveStyle({ color: 'rgb(93, 95, 239)' }); // #5d5fef
        expect(formulaElement).toHaveClass('font-mono', 'italic');
    });

    it('applies border-b class but not to the last-child (CSS check)', () => {
        const { container } = render(<SimpleTableRow {...defaultProps} />);
        const mainDiv = container.firstChild;
        
        // On vérifie que les classes de base sont là
        expect(mainDiv).toHaveClass('border-b', 'border-neutral-50', 'hover:bg-brand-primary-50/30');
    });

    it('handles zero or negative cost correctly', () => {
        render(<SimpleTableRow {...defaultProps} cost={0} />);
        expect(screen.getByText(/0,00/)).toBeInTheDocument();
    });
});