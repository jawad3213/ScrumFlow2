import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import AuthLayout from './AuthLayout';

// Helper pour wrapper le composant avec le Router nécessaire pour <Link>
const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('AuthLayout', () => {
  const defaultProps = {
    title: "Connexion",
    subtitle: "Accédez à votre espace",
    illustration: "test-img.png",
    children: <div data-testid="child-form">Formulaire Test</div>
  };

  beforeEach(() => {
    cleanup();
  });

  it('affiche correctement le titre et le sous-titre', () => {
    renderWithRouter(<AuthLayout {...defaultProps} />);

    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.subtitle)).toBeInTheDocument();
  });

  it('rend les composants enfants (children) à l\'intérieur du conteneur de formulaire', () => {
    renderWithRouter(<AuthLayout {...defaultProps} />);

    expect(screen.getByTestId('child-form')).toBeInTheDocument();
  });

  it('affiche l\'illustration par défaut avec les bonnes propriétés', () => {
    renderWithRouter(<AuthLayout {...defaultProps} illustrationAlt="Alt Image" />);

    const img = screen.getByAltText("Alt Image");
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toBe("test-img.png");
  });

  it('affiche illustrationContent au lieu de l\'image si la prop est fournie', () => {
    const customContent = <div data-testid="custom-illustration">Animation 3D</div>;
    renderWithRouter(
      <AuthLayout {...defaultProps} illustrationContent={customContent} />
    );

    // Le contenu personnalisé doit être présent
    expect(screen.getByTestId('custom-illustration')).toBeInTheDocument();

    // L'image d'illustration par défaut ne doit PAS être présente
    const defaultImg = screen.queryByAltText("Illustration");
    expect(defaultImg).not.toBeInTheDocument();
  });

  it('le lien du logo pointe vers le bon chemin par défaut', () => {
    renderWithRouter(<AuthLayout {...defaultProps} />);

    // On cherche le lien qui enveloppe l'image du logo (il y a aussi le lien "Accueil")
    const links = screen.getAllByRole('link');
    const logoLink = links.find(link => link.querySelector('img[alt="growtrack Logo"]'));
    expect(logoLink).toBeTruthy();
    expect(logoLink.getAttribute('href')).toBe('/login');
  });

  it('le lien du logo accepte un chemin personnalisé via logoPath', () => {
    renderWithRouter(<AuthLayout {...defaultProps} logoPath="/register" />);

    const links = screen.getAllByRole('link');
    const logoLink = links.find(link => link.querySelector('img[alt="growtrack Logo"]'));
    expect(logoLink).toBeTruthy();
    expect(logoLink.getAttribute('href')).toBe('/register');
  });

  it('masque la colonne d\'illustration sur les petits écrans (classe CSS)', () => {
    const { container } = renderWithRouter(<AuthLayout {...defaultProps} />);

    // The "Back to Home" Link is at index 0, form column at index 1, illustration at index 2
    const rightColumn = container.firstChild.childNodes[2];

    // Vérifie la présence de la classe Tailwind 'hidden lg:flex'
    expect(rightColumn.className).toContain('hidden');
    expect(rightColumn.className).toContain('lg:flex');
  });
});