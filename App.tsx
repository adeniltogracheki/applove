import React, { useState, useMemo, useEffect } from 'react';
import { Home, MessageCircle, MapPin, ShoppingCart, PawPrint, Heart } from 'lucide-react';

// Auth Components
import Welcome from './components/auth/Welcome';
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import LinkPartner from './components/auth/LinkPartner';

// Main App Components
import Dashboard from './components/Dashboard';
import LoveJar from './components/LoveJar';
import CoupleQA from './components/CoupleQA';
import Memories from './components/Memories';
import Chat from './components/Chat';
import Location from './components/Location';
import Shop from './components/Shop';
import Pet from './components/Pet';

import type { View, User, AuthView } from './types';
import * as authService from './services/authService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('welcome');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkCurrentUser = async () => {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
    };
    checkCurrentUser();
  }, []);

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
  };
  
  const handleLink = (linkedUser: User) => {
    setUser(linkedUser);
  };
  
  const handleLogout = () => {
    authService.logout();
    setUser(null);
    setAuthView('welcome');
  };

  if (isLoading) {
    return (
      <div className="bg-[#1a1a2e] min-h-screen flex items-center justify-center">
        <Heart className="text-purple-500 animate-pulse" size={64} />
      </div>
    );
  }

  if (!user) {
    switch (authView) {
      case 'login':
        return <Login onLogin={handleLogin} onGoogleSignIn={handleLogin} onNavigate={() => setAuthView('signup')} />;
      case 'signup':
        return <SignUp onSignUp={handleLogin} onNavigate={() => setAuthView('login')} />;
      case 'welcome':
      default:
        return <Welcome onNavigate={setAuthView} onGoogleSignIn={handleLogin} />;
    }
  }

  if (!user.linkedPartnerCode) {
    return <LinkPartner currentUser={user} onLink={handleLink} onLogout={handleLogout} />;
  }

  return <MainApp user={user} onLogout={handleLogout} />;
};

interface MainAppProps {
  user: User;
  onLogout: () => void;
}

const MainApp: React.FC<MainAppProps> = ({ user, onLogout }) => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const anniversaryDate = useMemo(() => new Date('2022-10-26T12:00:00'), []);

  const renderView = () => {
    switch (activeView) {
      case 'lovejar':
        return <LoveJar />;
      case 'qa':
        return <CoupleQA />;
      case 'memories':
        return <Memories />;
      case 'chat':
        return <Chat />;
      case 'location':
        return <Location />;
      case 'shop':
        return <Shop />;
      case 'pet':
        return <Pet />;
      case 'dashboard':
      default:
        return <Dashboard anniversaryDate={anniversaryDate} setView={setActiveView} user={user} />;
    }
  };
  
  return (
    <div className="bg-[#1a1a2e] min-h-screen text-gray-200 flex flex-col font-sans">
      <header className="container mx-auto p-4 max-w-2xl flex justify-between items-center">
        <h1 className="font-display text-2xl font-bold text-gray-100" style={{ textShadow: '0 0 8px #9333ea' }}>Love Space</h1>
        <button onClick={onLogout} className="text-sm text-purple-300 hover:text-purple-100">Sair</button>
      </header>
      <main className="flex-grow container mx-auto px-4 pb-28 max-w-2xl">
        {renderView()}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} />
    </div>
  );
};


interface BottomNavProps {
    activeView: View;
    setActiveView: (view: View) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView }) => {
    const navItems = [
        { id: 'dashboard', icon: Home, label: 'Início' },
        { id: 'chat', icon: MessageCircle, label: 'Chat' },
        { id: 'location', icon: MapPin, label: 'Local' },
        { id: 'shop', icon: ShoppingCart, label: 'Loja' },
        { id: 'pet', icon: PawPrint, label: 'Pet' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-[#1f1f3a]/80 backdrop-blur-md border-t border-purple-500/30 max-w-2xl mx-auto rounded-t-3xl shadow-[0_-5px_25px_-5px_rgba(147,51,234,0.3)]">
            <div className="flex justify-around items-center h-20">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveView(item.id as View)}
                        className={`flex flex-col items-center justify-center w-full transition-all duration-300 transform ${activeView === item.id ? 'text-purple-400 scale-110' : 'text-gray-400 hover:text-purple-300'}`}
                        aria-label={item.label}
                    >
                        <item.icon size={26} strokeWidth={activeView === item.id ? 2.5 : 2} />
                        <span className={`text-xs font-medium mt-1 transition-opacity duration-300 ${activeView === item.id ? 'opacity-100' : 'opacity-0'}`}>{item.label}</span>
                    </button>
                ))}
            </div>
        </nav>
    );
};

export default App;
