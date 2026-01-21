import { vi, expect, it, describe, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsPage from './SettingsPage';

// --- 1. MOCKS ---

// Mock du StorageService
vi.mock('@/utils/storage', () => ({
    default: {
        getGeminiKey: vi.fn(),
        setGeminiKey: vi.fn(),
    }
}));

import StorageService from '@/utils/storage';

// Mock de Framer Motion pour éviter les erreurs de rendu
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => children,
}));

// Mock des composants UI Lucide et UI personnalisés
vi.mock('@/components/ui/magic-card', () => ({
    MagicCard: ({ children, className }) => <div className={className}>{children}</div>,
}));

describe('SettingsPage Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Simuler un état initial vide par défaut
        StorageService.getGeminiKey.mockReturnValue(null);
    });

    it('doit charger la clé API existante au montage', () => {
        StorageService.getGeminiKey.mockReturnValue('AIza_test_key');
        
        render(<SettingsPage />);
        
        const input = screen.getByPlaceholderText(/Enter your API Key/i);
        expect(input.value).toBe('AIza_test_key');
        expect(StorageService.getGeminiKey).toHaveBeenCalledTimes(1);
    });

    it('doit afficher une erreur si on essaie de sauvegarder une clé vide', () => {
        render(<SettingsPage />);
        
        const saveButton = screen.getByRole('button', { name: /Save Preferences/i });
        fireEvent.click(saveButton);
        
        expect(screen.getByText(/API Key cannot be empty/i)).toBeInTheDocument();
        expect(StorageService.setGeminiKey).not.toHaveBeenCalled();
    });

    it('doit sauvegarder la clé API avec succès', async () => {
        render(<SettingsPage />);
        
        const input = screen.getByPlaceholderText(/Enter your API Key/i);
        const saveButton = screen.getByRole('button', { name: /Save Preferences/i });

        // Saisie d'une clé
        fireEvent.change(input, { target: { value: 'AIza_new_secret_key' } });
        fireEvent.click(saveButton);

        // Vérification de l'appel au service de stockage
        expect(StorageService.setGeminiKey).toHaveBeenCalledWith('AIza_new_secret_key');

        // Vérification du message de succès
        expect(screen.getByText(/Configuration Saved/i)).toBeInTheDocument();

        // Vérification que le message disparaît après le timer (optionnel)
        await waitFor(() => {
            expect(screen.queryByText(/Configuration Saved/i)).not.toBeInTheDocument();
        }, { timeout: 3500 });
    });

    it('doit gérer les erreurs de stockage local', () => {
        // Simuler un crash du localStorage (ex: quota plein)
        StorageService.setGeminiKey.mockImplementation(() => {
            throw new Error("Quota exceeded");
        });

        render(<SettingsPage />);
        
        const input = screen.getByPlaceholderText(/Enter your API Key/i);
        fireEvent.change(input, { target: { value: 'some_key' } });
        
        const saveButton = screen.getByRole('button', { name: /Save Preferences/i });
        fireEvent.click(saveButton);

        expect(screen.getByText(/Failed to save to local storage/i)).toBeInTheDocument();
    });
});