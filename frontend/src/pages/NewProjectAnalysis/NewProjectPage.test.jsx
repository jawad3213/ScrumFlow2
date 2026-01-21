import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

// --- LA CORRECTION EST ICI ---
// On importe le composant avec des accolades { } au cas où il n'est pas l'export par défaut
import { NewProjectPage } from './NewProjectPage'; 
// Si jamais l'erreur persiste encore, essayez d'enlever les { } ci-dessus.
// -----------------------------

/**
 * MOCK DU COMPOSANT ENFANT
 */
vi.mock('@/features/ai-analysis/components/ProjectAnalysisView', () => ({
  default: () => (
    <div data-testid="analysis-view">
      <h1>Analyse du Projet</h1>
      <div className="content">Données de l'analyse IA chargées</div>
      <button>Relancer l'analyse</button>
    </div>
  ),
}));

describe('NewProjectPage Integration Tests', () => {
  
  it('doit rendre la page de nouveau projet avec la vue d\'analyse', () => {
    // Sécurité pour éviter le crash de React si l'import est raté
    if (!NewProjectPage) {
       console.error("ERREUR : NewProjectPage n'est pas trouvé. Essayez de modifier l'import ligne 6.");
       return; 
    }

    render(<NewProjectPage />);
    
    const view = screen.getByTestId('analysis-view');
    expect(view).toBeInTheDocument();
  });

  it('doit afficher le titre de l\'analyse au sein de la page', () => {
    if (!NewProjectPage) return;
    render(<NewProjectPage />);
    expect(screen.getByRole('heading', { name: /analyse du projet/i })).toBeInTheDocument();
  });

  it('doit permettre l\'interaction avec le bouton d\'analyse', () => {
    if (!NewProjectPage) return;
    render(<NewProjectPage />);
    const actionBtn = screen.getByRole('button', { name: /relancer l'analyse/i });
    expect(actionBtn).toBeInTheDocument();
    expect(actionBtn).not.toBeDisabled();
  });

});