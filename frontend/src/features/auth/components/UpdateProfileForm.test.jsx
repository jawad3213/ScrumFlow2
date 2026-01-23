import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import UpdateProfileForm from './UpdateProfileForm';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { updateProfile } from '@/features/auth/api/profile';

// Mock des hooks et de l'API
vi.mock('@/features/auth/hooks/useAuth');
vi.mock('@/features/auth/api/profile');

describe('UpdateProfileForm', () => {
  const mockUser = {
    first_name: 'John',
    last_name: 'Doe',
    email: 'john@example.com',
  };

  const mockUpdateUser = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // Configuration du hook useAuth
    useAuth.mockReturnValue({
      user: mockUser,
      updateUser: mockUpdateUser,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('charge les données de l utilisateur dans les champs', () => {
    render(<UpdateProfileForm />);

    // On utilise displayValue pour vérifier ce qui est affiché dans l'input
    expect(screen.getByDisplayValue('John')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    expect(screen.getByDisplayValue('john@example.com')).toBeInTheDocument();
  });

  it('appelle updateProfile et affiche le succès lors de la soumission', async () => {
    vi.useRealTimers(); // Évite le timeout
    const newUserData = { user: { first_name: 'Jane', last_name: 'Smith' } };
    updateProfile.mockResolvedValueOnce(newUserData);

    render(<UpdateProfileForm />);

    // Sélection par Placeholder (puisqu'il n'y a pas d'ID/htmlFor)
    const firstNameInput = screen.getByPlaceholderText(/Enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/Enter your last name/i);
    const submitBtn = screen.getByRole('button', { name: /Save Changes/i });

    // Modification des champs
    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    
    fireEvent.click(submitBtn);

    // Vérification de l'appel API
    await waitFor(() => {
      expect(updateProfile).toHaveBeenCalledWith({
        first_name: 'Jane',
        last_name: 'Smith',
      });
    });

    // Vérification de la mise à jour du contexte local
    expect(mockUpdateUser).toHaveBeenCalled();

    // Vérification du message de succès
    expect(await screen.findByText(/Profile updated successfully/i)).toBeInTheDocument();
  });

  it('désactive le champ email car il n est pas modifiable', () => {
    render(<UpdateProfileForm />);
    const emailInput = screen.getByPlaceholderText(/Enter your email/i);
    expect(emailInput).toBeDisabled();
  });
});