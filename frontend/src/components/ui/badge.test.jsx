import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Badge } from './badge';

describe('Badge Component', () => {
    it('renders the badge with children text', () => {
        render(<Badge>En attente</Badge>);
        expect(screen.getByText('En attente')).toBeInTheDocument();
    });

    it('applies the default variant classes when no variant is specified', () => {
        const { container } = render(<Badge>Default</Badge>);
        // Classes du variant default
        expect(container.firstChild).toHaveClass('bg-brand-primary-500', 'text-white');
    });

    it('applies the correct classes for the success variant', () => {
        const { container } = render(<Badge variant="success">Succès</Badge>);
        expect(container.firstChild).toHaveClass('bg-success-lighter', 'text-success-darker');
    });

    it('applies the correct classes for the destructive variant', () => {
        const { container } = render(<Badge variant="destructive">Erreur</Badge>);
        expect(container.firstChild).toHaveClass('bg-danger-lighter', 'text-danger-darker');
    });

    it('applies the outline variant classes', () => {
        const { container } = render(<Badge variant="outline">Outline</Badge>);
        expect(container.firstChild).toHaveClass('text-neutral-700', 'border-neutral-200');
    });

    it('allows passing custom className and merges it correctly', () => {
        const customClass = 'my-custom-class';
        const { container } = render(<Badge className={customClass}>Custom</Badge>);
        expect(container.firstChild).toHaveClass(customClass);
        // Vérifie qu'il garde aussi les classes de base
        expect(container.firstChild).toHaveClass('inline-flex', 'items-center');
    });

    it('renders as a div by default and spreads props', () => {
        const { container } = render(<Badge id="test-badge" data-custom="value">Props</Badge>);
        expect(container.firstChild).toHaveAttribute('id', 'test-badge');
        expect(container.firstChild).toHaveAttribute('data-custom', 'value');
    });
});