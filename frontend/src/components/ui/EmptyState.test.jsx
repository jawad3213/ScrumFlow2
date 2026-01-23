import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import EmptyState from './EmptyState'; // Vérifiez le chemin et la casse
import { FolderPlus } from 'lucide-react';

describe('EmptyState Component V2', () => {
    it('affiche les textes par défaut si aucune prop n\'est passée', () => {
        render(<EmptyState />);
        
        expect(screen.getByText('No data available')).toBeInTheDocument();
        expect(screen.getByText('Get started by creating your first entry.')).toBeInTheDocument();
    });

    it('affiche une image si la prop image est fournie', () => {
        const testImage = "https://example.com/illustration.png";
        render(<EmptyState image={testImage} title="Test Image" />);
        
        const img = screen.getByAltText('Test Image');
        expect(img).toBeInTheDocument();
        expect(img).toHaveAttribute('src', testImage);
    });

    it('affiche l\'icône si aucune image n\'est fournie', () => {
        // On passe le composant d'icône Lucide
        const { container } = render(<EmptyState icon={FolderPlus} />);
        
        // On cherche le SVG à l'intérieur de la div de l'icône
        const svg = container.querySelector('svg');
        expect(svg).toBeInTheDocument();
        // Vérifie la classe de couleur définie dans le composant
        expect(svg).toHaveClass('text-brand-primary-500');
    });

    it('affiche un placeholder gris si ni image ni icône ne sont fournis', () => {
        const { container } = render(<EmptyState icon={null} image={null} />);
        
        // Recherche la div de placeholder (bg-neutral-100)
        const placeholder = container.querySelector('.bg-neutral-100');
        expect(placeholder).toBeInTheDocument();
    });

    it('rend le bouton d\'action et réagit au clic', () => {
        const onActionMock = vi.fn();
        render(
            <EmptyState 
                onAction={onActionMock} 
                actionLabel="Ajouter un projet" 
            />
        );
        
        const button = screen.getByRole('button', { name: /ajouter un projet/i });
        expect(button).toBeInTheDocument();
        
        fireEvent.click(button);
        expect(onActionMock).toHaveBeenCalledTimes(1);
    });

    it('ne rend pas le bouton si onAction est absent', () => {
        render(<EmptyState onAction={undefined} />);
        const button = screen.queryByRole('button');
        expect(button).not.toBeInTheDocument();
    });
});