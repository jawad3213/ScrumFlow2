import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import PlaceholderPage from './placeholder-page';

describe('PlaceholderPage Component', () => {
    const defaultProps = {
        title: "Tableau de Bord",
        description: "Cette fonctionnalité arrive très bientôt dans votre espace."
    };

    it('affiche le titre et la description fournis', () => {
        render(<PlaceholderPage {...defaultProps} />);
        
        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    });

    it('affiche toujours le badge "Coming Soon"', () => {
        render(<PlaceholderPage {...defaultProps} />);
        
        const badge = screen.getByText(/coming soon/i);
        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass('uppercase', 'tracking-widest');
    });

    it('contient une icône SVG décorative', () => {
        const { container } = render(<PlaceholderPage {...defaultProps} />);
        
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        expect(svg).toHaveClass('w-12', 'h-12');
    });

    it('possède les classes d\'animation CSS', () => {
        const { container } = render(<PlaceholderPage {...defaultProps} />);
        
        const wrapper = container.firstChild;
        // Vérifie la présence des classes Tailwind pour animate-in
        expect(wrapper).toHaveClass('animate-in', 'fade-in', 'duration-700');
    });
});