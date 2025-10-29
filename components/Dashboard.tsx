import React, { useState, useEffect } from 'react';
import { Heart, Gift, MessageSquare, Image as ImageIcon } from 'lucide-react';
import type { View, User } from '../types';
import * as authService from '../services/authService';

interface DashboardProps {
  anniversaryDate: Date;
  setView: (view: View) => void;
  user: User;
}

const Dashboard: React.FC<DashboardProps> = ({ anniversaryDate, setView, user }) => {
  const [timeTogether, setTimeTogether] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [nextAnniversary, setNextAnniversary] = useState({ days: 0, date: '' });

  useEffect(() => {
    const calculateTime = () => {
      const now = new Date();
      
      const diff = now.getTime() - anniversaryDate.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setTimeTogether({ days, hours, minutes, seconds });

      let nextAnniversaryDate = new Date(anniversaryDate);
      nextAnniversaryDate.setFullYear(now.getFullYear());
      if (now > nextAnniversaryDate) {
        nextAnniversaryDate.setFullYear(now.getFullYear() + 1);
      }
      const nextAnniversaryDiff = nextAnniversaryDate.getTime() - now.getTime();
      const daysUntil = Math.ceil(nextAnniversaryDiff / (1000 * 60 * 60 * 24));
      setNextAnniversary({
        days: daysUntil,
        date: nextAnniversaryDate.toLocaleDateString('pt-BR', { month: 'long', day: 'numeric' })
      });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [anniversaryDate]);

  return (
    <div className="flex flex-col items-center text-center animate-fade-in">
       <div className="w-full text-left mb-4">
        <p className="text-lg text-gray-300">Olá, <span className="font-bold text-purple-300">{user.displayName || user.username}</span>!</p>
      </div>
      <div className="w-full bg-[#1f1f3a]/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mt-2 border border-purple-500/30">
        <div className="flex items-center justify-center text-purple-400">
          <Heart className="animate-pulse" size={28} style={{ filter: 'drop-shadow(0 0 5px #9333ea)' }}/>
          <h2 className="font-display text-3xl font-bold ml-3">{timeTogether.days.toLocaleString()} Dias Juntos</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 text-gray-300">
          <div className="p-2 rounded-lg bg-purple-900/30">
            <div className="text-3xl font-bold text-purple-400">{String(timeTogether.hours).padStart(2, '0')}</div>
            <div className="text-xs">Horas</div>
          </div>
          <div className="p-2 rounded-lg bg-purple-900/30">
            <div className="text-3xl font-bold text-purple-400">{String(timeTogether.minutes).padStart(2, '0')}</div>
            <div className="text-xs">Minutos</div>
          </div>
          <div className="p-2 rounded-lg bg-purple-900/30">
            <div className="text-3xl font-bold text-purple-400">{String(timeTogether.seconds).padStart(2, '0')}</div>
            <div className="text-xs">Segundos</div>
          </div>
        </div>
      </div>
      
      <div className="w-full bg-[#1f1f3a]/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 mt-6 border border-purple-500/30">
        <h3 className="text-xl font-bold text-gray-200">Próximo Aniversário</h3>
        <p className="text-purple-300 text-sm">{nextAnniversary.date}</p>
        <div className="text-5xl font-bold text-purple-400 my-3" style={{ textShadow: '0 0 8px #9333ea' }}>{nextAnniversary.days}</div>
        <p className="text-gray-300 font-semibold">dias restantes!</p>
      </div>

      <div className="w-full grid grid-cols-3 gap-4 mt-6">
          <button onClick={() => setView('lovejar')} className="bg-[#1f1f3a]/70 p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-purple-500/30 hover:bg-purple-900/50 transition-colors">
              <Gift className="text-purple-400" size={24}/>
              <span className="text-xs">Jarrinho</span>
          </button>
          <button onClick={() => setView('qa')} className="bg-[#1f1f3a]/70 p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-purple-500/30 hover:bg-purple-900/50 transition-colors">
              <MessageSquare className="text-purple-400" size={24}/>
              <span className="text-xs">Q&A</span>
          </button>
          <button onClick={() => setView('memories')} className="bg-[#1f1f3a]/70 p-4 rounded-xl flex flex-col items-center justify-center gap-2 border border-purple-500/30 hover:bg-purple-900/50 transition-colors">
              <ImageIcon className="text-purple-400" size={24}/>
              <span className="text-xs">Lembranças</span>
          </button>
      </div>
    </div>
  );
};

export default Dashboard;
