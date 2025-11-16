import React from 'react';
import { Icon } from './Icon';

interface PricingPageProps {
  onLogin: () => void;
}

const pricingTiers = [
  {
    name: 'Starter',
    price: 'Grátis',
    frequency: '',
    description: 'Comece a criar e explore as funcionalidades básicas.',
    features: [
      '20 gerações por mês',
      'Acesso a todas as personas',
      'Acessórios básicos',
      'Resolução padrão',
    ],
    cta: 'Assinar',
    isFeatured: false,
  },
  {
    name: 'Pro',
    price: 'R$49',
    frequency: '/mês',
    description: 'O plano ideal para criadores que buscam máximo impacto.',
    features: [
      'Gerações ilimitadas',
      'Acessórios premium (chapéus, boné, joias)',
      'Ambientes completos (luxo, tumblr, nórdico, externo, noturno)',
      'Mirror interactions premium',
      'Resolução máxima',
      'Prioridade no servidor de IA',
    ],
    cta: 'Assinar Pro',
    isFeatured: true,
  },
  {
    name: 'Ultra',
    price: 'R$199',
    frequency: '/mês',
    description: 'Para marcas que exigem o melhor em performance e suporte.',
    features: [
      'Tudo do Pro',
      'Upgrades antecipados',
      'Suporte VIP',
      'Prioridade máxima no motor de IA',
    ],
    cta: 'Assinar Ultra',
    isFeatured: false,
  },
];


export const PricingPage: React.FC<PricingPageProps> = ({ onLogin }) => {
  return (
    <div className="w-full max-w-6xl mx-auto flex flex-col items-center animate-fade-in">
        <header className="text-center mb-8 md:mb-12">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-purple">
                Escolha o seu plano e comece a criar.
            </h1>
        </header>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier) => (
            <div
                key={tier.name}
                className={`flex flex-col p-6 rounded-2xl border-2 ${tier.isFeatured ? 'border-brand-blue bg-gray-800' : 'border-gray-700 bg-gray-800/50'}`}
            >
                {tier.isFeatured && (
                <span className="bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-full self-center mb-4 -mt-10">
                    MAIS POPULAR
                </span>
                )}
                <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                <p className="mt-2 text-gray-400 h-12">{tier.description}</p>
                <div className="my-6">
                <span className="text-5xl font-extrabold text-white">{tier.price}</span>
                <span className="text-lg font-medium text-gray-400">{tier.frequency}</span>
                </div>
                <ul className="space-y-3 text-left mb-8 flex-grow">
                {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center">
                    <Icon name="check" className="w-5 h-5 text-green-400 mr-2" />
                    <span className="text-gray-300">{feature}</span>
                    </li>
                ))}
                </ul>
                <button
                className={`w-full font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105
                    ${tier.isFeatured
                    ? 'bg-brand-blue hover:bg-brand-blue/90 text-white'
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                >
                {tier.cta}
                </button>
            </div>
            ))}
        </div>

        <div className="mt-12 text-center">
            <p className="text-lg text-gray-300 italic">“A ferramenta que está mudando o jogo nos marketplaces.”</p>
        </div>

        <footer className="text-center mt-8 text-gray-400">
            <p>
                Já tem uma conta?{' '}
                <button onClick={onLogin} className="font-semibold text-brand-blue hover:underline focus:outline-none">
                    Entrar
                </button>
            </p>
        </footer>
    </div>
  );
};