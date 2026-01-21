import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { vi, expect, it, describe, beforeEach } from 'vitest';
import ProjectOverviewPage from './ProjectOverviewPage';

// --- MOCKS DE L'ENVIRONNEMENT ---

// 1. Mock IntersectionObserver (déjà fait précédemment)
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null; }
  unobserve() { return null; }
  disconnect() { return null; }
};

// 2. Mock CANVAS pour éviter l'erreur getContext()
// Cela simule le support du dessin sans installer de package lourd
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  fillRect: vi.fn(),
  clearRect: vi.fn(),
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  createImageData: vi.fn(),
  setTransform: vi.fn(),
  drawImage: vi.fn(),
  save: vi.fn(),
  restore: vi.fn(),
  beginPath: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  closePath: vi.fn(),
  stroke: vi.fn(),
  translate: vi.fn(),
  scale: vi.fn(),
  rotate: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  measureText: vi.fn(() => ({ width: 0 })),
  transform: vi.fn(),
  rect: vi.fn(),
  clip: vi.fn(),
}));

// 3. Mock du hook d'API
vi.mock('@/features/projects/api/useProjectsQuery.js', () => ({
  useProjectDetails: vi.fn()
}));

import { useProjectDetails } from '@/features/projects/api/useProjectsQuery.js';

describe('Integration Test: ProjectOverviewPage', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  const renderWithProviders = (ui) => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{ui}</MemoryRouter>
      </QueryClientProvider>
    );
  };

  it('doit afficher les détails du projet après le chargement', async () => {
    useProjectDetails.mockReturnValue({
      data: { id: '1', name: 'Projet de Test' },
      isLoading: false,
      error: null
    });

    renderWithProviders(<ProjectOverviewPage />);
    await waitFor(() => {
      expect(screen.getByText('Projet de Test')).toBeInTheDocument();
    });
  });

  it('doit afficher un état de chargement', () => {
    useProjectDetails.mockReturnValue({
      data: null,
      isLoading: true,
      error: null
    });

    renderWithProviders(<ProjectOverviewPage />);
    
    // CORRECTION : On cherche le vrai texte qui est dans ton DOM
    expect(screen.getByText(/Setting up your mission control/i)).toBeInTheDocument();
  });

  it('doit afficher un message d\'erreur si le projet est introuvable', async () => {
    useProjectDetails.mockReturnValue({
      data: null,
      isLoading: false,
      error: { message: 'Project not found' }
    });

    renderWithProviders(<ProjectOverviewPage />);
    await waitFor(() => {
      expect(screen.getByText(/Project not found/i)).toBeInTheDocument();
    });
  });
});