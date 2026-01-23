import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import StaffingStrategy from './StaffingStrategy';

// Mock de framer-motion pour éviter les erreurs d'animation
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

describe('StaffingStrategy', () => {
  const mockOnSelect = vi.fn();
  const defaultProps = {
    selected: 'internal',
    onSelect: mockOnSelect,
    team1Img: 'team1.png',
    teamChecklistImg: 'checklist.png',
  };

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('affiche les deux stratégies de recrutement', () => {
    render(<StaffingStrategy {...defaultProps} />);
    
    expect(screen.getByText(/Leverage Internal Talent/i)).toBeInTheDocument();
    expect(screen.getByText(/Dynamic Unit Assembly/i)).toBeInTheDocument();
  });

  it('appelle onSelect avec "custom" lorsque la deuxième carte est cliquée', () => {
    render(<StaffingStrategy {...defaultProps} />);
    
    const customCard = screen.getByText(/Dynamic Unit Assembly/i).closest('div').parentElement;
    fireEvent.click(customCard);

    expect(mockOnSelect).toHaveBeenCalledWith('custom');
  });

  it('affiche l\'icône de validation (Check) uniquement sur l\'élément sélectionné', () => {
    const { container } = render(<StaffingStrategy {...defaultProps} selected="internal" />);
    
    // Le badge de sélection contient l'icône Lucide Check
    // On vérifie la présence du badge via la classe CSS ou l'élément svg
    const checkIcon = container.querySelector('svg.lucide-check');
    expect(checkIcon).toBeInTheDocument();
    
    // On vérifie que le conteneur de la carte sélectionnée a les styles spécifiques
    const internalCard = screen.getByText(/Leverage Internal Talent/i).closest('div').parentElement;
    expect(internalCard.className).toContain('border-brand-primary-500');
  });

  it('applique les styles de désactivation (grayscale) sur l\'élément non sélectionné', () => {
    render(<StaffingStrategy {...defaultProps} selected="internal" />);
    
    // L'image de la stratégie "custom" devrait avoir la classe grayscale car non sélectionnée
    const customImage = screen.getByAltText(/Dynamic Unit Assembly/i);
    const imageContainer = customImage.parentElement;
    
    expect(imageContainer.className).toContain('grayscale');
  });

  it('affiche les images passées en props correctement', () => {
    render(<StaffingStrategy {...defaultProps} />);
    
    const img1 = screen.getByAltText(/Leverage Internal Talent/i);
    const img2 = screen.getByAltText(/Dynamic Unit Assembly/i);
    
    expect(img1.getAttribute('src')).toBe('checklist.png');
    expect(img2.getAttribute('src')).toBe('team1.png');
  });
});