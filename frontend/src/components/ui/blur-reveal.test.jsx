import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { BlurReveal } from './blur-reveal';

// Utilisation d'une classe réelle pour garantir le support du mot-clé 'new'
global.IntersectionObserver = class IntersectionObserver {
    constructor(callback) {
        this.callback = callback;
    }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
};

describe('BlurReveal Component', () => {
    it('renders children correctly', () => {
        render(<BlurReveal>Texte animé</BlurReveal>);
        expect(screen.getByText('Texte animé')).toBeInTheDocument();
    });

    it('has correct initial styles for animation', () => {
        render(<BlurReveal>Initial</BlurReveal>);
        const element = screen.getByText('Initial');
        
        // Framer Motion applique l'opacité 0 initialement
        expect(element).toHaveStyle({
            opacity: 0,
            display: 'inline-block'
        });
    });

    it('applies the provided className', () => {
        const customClass = "test-class-reveal";
        render(<BlurReveal className={customClass}>Class Test</BlurReveal>);
        expect(screen.getByText('Class Test')).toHaveClass(customClass);
    });

    it('renders as a span element', () => {
        render(<BlurReveal>Span Test</BlurReveal>);
        expect(screen.getByText('Span Test').tagName).toBe('SPAN');
    });
});