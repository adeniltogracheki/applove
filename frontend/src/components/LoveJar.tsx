import React, { useState } from 'react';
import { generateDateIdea } from '@/services/geminiService';
import type { LoveJarItem } from '@/types';
import { Gift, Plus, Sparkles, Trash2 } from 'lucide-react';

const LoveJar: React.FC = () => {
  const [items, setItems] = useState<LoveJarItem[]>([
    { id: 1, text: 'Cozinhar uma nova receita juntos' },
    { id: 2, text: 'Fazer um piquenique ao pôr do sol' },
  ]);
  const [newItem, setNewItem] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      setItems([{ id: Date.now(), text: newItem.trim() }, ...items]);
      setNewItem('');
    }
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleGenerateIdea = async () => {
    setIsLoading(true);
    const idea = await generateDateIdea();
    if (idea && !idea.includes("não foi possível")) {
      setItems([{ id: Date.now(), text: idea }, ...items]);
    }
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-center mb-6 text-center">
        <Gift size={32} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 5px #9333ea)' }}/>
        <h1 className="font-display text-4xl font-bold text-gray-100 ml-3" style={{ textShadow: '0 0 10px #9333ea' }}>Jarrinho de Amor</h1>
      </div>
      <p className="text-center text-purple-300 mb-6">Uma coleção dos nossos sonhos e ideias de encontros.</p>

      <div className="bg-[#1f1f3a]/70 border border-purple-500/30 rounded-2xl shadow-lg p-6 mb-6">
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            placeholder="Adicionar uma nova ideia..."
            className="w-full px-4 py-2 bg-[#1a1a2e] border border-purple-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition text-gray-200"
          />
          <button type="submit" className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-500 transition shadow-[0_0_15px_rgba(147,51,234,0.5)]">
            <Plus size={20} />
          </button>
        </form>
         <button 
          onClick={handleGenerateIdea}
          disabled={isLoading}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-purple-800/50 text-purple-200 font-semibold rounded-full hover:bg-purple-800/80 transition disabled:opacity-50 disabled:cursor-not-allowed border border-purple-700"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-200"></div>
              <span>Gerando...</span>
            </>
          ) : (
            <>
              <Sparkles size={18} />
              <span>Obter Ideia com IA</span>
            </>
          )}
        </button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-[#1f1f3a] rounded-xl shadow-md p-4 flex justify-between items-center transition-transform hover:scale-105 border border-purple-900/50">
            <p className="text-gray-300">{item.text}</p>
            <button onClick={() => handleRemoveItem(item.id)} className="text-gray-500 hover:text-red-500 transition-colors p-1">
              <Trash2 size={18} />
            </button>
          </div>
        ))}
        {items.length === 0 && (
            <p className="text-center text-gray-500 py-8">O jarrinho está vazio. Vamos adicionar algumas ideias!</p>
        )}
      </div>
    </div>
  );
};

export default LoveJar;
