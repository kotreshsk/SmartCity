import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/Layout/AppLayout';
import LoadingSpinner from './components/Common/LoadingSpinner';
import ToastContainer from './components/Common/Toast';

// Pages
import Login from './pages/Login';
import Home from './pages/Home';
import Report from './pages/Report';
import IssueDetail from './pages/IssueDetail';
import MyReports from './pages/MyReports';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import Contractor from './pages/Contractor';

// Extremely basic router for MVP since we didn't add react-router-dom to save time/complexity
const App = () => {
  const { user, loading } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Handle browser back/forward
  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path) => {
    // Handle "back" navigation
    if (path === -1) {
      window.history.back();
      return;
    }
    window.history.pushState({}, '', path);
    setCurrentPath(path);
  };

  if (loading) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <LoadingSpinner size={48} />
      </div>
    );
  }

  // If not logged in, only show login page
  if (!user) {
    return <Login onSuccess={() => navigate('/')} />;
  }

  // Routing logic
  const renderPage = () => {
    if (currentPath === '/') return <Home onNavigate={navigate} />;
    if (currentPath === '/report') return <Report onNavigate={navigate} />;
    if (currentPath === '/my-reports') return <MyReports onNavigate={navigate} />;
    if (currentPath === '/profile') return <Profile />;
    
    if (currentPath === '/admin' && user.role === 'admin') return <Admin />;
    if (currentPath === '/contractor' && user.role === 'contractor') return <Contractor />;

    // Dynamic routes
    if (currentPath.startsWith('/issue/')) {
      const issueId = currentPath.split('/')[2];
      return <IssueDetail issueId={issueId} onNavigate={navigate} />;
    }

    // Fallback
    return <Home onNavigate={navigate} />;
  };

  return (
    <>
      <AppLayout currentPath={currentPath} onNavigate={navigate}>
        {renderPage()}
      </AppLayout>
      <ToastContainer />
    </>
  );
};

export default App;
