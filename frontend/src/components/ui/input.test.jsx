import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Input } from './input';

describe('Input Component', () => {
    it('rend correctement avec les styles par défaut', () => {
        render(<Input placeholder="Entrez votre nom" />);
        const input = screen.getByPlaceholderText('Entrez votre nom');
        
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('rounded-xl', 'border-surface-border');
    });

    it('met à jour la valeur lors de la saisie', async () => {
        const user = userEvent.setup();
        render(<Input aria-label="nom-input" />);
        const input = screen.getByLabelText('nom-input');

        await user.type(input, 'Jean Dupont');
        expect(input.value).toBe('Jean Dupont');
    });

    it('respecte le type passé en propriété (ex: password)', () => {
        render(<Input type="password" placeholder="Mot de passe" />);
        const input = screen.getByPlaceholderText('Mot de passe');
        
        expect(input).toHaveAttribute('type', 'password');
    });

    it('est désactivé lorsque la prop disabled est présente', () => {
        render(<Input disabled placeholder="Indisponible" />);
        const input = screen.getByPlaceholderText('Indisponible');
        
        expect(input).toBeDisabled();
        expect(input).toHaveClass('disabled:cursor-not-allowed', 'disabled:opacity-50');
    });

    it('transmet correctement la ref à l\'élément input', () => {
        const ref = React.createRef();
        render(<Input ref={ref} />);
        
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    it('applique des classes supplémentaires via className', () => {
        render(<Input className="custom-class" placeholder="Test" />);
        const input = screen.getByPlaceholderText('Test');
        
        expect(input).toHaveClass('custom-class');
    });

    it('gère les événements focus et blur', async () => {
        const onFocus = vi.fn();
        const onBlur = vi.fn();
        render(<Input onFocus={onFocus} onBlur={onBlur} />);
        
        const input = screen.getByRole('textbox');
        
        input.focus();
        expect(onFocus).toHaveBeenCalled();
        
        input.blur();
        expect(onBlur).toHaveBeenCalled();
    });
});