import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ResetPasswordForm from './ResetPasswordForm';
import { resetPassword } from '@/features/auth/api/auth';

// Mocks
vi.mock('@/features/auth/api/auth', () => ({
  resetPassword: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ResetPasswordForm', () => {
  const mockOnSuccess = vi.fn();

  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
  });

  const renderComponent = (token = 'fake-token', email = 'test@example.com') => {
    return render(
      <MemoryRouter initialEntries={[`/reset-password?token=${token}&email=${email}`]}>
        <ResetPasswordForm onSuccess={mockOnSuccess} />
      </MemoryRouter>
    );
  };

  it('affiche les champs de mot de passe via leurs placeholders', () => {
    renderComponent();
    // On utilise getAll car les deux inputs ont le même placeholder
    const inputs = screen.getAllByPlaceholderText('••••••••');
    expect(inputs).toHaveLength(2);
    expect(screen.getByText(/At least 8 characters/i)).toBeInTheDocument();
  });

 it('met à jour la force du mot de passe dynamiquement', () => {
    renderComponent();
    const inputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = inputs[0];

    // 1. Initial : "Critical" (vide)
    expect(screen.getByText(/Critical/i)).toBeInTheDocument();

    // 2. Score de 2 ou 3 : "Moderate"
    // "abc1!" -> court (0), chiffre (1), spécial (1), min (0) = Score 2
    fireEvent.change(passwordInput, { target: { value: 'abc1!' } });
    expect(screen.getByText(/Moderate/i)).toBeInTheDocument();

    // 3. Score de 4 : "Optimal"
    // "Abcdefg1!" -> long (1), chiffre (1), spécial (1), Maj (1) = Score 4
    fireEvent.change(passwordInput, { target: { value: 'Abcdefg1!' } });
    expect(screen.getByText(/Optimal/i)).toBeInTheDocument();
  });

  it('affiche une erreur si les mots de passe ne correspondent pas', async () => {
    renderComponent();
    const inputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = inputs[0];
    const confirmInput = inputs[1];
    const submitBtn = screen.getByRole('button', { name: /Update Password/i });

    fireEvent.change(passwordInput, { target: { value: 'SecurePass123!' } });
    fireEvent.change(confirmInput, { target: { value: 'Different123!' } });
    fireEvent.click(submitBtn);

    expect(await screen.findByText(/Passwords do not match/i)).toBeInTheDocument();
  });

  it('soumet le formulaire avec succès', async () => {
    resetPassword.mockResolvedValueOnce({ status: 'success' });
    renderComponent('valid-token', 'user@test.com');

    const inputs = screen.getAllByPlaceholderText('••••••••');
    const validPass = 'SecurePass123!';
    
    fireEvent.change(inputs[0], { target: { value: validPass } });
    fireEvent.change(inputs[1], { target: { value: validPass } });
    
    fireEvent.click(screen.getByRole('button', { name: /Update Password/i }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith(expect.objectContaining({
        token: 'valid-token',
        email: 'user@test.com',
        password: validPass
      }));
      expect(mockOnSuccess).toHaveBeenCalled();
    });
  });

  it('bascule la visibilité du mot de passe', () => {
    renderComponent();
    const inputs = screen.getAllByPlaceholderText('••••••••');
    const passwordInput = inputs[0];
    
    // On cible le bouton par sa classe ou son icône car il n'a pas de texte
    const toggleBtn = screen.getByRole('button', { name: '' }); 

    expect(passwordInput.type).toBe('password');
    fireEvent.click(toggleBtn);
    expect(passwordInput.type).toBe('text');
  });
});