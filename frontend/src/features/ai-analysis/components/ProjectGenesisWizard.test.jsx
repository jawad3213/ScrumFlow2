import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProjectGenesisWizard from './ProjectGenesisWizard';

// --- MOCKS ---
vi.mock('lucide-react', () => ({
  Briefcase: () => <div data-testid="icon" />,
  Target: () => <div data-testid="icon" />,
  Users: () => <div data-testid="icon" />,
  FileText: () => <div data-testid="icon" />,
  TrendingUp: () => <div data-testid="icon" />,
  Rocket: () => <div data-testid="icon" />,
  CheckCircle2: () => <div data-testid="icon" />,
  ChevronLeft: () => <div data-testid="icon" />,
  ChevronRight: () => <div data-testid="icon" />,
  Store: () => <div data-testid="icon" />,
}));

vi.mock('@/assets/NormalSelction.png', () => ({ default: 'mock-img' }));
vi.mock('@/assets/AgenceSelection.png', () => ({ default: 'mock-img' }));

vi.mock('@/components/ui/input', () => ({
  Input: (props) => <input data-testid="project-name-input" {...props} />
}));
vi.mock('@/components/ui/textarea', () => ({
  Textarea: (props) => <textarea data-testid="project-desc-textarea" {...props} />
}));
vi.mock('@/components/ui/SiriOrb', () => ({ default: () => <div data-testid="siri-orb" /> }));

vi.mock('@/features/ai-analysis/components/InternalResourcePool', () => ({ default: () => <div>Pool</div> }));
vi.mock('@/features/ai-analysis/components/DynamicResourcePool', () => ({ default: () => <div>Pool</div> }));
vi.mock('@/features/ai-analysis/components/StaffingStrategy', () => ({ default: () => <div data-testid="strategy-component">Strategy Content</div> }));
vi.mock('@/features/ai-analysis/components/RequirementUpload', () => ({ default: () => <div>Upload</div> }));
vi.mock('@/features/ai-analysis/components/AIDashboard', () => ({ default: () => <div>Dashboard</div> }));

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
  useAnimation: () => ({ start: vi.fn() }),
}));

vi.mock('@/lib/axios', () => ({ default: vi.fn() }));
vi.mock('@/utils/storage', () => ({ default: { getGeminiKey: vi.fn(() => 'key-123') } }));

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

// --- TESTS ---
describe('ProjectGenesisWizard', () => {
  it('doit rendre le titre principal et l\'étape initiale', () => {
    renderWithRouter(<ProjectGenesisWizard />);
    
    // On cible spécifiquement le titre de niveau 1 pour éviter les doublons avec les étapes
    expect(screen.getByRole('heading', { level: 1, name: /Project/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., Enterprise SaaS Platform/i)).toBeInTheDocument();
  });

  it('affiche une erreur de validation si les champs sont vides', async () => {
    renderWithRouter(<ProjectGenesisWizard />);
    
    const nextBtn = screen.getByText(/Progress to Strategy/i);
    fireEvent.click(nextBtn);

    await waitFor(() => {
      // On s'attend à plusieurs messages "Required", donc on utilise getAll
      const errorLabels = screen.getAllByText(/Required/i);
      expect(errorLabels.length).toBeGreaterThan(0);
    });
  });

  it('passe à l\'étape Strategy si les informations sont valides', async () => {
    renderWithRouter(<ProjectGenesisWizard />);

    // Utilisation des test-ids pour plus de sécurité
    fireEvent.change(screen.getByPlaceholderText(/e.g., Enterprise SaaS Platform/i), { target: { value: 'Nouveau Projet' } });
    fireEvent.change(screen.getByPlaceholderText(/What is the primary objective/i), { target: { value: 'Description valide' } });

    fireEvent.click(screen.getByText(/Progress to Strategy/i));

    await waitFor(() => {
      // On vérifie que le composant mocké est là via son test-id
      expect(screen.getByTestId('strategy-component')).toBeInTheDocument();
      // Et que le bouton de l'étape suivante est apparu
      expect(screen.getByText(/Progress to Resources/i)).toBeInTheDocument();
    });
  });

  it('retourne à l\'étape Identity lors du clic sur Back', async () => {
    renderWithRouter(<ProjectGenesisWizard />);

    // Remplir et avancer
    fireEvent.change(screen.getByPlaceholderText(/e.g., Enterprise SaaS Platform/i), { target: { value: 'T' } });
    fireEvent.change(screen.getByPlaceholderText(/What is the primary objective/i), { target: { value: 'T' } });
    fireEvent.click(screen.getByText(/Progress to Strategy/i));

    // Attendre d'être sur Strategy puis cliquer sur Back
    const backBtn = await screen.findByText(/Back to/i);
    fireEvent.click(backBtn);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/e.g., Enterprise SaaS Platform/i)).toBeInTheDocument();
    });
  });
});