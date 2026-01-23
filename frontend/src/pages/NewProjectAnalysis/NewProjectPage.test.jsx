import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import NewProjectPage from './NewProjectPage';

/**
 * MOCK DU COMPOSANT ENFANT (ProjectGenesisWizard)
 */
vi.mock('@/features/ai-analysis/components/ProjectGenesisWizard', () => ({
  default: () => (
    <div data-testid="genesis-wizard">
      <h1>Analyse du Projet</h1>
      <div className="content">Données de l'analyse IA chargées</div>
      <button>Relancer l'analyse</button>
    </div>
  ),
}));

describe('NewProjectPage Integration Tests', () => {

  it('doit rendre la page de nouveau projet avec le wizard', () => {
    render(
      <MemoryRouter>
        <NewProjectPage />
      </MemoryRouter>
    );

    const view = screen.getByTestId('genesis-wizard');
    expect(view).toBeInTheDocument();
  });

  it('doit afficher le titre de l\'analyse au sein de la page', () => {
    render(
      <MemoryRouter>
        <NewProjectPage />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: /analyse du projet/i })).toBeInTheDocument();
  });

  it('doit permettre l\'interaction avec le bouton d\'analyse', () => {
    render(
      <MemoryRouter>
        <NewProjectPage />
      </MemoryRouter>
    );
    const actionBtn = screen.getByRole('button', { name: /relancer l'analyse/i });
    expect(actionBtn).toBeInTheDocument();
    expect(actionBtn).not.toBeDisabled();
  });

});