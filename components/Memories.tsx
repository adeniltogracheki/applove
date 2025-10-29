import React, { useState, useRef } from 'react';
import type { MemoryItem } from '../types';
import { Image as ImageIcon, PlusCircle } from 'lucide-react';

const Memories: React.FC = () => {
  const [memories, setMemories] = useState<MemoryItem[]>([
    { id: 1, src: 'https://picsum.photos/400/500?random=1' },
    { id: 2, src: 'https://picsum.photos/400/400?random=2' },
    { id: 3, src: 'https://picsum.photos/500/400?random=3' },
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (typeof result === 'string') {
          const newMemory: MemoryItem = {
            id: Date.now(),
            src: result,
          };
          setMemories([newMemory, ...memories]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-center mb-6 text-center">
        <ImageIcon size={32} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 5px #9333ea)' }}/>
        <h1 className="font-display text-4xl font-bold text-gray-100 ml-3" style={{ textShadow: '0 0 10px #9333ea' }}>Nossas Lembranças</h1>
      </div>
      <p className="text-center text-purple-300 mb-6">Uma galeria dos nossos momentos favoritos.</p>

      <div className="columns-2 md:columns-3 gap-4">
        <button 
          onClick={handleAddClick} 
          className="w-full aspect-square bg-[#1f1f3a]/70 border-2 border-dashed border-purple-600 rounded-xl flex flex-col items-center justify-center text-purple-400 hover:bg-purple-900/50 hover:border-purple-400 transition mb-4"
        >
          <PlusCircle size={40} />
          <span className="mt-2 font-semibold">Adicionar Lembrança</span>
        </button>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {memories.map((memory) => (
          <div key={memory.id} className="mb-4 break-inside-avoid">
            <img 
              src={memory.src} 
              alt="Lembrança do casal" 
              className="w-full rounded-xl shadow-lg transition-transform hover:scale-105 hover:shadow-xl hover:shadow-purple-500/30"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Memories;