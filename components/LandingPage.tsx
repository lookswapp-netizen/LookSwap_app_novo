import React from 'react';
import { Icon } from './Icon';

interface LandingPageProps {
  onNavigateToApp: () => void;
  onNavigateToPricing: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigateToApp, onNavigateToPricing }) => {
  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center text-center animate-fade-in">
      {/* Topo */}
      <header className="w-full flex justify-center sm:justify-start items-center mb-16 sm:mb-24">
        <h1 className="text-2xl font-bold">LookSwap MM Studio®</h1>
      </header>

      {/* Hero */}
      <section className="w-full mb-20 sm:mb-32">
        <div className="w-full h-64 md:h-96 bg-gradient-to-br from-brand-blue/20 to-brand-purple/20 rounded-2xl mb-8 flex items-center justify-center border border-gray-700 shadow-2xl">
           <Icon name="sparkles" className="w-24 h-24 text-brand-blue/50" />
        </div>
        <h2 className="text-4xl md:text-6xl font-extrabold mb-4 leading-tight">
          Crie looks perfeitos com IA.<br/>Sem modelo. Sem estúdio. Só com uma foto.
        </h2>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-8">
          Feito para criadores de TikTok Shop, Shopee e marketplaces acelerarem vendas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={onNavigateToApp} className="bg-gradient-to-r from-brand-blue to-brand-purple hover:opacity-90 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 text-lg">
            Entrar / Criar Conta
          </button>
          <button onClick={onNavigateToPricing} className="bg-transparent border-2 border-gray-600 hover:bg-gray-800 text-gray-300 font-bold py-3 px-8 rounded-lg transition-colors text-lg">
            Planos e Preços
          </button>
        </div>
      </section>

      {/* Benefícios */}
      <section className="w-full grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-left">
            <Icon name="clock" className="w-8 h-8 mb-4 text-brand-blue" />
            <h3 className="text-xl font-bold mb-2">Produza imagens de moda em segundos</h3>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-left">
            <Icon name="wand" className="w-8 h-8 mb-4 text-brand-blue" />
            <h3 className="text-xl font-bold mb-2">Ambientes, personas e acessórios variáveis</h3>
        </div>
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-left">
            <Icon name="sparkles" className="w-8 h-8 mb-4 text-brand-blue" />
            <h3 className="text-xl font-bold mb-2">Qualidade profissional</h3>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="text-center mt-8 text-gray-500 text-sm">
        <p>LookSwap MM Studio®</p>
      </footer>
    </div>
  );
};