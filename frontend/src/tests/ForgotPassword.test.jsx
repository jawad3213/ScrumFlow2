import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import ForgotPassword from '../pages/ForgotPassword';

// ----- MOCK GLOBAL FETCH -----
globalThis.fetch = vi.fn();

// ----- MOCK useNavigate -----
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate
  };
});

// ----- HELPER RENDER -----
const renderWithRouter = (url = '/') => {
  render(
    <MemoryRouter initialEntries={[url]}>
      <ForgotPassword />
    </MemoryRouter>
  );
};

// ----- CLEANUP -----
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('ForgotPassword', () => {

  it('affiche le formulaire correctement', () => {
    renderWithRouter();
    expect(screen.getByText(/Trouver votre compte/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText('user@company.com')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Réinitialiser/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /Annuler/i })).toBeInTheDocument();
  });

  it('active le bouton Réinitialiser lorsque l’email est saisi', () => {
    renderWithRouter();
    const input = screen.getByPlaceholderText('user@company.com');
    fireEvent.change(input, { target: { value: 'test@example.com' } });
    expect(screen.getByRole('button', { name: /Réinitialiser/i })).toBeEnabled();
  });

  it('affiche un message de succès si fetch répond ok', async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText('user@company.com'), { target: { value: 'test@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Réinitialiser/i }));

    await waitFor(() => expect(fetch).toHaveBeenCalledWith(
      "http://localhost:8000/api/forgot-password",
      expect.objectContaining({
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: 'test@example.com' })
      })
    ));

    expect(await screen.findByText(/Un email de réinitialisation a été envoyé/i)).toBeInTheDocument();
  });

  it('affiche un message d’erreur si fetch échoue', async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    renderWithRouter();

    fireEvent.change(screen.getByPlaceholderText('user@company.com'), { target: { value: 'notfound@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: /Réinitialiser/i }));

    expect(await screen.findByText(/Cet email n'existe pas/i)).toBeInTheDocument();
  });

  it('réinitialise le formulaire et navigue sur Annuler', () => {
    renderWithRouter();

    const input = screen.getByPlaceholderText('user@company.com');
    fireEvent.change(input, { target: { value: 'test@example.com' } });

    fireEvent.click(screen.getByRole('button', { name: /Annuler/i }));

    expect(input.value).toBe('');
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

});
