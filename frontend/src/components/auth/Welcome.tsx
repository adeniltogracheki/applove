import React from 'react';
import AuthLayout from './AuthLayout';
import type { AuthView, User } from '@/types';
import GoogleSignInButton from './GoogleSignInButton';

interface WelcomeProps {
    onNavigate: (view: AuthView) => void;
    onGoogleSignIn: (user: User) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate, onGoogleSignIn }) => {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-4">
        <button
          onClick={() => onNavigate('signup')}
          className="w-full px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-500 transition shadow-lg transform hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.6)]"
        >
          Criar conta
        </button>
         <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-purple-800"></div>
            <span className="flex-shrink mx-4 text-purple-300 text-xs">OU</span>
            <div className="flex-grow border-t border-purple-800"></div>
        </div>
        <GoogleSignInButton onGoogleSignIn={onGoogleSignIn} />
        <button
          onClick={() => onNavigate('login')}
          className="w-full px-6 py-2 text-purple-300 font-semibold rounded-full hover:bg-purple-800/40 transition mt-4"
        >
          Já tenho uma conta
        </button>
      </div>
    </AuthLayout>
  );
};

export default Welcome;
