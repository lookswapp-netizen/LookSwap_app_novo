import React from 'react';
import { Icon } from './Icon';

interface GeneratedImageProps {
  imageData: string;
  onDownload: () => void;
  onReset: () => void;
}

export const GeneratedImage: React.FC<GeneratedImageProps> = ({ imageData, onDownload, onReset }) => {
  const imageUrl = `data:image/jpeg;base64,${imageData}`;

  return (
    <div className="w-full max-w-md mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple mb-4">Seu Novo Look!</h2>
        <div className="relative group overflow-hidden rounded-lg shadow-2xl mb-6">
            <img src={imageUrl} alt="Generated look" className="w-full h-auto object-contain" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a href={imageUrl} download="look_gerado.jpg" className="text-white bg-black/50 p-3 rounded-full">
                    <Icon name="download" className="w-8 h-8"/>
                </a>
            </div>
        </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onDownload}
          className="flex items-center justify-center gap-2 w-full bg-brand-blue hover:bg-brand-blue/90 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          <Icon name="download" className="w-5 h-5" />
          Baixar Imagem
        </button>
        <button
          onClick={() => {}}
          disabled
          className="flex items-center justify-center gap-2 w-full bg-gray-700 text-gray-400 font-bold py-3 px-4 rounded-lg cursor-not-allowed opacity-60"
          title="Funcionalidade em desenvolvimento"
        >
          <Icon name="wand" className="w-5 h-5" />
          Baixar Roupa (PNG)
        </button>
      </div>
      <button
          onClick={onReset}
          className="flex items-center justify-center gap-2 w-full bg-transparent border border-gray-600 hover:bg-gray-800 text-gray-300 font-bold py-3 px-4 rounded-lg transition-colors mt-4"
        >
            <Icon name="reset" className="w-5 h-5" />
            Gerar Outra Imagem
        </button>
    </div>
  );
};