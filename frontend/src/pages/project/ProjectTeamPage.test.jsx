import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { vi, expect, it, describe } from 'vitest';
import ProjectTeamPage from './ProjectTeamPage';

// --- CONFIGURATION DE L'ENVIRONNEMENT ---

// 1. Mock IntersectionObserver (pour éviter les erreurs avec les animations Tailwind/Lottie)
global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    observe() { return null; }
    unobserve() { return null; }
    disconnect() { return null; }
};

// 2. Mock Canvas (si des composants enfants utilisent des graphiques ou animations)
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
    fillRect: vi.fn(),
    measureText: vi.fn(() => ({ width: 0 })),
}));

describe('Integration Test: ProjectTeamPage', () => {

    // Utilitaire pour injecter un ID de projet spécifique dans les paramètres d'URL
    const renderWithRouter = (initialId = '123') => {
        return render(
            <MemoryRouter initialEntries={[`/projects/${initialId}/team`]}>
                <Routes>
                    <Route path="/projects/:id/team" element={<ProjectTeamPage />} />
                </Routes>
            </MemoryRouter>
        );
    };

   it('doit rendre correctement l’en-tête de la page et le titre', () => {
        renderWithRouter();

        // ✅ Solution 1 : Cibler par rôle (recommandé pour l'accessibilité)
        // On cherche un titre (h1-h6) qui contient exactement ce texte
        expect(screen.getByRole('heading', { name: /Project Team$/i })).toBeInTheDocument();
        
        // ✅ Solution 2 : Si vous préférez rester sur getByText, utilisez une string exacte
        // Au lieu de la regex /Project Team/i qui matche tout, on cherche le texte précis du titre
        expect(screen.getByText('Project Team')).toBeInTheDocument();

        // Vérification de la description
        expect(screen.getByText(/Manage members assigned to this specific project/i)).toBeInTheDocument();
    });

    it('doit afficher le conteneur de contenu vide temporaire', () => {
        renderWithRouter();

        // Vérification de la présence du texte placeholder
        expect(screen.getByText(/Project Team management content will go here/i)).toBeInTheDocument();
    });

    it('doit posséder l’icône Users (accessibilité)', () => {
        renderWithRouter();
        
        // Comme Users est un composant lucide-react, on vérifie la présence du SVG ou de sa classe
        const icon = document.querySelector('.lucide-users');
        expect(icon).toBeInTheDocument();
    });
});