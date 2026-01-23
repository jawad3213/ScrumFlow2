import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest'; // Ton import direct
import ConfirmDeleteModal from './ConfirmDeleteModal';

describe('ConfirmDeleteModal Component', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    onConfirm: vi.fn(),
    title: "Supprimer l'élément ?",
    description: "Cette action est irréversible.",
    confirmText: "Oui, supprimer",
    cancelText: "Annuler"
  };

  it('should render with custom title and description', () => {
    render(<ConfirmDeleteModal {...defaultProps} />);
    
    expect(screen.getByText(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Oui, supprimer/i })).toBeInTheDocument();
  });

  it('should call onOpenChange(false) when cancel button is clicked', () => {
    render(<ConfirmDeleteModal {...defaultProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /Annuler/i });
    fireEvent.click(cancelButton);
    
    expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should handle internal loading and autoClose correctly', async () => {
    const mockConfirm = vi.fn().mockResolvedValue(null);
    render(<ConfirmDeleteModal {...defaultProps} onConfirm={mockConfirm} autoClose={true} />);

    const confirmButton = screen.getByRole('button', { name: /Oui, supprimer/i });
    fireEvent.click(confirmButton);

    // Vérifie que onConfirm est appelé
    expect(mockConfirm).toHaveBeenCalled();

    // Attend que le modal se ferme automatiquement (autoClose: true)
    await waitFor(() => {
      expect(defaultProps.onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('should NOT close automatically if autoClose is false', async () => {
    const mockOpenChange = vi.fn();
    const mockConfirm = vi.fn().mockResolvedValue(null);
    
    render(
      <ConfirmDeleteModal 
        {...defaultProps} 
        onOpenChange={mockOpenChange} 
        onConfirm={mockConfirm} 
        autoClose={false} 
      />
    );

    const confirmButton = screen.getByRole('button', { name: /Oui, supprimer/i });
    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(mockConfirm).toHaveBeenCalled();
    });

    // onOpenChange ne devrait PAS avoir été appelé avec false
    expect(mockOpenChange).not.toHaveBeenCalledWith(false);
  });

 it('should be disabled and show loader if external loading is true', () => {
    render(<ConfirmDeleteModal {...defaultProps} loading={true} />);
    
    // On récupère TOUS les boutons
    const buttons = screen.getAllByRole('button');
    
    // Le bouton de confirmation est celui qui n'a pas le texte "Annuler" 
    // ou celui qui contient le spinner
    const confirmButton = buttons.find(btn => btn.querySelector('.animate-spin'));
    const cancelButton = screen.getByRole('button', { name: /Annuler/i });

    expect(confirmButton).toBeDisabled();
    expect(cancelButton).toBeDisabled();
    expect(confirmButton).toContainElement(document.querySelector('.animate-spin'));
});
});