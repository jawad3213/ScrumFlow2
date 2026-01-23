import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RequirementUpload from './RequirementUpload';

// 1. Mock de framer-motion pour éviter les problèmes d'opacité/visibilité
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
    h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

// 2. Mock de FileDropzone avec un déclencheur manuel
vi.mock('@/components/shared/FileDropzone', () => ({
  default: ({ children, onFileSelected }) => (
    <div data-testid="dropzone">
      {children({
        isDragging: false,
        openFilePicker: () => {
          const file = new File(['content'], 'test.pdf', { type: 'application/pdf' });
          onFileSelected(file);
        }
      })}
    </div>
  ),
}));

// 3. Mock de EmptyState
vi.mock('@/components/ui/empty-state', () => ({
  EmptyState: ({ title, action }) => (
    <div>
      <h2>{title}</h2>
      <button onClick={action.onClick}>{action.label}</button>
    </div>
  ),
}));

describe('RequirementUpload', () => {
  const mockOnFileSelected = vi.fn();

  it('rend l\'état initial correctement', () => {
    render(<RequirementUpload onFileSelected={mockOnFileSelected} />);
    expect(screen.getByText(/Project Scoping/i)).toBeInTheDocument();
  });

  it('valide et affiche le fichier quand un PDF est sélectionné', async () => {
    render(<RequirementUpload onFileSelected={mockOnFileSelected} />);

    const selectButton = screen.getByRole('button', { name: /Select PDF Document/i });
    fireEvent.click(selectButton);

    // On utilise findByText car le changement d'état est asynchrone
    expect(await screen.findByText(/Scoping Document Validated/i)).toBeInTheDocument();
    expect(screen.getByText('test.pdf')).toBeInTheDocument();
  });

  it('appelle onFileSelected quand on clique sur Launch AI Analysis', async () => {
    render(<RequirementUpload onFileSelected={mockOnFileSelected} />);

    // Sélection
    fireEvent.click(screen.getByRole('button', { name: /Select PDF Document/i }));
    
    // Attendre l'apparition du bouton de lancement
    const launchButton = await screen.findByRole('button', { name: /Launch AI Analysis/i });
    fireEvent.click(launchButton);

    expect(mockOnFileSelected).toHaveBeenCalled();
  });

  it('affiche l\'état de chargement correct', () => {
    // Cas 1: Chargement sur le bouton initial
    render(<RequirementUpload onFileSelected={mockOnFileSelected} isLoading={true} />);
    expect(screen.getByText(/Analyzing.../i)).toBeInTheDocument();
  });

  it('affiche le loader sur le bouton de lancement pendant l\'analyse', async () => {
    render(<RequirementUpload onFileSelected={mockOnFileSelected} isLoading={true} />);
    
    // On force la sélection d'un fichier (en ignorant le label du bouton qui a changé)
    fireEvent.click(screen.getByRole('button', { name: /Analyzing.../i }));

    // On vérifie le texte du bouton final
    expect(await screen.findByText(/Synthesizing Blueprint.../i)).toBeInTheDocument();
  });

  it('affiche un message d\'erreur', () => {
    render(<RequirementUpload onFileSelected={mockOnFileSelected} error="Fatal Error" />);
    expect(screen.getByText(/Intelligence Engine Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Fatal Error/i)).toBeInTheDocument();
  });
});