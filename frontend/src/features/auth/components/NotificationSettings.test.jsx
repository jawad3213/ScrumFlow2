import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import NotificationSettings from './NotificationSettings';

describe('NotificationSettings', () => {
  beforeEach(() => {
    cleanup();
  });

  it('affiche le titre correct', () => {
    render(<NotificationSettings />);
    const title = screen.getByText(/Notification Settings/i);
    expect(title).toBeInTheDocument();
    expect(title.tagName).toBe('H3');
  });

  it('affiche le message "Coming soon"', () => {
    render(<NotificationSettings />);
    const paragraph = screen.getByText(/Coming soon!/i);
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveTextContent("You'll be able to manage your email and push notification preferences here.");
  });

  it('rend l\'icône de cloche (Bell)', () => {
    const { container } = render(<NotificationSettings />);
    
    // Lucide-react rend des SVG. On vérifie la présence de la classe lucide-bell
    const icon = container.querySelector('.lucide-bell');
    expect(icon).toBeInTheDocument();
    
    // Vérification optionnelle des classes de style sur le conteneur de l'icône
    const iconContainer = icon.closest('div');
    expect(iconContainer).toHaveClass('bg-brand-primary-50');
  });

  it('possède les classes de mise en page centrée', () => {
    const { container } = render(<NotificationSettings />);
    const mainDiv = container.firstChild;
    
    // Vérifie que le composant est bien centré (utile pour un placeholder)
    expect(mainDiv).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });
});