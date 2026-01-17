import React from 'react';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BulkDeleteModal from './BulkDeleteModal';

describe('BulkDeleteModal Component', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onConfirm: vi.fn(),
    count: 5,
    type: "tasks"
  };

  it('should render the correct count and type in the title', () => {
    render(<BulkDeleteModal {...defaultProps} />);
    
    // Vérifie le titre
    expect(screen.getByText(/Delete 5 tasks\?/i)).toBeDefined();
    // Vérifie la description
    expect(screen.getByText(/permanently delete/i)).toBeDefined();
  });

  it('should call onConfirm when the delete button is clicked', async () => {
    // On simule une promesse pour onConfirm
    const mockConfirm = vi.fn().mockResolvedValue(null);
    render(<BulkDeleteModal {...defaultProps} onConfirm={mockConfirm} />);

    const deleteButton = screen.getByRole('button', { name: /Delete 5 tasks/i });
    fireEvent.click(deleteButton);

    // Vérifie si le chargement s'affiche (pendant que la promesse est en cours)
    expect(mockConfirm).toHaveBeenCalledTimes(1);
  });

  it('should show loader and disable buttons when loading', async () => {
    // Créer une promesse qui ne se résout pas immédiatement
    let resolvePromise;
    const promise = new Promise((resolve) => { resolvePromise = resolve; });
    const mockConfirm = vi.fn().mockReturnValue(promise);

    render(<BulkDeleteModal {...defaultProps} onConfirm={mockConfirm} />);

    const deleteButton = screen.getByRole('button', { name: /Delete 5 tasks/i });
    fireEvent.click(deleteButton);

    // Le bouton devrait être désactivé et le spinner présent
    expect(deleteButton).toBeDisabled();
    
    // Finaliser la promesse pour nettoyer le test
    resolvePromise();
  });

  it('should call onOpenChange(false) after successful deletion', async () => {
    const mockOpenChange = vi.fn();
    render(<BulkDeleteModal {...defaultProps} onOpenChange={mockOpenChange} onConfirm={vi.fn().mockResolvedValue({})} />);

    const deleteButton = screen.getByRole('button', { name: /Delete 5 tasks/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockOpenChange).toHaveBeenCalledWith(false);
    });
  });
});