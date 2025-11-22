import React, { useState, useMemo } from 'react';
import { PersonaState, PersonaCompatibility } from '../types';

interface StepPersonaProps {
  onNext: (data: PersonaState) => void;
  onBack: () => void;
}

const SKIN_TONES = [
  { id: 'pele_clara', label: 'Pele Clara', color: '#f8d9d0' },
  { id: 'morena_clara', label: 'Morena Clara', color: '#e0ac96' },
  { id: 'morena_media', label: 'Morena Média', color: '#c68674' },
  { id: 'morena_escura', label: 'Morena Escura', color: '#8d5524' },
  { id: 'negra', label: 'Negra', color: '#4a3121' },
  { id: 'asiatica', label: 'Asiática / Oriental', color: '#f3e3c2' },
];

const HAIR_STYLES = [
  'Liso Longo', 'Liso Curto', 'Ondulado Médio', 'Cacheado Volumoso',
  'Afro Black', 'Coque Elegante', 'Rabo de Cavalo', 'Tranças Longas',
  'Ruivo', 'Castanho Claro', 'Castanho Escuro', 'Loiro Dourado'
];

// Grupos de Estilos para facilitar a lógica
const AFRO_STYLES = ['Afro Black', 'Tranças Longas', 'Cacheado Volumoso'];
const STRAIGHT_STYLES = ['Liso Longo', 'Liso Curto'];
const LIGHT_COLORS = ['Loiro Dourado', 'Ruivo'];

export const StepPersona: React.FC<StepPersonaProps> = ({ onNext, onBack }) => {
  const [skinTone, setSkinTone] = useState<string | null>(null);
  const [hairStyle, setHairStyle] = useState<string | null>(null);

  // Lógica de Compatibilidade baseada nas regras fornecidas
  const getCompatibility = (skin: string, hair: string): PersonaCompatibility => {
    // A) PELE CLARA
    if (skin === 'pele_clara') {
      if (AFRO_STYLES.includes(hair)) return 'blocked';
      return 'full';
    }

    // B) MORENA CLARA e MORENA MÉDIA
    if (skin === 'morena_clara' || skin === 'morena_media') {
      if (AFRO_STYLES.includes(hair)) return 'recalibrated';
      return 'full';
    }

    // C) MORENA ESCURA
    if (skin === 'morena_escura') {
      if (LIGHT_COLORS.includes(hair)) return 'recalibrated';
      return 'full';
    }

    // D) NEGRA
    if (skin === 'negra') {
      // Permitido com recalibração: Liso (adaptado), Ruivo, Loiro
      if (STRAIGHT_STYLES.includes(hair) || LIGHT_COLORS.includes(hair)) return 'recalibrated';
      // Afro e outros são full
      return 'full';
    }

    // E) ASIÁTICA
    if (skin === 'asiatica') {
      if (AFRO_STYLES.includes(hair)) return 'blocked';
      if (LIGHT_COLORS.includes(hair)) return 'recalibrated';
      return 'full';
    }

    return 'full';
  };

  const handleSkinSelect = (id: string) => {
    setSkinTone(id);
    setHairStyle(null); // Reset hair when skin changes to force re-validation
  };

  const handleHairSelect = (style: string, compatibility: PersonaCompatibility) => {
    if (!skinTone || compatibility === 'blocked') return;
    setHairStyle(style);
  };

  const handleConfirm = () => {
    if (skinTone && hairStyle) {
      const compatibility = getCompatibility(skinTone, hairStyle);
      
      onNext({
        skinTone,
        hairStyle,
        compatibility,
        autoRecalibrated: compatibility === 'recalibrated'
      });
    }
  };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto p-4 animate-fade-in">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Defina a Persona</h2>
        <p className="text-slate-400">Escolha o tom de pele e o estilo de cabelo para sua modelo.</p>
      </div>

      {/* Skin Tone Section */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2">1. Tom de Pele <span className="text-red-500 text-xs">* Obrigatório</span></h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {SKIN_TONES.map((tone) => (
            <button
              key={tone.id}
              onClick={() => handleSkinSelect(tone.id)}
              className={`
                flex flex-col items-center p-3 rounded-xl border-2 transition-all group
                ${skinTone === tone.id
                  ? 'border-brand-500 bg-brand-500/10 scale-105 shadow-[0_0_15px_rgba(139,92,246,0.3)]'
                  : 'border-slate-700 bg-slate-800 hover:border-slate-500 hover:bg-slate-750'}
              `}
            >
              <div 
                className="w-12 h-12 rounded-full shadow-inner mb-3 border border-white/10" 
                style={{ backgroundColor: tone.color }}
              ></div>
              <span className={`text-xs font-medium text-center group-hover:text-white ${skinTone === tone.id ? 'text-white' : 'text-slate-300'}`}>{tone.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Hair Style Section */}
      <div className={`transition-all duration-500 ${skinTone ? 'opacity-100' : 'opacity-50 pointer-events-none grayscale'}`}>
         <h3 className="text-lg font-bold text-white mb-4 border-b border-slate-700 pb-2 flex justify-between items-center">
            2. Estilo de Cabelo
            {!skinTone && <span className="text-xs text-yellow-500 font-normal bg-yellow-500/10 px-2 py-1 rounded">Selecione a pele primeiro</span>}
         </h3>
         <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {HAIR_STYLES.map((style) => {
                const compatibility = skinTone ? getCompatibility(skinTone, style) : 'full';
                const isBlocked = compatibility === 'blocked';
                const isRecalibrated = compatibility === 'recalibrated';
                const isSelected = hairStyle === style;

                return (
                    <button
                        key={style}
                        onClick={() => handleHairSelect(style, compatibility)}
                        disabled={!skinTone || isBlocked}
                        className={`
                            relative py-4 px-2 rounded-lg border text-sm font-medium transition-all
                            ${isBlocked 
                                ? 'opacity-30 cursor-not-allowed bg-slate-900 border-slate-800 text-slate-600' 
                                : isSelected
                                    ? 'bg-brand-500 text-white border-brand-400 shadow-lg transform scale-105'
                                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'}
                        `}
                    >
                        {style}
                        {isRecalibrated && !isBlocked && (
                            <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-500 rounded-full animate-pulse" title="Ajuste automático de coerência"></span>
                        )}
                    </button>
                );
            })}
         </div>
         <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
             <div className="flex items-center gap-1"><div className="w-2 h-2 bg-yellow-500 rounded-full"></div> Ajuste Automático de Coerência</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 bg-slate-600 rounded-full"></div> Combinação Indisponível</div>
         </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4 w-full justify-center mt-12">
        <button onClick={onBack} className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium transition-colors">
            Voltar
        </button>
        <button 
            onClick={handleConfirm} 
            disabled={!skinTone || !hairStyle}
            className={`
                px-8 py-3 rounded-xl font-bold shadow-lg transition-all
                ${skinTone && hairStyle
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:scale-105 shadow-brand-500/30' 
                    : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
            `}
        >
            Continuar
        </button>
      </div>
    </div>
  );
};