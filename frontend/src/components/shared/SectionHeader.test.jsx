import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import SectionHeader from './SectionHeader';
import { Settings } from 'lucide-react';

describe('SectionHeader Component', () => {
    const defaultProps = {
        title: 'Paramètres du compte',
        icon: Settings,
        color: 'indigo'
    };

    it('renders the title in uppercase', () => {
        render(<SectionHeader {...defaultProps} />);
        const titleElement = screen.getByText(defaultProps.title);
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveClass('uppercase');
    });

    it('renders the icon provided', () => {
        const { container } = render(<SectionHeader {...defaultProps} />);
        const svgElement = container.querySelector('svg');
        expect(svgElement).toBeInTheDocument();
    });

    it('applies the correct color classes based on the color prop', () => {
        const { container } = render(<SectionHeader {...defaultProps} color="emerald" />);
        
        // On cherche le div qui contient le SVG (l'icône)
        const svg = container.querySelector('svg');
        const iconWrapper = svg.parentElement;
        
        expect(iconWrapper).toHaveClass('bg-emerald-50');
        expect(iconWrapper).toHaveClass('text-emerald-500');
        expect(iconWrapper).toHaveClass('border-emerald-100');
    });

    it('falls back to brand-primary if color is missing or unknown', () => {
        const { container } = render(<SectionHeader {...defaultProps} color="unknown" />);
        
        const svg = container.querySelector('svg');
        const iconWrapper = svg.parentElement;
        
        expect(iconWrapper).toHaveClass('bg-brand-primary-50');
        expect(iconWrapper).toHaveClass('text-brand-primary-500');
    });

    it('handles the "brand" alias correctly', () => {
        const { container } = render(<SectionHeader {...defaultProps} color="brand" />);
        
        const svg = container.querySelector('svg');
        const iconWrapper = svg.parentElement;
        
        expect(iconWrapper).toHaveClass('bg-brand-primary-50');
    });
});