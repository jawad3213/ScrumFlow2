/**
 * @vitest-environment jsdom
 */
/* eslint-disable no-undef */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProjectAnalysisView from './ProjectAnalysisView';

// --- MOCKS ---

// Mock de framer-motion (évite les erreurs d'animation dans JSDOM)
vi.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
    },
    AnimatePresence: ({ children }) => <>{children}</>,
}));

// Mock des icônes Lucide
vi.mock('lucide-react', () => ({
    Briefcase: () => <div data-testid="icon-briefcase" />,
    FileText: () => <div data-testid="icon-filetext" />,
    ChevronRight: () => <div />,
    Rocket: () => <div />,
    Save: () => <div />,
    Sparkles: () => <div />,
    History: () => <div />,
    CheckCircle: () => <div />,
}));

// Mock des composants enfants
vi.mock('@/features/ai-analysis/components/AIDashboard', () => ({
    default: () => <div data-testid="ai-dashboard">AI Dashboard Rendered</div>
}));

vi.mock('@/features/ai-analysis/components/RequirementUpload', () => ({
    default: ({ onFileSelected }) => (
        <div data-testid="upload-step">
            <button onClick={() => onFileSelected(new File([], 'test.pdf'))}>
                Simulate Upload
            </button>
        </div>
    )
}));

vi.mock('@/features/ai-analysis/components/ResourcePool', () => ({
    default: ({ pool }) => (
        <div data-testid="resource-pool">
            Resource Pool ({pool.length} employees)
        </div>
    )
}));

vi.mock('@/components/ui/loading-animation', () => ({
    default: ({ message }) => (
        <div data-testid="loading-animation">
            <div data-testid="lottie-animation" />
            {message}
        </div>
    )
}));

// Mock des APIs et Services
vi.mock('@/features/ai-analysis/api/ai', () => ({
    analyzeStaffing: vi.fn().mockResolvedValue({ project_name: 'Analysis Result' })
}));

vi.mock('@/features/projects/api/projects', () => ({
    createProject: vi.fn().mockResolvedValue({ id: 1, status: 'success' })
}));

vi.mock('@/utils/storage', () => ({
    default: {
        getGeminiKey: vi.fn().mockReturnValue('fake-key'),
        setGeminiKey: vi.fn(),
    }
}));

// Mock de react-router-dom
vi.mock('react-router-dom', () => ({
    useParams: () => ({ id: 'new-123' }),
}));

// --- TESTS ---

describe('ProjectAnalysisView Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('affiche le formulaire de configuration par défaut', () => {
        render(<ProjectAnalysisView />);

        expect(screen.getByText(/Configure/i)).toBeDefined();
        expect(screen.getByPlaceholderText(/e.g., Enterprise SaaS Platform/i)).toBeDefined();
        expect(screen.getByPlaceholderText(/Describe the core problem/i)).toBeDefined();
    });

    it('le bouton "Start Analysis" est désactivé si les champs sont vides', () => {
        render(<ProjectAnalysisView />);
        const btn = screen.getByRole('button', { name: /Start Analysis/i });

        expect(btn.getAttribute('disabled')).toBeDefined();
    });

    it('permet de naviguer vers la sélection des ressources après saisie', async () => {
        render(<ProjectAnalysisView />);

        const nameInput = screen.getByPlaceholderText(/e.g., Enterprise SaaS Platform/i);
        const descInput = screen.getByPlaceholderText(/Describe the core problem/i);

        fireEvent.change(nameInput, { target: { value: 'Projet Alpha' } });
        fireEvent.change(descInput, { target: { value: 'Description du projet Alpha' } });

        const btn = screen.getByRole('button', { name: /Start Analysis/i });
        fireEvent.click(btn);

        // On vérifie que l'étape ResourcePool est affichée
        expect(screen.getByTestId('resource-pool')).toBeDefined();
    });

    it('enchaîne le flux jusqu’au dashboard après simulation d’upload', async () => {
        render(<ProjectAnalysisView />);

        // 1. Config
        fireEvent.change(screen.getByPlaceholderText(/e.g., Enterprise SaaS Platform/i), { target: { value: 'X' } });
        fireEvent.change(screen.getByPlaceholderText(/Describe the core problem/i), { target: { value: 'Y' } });
        fireEvent.click(screen.getByText(/Start Analysis/i));

        // 2. Resources
        fireEvent.click(screen.getByText(/Continue to Scoping/i));

        // 3. Upload & Analysis
        const uploadBtn = screen.getByText(/Simulate Upload/i);
        fireEvent.click(uploadBtn);

        // Vérifie l'état de chargement
        expect(screen.getByTestId('lottie-animation')).toBeDefined();
        expect(screen.getByText(/AI Synthesis In Progress/i)).toBeDefined();

        // 4. Dashboard final
        await waitFor(() => {
            expect(screen.getByTestId('ai-dashboard')).toBeDefined();
        });
    });

    it('permet de réinitialiser la configuration via le bouton Reset', async () => {
        render(<ProjectAnalysisView />);

        // Passer à l'étape ressources
        fireEvent.change(screen.getByPlaceholderText(/e.g., Enterprise SaaS Platform/i), { target: { value: 'X' } });
        fireEvent.change(screen.getByPlaceholderText(/Describe the core problem/i), { target: { value: 'Y' } });
        fireEvent.click(screen.getByText(/Start Analysis/i));

        // Cliquer sur Reset to Config
        const resetBtn = screen.getByText(/Reset to Config/i);
        fireEvent.click(resetBtn);

        // Vérifier le retour au formulaire
        expect(screen.getByPlaceholderText(/e.g., Enterprise SaaS Platform/i)).toBeDefined();
    });
});