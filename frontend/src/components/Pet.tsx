import React from 'react';
import { PawPrint } from 'lucide-react';

const Pet: React.FC = () => {
  return (
    <div className="animate-fade-in text-center">
      <div className="flex items-center justify-center mb-6">
        <PawPrint size={32} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 5px #9333ea)' }}/>
        <h1 className="font-display text-4xl font-bold text-gray-100 ml-3" style={{ textShadow: '0 0 10px #9333ea' }}>Nosso Pet</h1>
      </div>
      <p className="text-purple-300 mb-8">Cuidem juntos do seu cachorrinho virtual.</p>
      
      <div className="bg-[#1f1f3a]/70 border border-purple-500/30 rounded-2xl shadow-lg p-8 min-h-[300px] flex flex-col items-center justify-center">
        <div className="text-6xl mb-4" role="img" aria-label="dog emoji">🐶</div>
        <div className="text-center text-gray-500">
            <p>Seu pet aparecerá aqui.</p>
            <p className="text-sm">(Funcionalidade em desenvolvimento)</p>
        </div>
      </div>

       <div className="grid grid-cols-2 gap-4 mt-6">
          <button className="bg-purple-600/50 p-4 rounded-xl flex items-center justify-center gap-2 border border-purple-500/30 hover:bg-purple-600/80 transition-colors">
              <span role="img" aria-label="food emoji">🍖</span>
              <span>Alimentar</span>
          </button>
          <button className="bg-purple-600/50 p-4 rounded-xl flex items-center justify-center gap-2 border border-purple-500/30 hover:bg-purple-600/80 transition-colors">
              <span role="img" aria-label="water emoji">💧</span>
              <span>Dar Água</span>
          </button>
      </div>
    </div>
  );
};

export default Pet;
