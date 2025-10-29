import React from 'react';
import { MessageCircle, Send } from 'lucide-react';

const Chat: React.FC = () => {
  return (
    <div className="animate-fade-in flex flex-col h-full">
      <div className="flex items-center justify-center mb-6 text-center">
        <MessageCircle size={32} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 5px #9333ea)' }}/>
        <h1 className="font-display text-4xl font-bold text-gray-100 ml-3" style={{ textShadow: '0 0 10px #9333ea' }}>Chat</h1>
      </div>
      <p className="text-center text-purple-300 mb-6 flex-shrink-0">Nosso cantinho para conversar.</p>
      
      <div className="flex-grow bg-[#1f1f3a]/70 border border-purple-500/30 rounded-2xl shadow-lg p-4 flex flex-col justify-end">
        {/* Placeholder para mensagens */}
        <div className="text-center text-gray-500">
          <p>As mensagens aparecerão aqui.</p>
          <p className="text-sm">(Funcionalidade em desenvolvimento)</p>
        </div>
      </div>

      <div className="mt-4 flex gap-2 flex-shrink-0">
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          className="w-full px-4 py-3 bg-[#1a1a2e] border border-purple-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-200"
        />
        <button className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-500 transition shadow-[0_0_15px_rgba(147,51,234,0.5)] flex-shrink-0">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
