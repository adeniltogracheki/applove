import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import * as authService from '../../services/authService';
import type { User } from '../../types';
import GoogleSignInButton from './GoogleSignInButton';


interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate: () => void;
  onGoogleSignIn: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate, onGoogleSignIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const user = await authService.login(username, password);
      if(user) onLogin(user);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <h2 className="text-2xl font-bold text-center text-gray-200 mb-6">Entrar</h2>
       <div className="flex flex-col gap-4">
          <GoogleSignInButton onGoogleSignIn={onLogin} />
          <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-purple-800"></div>
            <span className="flex-shrink mx-4 text-purple-300 text-xs">OU</span>
            <div className="flex-grow border-t border-purple-800"></div>
          </div>
       </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Nome de usuário"
          className="w-full px-4 py-2 bg-[#1a1a2e] border border-purple-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-200"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-full px-4 py-2 bg-[#1a1a2e] border border-purple-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-200"
          required
        />
        {error && <p className="text-red-400 text-sm text-center">{error}</p>}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-500 transition shadow-lg disabled:opacity-50 disabled:cursor-wait transform hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.6)]"
        >
          {isLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-400 mt-6">
        Não tem uma conta?{' '}
        <button onClick={onNavigate} className="font-semibold text-purple-400 hover:text-purple-300">
          Cadastre-se
        </button>
      </p>
    </AuthLayout>
  );
};

export default Login;