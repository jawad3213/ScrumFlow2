import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import '@testing-library/jest-dom';
import { MemoryRouter } from "react-router-dom";
import ConfirmNewPass from "../pages/ConfirmNewPass";

/* ---------- MOCK FETCH : appel à une API fausse ---------- */
globalThis.fetch = vi.fn();

/* ---------- HELPER RENDER ---------- */
const renderWithRouter = (url) => {
  render(
    <MemoryRouter initialEntries={[url]}>
      <ConfirmNewPass />
    </MemoryRouter>
  );
};


describe("ConfirmNewPass", () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ========================= */
  it("affiche le formulaire", () => {
    renderWithRouter("/confirm-password?token=123");

    expect(
      screen.getByText(/Créer un nouveau mot de passe/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Nouveau mot de passe/i)
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Confirmer le mot de passe/i)
    ).toBeInTheDocument();
  });

  /* ========================= */
  it("affiche une erreur si le mot de passe est trop court", async () => {
    renderWithRouter("/confirm-password?token=123");

    fireEvent.change(screen.getByLabelText(/Entrer votre email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/i), { target: { value: '123' } });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), { target: { value: '123' } });

    fireEvent.click(
      screen.getByRole("button", { name: /Réinitialiser/i })
    );

    expect(
      await screen.findByText(/au moins 6 caractères/i)
    ).toBeInTheDocument();
  });

  /* ========================= */
  it("affiche une erreur si les mots de passe ne correspondent pas", async () => {
    renderWithRouter("/confirm-password?token=123");

    fireEvent.change(screen.getByLabelText(/Entrer votre email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/i), { target: { value: 'password1' } });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), { target: { value: 'password2' } });


    fireEvent.click(
      screen.getByRole("button", { name: /Réinitialiser/i })
    );

    expect(
      await screen.findByText(/ne correspondent pas/i)
    ).toBeInTheDocument();
  });

  /* ========================= */
  it("affiche un succès si l’API répond OK", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    renderWithRouter("/confirm-password?token=123");

    fireEvent.change(screen.getByLabelText(/Entrer votre email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), { target: { value: 'password123' } });


    fireEvent.click(
      screen.getByRole("button", { name: /Réinitialiser/i })
    );

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });

    expect(
      await screen.findByText(/réinitialisé avec succès/i)
    ).toBeInTheDocument();
  });

  /* ========================= */
  it("affiche une erreur si l’API échoue", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    renderWithRouter("/confirm-password?token=123");

    fireEvent.change(screen.getByLabelText(/Entrer votre email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), { target: { value: 'password123' } });


    fireEvent.click(
      screen.getByRole("button", { name: /Réinitialiser/i })
    );

    expect(
      await screen.findByText(/lien est invalide/i)
    ).toBeInTheDocument();
  });

  /* ========================= */
  it("affiche une erreur si le token est absent", async () => {
    renderWithRouter("/confirm-password");

    fireEvent.change(screen.getByLabelText(/Entrer votre email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/Nouveau mot de passe/i), { target: { value: 'password123' } });
    fireEvent.change(screen.getByLabelText(/Confirmer le mot de passe/i), { target: { value: 'password123' } });


    fireEvent.click(
      screen.getByRole("button", { name: /Réinitialiser/i })
    );

    expect(
      await screen.findByText(/token manquant/i)
    ).toBeInTheDocument();
  });

});
