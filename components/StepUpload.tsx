import React, { useCallback, useState } from 'react';
import { AspectRatio } from '../types';

interface StepUploadProps {
  onImageUpload: (base64: string, ratio: AspectRatio) => void;
}

export const StepUpload: React.FC<StepUploadProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedRatio, setSelectedRatio] = useState<AspectRatio>('9:16');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor, envie um arquivo de imagem.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (result) {
        onImageUpload(result, selectedRatio);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRatio]);

  return (
    <div className="flex flex-col items-center justify-center h-full w-full max-w-2xl mx-auto p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Configuração Inicial</h2>
        <p className="text-slate-400">Escolha o formato do vídeo e carregue sua foto.</p>
      </div>

      {/* Aspect Ratio Selection */}
      <div className="grid grid-cols-2 gap-4 w-full mb-8">
        <button
          onClick={() => setSelectedRatio('9:16')}
          className={`
            flex flex-col items-center p-4 rounded-xl border-2 transition-all
            ${selectedRatio === '9:16' 
              ? 'bg-brand-900/20 border-brand-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
              : 'bg-slate-800 border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'}
          `}
        >
          <div className="w-6 h-10 border-2 border-current rounded-sm mb-2 bg-current/10"></div>
          <span className="font-bold text-white">Vertical (9:16)</span>
          <span className="text-xs text-slate-400">Stories / Reels / TikTok</span>
        </button>

        <button
          onClick={() => setSelectedRatio('16:9')}
          className={`
            flex flex-col items-center p-4 rounded-xl border-2 transition-all
            ${selectedRatio === '16:9' 
              ? 'bg-brand-900/20 border-brand-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
              : 'bg-slate-800 border-slate-700 opacity-60 hover:opacity-100 hover:border-slate-500'}
          `}
        >
          <div className="w-10 h-6 border-2 border-current rounded-sm mb-2 bg-current/10"></div>
          <span className="font-bold text-white">Horizontal (16:9)</span>
          <span className="text-xs text-slate-400">Cinemático / Youtube</span>
        </button>
      </div>

      <label
        className={`
          relative flex flex-col items-center justify-center w-full h-64 
          border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300
          ${isDragging ? 'border-brand-500 bg-brand-500/10' : 'border-slate-600 hover:border-brand-400 hover:bg-slate-800'}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-12 h-12 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
          </svg>
          <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Clique para enviar</span> ou arraste e solte</p>
          <p className="text-xs text-slate-500">SVG, PNG, JPG ou GIF</p>
        </div>
        <input 
          type="file" 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange}
        />
      </label>
    </div>
  );
};