/**
 * @vitest-environment jsdom
 */
/* eslint-disable no-undef */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// 1. Mock de Framer Motion (Hoisted pour éviter ReferenceError)
const { motionMock } = vi.hoisted(() => {
    const Mock = (tag) => ({ children, ...props }) => React.createElement(tag, props, children);
    return {
        motionMock: {
            div: Mock('div'),
            span: Mock('span'),
        }
    };
});

Object.defineProperty(global, 'motion', { value: motionMock });

vi.mock('framer-motion', () => ({
    motion: motionMock,
    AnimatePresence: ({ children }) => children,
}));

// 2. Mock des icônes Lucide
vi.mock('lucide-react', () => ({
    Key: () => <div data-testid="icon-key" />,
    AlertCircle: () => <div data-testid="icon-alert" />,
    ChevronRight: () => <div data-testid="icon-chevron" />,
}));

import { render, screen, fireEvent } from '@testing-library/react';
import GeminiAuth from './GeminiAuth';

describe('GeminiAuth Component', () => {
    const defaultProps = {
        apiKey: '',
        onKeyChange: vi.fn(),
        onNext: vi.fn(),
        validationError: false,
        shakeControls: {}
    };

    it('doit afficher le champ de saisie de la clé API', () => {
        render(<GeminiAuth {...defaultProps} />);
        
        expect(screen.getByText(/Gemini Pro API Key/i)).toBeDefined();
        expect(screen.getByPlaceholderText(/Paste your key here/i)).toBeDefined();
    });

    it('doit appeler onKeyChange lorsque l’utilisateur tape une clé', () => {
        const onKeyChange = vi.fn();
        render(<GeminiAuth {...defaultProps} onKeyChange={onKeyChange} />);
        
        const input = screen.getByPlaceholderText(/Paste your key here/i);
        fireEvent.change(input, { target: { value: 'ma-super-cle-123' } });
        
        expect(onKeyChange).toHaveBeenCalledWith('ma-super-cle-123');
    });

    it('doit afficher un message d’erreur si validationError est vrai', () => {
        render(<GeminiAuth {...defaultProps} validationError={true} />);
        
        // Vérifie si le texte "Required" s'affiche
        expect(screen.getByText(/Required/i)).toBeDefined();
        
        // Vérifie si l'input a les classes CSS de bordure rouge
        const input = screen.getByPlaceholderText(/Paste your key here/i);
        expect(input.className).toContain('border-red-200');
    });

    it('doit afficher la valeur de la clé fournie dans les props', () => {
        render(<GeminiAuth {...defaultProps} apiKey="cle-existante" />);
        
        const input = screen.getByPlaceholderText(/Paste your key here/i);
        expect(input.value).toBe('cle-existante');
    });
});