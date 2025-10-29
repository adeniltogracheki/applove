import React from 'react';
import { Gamepad2 } from 'lucide-react';

const Games: React.FC = () => {
  return (
    <div className="animate-fade-in text-center">
      <div className="flex items-center justify-center mb-6">
        <Gamepad2 size={32} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 5px #9333ea)' }}/>
        <h1 className="font-display text-4xl font-bold text-gray-100 ml-3" style={{ textShadow: '0 0 10px #9333ea' }}>Jogos</h1>
      </div>
      <p className="text-purple-300 mb-8">Divirtam-se com jogos feitos para casais.</p>
      
      <div className="bg-[#1f1f3a]/70 border border-purple-500/30 rounded-2xl shadow-lg p-8 min-h-[300px] flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p>Em breve, novos jogos para vocês!</p>
          <p className="text-sm">(Funcionalidade em desenvolvimento)</p>
        </div>
      </div>
    </div>
  );
};

export default Games;