import { Routes, Route } from 'react-router-dom';
import PrivateLayout from './layouts/PrivateLayout';
import ProjectLayout from './layouts/ProjectLayout';
import RoleGuard from './components/RoleGuard';
import LoginPage from './pages/auth/LoginPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import DashboardPage from './pages/hub/DashboardPage';
import MyTasksPage from './pages/hub/MyTasksPage';
import ProfilePage from './pages/hub/ProfilePage';
import NewProjectPage from './pages/hub/NewProjectPage';
import ProjectDashboardPage from './pages/project/ProjectDashboardPage';
import SprintBoardPage from './pages/project/SprintBoardPage';
import BacklogPage from './pages/project/BacklogPage';
import AnalysisPage from './pages/project/AnalysisPage';
import TeamPage from './pages/project/TeamPage';
import FinancialsPage from './pages/project/FinancialsPage';
import SettingsPage from './pages/project/SettingsPage';
import MySpacePage from './pages/project/MySpacePage';
function App() {
  return (
    <div className="min-h-screen bg-surface-background">
      <Routes>
        {/* --- PUBLIC --- */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/" element={<LoginPage />} />

        {/* --- PRIVATE LAYOUT (Sidebar + Navbar) --- */}
        <Route element={<PrivateLayout />}>

          {/* HUB GLOBAL */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/my-tasks" element={<MyTasksPage />} />
          <Route path="/profile" element={<ProfilePage />} />


          {/* CRÉATION PROJET (CHEF ONLY) */}
          <Route path="/projects/new" element={
            <RoleGuard role="admin"><NewProjectPage /></RoleGuard>
          } />
          <Route path="/team-global" element={
            <RoleGuard role="admin"><TeamPage /></RoleGuard>
          } />

          {/* --- CONTEXTE PROJET (:id) --- */}
          <Route path="/project/:id" element={<ProjectLayout />}>

            {/* VUES COMMUNES */}
            <Route index element={<ProjectDashboardPage />} /> {/* Default */}
            <Route path="board" element={<SprintBoardPage />} />
            <Route path="backlog" element={<BacklogPage />} />

            {/* VUES EMPLOYÉ */}
            <Route path="my-space" element={<MySpacePage />} />

            {/* VUES CHEF (PROTECTED) */}
            <Route path="analysis" element={
              <RoleGuard role="admin"><AnalysisPage /></RoleGuard>
            } />
            <Route path="team" element={
              <RoleGuard role="admin"><TeamPage /></RoleGuard>
            } />
            <Route path="financials" element={
              <RoleGuard role="admin"><FinancialsPage /></RoleGuard>
            } />
            <Route path="settings" element={
              <RoleGuard role="admin"><SettingsPage /></RoleGuard>
            } />

          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
