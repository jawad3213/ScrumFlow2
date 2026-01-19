import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ForgotPasswordForm from './ForgotPasswordForm';
import { forgotPassword } from '@/features/auth/api/auth';
import * as utils from '@/utils'; // Import correct pour le spy

vi.mock('@/features/auth/api/auth', () => ({
  forgotPassword: vi.fn(),
}));

const renderWithRouter = (ui) => {
  return render(ui, { wrapper: BrowserRouter });
};

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  it('affiche une erreur si l\'email est invalide', async () => {
    // On force isValidEmail à retourner false pour ce test
    const spy = vi.spyOn(utils, 'isValidEmail').mockReturnValue(false);
    
    renderWithRouter(<ForgotPasswordForm />);
    
    const emailInput = screen.getByPlaceholderText(/example@gmail.com/i);
    const submitButton = screen.getByRole('button', { name: /Send Reset Link/i });

    // Important : On change la valeur pour que le bouton ne soit pas bloqué par HTML5 "required"
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    
    // On utilise fireEvent.submit sur le formulaire directement pour contourner 
    // les blocages potentiels du bouton par le navigateur
    fireEvent.submit(screen.getByRole('button', { name: /Send Reset Link/i }).closest('form'));

    // On attend que l'état React se mette à jour et affiche l'erreur
    await waitFor(() => {
        expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument();
    });
    
    expect(forgotPassword).not.toHaveBeenCalled();
    spy.mockRestore();
  });

  it('désactive le bouton et affiche le loader pendant le chargement', async () => {
    // On mock isValidEmail pour qu'il passe
    vi.spyOn(utils, 'isValidEmail').mockReturnValue(true);
    forgotPassword.mockReturnValue(new Promise(() => {})); // Promesse pendante
    
    // On récupère "container" ici pour pouvoir faire du querySelector
    const { container } = renderWithRouter(<ForgotPasswordForm />);
    
    fireEvent.change(screen.getByPlaceholderText(/example@gmail.com/i), { 
      target: { value: 'test@example.com' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /Send Reset Link/i }));

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    
    // Correction de l'erreur : container est maintenant défini
    const loader = container.querySelector('.animate-spin');
    expect(loader).toBeInTheDocument();
  });
});