import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UpdatePasswordForm from './UpdatePasswordForm';
import { updatePassword } from '@/features/auth/api/profile';

// Mock de l'API
vi.mock('@/features/auth/api/profile', () => ({
  updatePassword: vi.fn(),
}));

// Mock de window.alert
const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

describe('UpdatePasswordForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers(); // Toujours revenir aux vrais timers après chaque test
  });

  it('affiche correctement tous les éléments du formulaire', () => {
    render(<UpdatePasswordForm />);
    expect(screen.getByText(/Current Password/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it('affiche une alerte si les mots de passe ne correspondent pas', async () => {
    render(<UpdatePasswordForm />);
    
    fireEvent.change(screen.getByPlaceholderText(/Min 8 chars/i), { target: { value: 'Pass1' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm new password/i), { target: { value: 'Pass2' } });
    
    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

    expect(alertMock).toHaveBeenCalledWith("Passwords don't match");
  });

  it('appelle l API et affiche le succès avec des données valides', async () => {
    // Utilisation des vrais timers pour ce test pour éviter le timeout
    vi.useRealTimers();
    updatePassword.mockResolvedValueOnce({ status: 'success' });
    
    render(<UpdatePasswordForm />);

    const currentInput = screen.getByPlaceholderText("••••••••");
    const newInput = screen.getByPlaceholderText(/Min 8 chars/i);
    const confirmInput = screen.getByPlaceholderText(/Confirm new password/i);

    fireEvent.change(currentInput, { target: { value: 'old-pass' } });
    fireEvent.change(newInput, { target: { value: 'new-pass-123' } });
    fireEvent.change(confirmInput, { target: { value: 'new-pass-123' } });

    fireEvent.click(screen.getByRole('button', { name: /Change Password/i }));

    // On attend que l'API soit appelée
    await waitFor(() => {
      expect(updatePassword).toHaveBeenCalled();
    });

    // On vérifie le message de succès
    expect(await screen.findByText(/Password updated successfully/i)).toBeInTheDocument();
    expect(currentInput.value).toBe('');
  });

  it('désactive le bouton pendant le chargement', async () => {
    vi.useRealTimers();
    // On crée une promesse qui ne se résout pas immédiatement
    updatePassword.mockReturnValue(new Promise((resolve) => setTimeout(resolve, 500)));
    
    render(<UpdatePasswordForm />);
    const submitBtn = screen.getByRole('button', { name: /Change Password/i });

    fireEvent.change(screen.getByPlaceholderText(/Min 8 chars/i), { target: { value: 'abcyour_db_password' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm new password/i), { target: { value: 'abcyour_db_password' } });

    fireEvent.click(submitBtn);

    expect(submitBtn).toBeDisabled();
    expect(submitBtn).toHaveTextContent(/Changing.../i);
  });
});