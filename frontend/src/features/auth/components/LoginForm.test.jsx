import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import * as utils from '@/utils'; // Pour pouvoir espionner isValidEmail

vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('LoginForm', () => {
  const mockLogin = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    useAuth.mockReturnValue({ login: mockLogin });
  });

  const renderForm = () => render(<LoginForm />, { wrapper: BrowserRouter });

  it('valide l\'email avant de tenter la connexion', async () => {
    vi.spyOn(utils, 'isValidEmail').mockReturnValue(false);
    renderForm();

    const emailInput = screen.getByPlaceholderText(/example@gmail.com/i);
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });

    // On soumet le formulaire directement
    fireEvent.submit(screen.getByRole('button', { name: /Log in Now/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('affiche un message d\'erreur si les identifiants sont incorrects', async () => {
    const apiError = 'Invalid credentials';
    mockLogin.mockRejectedValueOnce(apiError);
    vi.spyOn(utils, 'isValidEmail').mockReturnValue(true);
    
    renderForm();

    fireEvent.change(screen.getByPlaceholderText(/example@gmail.com/i), { target: { value: 'wrong@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password' } });
    
    fireEvent.submit(screen.getByRole('button', { name: /Log in Now/i }).closest('form'));

    await waitFor(() => {
      expect(screen.getByText(apiError)).toBeInTheDocument();
    });
  });

  it('affiche le loader et désactive le bouton pendant la soumission', async () => {
    vi.spyOn(utils, 'isValidEmail').mockReturnValue(true);
    // On simule une promesse qui ne se résout jamais pour rester en état "loading"
    mockLogin.mockReturnValue(new Promise(() => {})); 
    
    renderForm();

    // Remplir les champs pour permettre la soumission
    fireEvent.change(screen.getByPlaceholderText(/example@gmail.com/i), { target: { value: 'test@test.com' } });
    fireEvent.change(screen.getByPlaceholderText(/••••••••/i), { target: { value: 'password123' } });
    
    // Cliquer sur le bouton de soumission (qui a encore son nom "Log in Now" à ce moment-là)
    const submitButton = screen.getByRole('button', { name: /Log in Now/i });
    fireEvent.click(submitButton);

    // 1. Vérifier que le bouton est maintenant désactivé
    // On utilise queryByRole pour éviter l'erreur "multiple elements"
    // ou on cible par type submit.
    await waitFor(() => {
      const busyButton = screen.getAllByRole('button').find(btn => btn.type === 'submit');
      expect(busyButton).toBeDisabled();
    });

    // 2. Vérifier la présence du loader (icône Lucide avec animate-spin)
    const loader = document.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();
  });
});