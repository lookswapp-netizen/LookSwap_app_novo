import React, { useState } from 'react';
import { generateVideoInstructions } from '../services/geminiService';
import { SceneData } from '../types';
import { Spinner } from './Spinner';

interface StepInstructionsProps {
  sceneData: SceneData;
  pieceName: string;
  speechQuantity: number;
  finalImageUrl: string;
  onNext: (instructions: string) => void;
  onBack: () => void;
}

export const StepInstructions: React.FC<StepInstructionsProps> = ({ 
  sceneData, pieceName, speechQuantity, finalImageUrl, onNext, onBack 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Using the new Autonomous Speech Engine VEO3 with Scene Context
      const instructions = await generateVideoInstructions(pieceName, speechQuantity, finalImageUrl, sceneData);
      onNext(instructions);
    } catch (err: any) {
      setError("Falha ao gerar instruções (Speech Engine VEO3). Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-2xl mx-auto p-6 animate-fade-in min-h-[60vh]">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-4">Speech Engine VEO3</h2>
        <p className="text-slate-400 max-w-lg mx-auto">Gerando roteiro autônomo estilo TikTok Shop com validação de 22 palavras.</p>
      </div>
      <div className="w-full bg-slate-800/50 p-6 rounded-2xl border border-slate-700 backdrop-blur-sm mb-8">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-700 pb-2">Dados do Roteiro</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-slate-900/50 p-3 rounded-lg">
            <span className="block text-slate-500 text-xs uppercase mb-1">Nome da Peça</span>
            <span className="text-white font-medium text-brand-300">{pieceName}</span>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg">
             <span className="block text-slate-500 text-xs uppercase mb-1">Estilo</span>
             <span className="text-white font-medium capitalize">TikTok Shop ({sceneData.category})</span>
          </div>
          <div className="bg-slate-900/50 p-3 rounded-lg">
             <span className="block text-slate-500 text-xs uppercase mb-1">Blocos (22 palavras)</span>
             <span className="text-white font-medium">{speechQuantity} Blocos</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-blue-900/20 border border-blue-500/20 rounded-lg flex items-start gap-3">
             <div className="mt-1 text-blue-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>
             <p className="text-xs text-slate-400">O Speech Engine adaptará o tom para o cenário <strong>{sceneData.category}</strong> e aplicará padrões de validação viral.</p>
        </div>
      </div>
      {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl text-red-200 text-sm w-full flex items-center">{error}</div>}
      <div className="flex flex-col w-full max-w-md gap-4">
        <button onClick={handleGenerate} disabled={isGenerating} className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-3 transition-all ${isGenerating ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-gradient-to-r from-brand-600 to-blue-600 text-white shadow-xl hover:scale-[1.02]'}`}>
          {isGenerating ? <><Spinner /><span>Processando Roteiro...</span></> : <><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg><span>Gerar Arquivo .TXT</span></>}
        </button>
        {!isGenerating && <button onClick={onBack} className="w-full py-3 rounded-xl text-slate-500 hover:text-slate-300 font-medium transition-colors">Voltar para Configuração</button>}
      </div>
    </div>
  );
};