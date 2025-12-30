import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Tracker from './pages/Tracker';
import Profile from './pages/Profile';
import AskAI from './pages/AskAI';
import History from './pages/History';
import Analytics from './pages/Analytics';
import { getCurrentUser } from './services/authService';
import { getUserProfile } from './services/storageService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [hasProfile, setHasProfile] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuthState = async () => {
      const user = getCurrentUser();

      if (user) {
        setIsAuthenticated(true);
        // Check if user has completed profile
        const profile = await getUserProfile();
        setHasProfile(!!profile);
      } else {
        setIsAuthenticated(false);
        setHasProfile(false);
      }
    };

    checkAuthState();
  }, []);

  // Show loading state while checking auth
  if (isAuthenticated === null || hasProfile === null) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          border: '4px solid #f3f3f3',
          borderTop: '4px solid var(--primary-color)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <p style={{ color: '#666' }}>Loading...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Root redirect based on auth state */}
          <Route
            path="/"
            element={
              isAuthenticated
                ? (hasProfile ? <Navigate to="/dashboard" replace /> : <Navigate to="/onboarding" replace />)
                : <Navigate to="/login" replace />
            }
          />

          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes - require authentication */}
          <Route
            path="/onboarding"
            element={isAuthenticated ? <Onboarding /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated && hasProfile ? <Dashboard /> : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} replace />}
          />
          <Route
            path="/track"
            element={isAuthenticated && hasProfile ? <Tracker /> : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} replace />}
          />
          <Route
            path="/ask-ai"
            element={isAuthenticated && hasProfile ? <AskAI /> : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} replace />}
          />
          <Route
            path="/profile"
            element={isAuthenticated && hasProfile ? <Profile /> : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} replace />}
          />
          <Route
            path="/history"
            element={isAuthenticated && hasProfile ? <History /> : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} replace />}
          />
          <Route
            path="/analytics"
            element={isAuthenticated && hasProfile ? <Analytics /> : <Navigate to={isAuthenticated ? "/onboarding" : "/login"} replace />}
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
