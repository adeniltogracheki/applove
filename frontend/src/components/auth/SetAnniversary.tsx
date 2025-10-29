import React, { useState } from 'react';
import { Calendar, LogOut } from 'lucide-react';
import * as authService from '@/services/authService';
import type { User } from '@/types';

interface SetAnniversaryProps {
  currentUser: User;
  onDateSet: (user: User) => void;
  onLogout: () => void;
}

const SetAnniversary: React.FC<SetAnniversaryProps> = ({ currentUser, onDateSet, onLogout }) => {
  const [anniversaryDate, setAnniversaryDate] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!anniversaryDate) {
        setError('Por favor, selecione uma data.');
        return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const updatedUser = await authService.setAnniversary(currentUser.uniqueCode, anniversaryDate);
      onDateSet(updatedUser);
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro ao salvar a data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#1a1a2e] min-h-screen text-gray-200 flex flex-col justify-center items-center p-4 font-sans animate-fade-in">
      <div className="w-full max-w-sm text-center">
        <h1 className="font-display text-4xl font-bold text-gray-100" style={{ textShadow: '0 0 10px #9333ea' }}>
          Nossa Data Especial
        </h1>
        <p className="text-purple-300 mt-2 mb-8">Quando tudo começou?</p>
        
        <div className="bg-[#1f1f3a]/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-purple-500/30">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label htmlFor="anniversary" className="text-gray-300 font-semibold">Data de Aniversário</label>
            <input
              id="anniversary"
              type="date"
              value={anniversaryDate}
              onChange={(e) => setAnniversaryDate(e.target.value)}
              className="w-full px-4 py-3 bg-[#1a1a2e] border border-purple-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-200 text-center"
              style={{ colorScheme: 'dark' }}
              required
            />
            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 mt-4 px-6 py-3 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-500 transition shadow-lg disabled:opacity-50 disabled:cursor-wait transform hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.6)]"
            >
              <Calendar size={18} />
              {isLoading ? 'Salvando...' : 'Salvar Data'}
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

export default SetAnniversary;