import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ResetPasswordSuccess from './ResetPasswordSuccess';

describe('ResetPasswordSuccess', () => {
  // Helper pour rendre le composant avec le Router nécessaire pour le composant <Link>
  const renderComponent = () => {
    return render(
      <BrowserRouter>
        <ResetPasswordSuccess />
      </BrowserRouter>
    );
  };

  it('affiche le message de succès et le titre', () => {
    renderComponent();
    
    // Vérifie le titre principal
    expect(screen.getByText(/Password Reset!/i)).toBeInTheDocument();
    
    // Vérifie le texte de description
    expect(screen.getByText(/successfully updated/i)).toBeInTheDocument();
  });

  it('affiche une icône de succès (Check)', () => {
    const { container } = renderComponent();
    
    // On cherche l'élément SVG Lucide (Check)
    const icon = container.querySelector('.lucide-check');
    expect(icon).toBeInTheDocument();
    
    // Vérifie que le conteneur de l'icône a la classe de succès
    const iconWrapper = icon.closest('div');
    expect(iconWrapper).toHaveClass('bg-success-lighter');
  });

  it('contient un lien vers la page de login', () => {
    renderComponent();
    
    const loginLink = screen.getByRole('link', { name: /go to login/i });
    
    // Vérifie que le lien pointe vers la bonne URL
    expect(loginLink).toHaveAttribute('href', '/login');
    
    // Vérifie le style visuel (bouton de succès)
    expect(loginLink).toHaveClass('bg-success-default');
  });

  it('possède les classes d’animation pour l’entrée en scène', () => {
    renderComponent();
    
    const container = screen.getByText(/Password Reset!/i).closest('div');
    
    // Vérifie la présence des classes Tailwind animate-in (provenant de tailwindcss-animate)
    expect(container).toHaveClass('animate-in');
    expect(container).toHaveClass('fade-in');
    expect(container).toHaveClass('slide-in-from-bottom-4');
  });
});