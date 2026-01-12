import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PrivateLayout from './layouts/PrivateLayout';
import ProjectLayout from './layouts/ProjectLayout';

// Features
import RoleGuard from './features/auth/components/RoleGuard';

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

// Pages - Team & Admin
import TeamPage from './pages/team/TeamPage';


// Pages - Reporting


// Pages - Settings
import SettingsPage from './pages/settings/SettingsPage';

function App() {
  return (
    <div className="min-h-screen bg-surface-background font-sans antialiased text-neutral-900">
      <Routes>
        {/* ==========================================
            PUBLIC ROUTES
           ========================================== */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

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
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
