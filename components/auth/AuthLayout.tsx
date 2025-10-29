import React from 'react';
import { Heart } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="bg-[#1a1a2e] min-h-screen text-gray-200 flex flex-col justify-center items-center p-4 font-sans animate-fade-in">
      <div className="text-center mb-8">
        <Heart size={48} className="mx-auto text-purple-500 animate-pulse" style={{ filter: 'drop-shadow(0 0 10px #9333ea)' }}/>
        <h1 className="font-display text-5xl font-bold text-gray-100 mt-4 tracking-wider" style={{ textShadow: '0 0 10px #9333ea' }}>
          Love Space
        </h1>
        <p className="text-purple-300 mt-2">Seu espaço digital para se conectar</p>
      </div>
      <div className="w-full max-w-sm bg-[#1f1f3a]/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-purple-500/30">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;