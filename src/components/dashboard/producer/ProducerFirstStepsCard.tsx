import React from 'react';
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

interface ProducerFirstStepsCardProps {
  isOpen: boolean;
  onToggleOpen: () => void;
  checklistStep1: boolean;
  checklistStep2: boolean;
  checklistStep3: boolean;
  completedSteps: number;
  isAllStepsCompleted: boolean;
  onCompleteTrainingChecklist: () => void;
}

export const ProducerFirstStepsCard: React.FC<ProducerFirstStepsCardProps> = ({
  isOpen,
  onToggleOpen,
  checklistStep1,
  checklistStep2,
  checklistStep3,
  completedSteps,
  isAllStepsCompleted,
  onCompleteTrainingChecklist,
}) => {
  return (
    <div
      id="primeiros-passos"
      data-tour="aprendiz-steps"
      className="bg-white dark:bg-stone-900 rounded-3xl border-2 border-emerald-300 dark:border-emerald-800 shadow-sm overflow-hidden scroll-mt-24"
    >
      <button
        type="button"
        onClick={onToggleOpen}
        className="w-full min-h-[56px] px-6 py-4 flex items-center justify-between gap-4 text-left hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-emerald-800 dark:text-emerald-300 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-stone-900 dark:text-white leading-tight">
              Primeiros passos
            </h2>
            <span className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 tabular-nums">
              {isAllStepsCompleted ? '3 de 3 etapas concluídas' : `${completedSteps} de 3 etapas`}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-stone-600 dark:text-stone-300">
          <span className="text-sm font-bold hidden sm:inline">
            {isOpen ? 'Recolher' : 'Expandir'}
          </span>
          {isOpen ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </div>
      </button>

      {isOpen && (
        <div className="p-6 pt-3 border-t border-emerald-100 dark:border-emerald-900/60 space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                  checklistStep1 ? 'bg-emerald-600 text-white' : 'bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                }`}
              >
                {checklistStep1 ? '✓' : '1'}
              </div>
              <div className="flex-1">
                <span className="text-[18px] font-black text-stone-900 dark:text-white block">
                  1. Ver a vitrine Rosa Mística
                </span>
                <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  {checklistStep1 ? 'Você já conferiu as peças' : 'Conheça as peças da nossa gente'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                  checklistStep2 ? 'bg-emerald-600 text-white' : 'bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                }`}
              >
                {checklistStep2 ? '✓' : '2'}
              </div>
              <div className="flex-1">
                <span className="text-[18px] font-black text-stone-900 dark:text-white block">
                  2. Cadastrar uma peça
                </span>
                <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  {checklistStep2 ? 'Etapa concluída com sucesso' : 'Pratique o cadastro em 4 passos'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${
                  checklistStep3 ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                }`}
              >
                {checklistStep3 ? '✓' : '3'}
              </div>
              <div className="flex-1">
                <span className="text-[18px] font-black text-stone-900 dark:text-white block">
                  3. Concluir treinamento inicial
                </span>
                <span className="text-sm font-medium text-stone-600 dark:text-stone-400">
                  {checklistStep3 ? 'Treinamento inicial concluído' : 'Finalize sua prática inicial neste ambiente seguro'}
                </span>
              </div>
            </div>
          </div>

          {!checklistStep3 && (
            <button
              type="button"
              onClick={onCompleteTrainingChecklist}
              className="w-full min-h-[56px] px-6 py-4 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-[18px] flex items-center justify-center gap-3 cursor-pointer shadow-md transition-colors active:scale-95"
            >
              <CheckCircle2 className="w-6 h-6 shrink-0" />
              <span>Concluir treinamento inicial</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
