import React, { useState } from 'react';
import { SceneCategory, SceneData } from '../types';

interface StepStyleProps {
  onNext: (data: SceneData) => void;
  onBack: () => void;
}

interface CategoryConfig {
  id: SceneCategory;
  title: string;
  icon: React.ReactNode;
  description: string;
  sections: Record<string, string[]>;
}

// Dicionário de descrições para os Tooltips
const optionDescriptions: Record<string, string> = {
  // Ambientes
  'Closet Minimalista': 'Fundo clean e organizado, ideal para destacar detalhes da roupa.',
  'Banheiro de Luxo': 'Estética high-end com mármores e iluminação suave e elegante.',
  'Quarto Luxuoso Moderno': 'Ambiente sofisticado com tons neutros e decoração contemporânea.',
  'Quarto com LEDs': 'Visual jovem e moderno com iluminação colorida ao fundo.',
  'Quarto Tumblr Rosa': 'Estética suave, tons pastéis e decoração aconchegante.',
  'Decoração Nórdica': 'Tons brancos e madeira, luz natural e simplicidade.',
  'Ambiente Noturno com Neon': 'Contraste alto, luzes vibrantes e atmosfera urbana.',
  'Estúdio Fotográfico Branco': 'Fundo infinito branco, foco total no produto sem distrações.',
  'Estúdio Industrial Urbano': 'Paredes de concreto e texturas rústicas para um look street.',
  'Sala Moderna': 'Ambiente residencial chique, com móveis de design.',
  'Rua Urbana': 'Cenário de cidade, calçada e arquitetura ao fundo.',
  'Jardim': 'Luz natural, verde e natureza para looks frescos.',
  'Varanda Externa': 'Luz do dia com arquitetura externa suave.',
  'Cena Noturna com Luzes': 'Bokeh de luzes da cidade ao fundo, atmosfera premium.',
  
  // Tipos/Poses
  'Corpo Inteiro': 'Enquadramento total, mostrando o look dos pés à cabeça.',
  'Decorativo': 'Foco artístico, ideal para compor o feed.',
  'Provador': 'Ângulo clássico de "look do dia" em frente ao espelho.',
  'Frontal': 'Câmera direta, destacando o rosto e a parte superior do look.',
  'Ângulo Influencer': 'Câmera levemente acima, valorizando a silhueta.',
  'Corpo Central': 'Pose simétrica e forte, ideal para catálogos.',
  'Levemente Angular': 'Pose de 3/4, criando dinamismo e elegância.',
  'Mão na Cintura': 'Pose clássica de moda para definir a silhueta.',
  'Movimento Leve': 'Sensação de andar ou girar, trazendo vida à roupa.',
  'Zoom Textura': 'Close-up para mostrar tecido e detalhes da peça.',

  // Ações
  'Olhar Reflexo': 'Modelo olhando para o próprio reflexo no espelho.',
  'Selfie no Espelho': 'Segurando o celular, simulando uma foto real.',
  'Giro Leve': 'Movimento sutil para mostrar caimento.',
  
  // Acessórios
  'Celular': 'Segurando um smartphone moderno.',
  'Bolsa': 'Complemento com bolsa lateral ou de mão.',
  'Relógio': 'Detalhe de luxo no pulso.',
  'Pulseira': 'Acessórios delicados no pulso.',
  'Colar': 'Destaque para joias no pescoço.',
  'Nenhum': 'Foco 100% na peça de roupa principal.',
  'Celular na Mão': 'Smartphone visível na composição.',
  'Celular no Rosto': 'Cobrindo parcialmente o rosto, estilo "misterioso".',
  'Bolsa Lateral': 'Bolsa cruzada ou no ombro.',
  'Chapéu Estilizado': 'Adiciona personalidade com chapéu ou boné.',

  // Expressões/Mood/Iluminação
  'Neutra Elegante': 'Expressão séria e sofisticada.',
  'Sorriso Leve': 'Expressão amigável e acessível.',
  'Confiante Suave': 'Olhar direto e postura segura.',
  'Editorial': 'Visual de revista, pose artística.',
  'Minimalista': 'Menos é mais, linhas limpas.',
  'Catálogo Profissional': 'Iluminação perfeita e pose clara para venda.',
  'Difusa Suave': 'Luz sem sombras duras, valoriza a pele.',
  'Quente Natural': 'Luz dourada, simulando sol.',
  'Neutra Comercial': 'Luz branca balanceada, cores reais.'
};

export const StepStyle: React.FC<StepStyleProps> = ({ onNext, onBack }) => {
  const [activeCategory, setActiveCategory] = useState<SceneCategory | null>(null);
  const [selections, setSelections] = useState<Record<string, string>>({});

  const categories: CategoryConfig[] = [
    {
      id: 'mirror',
      title: 'Cena com Espelho',
      description: 'Reflexos e vibes de provador',
      icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5h8a2 2 0 012 2v10a2 2 0 01-2 2H8a2 2 0 01-2-2V7a2 2 0 012-2z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2H8z"></path></svg>),
      sections: {
        'Ambiente': ['Closet Minimalista', 'Banheiro de Luxo', 'Quarto Luxuoso Moderno', 'Quarto com LEDs'],
        'Tipo': ['Corpo Inteiro', 'Decorativo', 'Provador'],
        'Ação': ['Olhar Reflexo', 'Selfie no Espelho', 'Giro Leve'],
        'Acessórios': ['Celular', 'Bolsa', 'Relógio', 'Pulseira', 'Colar', 'Nenhum']
      }
    },
    {
      id: 'selfie',
      title: 'Selfie',
      description: 'Foco em ângulos e expressões',
      icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>),
      sections: {
        'Ambiente': ['Quarto Tumblr Rosa', 'Decoração Nórdica', 'Ambiente Noturno com Neon', 'Quarto Luxuoso Moderno'],
        'Ângulo': ['Frontal', 'Ângulo Influencer'],
        'Acessórios': ['Celular na Mão', 'Celular no Rosto', 'Bolsa', 'Relógio', 'Pulseira', 'Colar'],
        'Expressão': ['Neutra Elegante', 'Sorriso Leve', 'Confiante Suave']
      }
    },
    {
      id: 'promo',
      title: 'Pose Promocional',
      description: 'Visual profissional e clean',
      icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>),
      sections: {
        'Ambiente': ['Estúdio Fotográfico Branco', 'Estúdio Industrial Urbano', 'Sala Moderna', 'Rua Urbana'],
        'Pose': ['Corpo Central', 'Levemente Angular', 'Mão na Cintura'],
        'Iluminação': ['Difusa Suave', 'Quente Natural', 'Neutra Comercial']
      }
    },
    {
      id: 'editorial',
      title: 'Editorial / Catálogo',
      description: 'Alta moda e moods minimalistas',
      icon: (<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>),
      sections: {
        'Ambiente': ['Jardim', 'Varanda Externa', 'Cena Noturna com Luzes', 'Rua Urbana', 'Ambiente Noturno com Neon'],
        'Mood': ['Editorial', 'Minimalista', 'Catálogo Profissional'],
        'Composição': ['Corpo Inteiro', 'Movimento Leve', 'Zoom Textura'],
        'Elementos': ['Bolsa Lateral', 'Chapéu Estilizado']
      }
    }
  ];

  const handleCategorySelect = (id: SceneCategory) => {
    if (activeCategory === id) return;
    setActiveCategory(id);
    const config = categories.find(c => c.id === id);
    if (config) {
      const defaults: Record<string, string> = {};
      Object.entries(config.sections).forEach(([key, options]) => {
        defaults[key] = options[0];
      });
      setSelections(defaults);
    }
  };

  const handleOptionSelect = (sectionKey: string, value: string) => {
    setSelections(prev => ({ ...prev, [sectionKey]: value }));
  };

  const handleConfirm = () => {
    if (activeCategory) {
      onNext({ category: activeCategory, options: selections });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Escolha o Estilo da Cena</h2>
        <p className="text-slate-400">Selecione o ambiente e a vibe para o seu novo look.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className={`relative p-6 rounded-xl border-2 text-left transition-all duration-300 ${activeCategory === cat.id ? 'bg-brand-900/20 border-brand-500 ring-1 ring-brand-500/50' : 'bg-slate-800 border-slate-700 hover:border-brand-400/50 hover:bg-slate-800/80'}`}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-lg ${activeCategory === cat.id ? 'bg-brand-500 text-white' : 'bg-slate-700 text-slate-400'}`}>{cat.icon}</div>
              <div>
                <h3 className={`text-lg font-bold ${activeCategory === cat.id ? 'text-white' : 'text-slate-200'}`}>{cat.title}</h3>
                <p className="text-sm text-slate-400 mt-1">{cat.description}</p>
              </div>
            </div>
            {activeCategory === cat.id && <div className="absolute top-4 right-4 w-3 h-3 bg-brand-500 rounded-full shadow-[0_0_10px_rgba(139,92,246,0.8)]"></div>}
          </button>
        ))}
      </div>

      <div className={`overflow-hidden transition-all duration-500 ease-in-out ${activeCategory ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {activeCategory && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-6 mb-8">
            <div className="flex items-center mb-6 border-b border-slate-700/50 pb-4">
              <h3 className="text-xl font-bold text-white flex items-center"><span className="text-brand-400 mr-2">Configurar:</span>{categories.find(c => c.id === activeCategory)?.title}</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(categories.find(c => c.id === activeCategory)?.sections || {}).map(([sectionKey, options]) => (
                <div key={sectionKey} className="space-y-3">
                  <label className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{sectionKey}</label>
                  <div className="flex flex-wrap gap-2">
                    {options.map(option => (
                      <div key={option} className="relative group">
                        <button 
                          onClick={() => handleOptionSelect(sectionKey, option)} 
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${selections[sectionKey] === option ? 'bg-brand-500 text-white shadow-md' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}
                        >
                          {option}
                        </button>
                        
                        {/* Tooltip Implementation */}
                        {optionDescriptions[option] && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 border border-slate-600 text-slate-200 text-xs rounded-lg shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-50 text-center">
                            {optionDescriptions[option]}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900"></div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex space-x-4 w-full justify-center mt-auto">
        <button onClick={onBack} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors">Voltar</button>
        <button onClick={handleConfirm} disabled={!activeCategory} className={`px-8 py-3 rounded-xl font-bold shadow-lg transition-all ${activeCategory ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:scale-105' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>Continuar</button>
      </div>
    </div>
  );
};
