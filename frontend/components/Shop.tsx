import React from 'react';
import { ShoppingCart, PawPrint, Palette, Gift } from 'lucide-react';

const Shop: React.FC = () => {
  return (
    <div className="animate-fade-in">
      <div className="flex items-center justify-center mb-6 text-center">
        <ShoppingCart size={32} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 5px #9333ea)' }}/>
        <h1 className="font-display text-4xl font-bold text-gray-100 ml-3" style={{ textShadow: '0 0 10px #9333ea' }}>Lojinha</h1>
      </div>
      <p className="text-center text-purple-300 mb-8">Mimos e itens especiais para personalizar seu espaço.</p>

      <div className="space-y-6">
        {/* Seção Pet */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-purple-300 mb-3">
            <PawPrint size={20} />
            <span>Para seu Pet</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             <ShopItem name="Roupinha de Sapo" price="150" emoji="🐸" />
             <ShopItem name="Bolinha de Tênis" price="50" emoji="🎾" />
             <ShopItem name="Pote de Ração Chique" price="100" emoji="🍲" />
          </div>
        </div>

        {/* Seção Temas */}
        <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-purple-300 mb-3">
            <Palette size={20} />
            <span>Temas para o App</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <ShopItem name="Tema 'Noite Estrelada'" price="500" emoji="🌌" />
            <ShopItem name="Tema 'Praia ao Entardecer'" price="500" emoji="🌅" />
          </div>
        </div>
        
        {/* Seção Caixas */}
         <div>
          <h2 className="flex items-center gap-2 text-xl font-bold text-purple-300 mb-3">
            <Gift size={20} />
            <span>Caixas Surpresa</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
             <ShopItem name="Caixa de Mimos Rara" price="300" emoji="🎁" />
          </div>
        </div>
      </div>
       <p className="text-center text-gray-500 mt-8 text-sm">(Funcionalidade em desenvolvimento)</p>
    </div>
  );
};

interface ShopItemProps {
    name: string;
    price: string;
    emoji: string;
}

const ShopItem: React.FC<ShopItemProps> = ({ name, price, emoji }) => (
    <div className="bg-[#1f1f3a]/70 border border-purple-500/30 rounded-2xl shadow-lg p-4 flex flex-col items-center justify-between text-center transition-transform hover:scale-105 hover:border-purple-400">
        <div className="text-5xl mb-3">{emoji}</div>
        <p className="text-sm font-semibold text-gray-200 h-10">{name}</p>
        <button className="mt-3 w-full bg-purple-600/50 text-purple-200 font-bold py-1.5 rounded-full border border-purple-600 hover:bg-purple-600/80 transition text-sm">
            {price} ✨
        </button>
    </div>
);


export default Shop;