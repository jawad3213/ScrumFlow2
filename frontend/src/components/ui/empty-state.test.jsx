import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { EmptyState } from './empty-state';
import { Mail, Bell, Settings } from 'lucide-react';

describe('EmptyState Component', () => {
    const defaultProps = {
        title: "Aucun message",
        description: "Votre boîte de réception est vide.",
    };

    it('affiche correctement le titre et la description', () => {
        render(<EmptyState {...defaultProps} />);
        
        expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
        expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    });

    it('rend une seule icône quand une seule est fournie', () => {
        // On passe un composant Lucide-react comme icône
        const { container } = render(
            <EmptyState {...defaultProps} icons={[Mail]} />
        );
        
        // On vérifie qu'un seul SVG est rendu
        const svgs = container.querySelectorAll('svg');
        expect(svgs).toHaveLength(1);
    });

    it('rend exactement trois icônes avec la mise en page spécifique', () => {
        const { container } = render(
            <EmptyState {...defaultProps} icons={[Mail, Bell, Settings]} />
        );
        
        const svgs = container.querySelectorAll('svg');
        expect(svgs).toHaveLength(3);
    });

    it('appelle la fonction onClick lors du clic sur le bouton d\'action', () => {
        const handleClick = vi.fn();
        const action = { label: "CRÉER UN DOSSIER", onClick: handleClick };
        
        render(<EmptyState {...defaultProps} action={action} />);
        
        const button = screen.getByRole('button', { name: /créer un dossier/i });
        fireEvent.click(button);
        
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('ne rend pas de bouton si aucune action n\'est fournie', () => {
        render(<EmptyState {...defaultProps} />);
        const button = screen.queryByRole('button');
        expect(button).not.toBeInTheDocument();
    });

    it('applique la classe personnalisée passée en prop', () => {
        const customClass = "mt-10";
        const { container } = render(
            <EmptyState {...defaultProps} className={customClass} />
        );
        
        // container.firstChild est le motion.div
        expect(container.firstChild).toHaveClass(customClass);
    });
});