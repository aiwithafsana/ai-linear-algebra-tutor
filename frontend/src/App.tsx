import React, { useEffect } from 'react';
import { AuthProvider, useAuth } from './components/AuthProvider';
import MainApp from './components/MainApp';
import LoginPage from './components/LoginPage';

const AppContent: React.FC = () => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    // Handle OAuth callback
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token) {
      // Extract user info from token (you might want to decode JWT here)
      // For now, we'll use a simple approach
      const userInfo = {
        id: 'user_' + Date.now(),
        email: 'user@example.com',
        name: 'User',
        provider: 'google' as const
      };
      
      // Store token and user info
      localStorage.setItem('auth_token', token);
      localStorage.setItem('auth_user', JSON.stringify(userInfo));
      
      // Redirect to clean URL
      window.history.replaceState({}, document.title, window.location.pathname);
      window.location.reload();
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={() => {}} />;
  }

  return <MainApp />;
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;