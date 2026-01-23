import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AddSpecializationModal from './AddSpecializationModal';

// 1. MOCKS API & CONSTANTES
// Utilisation de fonctions de retour propres pour éviter l'avertissement Vitest
vi.mock('@/features/team/api/specializations', () => ({
  createSpecialization: vi.fn().mockImplementation(() => Promise.resolve({ success: true })),
}));

vi.mock('@/utils/constants', () => ({
  ALL_ROLES: ['Fullstack Developer'],
  ROLE_LEVELS: { 'Fullstack Developer': ['Junior', 'Senior'] },
}));

// 2. POLYFILLS (Correction du ResizeObserver Constructor)
beforeEach(() => {
  HTMLElement.prototype.scrollIntoView = vi.fn();
  HTMLElement.prototype.hasPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();

  // Correction ici : On utilise une classe pour le constructeur
  global.ResizeObserver = class ResizeObserver {
    observe() { }
    unobserve() { }
    disconnect() { }
  };
});

describe('AddSpecializationModal', () => {
  it('doit afficher une erreur si le salaire est vide', async () => {
    const user = userEvent.setup();
    render(<AddSpecializationModal />);

    // 1. Ouvrir la modal
    const openBtn = screen.getByRole('button', { name: /Add Role/i });
    await user.click(openBtn);

    // 2. Désactiver la validation HTML5 native
    const form = screen.getByRole('dialog').querySelector('form');
    if (form) form.setAttribute('noValidate', 'true');

    // 3. Sélectionner le Rôle
    const roleTrigger = screen.getAllByRole('combobox')[0];
    fireEvent.click(roleTrigger);

    const roleOption = await screen.findByRole('option', { name: 'Fullstack Developer' });
    fireEvent.click(roleOption);

    // 4. Sélectionner le Niveau
    // On attend que l'état React débloque le champ
    await waitFor(() => {
      const levelTrigger = screen.getAllByRole('combobox')[1];
      expect(levelTrigger).not.toBeDisabled();
    });

    const levelTrigger = screen.getAllByRole('combobox')[1];
    fireEvent.click(levelTrigger);
    const levelOption = await screen.findByRole('option', { name: 'Junior' });
    fireEvent.click(levelOption);

    // 5. Soumission
    const submitBtn = screen.getByRole('button', { name: /Create Role/i });
    fireEvent.click(submitBtn);

    // 6. Vérification du message d'erreur
    // On cherche spécifiquement le texte complet de l'erreur pour ne pas confondre avec le label du champ
    const errorMessage = await screen.findByText(/Please enter a valid salary amount/i);
    expect(errorMessage).toBeInTheDocument();
    // Optionnel : vérifier qu'il a le style d'une erreur (si vous utilisez des classes spécifiques)
    expect(errorMessage).toHaveClass('text-danger-darker');
  });
});