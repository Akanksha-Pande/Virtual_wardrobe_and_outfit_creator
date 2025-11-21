import { useState, useEffect } from 'react';
import { LoginPage } from './components/auth/LoginPage';
import { Dashboard } from './components/dashboard/Dashboard';
import { VirtualCloset } from './components/closet/VirtualCloset';
import { OutfitCreator } from './components/outfit/OutfitCreator';
import { Navigation } from './components/layout/Navigation';
import { UserProvider, useUser } from './contexts/UserContext';
import { WardrobeProvider, useWardrobe } from './contexts/WardrobeContext';
import { View } from './types/View';
import { SavedOutfits } from './components/outfit/SavedOutfits';
import { ToastProvider } from "./components/Toast";

function AppContent() {
  const { user } = useUser();
  const { fetchUserOutfits } = useWardrobe(); 
  const [currentView, setCurrentView] = useState<View>(() => {
    return (localStorage.getItem("currentView") as View) || "dashboard";
  });

  useEffect(() => {
    if (user) {
      const userId = localStorage.getItem("userId");
      if (userId) {
        fetchUserOutfits(userId);
      }
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const savedView = localStorage.getItem("currentView") as View;
      setCurrentView(savedView || "dashboard");
    }
  }, [user]);

  const handleNavigate = (view: View) => {
    setCurrentView(view);

    if (user) {
      localStorage.setItem("currentView", view);
    }
  };

  if (!user) {
    localStorage.removeItem("currentView");
    return <LoginPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'closet':
        return <VirtualCloset onNavigate={handleNavigate} />;
      case 'outfit-creator':
        return <OutfitCreator onNavigate={handleNavigate} />;
      case 'saved-outfits':
        return <SavedOutfits onNavigate={handleNavigate} />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <Navigation currentView={currentView} onNavigate={handleNavigate} />
      <main className="pt-16">{renderView()}</main>
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <UserProvider>
        <WardrobeProvider>
          <AppContent />
        </WardrobeProvider>
      </UserProvider>
    </ToastProvider>
  );
}

export default App;