import React from 'react';
import { useAuth } from './contexts/AuthContext';
import LandingPage from './components/LandingPage';
import DashboardLayout from './components/DashboardLayout';

const App: React.FC = () => {
  const { session, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-light-bg dark:bg-dark-bg">
        <p className="text-xl">Carregando Refrimix...</p>
      </div>
    );
  }

  return session ? <DashboardLayout /> : <LandingPage />;
};

export default App;
