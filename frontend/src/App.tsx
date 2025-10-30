import React, { useState, useEffect } from 'react';
import type { View, AuthView, User } from '@/types';

// Auth Components
import Welcome from '@/components/auth/Welcome';
import Login from '@/components/auth/Login';
import SignUp from '@/components/auth/SignUp';
import LinkPartner from '@/components/auth/LinkPartner';
import SetAnniversary from '@/components/auth/SetAnniversary';

// Main App Components
import Dashboard from '@/components/Dashboard';
import LoveJar from '@/components/LoveJar';
import CoupleQA from '@/components/CoupleQA';
import Memories from '@/components/Memories';
import Chat from '@/components/Chat';
import Location from '@/components/Location';
import Games from '@/components/Games';
import Pet from '@/components/Pet';
import Shop from '@/components/Shop';
import { MessageCircle, MapPin, Gamepad2, PawPrint, ShoppingCart, Home, LogOut, Heart } from 'lucide-react';

const MainApp: React.FC<{ user: User; onLogout: () => void }> = ({ user, onLogout }) => {
  const [view, setView] = useState<View>('dashboard');

  const renderView = () => {
    // A data de aniversário agora vem do objeto do usuário
    const anniversaryDate = user.anniversaryDate ? new Date(user.anniversaryDate) : new Date();
     // Ajusta o fuso horário para evitar problemas de data "um dia antes"
    anniversaryDate.setMinutes(anniversaryDate.getMinutes() + anniversaryDate.getTimezoneOffset());

    switch (view) {
      case 'lovejar': return <LoveJar user={user} />;
      case 'qa': return <CoupleQA />;
      case 'memories': return <Memories />;
      case 'chat': return <Chat />;
      case 'location': return <Location />;
      case 'games': return <Games />;
      case 'pet': return <Pet />;
      case 'shop': return <Shop />;
      case 'dashboard':
      default:
        return <Dashboard anniversaryDate={anniversaryDate} setView={setView} user={user} />;
    }
  };

  const NavItem: React.FC<{ icon: React.ElementType; label: View; currentView: View; onClick: (view: View) => void }> = ({ icon: Icon, label, currentView, onClick }) => (
    <button
      onClick={() => onClick(label)}
      className={`flex flex-col items-center justify-center gap-1 w-full transition-colors p-1 rounded-md ${currentView === label ? 'text-purple-400 bg-purple-900/50' : 'text-gray-500 hover:text-purple-300'}`}
      aria-label={label}
    >
      <Icon size={24} />
      <span className="text-xs capitalize">{label === 'dashboard' ? 'Início' : label === 'qa' ? 'Q&A' : label}</span>
    </button>
  );

  return (
    <div className="bg-[#1a1a2e] text-gray-200 flex flex-col font-sans min-h-screen">
      <header className="flex justify-between items-center p-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <Heart size={24} className="text-purple-500" />
            <span className="font-display font-bold text-xl text-gray-100">Love Space</span>
          </div>
          <button onClick={onLogout} className="text-gray-500 hover:text-red-400 transition p-2 rounded-full hover:bg-purple-900/50">
            <LogOut size={22} />
          </button>
      </header>
      <main className="flex-grow p-4 overflow-y-auto pb-24">
        {renderView()}
      </main>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1f1f3a]/80 backdrop-blur-sm border-t border-purple-500/30 p-2 grid grid-cols-5 gap-1 z-50 flex-shrink-0">
        <NavItem icon={Home} label="dashboard" currentView={view} onClick={setView} />
        <NavItem icon={MessageCircle} label="chat" currentView={view} onClick={setView} />
        <NavItem icon={MapPin} label="location" currentView={view} onClick={setView} />
        <NavItem icon={Gamepad2} label="games" currentView={view} onClick={setView} />
        <NavItem icon={PawPrint} label="pet" currentView={view} onClick={setView} />
      </nav>
    </div>
  );
};


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authView, setAuthView] = useState<AuthView>('welcome');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const loggedUserJSON = window.localStorage.getItem('loggedLoveSpaceUser');
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        setCurrentUser(user);
      }
    } catch (error) {
        console.error("Failed to parse user from localStorage", error);
        window.localStorage.removeItem('loggedLoveSpaceUser');
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    window.localStorage.setItem('loggedLoveSpaceUser', JSON.stringify(user));
    setCurrentUser(user);
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedLoveSpaceUser');
    setCurrentUser(null);
    setAuthView('login');
  };

  if (isLoading) {
    return <div className="bg-[#1a1a2e] min-h-screen" />; // Tela em branco enquanto carrega
  }
  
  if (!currentUser) {
    switch(authView) {
      case 'login':
        return <Login onLogin={handleLogin} onNavigate={() => setAuthView('signup')} onGoogleSignIn={handleLogin} />;
      case 'signup':
        return <SignUp onSignUp={handleLogin} onNavigate={() => setAuthView('login')} />;
      case 'welcome':
      default:
        return <Welcome onNavigate={(v) => setAuthView(v)} onGoogleSignIn={handleLogin} />;
    }
  }

  if (!currentUser.linkedPartnerCode) {
    return <LinkPartner currentUser={currentUser} onLink={handleLogin} onLogout={handleLogout} />;
  }
  
  if (!currentUser.anniversaryDate) {
    return <SetAnniversary currentUser={currentUser} onDateSet={handleLogin} onLogout={handleLogout} />;
  }

  return <MainApp user={currentUser} onLogout={handleLogout} />;
};

export default App;
