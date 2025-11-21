import { Home, Shirt, Palette, LogOut, Layers } from 'lucide-react';
import { useUser } from '../../contexts/UserContext';
import { View } from '../../types/View';

interface NavigationProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Navigation({ currentView, onNavigate }: NavigationProps) {
  const { user, logout } = useUser();

  const navigationItems = [
    { id: 'dashboard' as View, label: 'Dashboard', icon: Home },
    { id: 'closet' as View, label: 'My Closet', icon: Shirt },
    { id: 'outfit-creator' as View, label: 'Outfit Creator', icon: Palette },
    { id: 'saved-outfits' as View, label: 'Saved Outfits', icon: Layers },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-gradient-to-r from-purple-300/40 via-fuchsia-200/40 to-pink-100/40 backdrop-blur-2xl border-b border-purple-200/60 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Shirt className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Virtual Wardrobe</span>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-1000'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <div className="hidden sm:flex items-center space-x-3">
              <div className="text-sm">
                <p className="font-medium text-gray-900">{user?.username}</p>
                <p className="text-gray-500 text-xs">{user?.email}</p>
              </div>
            </div>
            
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-3">
          <div className="flex space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center space-x-1 ${
                    isActive
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}