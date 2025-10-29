import React from 'react';
import AuthLayout from './AuthLayout';
import type { AuthView, User } from '../../types';
import GoogleSignInButton from './GoogleSignInButton';

interface WelcomeProps {
    onNavigate: (view: AuthView) => void;
    onGoogleSignIn: (user: User) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ onNavigate, onGoogleSignIn }) => {
  return (
    <AuthLayout>
      <div className="flex flex-col gap-4">
        <GoogleSignInButton onGoogleSignIn={onGoogleSignIn} />
        <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-purple-800"></div>
            <span className="flex-shrink mx-4 text-purple-300 text-xs">OU</span>
            <div className="flex-grow border-t border-purple-800"></div>
        </div>
        <button
          onClick={() => onNavigate('login')}
          className="w-full px-6 py-3 bg-purple-800/50 text-purple-200 font-semibold rounded-full hover:bg-purple-800/80 transition border border-purple-700"
        >
          Entrar com nome de usuário
        </button>
      </div>
    </AuthLayout>
  );
};

export default Welcome;
