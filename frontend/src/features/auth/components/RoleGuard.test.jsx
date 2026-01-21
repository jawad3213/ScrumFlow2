import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RoleGuard from './RoleGuard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { USER_ROLES } from '@/utils/constants';

// Mock du hook useAuth
vi.mock('@/features/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

describe('RoleGuard', () => {
  const ChildComponent = () => <div>Protected Content</div>;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (ui, { initialEntries = ['/protected'] } = {}) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/protected" element={ui} />
          <Route path="/login" element={<div>Login Page</div>} />
          <Route path="/dashboard" element={<div>Dashboard Page</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('ne rend rien pendant le chargement', () => {
    useAuth.mockReturnValue({ loading: true });
    const { container } = renderWithRouter(
      <RoleGuard><ChildComponent /></RoleGuard>
    );
    expect(container.firstChild).toBeNull();
  });

  it('redirige vers /login si l utilisateur n est pas authentifié', () => {
    useAuth.mockReturnValue({ 
      isAuthenticated: false, 
      loading: false 
    });

    renderWithRouter(
      <RoleGuard><ChildComponent /></RoleGuard>
    );

    expect(screen.getByText(/Login Page/i)).toBeInTheDocument();
  });

  it('affiche le contenu si l utilisateur est authentifié et sans restriction de rôle', () => {
    useAuth.mockReturnValue({ 
      isAuthenticated: true, 
      userRole: USER_ROLES.USER,
      loading: false 
    });

    renderWithRouter(
      <RoleGuard><ChildComponent /></RoleGuard>
    );

    expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
  });

  it('redirige vers /dashboard si le rôle ne correspond pas', () => {
    useAuth.mockReturnValue({ 
      isAuthenticated: true, 
      userRole: USER_ROLES.USER, // L'utilisateur est un simple USER
      loading: false 
    });

    renderWithRouter(
      <RoleGuard role="admin"><ChildComponent /></RoleGuard>
    );

    // Devrait rediriger car 'admin' exige USER_ROLES.MANAGER
    expect(screen.getByText(/Dashboard Page/i)).toBeInTheDocument();
    expect(screen.queryByText(/Protected Content/i)).not.toBeInTheDocument();
  });

  it('autorise l accès si le rôle est admin et l utilisateur est MANAGER', () => {
    useAuth.mockReturnValue({ 
      isAuthenticated: true, 
      userRole: USER_ROLES.MANAGER, // L'utilisateur a le bon rôle mappé
      loading: false 
    });

    renderWithRouter(
      <RoleGuard role="admin"><ChildComponent /></RoleGuard>
    );

    expect(screen.getByText(/Protected Content/i)).toBeInTheDocument();
  });
});