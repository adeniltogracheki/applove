import React, { useState } from 'react';
import { generateCoupleQuestion } from '../services/geminiService';
import { MessageSquare, RefreshCw } from 'lucide-react';

const CoupleQA: React.FC = () => {
  const [question, setQuestion] = useState("Qual é uma coisinha que sempre te faz sorrir?");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>(["Qual é uma coisinha que sempre te faz sorrir?"]);
  
  const handleNewQuestion = async () => {
    setIsLoading(true);
    const newQuestion = await generateCoupleQuestion();
    if (newQuestion && !newQuestion.includes("não foi possível")) {
      setQuestion(newQuestion);
      setHistory(prev => [newQuestion, ...prev].slice(0, 5));
    }
    setIsLoading(false);
  };

  return (
    <div className="animate-fade-in text-center">
      <div className="flex items-center justify-center mb-6">
        <MessageSquare size={32} className="text-purple-400" style={{ filter: 'drop-shadow(0 0 5px #9333ea)' }}/>
        <h1 className="font-display text-4xl font-bold text-gray-100 ml-3" style={{ textShadow: '0 0 10px #9333ea' }}>Casal Q&A</h1>
      </div>
      <p className="text-center text-purple-300 mb-8">Descubra algo novo um sobre o outro.</p>
      
      <div className="bg-[#1f1f3a]/70 border border-purple-500/30 rounded-2xl shadow-lg p-8 min-h-[200px] flex items-center justify-center mb-6">
        {isLoading ? (
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
        ) : (
          <p className="text-xl md:text-2xl font-semibold text-gray-200">{question}</p>
        )}
      </div>
      
      <button 
        onClick={handleNewQuestion}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-500 transition shadow-lg disabled:opacity-60 disabled:cursor-not-allowed transform hover:scale-105 shadow-[0_0_20px_rgba(147,51,234,0.6)]"
      >
        <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        <span>Nova Pergunta</span>
      </button>

      {history.length > 1 && (
        <div className="mt-8 text-left bg-[#1f1f3a]/70 border border-purple-500/30 rounded-2xl p-4">
          <h3 className="font-bold text-gray-300 mb-3">Perguntas Recentes:</h3>
          <ul className="list-disc list-inside space-y-2 text-purple-300 text-sm">
            {history.slice(1).map((q, index) => (
              <li key={index}>{q}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CoupleQA;