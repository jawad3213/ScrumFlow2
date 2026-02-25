import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import LoadingAnimation from './loading-animation';

// Mock de la bibliothèque Lottie car JSDOM ne supporte pas le rendu complexe/canvas
vi.mock('@lottiefiles/dotlottie-react', () => ({
    DotLottieReact: (props) => <div data-testid="lottie-mock" {...props} />
}));

describe('LoadingAnimation Component', () => {
    it('affiche le message par défaut correctement', () => {
        render(<LoadingAnimation />);
        expect(screen.getByText('Almost there... Just a moment')).toBeInTheDocument();
    });

    it('affiche un message personnalisé', () => {
        const customMessage = "Chargement en cours...";
        render(<LoadingAnimation message={customMessage} />);
        expect(screen.getByText(customMessage)).toBeInTheDocument();
    });

    it('ne rend pas de paragraphe si le message est vide', () => {
        const { container } = render(<LoadingAnimation message="" />);
        // Vérifie qu'aucun élément <p> n'est présent
        expect(container.querySelector('p')).not.toBeInTheDocument();
    });

    it('configure correctement le composant Lottie', () => {
        render(<LoadingAnimation />);
        const lottie = screen.getByTestId('lottie-mock');
        
        // Vérifie que les props essentielles sont passées à Lottie
        expect(lottie).toHaveAttribute('src', expect.stringContaining('kRsMetvmWB.lottie'));
        // Dans le mock, les booléens deviennent des chaînes si passés tels quels
        expect(lottie.getAttribute('loop')).toBeDefined();
        expect(lottie.getAttribute('autoplay')).toBeDefined();
    });

    it('applique la classe personnalisée au conteneur', () => {
        const { container } = render(<LoadingAnimation className="w-96" />);
        // Le premier enfant est la div de wrapping
        expect(container.firstChild).toHaveClass('w-96');
    });
});