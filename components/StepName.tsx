import React, { useState } from 'react';

interface StepNameProps {
  onNext: (name: string) => void;
}

export const StepName: React.FC<StepNameProps> = ({ onNext }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(true);
      return;
    }
    onNext(name.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    if (error && e.target.value.trim()) {
      setError(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-6 animate-fade-in min-h-[50vh]">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Nomeie sua Peça</h2>
        <p className="text-slate-400">Dê um nome único para identificar sua criação.</p>
      </div>
      <form onSubmit={handleSubmit} className="w-full bg-slate-800/50 p-8 rounded-2xl border border-slate-700 backdrop-blur-sm">
        <div className="mb-6">
          <label htmlFor="pieceName" className="block text-sm font-medium text-slate-300 mb-2">Nome da Peça <span className="text-brand-500">*</span></label>
          <div className="relative">
            <input
              type="text" id="pieceName" value={name} onChange={handleChange}
              placeholder="ex: Jaqueta Jeans Vintage"
              className={`w-full px-4 py-4 rounded-xl bg-slate-900 border focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all text-white placeholder-slate-600 ${error ? 'border-red-500 ring-1 ring-red-500/50' : 'border-slate-700'}`}
              autoFocus
            />
            {error && <div className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div>}
          </div>
          {error && <p className="mt-2 text-sm text-red-400 animate-pulse">Por favor, insira um nome para sua peça.</p>}
        </div>
        <button type="submit" disabled={!name.trim()} className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform ${name.trim() ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:scale-[1.02]' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}`}>Continuar</button>
      </form>
    </div>
  );
};