import React from 'react';

interface StepResultProps {
  generatedImage: string;
  instructions: string;
  pieceName: string;
  onRestart: () => void;
}

export const StepResult: React.FC<StepResultProps> = ({ generatedImage, instructions, pieceName, onRestart }) => {
  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${pieceName.replace(/\s+/g, '_')}_LookSwap.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadText = () => {
    const blob = new Blob([instructions], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Instrucoes_VEO3_Venda_Look.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const copyInstructions = () => {
    navigator.clipboard.writeText(instructions);
    alert("Instruções copiadas para a área de transferência!");
  };

  return (
    <div className="flex flex-col lg:flex-row h-full w-full max-w-7xl mx-auto p-4 lg:p-8 animate-fade-in gap-8">
      <div className="w-full lg:w-1/3 flex flex-col items-center lg:items-start">
        <h2 className="text-2xl font-bold text-white mb-4 lg:hidden">Resultado Final</h2>
        <div className="bg-slate-900 p-2 rounded-2xl border border-slate-700 shadow-2xl w-full max-w-md relative group">
            <img src={generatedImage} alt="Final Look" className="w-full rounded-xl aspect-[9/16] object-cover" />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                <button onClick={downloadImage} className="bg-white text-slate-900 px-6 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transform hover:scale-105 transition-all">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Baixar Imagem
                </button>
            </div>
        </div>
        <button onClick={downloadImage} className="mt-4 w-full max-w-md py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors border border-slate-700 flex items-center justify-center gap-2 lg:hidden"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Baixar Imagem</button>
      </div>
      <div className="w-full lg:w-2/3 flex flex-col h-full">
         <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-white hidden lg:block">Projeto Concluído</h2>
            <div className="flex space-x-3">
                <button onClick={onRestart} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors">Gerar Novamente</button>
            </div>
         </div>
         <div className="flex-grow bg-slate-900 rounded-xl border border-slate-700 overflow-hidden flex flex-col shadow-xl min-h-[400px]">
            <div className="bg-slate-800 px-4 py-3 border-b border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-2"><svg className="w-5 h-5 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg><span className="font-mono text-sm text-slate-300">Instrucoes_VEO3_Venda_Look.txt</span></div>
                <div className="flex space-x-2">
                    <button onClick={copyInstructions} className="flex items-center gap-2 px-3 py-1.5 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition-colors border border-transparent hover:border-slate-600" title="Copiar Conteúdo">
                        <span className="text-xs font-bold uppercase">Copiar Instruções</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                    </button>
                </div>
            </div>
            <div className="p-6 overflow-y-auto flex-grow bg-[#0d1117] font-mono text-sm text-slate-300 max-h-[500px]">
                <pre className="whitespace-pre-wrap">{instructions}</pre>
            </div>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <button onClick={downloadText} className="py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold shadow-lg border border-slate-600 hover:border-brand-500 transition-all flex items-center justify-center gap-2"><svg className="w-6 h-6 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Baixar .TXT</button>
            <button onClick={downloadImage} className="hidden lg:flex py-4 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-bold shadow-lg shadow-brand-900/30 transition-all transform hover:scale-[1.02] items-center justify-center gap-2"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>Baixar Imagem</button>
         </div>
      </div>
    </div>
  );
};