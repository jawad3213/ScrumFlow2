import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PrivateLayout from './layouts/PrivateLayout';
import ProjectLayout from './layouts/ProjectLayout';

// Features
import RoleGuard from './features/auth/components/RoleGuard';
import { useAuth } from '@/features/auth/hooks/useAuth';
import LoadingAnimation from '@/components/ui/LoadingAnimation';

// Guard: redirects authenticated users away from public-only pages
// For the landing page: always renders (no spinner, no redirect) — CTA handled inside the page
// For other public pages (/login etc.): waits for auth to resolve to prevent flicker
const PublicRoute = ({ children, instant = false }) => {
  const { isAuthenticated, loading } = useAuth();

  // For instant pages (landing): always render, no redirect
  if (instant) return children;

  // If auth is confirmed → redirect to dashboard
  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  // For other public pages: show spinner while auth resolves
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-background">
        <LoadingAnimation message="Loading..." />
      </div>
    );
  }

  return children;
};


// Pages - Auth
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import ProfilePage from './pages/auth/ProfilePage';

// Pages - Dashboard & Hub
import DashboardPage from './pages/dashboard/DashboardPage';
import NewProjectPage from './pages/NewProjectAnalysis/NewProjectPage';
import ProjectDashboardPage from './pages/dashboard/ProjectDashboardPage';
import NotificationsPage from './pages/dashboard/NotificationsPage';


// Pages - Backlog & Analysis

import AnalysisPage from './pages/NewProjectAnalysis/AnalysisPage';
import StrategicBlueprint from './pages/project/StrategicBlueprint';
import TechnicalBlueprintPage from './pages/project/TechnicalBlueprintPage';
import StackChoicePage from './pages/project/StackChoicePage';
import ProjectTeamPage from './pages/project/ProjectTeamPage';

// Pages - Team & Admin
import TeamPage from './pages/team/TeamPage';


// Pages - Reporting


// Pages - Settings
import SettingsPage from './pages/settings/SettingsPage';

// Pages - Landing
import LandingPage from './pages/LandingPage';


function App() {
  return (
    <div className="min-h-screen bg-surface-background font-sans antialiased text-neutral-900">
      {/* Debug Marker */}
      <span className="sr-only">App Rendered</span>

      <Routes>

        {/* ==========================================
            PUBLIC ROUTES
           ========================================== */}
        <Route path="/" element={<PublicRoute instant><LandingPage /></PublicRoute>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

        {/* ==========================================
            PRIVATE PROTECTED ROUTES
           ========================================== */}
        <Route element={<PrivateLayout />}>

          {/* --- GLOBAL HUB (Unified View) --- */}
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* --- ADMIN / MANAGER ONLY (Global) --- */}
          <Route path="/projects/new" element={
            <RoleGuard role="admin"><NewProjectPage /></RoleGuard>
          } />
          <Route path="/team-global" element={
            <RoleGuard role="admin"><TeamPage /></RoleGuard>
          } />

          {/* --- PROJECT SPECIFIC CONTEXT (:id) --- */}
          <Route path="/project/:id" element={<ProjectLayout />}>
            {/* Common Project Views */}
            <Route index element={<ProjectDashboardPage />} />
            <Route path="hub" element={<StrategicBlueprint />} />
            <Route path="blueprint" element={<TechnicalBlueprintPage />} />
            <Route path="stack" element={<StackChoicePage />} />
            <Route path="project-team" element={<ProjectTeamPage />} />

            {/* Manager Protected Project Views */}
            <Route path="analysis" element={
              <RoleGuard role="admin"><AnalysisPage /></RoleGuard>
            } />
            <Route path="team" element={
              <RoleGuard role="admin"><TeamPage /></RoleGuard>
            } />

          </Route>
        </Route>

        {/* 404 CATCH-ALL */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
