import React, { useState } from 'react';
import { Copy, Link, LogOut } from 'lucide-react';
import * as authService from '../../services/authService';
import type { User } from '../../types';

interface LinkPartnerProps {
  currentUser: User;
  onLink: (user: User) => void;
  onLogout: () => void;
}

const LinkPartner: React.FC<LinkPartnerProps> = ({ currentUser, onLink, onLogout }) => {
  const [partnerCode, setPartnerCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentUser.uniqueCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    try {
      const updatedUser = await authService.linkPartner(currentUser, partnerCode);
      onLink(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao vincular.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a2e] min-h-screen text-gray-200 flex flex-col justify-center items-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-display text-4xl font-bold text-gray-100" style={{ textShadow: '0 0 10px #9333ea' }}>
          Conecte-se
        </h1>
        <p className="text-purple-300 mt-2 mb-8">Vincule sua conta com a do seu amor.</p>
        
        <div className="bg-[#1f1f3a]/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mb-6 border border-purple-500/30">
          <h3 className="text-gray-300 font-semibold">Seu Código de Vínculo</h3>
          <p className="text-sm text-purple-300 mb-3">Compartilhe este código com seu parceiro(a)</p>
          <div className="flex items-center justify-center gap-2 bg-[#1a1a2e] p-3 rounded-lg border border-purple-700">
            <span className="font-mono text-2xl font-bold text-purple-400 tracking-widest">{currentUser.uniqueCode}</span>
            <button onClick={handleCopyCode} className="text-purple-400 hover:text-purple-200 transition">
              {copied ? <span className="text-xs">Copiado!</span> : <Copy size={20} />}
            </button>
          </div>
        </div>

        <div className="bg-[#1f1f3a]/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-purple-500/30">
          <h3 className="text-gray-300 font-semibold">Código do seu Parceiro(a)</h3>
          <p className="text-sm text-purple-300 mb-3">Insira o código que você recebeu</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              value={partnerCode}
              onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
              placeholder="CÓDIGO"
              className="w-full px-4 py-2 bg-[#1a1a2e] border border-purple-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-200 font-mono text-center text-lg tracking-widest"
              required
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 mt-2 px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-500 transition shadow-lg disabled:opacity-50 disabled:cursor-wait transform hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.6)]"
            >
              <Link size={18} />
              {isLoading ? 'Vinculando...' : 'Vincular Contas'}
            </button>
          </form>
        </div>
        <button onClick={onLogout} className="text-sm text-gray-500 hover:text-gray-300 transition mt-8 flex items-center gap-2 mx-auto">
          <LogOut size={14} /> Sair e fazer depois
        </button>
      </div>
    </div>
  );
};

export default LinkPartner;
