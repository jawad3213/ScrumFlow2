import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import FinancialCard from './FinancialCard';
import { Activity } from 'lucide-react';

describe('FinancialCard Component', () => {
    const defaultProps = {
        title: 'Revenu Total',
        value: 15000.5,
        icon: Activity,
        color: 'emerald',
    };

    it('renders the title and formatted value correctly', () => {
        render(<FinancialCard {...defaultProps} />);
        
        expect(screen.getByText('Revenu Total')).toBeInTheDocument();
        // Vérifie le formatage fr-FR (espace pour les milliers, virgule pour les décimales)
        expect(screen.getByText(/15\s000,50/)).toBeInTheDocument();
        expect(screen.getByText('MAD')).toBeInTheDocument();
    });

    it('respects the precision prop for number formatting', () => {
        render(<FinancialCard {...defaultProps} value={123.4567} precision={3} />);
        
        // On s'attend à 123,457 (arrondi)
        expect(screen.getByText(/123,457/)).toBeInTheDocument();
    });

    it('hides the currency label when isCurrency is false', () => {
        render(<FinancialCard {...defaultProps} isCurrency={false} />);
        
        expect(screen.queryByText('MAD')).not.toBeInTheDocument();
    });

    it('renders the subtitle when provided', () => {
        const subtitle = "vs le mois dernier";
        render(<FinancialCard {...defaultProps} subtitle={subtitle} />);
        
        expect(screen.getByText(subtitle)).toBeInTheDocument();
    });

    it('applies the correct color classes based on the color prop', () => {
        const { container } = render(<FinancialCard {...defaultProps} color="rose" />);
        
        // Le mappage pour rose est 'rose'
        // On vérifie que le conteneur de l'icône a la classe bg-rose-50
        const iconWrapper = container.querySelector('.bg-rose-50');
        expect(iconWrapper).toBeInTheDocument();
        expect(iconWrapper).toHaveClass('text-rose-500');
    });

    it('falls back to brand-primary if color is unknown', () => {
        const { container } = render(<FinancialCard {...defaultProps} color="invalid-color" />);
        
        const iconWrapper = container.querySelector('.bg-brand-primary-50');
        expect(iconWrapper).toBeInTheDocument();
    });

    it('renders the raw value if it is not a number', () => {
        render(<FinancialCard {...defaultProps} value="Indisponible" />);
        
        expect(screen.getByText('Indisponible')).toBeInTheDocument();
        // Pas de formatage toLocaleString sur une string
    });
});