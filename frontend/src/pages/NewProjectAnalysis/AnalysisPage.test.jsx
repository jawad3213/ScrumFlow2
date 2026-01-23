import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AnalysisPage from './AnalysisPage';

/**
 * MOCK DU COMPOSANT ENFANT
 * Si ProjectAnalysisView est très complexe (appels API, graphiques lourds),
 * on simule son comportement pour tester l'intégration au niveau de la page.
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

describe('AnalysisPage Integration Tests', () => {
  
  it('doit rendre la page d\'analyse sans erreur', () => {
    render(<AnalysisPage />);
    
    // Vérifie que le composant enfant est présent
    const view = screen.getByTestId('analysis-view');
    expect(view).toBeInTheDocument();
  });

  it('doit afficher les éléments structurels de l\'analyse', () => {
    render(<AnalysisPage />);
    
    // Vérifie que le titre principal est présent
    expect(screen.getByRole('heading', { name: /analyse du projet/i })).toBeInTheDocument();
    
    // Vérifie qu'un élément de contenu attendu est là
    expect(screen.getByText(/données de l'analyse ia chargées/i)).toBeInTheDocument();
  });

  it('doit posséder un bouton pour interagir avec l\'analyse', () => {
    render(<AnalysisPage />);
    
    const actionBtn = screen.getByRole('button', { name: /relancer l'analyse/i });
    expect(actionBtn).toBeInTheDocument();
    expect(actionBtn).not.toBeDisabled();
  });

});