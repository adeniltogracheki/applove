import React, { useState, useEffect } from 'react';
import { generateDateIdea } from '@/services/geminiService';
import * as loveJarService from '@/services/loveJarService';
import type { LoveJarItem, User } from '@/types';
import { Gift, Plus, Sparkles, Trash2, User as UserIcon } from 'lucide-react';

interface LoveJarProps {
  user: User;
}

const LoveJar: React.FC<LoveJarProps> = ({ user }) => {
  const [items, setItems] = useState<LoveJarItem[]>([]);
  const [newItem, setNewItem] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const fetchedItems = await loveJarService.getLoveJarItems(user.uniqueCode);
        setItems(fetchedItems);
      } catch (error) {
        console.error("Erro ao buscar itens do jarrinho:", error);
      } finally {
        setIsFetching(false);
      }
    };
    fetchItems();
  }, [user.uniqueCode]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newItem.trim()) {
      setIsAdding(true);
      try {
        const addedItem = await loveJarService.addLoveJarItem(user.uniqueCode, newItem.trim());
        setItems([addedItem, ...items]);
        setNewItem('');
      } catch (error) {
        console.error("Erro ao adicionar item:", error);
      } finally {
        setIsAdding(false);
      }
    }
  };

  const handleRemoveItem = async (id: number) => {
    try {
      await loveJarService.deleteLoveJarItem(id);
      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Erro ao remover item:", error);
    }
  };
  
  const handleGenerateIdea = async () => {
    setIsGenerating(true);
    try {
      const idea = await generateDateIdea();
      if (idea && !idea.includes("não foi possível")) {
        const addedItem = await loveJarService.addLoveJarItem(user.uniqueCode, idea);
        setItems([addedItem, ...items]);
      }
    } catch (error) {
      console.error("Erro ao gerar e adicionar ideia:", error);
    } finally {
      setIsGenerating(false);
    }
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
            disabled={isAdding}
          />
          <button type="submit" className="bg-purple-600 text-white p-3 rounded-full hover:bg-purple-500 transition shadow-[0_0_15px_rgba(147,51,234,0.5)] disabled:opacity-50" disabled={isAdding}>
            {isAdding ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : <Plus size={20} />}
          </button>
        </form>
         <button 
          onClick={handleGenerateIdea}
          disabled={isGenerating}
          className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-purple-800/50 text-purple-200 font-semibold rounded-full hover:bg-purple-800/80 transition disabled:opacity-50 disabled:cursor-not-allowed border border-purple-700"
        >
          {isGenerating ? (
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
        {isFetching ? (
            <p className="text-center text-gray-500 py-8">Carregando ideias do jarrinho...</p>
        ) : items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="bg-[#1f1f3a] rounded-xl shadow-md p-4 flex justify-between items-center transition-transform hover:scale-105 border border-purple-900/50">
              <div className="flex items-center gap-3 flex-grow">
                {item.authorPictureUrl ? (
                    <img src={item.authorPictureUrl} alt="autor" className="w-8 h-8 rounded-full object-cover"/>
                ) : (
                    <div className="w-8 h-8 rounded-full bg-purple-900 flex items-center justify-center flex-shrink-0">
                        <UserIcon className="text-purple-400" size={16} />
                    </div>
                )}
                <p className="text-gray-300 break-words w-[calc(100%-60px)]">{item.text}</p>
              </div>
              <button onClick={() => handleRemoveItem(item.id)} className="text-gray-500 hover:text-red-500 transition-colors p-1 ml-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))
        ) : (
            <p className="text-center text-gray-500 py-8">O jarrinho está vazio. Vamos adicionar algumas ideias!</p>
        )}
      </div>
    </div>
  );
};

export default LoveJar;
