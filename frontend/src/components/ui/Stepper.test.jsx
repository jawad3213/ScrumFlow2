import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { Stepper } from './stepper';

describe('Stepper Component', () => {
    const steps = ['Profil', 'Paiement', 'Confirmation'];

    it('affiche toutes les étapes fournies', () => {
        render(<Stepper steps={steps} currentStep={1} />);
        
        steps.forEach(step => {
            expect(screen.getByText(step)).toBeInTheDocument();
        });
    });

    it('identifie correctement l’étape active', () => {
        render(<Stepper steps={steps} currentStep={2} />);
        
        // L'étape 2 (Paiement) doit être active
        const stepTwoLabel = screen.getByText('Paiement');
        expect(stepTwoLabel).toHaveClass('text-brand-primary-600');
        
        // Le numéro 2 doit être visible (pas encore de checkmark)
        expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('affiche une icône Check pour les étapes complétées', () => {
        const { container } = render(<Stepper steps={steps} currentStep={2} />);
        
        // L'étape 1 est complétée, elle doit contenir un SVG (lucide-check)
        // On cherche l'élément qui contient le label de l'étape 1
        const firstStepCircle = screen.getByText('Profil').closest('.relative').querySelector('svg');
        expect(firstStepCircle).toBeInTheDocument();
        
        // Le chiffre "1" ne doit plus être présent car remplacé par le Check
        expect(screen.queryByText('1')).not.toBeInTheDocument();
    });

    it('calcule la largeur correcte de la barre de progression', () => {
        const { container } = render(<Stepper steps={steps} currentStep={2} />);
        
        // Il y a 3 étapes, donc la barre entre 1 et 2 devrait être à 50%
        // (currentStep - 1) / (steps.length - 1) = (2-1) / (3-1) = 1/2 = 50%
        const progressBar = container.querySelector('.bg-brand-primary-500');
        expect(progressBar).toHaveStyle({ width: '50%' });
    });

    it('affiche les étapes futures en style neutre/grisé', () => {
        render(<Stepper steps={steps} currentStep={1} />);
        
        const futureStepLabel = screen.getByText('Confirmation');
        expect(futureStepLabel).toHaveClass('text-neutral-400');
        
        const futureNumber = screen.getByText('3');
        expect(futureNumber.parentElement).toHaveClass('border-neutral-200');
    });
});