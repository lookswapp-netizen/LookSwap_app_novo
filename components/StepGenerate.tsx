import React, { useState } from 'react';
import { generateLook } from '../services/geminiService';
import { Spinner } from './Spinner';
import { SceneData, AspectRatio, PersonaState } from '../types';

interface StepGenerateProps {
  croppedImage: string;
  sceneData: SceneData | null;
  personaData: PersonaState | null;
  aspectRatio: AspectRatio;
  onGenerateSuccess: (imageUrl: string) => void;
  onBack: () => void;
  onRestart: () => void;
}

export const StepGenerate: React.FC<StepGenerateProps> = ({ 
  croppedImage, 
  sceneData, 
  personaData,
  aspectRatio,
  onGenerateSuccess, 
  onBack
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!sceneData || !personaData) return;
    setIsGenerating(true);
    setError(null);
    setResultImage(null);

    try {
      // Pass aspect ratio and persona data to the service
      const generated = await generateLook(croppedImage, sceneData, personaData, aspectRatio);
      setResultImage(generated);
    } catch (err: any) {
      setError(err.message || "Falha ao gerar imagem. Por favor, tente novamente.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleConfirm = () => {
    if (resultImage) {
      onGenerateSuccess(resultImage);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-6xl mx-auto p-4 lg:p-8 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
          {resultImage ? "Look Final Criado" : "Gerar Look Final"}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          {resultImage 
            ? "Confira seu novo visual. Se gostar, continue para nomear sua peça." 
            : "Nossa IA irá integrar sua peça na nova persona escolhida, preservando rigorosamente seus detalhes."}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start justify-center w-full">
        <div className="w-full lg:w-1/3 flex flex-col space-y-4">
           <div className="bg-slate-800 p-4 rounded-2xl shadow-xl border border-slate-700">
                <div className="text-xs text-slate-400 mb-3 font-mono uppercase tracking-wider font-bold">Peça de Referência</div>
                <div className="aspect-square w-full rounded-xl overflow-hidden bg-black/50 flex items-center justify-center">
                   <img src={croppedImage} alt="Original" className="w-full h-full object-contain" />
                </div>
           </div>
           
           <div className="flex gap-4">
             {sceneData && (
               <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="font-bold text-brand-300 uppercase text-xs mb-3 tracking-wider">Cena</div>
                  <div className="flex items-center mb-2">
                      <span className="w-2 h-2 rounded-full bg-brand-500 mr-2"></span>
                      <span className="text-white font-medium capitalize truncate">{sceneData.category}</span>
                  </div>
               </div>
             )}
             {personaData && (
               <div className="flex-1 bg-slate-800/50 border border-slate-700 rounded-xl p-4">
                  <div className="font-bold text-pink-300 uppercase text-xs mb-3 tracking-wider">Persona</div>
                  <div className="flex flex-col gap-1">
                      <span className="text-xs text-slate-300">Pele: {personaData.skinTone}</span>
                      <span className="text-xs text-slate-300">Cabelo: {personaData.hairStyle}</span>
                  </div>
               </div>
             )}
           </div>
        </div>

        <div className="w-full lg:w-2/3 flex flex-col items-center">
            {resultImage ? (
                <div className="w-full max-w-md flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                     <div className="bg-slate-900 border border-brand-500/30 p-1 rounded-2xl shadow-2xl shadow-brand-900/20 w-full relative">
                        <div className="absolute top-4 right-4 bg-brand-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10 flex items-center">
                            Gerado
                        </div>
                        <img src={resultImage} alt="Generated Result" className="w-full rounded-xl shadow-sm" />
                   </div>

                   <div className="flex flex-col sm:flex-row gap-3 w-full mt-8">
                        <button onClick={() => setResultImage(null)} className="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors border border-slate-700">Gerar Novamente</button>
                        <button onClick={handleConfirm} className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold shadow-lg shadow-brand-900/40 transition-transform transform hover:scale-[1.02]">Ficou Ótimo! Próximo &rarr;</button>
                   </div>
                </div>
            ) : (
                <div className="w-full max-w-lg bg-slate-800/30 p-8 rounded-3xl border border-slate-700/50 backdrop-blur-sm flex flex-col items-center text-center h-full justify-center min-h-[400px]">
                    <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-inner">
                        <svg className="w-10 h-10 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Pronto para Transformar</h3>
                    <p className="text-slate-400 mb-8 text-sm px-4">Vamos criar uma imagem de alta fidelidade da sua peça na persona {personaData?.skinTone} com cabelo {personaData?.hairStyle}.</p>
                    {error && <div className="mb-6 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-200 text-sm w-full">{error}</div>}
                    <div className="flex flex-col w-full space-y-3">
                        <button onClick={handleGenerate} disabled={isGenerating} className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center space-x-2 transition-all ${isGenerating ? 'bg-slate-700 text-slate-400 cursor-wait' : 'bg-white text-brand-900 hover:bg-slate-100 shadow-lg shadow-white/10'}`}>
                            {isGenerating ? <><Spinner /><span>Criando Mágica...</span></> : <><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg><span>Gerar Look Final</span></>}
                        </button>
                        {!isGenerating && <button onClick={onBack} className="w-full py-3 rounded-xl text-slate-500 hover:text-slate-300 font-medium transition-colors text-sm">Voltar e Ajustar</button>}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};