import React, { useState } from 'react';

interface StepSpeechProps {
  onNext: (quantity: number) => void;
  onBack: () => void;
}

export const StepSpeech: React.FC<StepSpeechProps> = ({ onNext, onBack }) => {
  const [quantity, setQuantity] = useState<number>(3);

  const handleConfirm = () => {
    onNext(quantity);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Configuração de Falas</h2>
        <p className="text-slate-400">Quantas linhas o apresentador deve falar?</p>
      </div>
      <div className="w-full bg-slate-800/50 p-8 rounded-3xl border border-slate-700 backdrop-blur-sm mb-8">
        <div className="mb-10">
           <label className="block text-center text-sm font-bold text-slate-300 uppercase tracking-wider mb-6">Quantidade de Falas (1-6)</label>
           <div className="flex items-center justify-center gap-3">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button key={num} onClick={() => setQuantity(num)} className={`w-12 h-12 md:w-16 md:h-16 rounded-xl font-bold text-xl md:text-2xl transition-all duration-300 flex items-center justify-center ${quantity === num ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/40 scale-110 -translate-y-1' : 'bg-slate-700 text-slate-400 hover:bg-slate-600 hover:text-white'}`}>{num}</button>
              ))}
           </div>
        </div>
        <div className="space-y-4">
            <div className="flex items-start p-4 bg-blue-900/20 border border-blue-500/20 rounded-xl">
                <div className="bg-blue-500/20 p-2 rounded-lg mr-4"><svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
                <div><h4 className="text-white font-semibold text-sm">Limite de Extensão</h4><p className="text-slate-400 text-xs mt-1">Cada bloco de fala será gerado com aproximadamente 22 palavras.</p></div>
            </div>
            <div className="flex items-start p-4 bg-orange-900/20 border border-orange-500/20 rounded-xl">
                <div className="bg-orange-500/20 p-2 rounded-lg mr-4"><svg className="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div>
                <div><h4 className="text-white font-semibold text-sm">Chamada para Ação Obrigatória</h4><p className="text-slate-400 text-xs mt-1">A fala final incluirá automaticamente: <br/><span className="text-orange-300 italic">"clica aqui embaixo no carrinho laranja"</span></p></div>
            </div>
        </div>
      </div>
      <div className="flex space-x-4 w-full justify-center max-w-md">
        <button onClick={onBack} className="px-6 py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors">Voltar</button>
        <button onClick={handleConfirm} className="flex-1 px-6 py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold shadow-lg shadow-brand-900/30 transition-all hover:scale-[1.02]">Finalizar Configuração</button>
      </div>
    </div>
  );
};