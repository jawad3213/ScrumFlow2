import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Button } from './button';

describe('Button Component', () => {
    it('renders correctly with default styles', () => {
        render(<Button>Cliquez-moi</Button>);
        const button = screen.getByRole('button', { name: /cliquez-moi/i });
        
        expect(button).toBeInTheDocument();
        // Vérifie les classes par défaut (CVA)
        expect(button).toHaveClass('bg-brand-primary-500', 'text-white');
    });

    it('applies the correct classes for different variants', () => {
        const { rerender } = render(<Button variant="destructive">Supprimer</Button>);
        expect(screen.getByRole('button')).toHaveClass('bg-danger-default');

        rerender(<Button variant="outline">Annuler</Button>);
        expect(screen.getByRole('button')).toHaveClass('border', 'bg-white');
    });

    it('applies the correct classes for different sizes', () => {
        render(<Button size="sm">Petit</Button>);
        expect(screen.getByRole('button')).toHaveClass('h-8', 'text-xs');
    });

    it('calls onClick when clicked', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(<Button onClick={onClick}>Action</Button>);
        
        await user.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled and non-clickable when disabled prop is true', async () => {
        const onClick = vi.fn();
        render(<Button disabled onClick={onClick}>Bloqué</Button>);
        
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:opacity-50');
        
        fireEvent.click(button);
        expect(onClick).not.toHaveBeenCalled();
    });

    it('renders as a different element when asChild is true', () => {
        render(
            <Button asChild>
                <a href="/test">Lien Bouton</a>
            </Button>
        );
        
        // Il ne doit plus y avoir de balise <button>
        const link = screen.getByRole('link', { name: /lien bouton/i });
        expect(link).toBeInTheDocument();
        expect(link).toHaveAttribute('href', '/test');
        // Mais il doit garder les classes de style du bouton
        expect(link).toHaveClass('bg-brand-primary-500');
    });

    it('correctly forwards the ref', () => {
        const ref = React.createRef();
        render(<Button ref={ref}>Ref Test</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
});