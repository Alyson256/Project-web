import React from 'react';
import { Check } from 'lucide-react';

export interface TraineeGestorTextsTabProps {
  sampleText: string;
  onChangeSampleText: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function TraineeGestorTextsTab({
  sampleText,
  onChangeSampleText,
  onSubmit,
}: TraineeGestorTextsTabProps) {
  return (
    <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
      <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-black bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 mb-2">
            <span>Exemplo de Treino</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Editar um texto (rascunho)
          </h3>
          <p className="text-lg text-stone-700 dark:text-stone-300 font-medium mt-1">
            Pratique editar o texto que apresenta o ateliê para a comunidade.
          </p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label className="block text-lg font-extrabold text-stone-800 dark:text-stone-200 mb-2">
            Apresentação do Ateliê <span className="text-sm font-bold text-amber-700 dark:text-amber-400">(Exemplo)</span>
          </label>
          <textarea
            rows={4}
            value={sampleText}
            onChange={(e) => onChangeSampleText(e.target.value)}
            className="w-full p-4 rounded-2xl bg-stone-50 dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-900 dark:text-white font-medium text-lg focus:outline-none focus:border-green-600 resize-none leading-relaxed"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            data-tour="gestor-text-submit"
            className="min-h-[56px] px-8 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg inline-flex items-center gap-2.5 shadow-sm transition-all cursor-pointer active:scale-95"
          >
            <Check className="w-5 h-5 shrink-0" />
            <span>Publicar (simulação)</span>
          </button>
        </div>
      </form>
    </div>
  );
}
