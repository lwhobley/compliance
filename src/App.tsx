import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import PageTransition from './components/PageTransition';
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import ChecklistsPage from './pages/ChecklistsPage';
import InspectionsPage from './pages/InspectionsPage';
import CertificationsPage from './pages/CertificationsPage';
import IncidentsPage from './pages/IncidentsPage';
// import SeafoodPage from './pages/SeafoodPage';
import InspectorModePage from './pages/InspectorModePage';
import SettingsPage from './pages/SettingsPage';
import AuditsPage from './pages/AuditsPage';
import PaywallPage from './pages/PaywallPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import SubscriptionGuard from './components/SubscriptionGuard';

import CompleteRegistrationPage from './pages/CompleteRegistrationPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Loading ComplianceDaddy...
        </span>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // If user is logged in but profile is incomplete (missing company), redirect to completion
  if (!user.company) {
    return <Navigate to="/complete-registration" replace />;
  }

  return <>{children}</>;
}

function AppLayout() {
  return (
    <div className="page-wrapper">
      {/* Ambient Background Glow */}
      <div className="ambient-glow" style={{ top: '10%', left: '10%' }} />
      <div className="ambient-glow" style={{ top: '60%', right: '5%', animationDelay: '-7s' }} />

      <Sidebar />
      <main className="main-content">
        <PageTransition>
          <Routes>
            {/* Unprotected routes (but still require login) */}
            <Route path="/paywall" element={<PaywallPage />} />

            {/* Paywalled routes */}
            <Route path="/" element={<SubscriptionGuard><DashboardPage /></SubscriptionGuard>} />
            <Route path="/checklists" element={<SubscriptionGuard><ChecklistsPage /></SubscriptionGuard>} />
            <Route path="/audits" element={<SubscriptionGuard><AuditsPage /></SubscriptionGuard>} />
            <Route path="/inspections" element={<SubscriptionGuard><InspectionsPage /></SubscriptionGuard>} />
            <Route path="/certifications" element={<SubscriptionGuard><CertificationsPage /></SubscriptionGuard>} />
            <Route path="/incidents" element={<SubscriptionGuard><IncidentsPage /></SubscriptionGuard>} />
            {/* <Route path="/seafood" element={<SubscriptionGuard><SeafoodPage /></SubscriptionGuard>} /> */}
            <Route path="/inspector-mode" element={<SubscriptionGuard><InspectorModePage /></SubscriptionGuard>} />

            {/* Settings is open so they can manage billing */}
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </PageTransition>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          Loading ComplianceDaddy...
        </span>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={user ? (user.company ? <Navigate to="/" replace /> : <Navigate to="/complete-registration" replace />) : <AuthPage />}
      />
      <Route
        path="/complete-registration"
        element={user ? (user.company ? <Navigate to="/" replace /> : <CompleteRegistrationPage />) : <Navigate to="/auth" replace />}
      />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
