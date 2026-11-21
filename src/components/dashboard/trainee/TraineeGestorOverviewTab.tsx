import { ArrowRight, Check, LogOut } from 'lucide-react';
import type { TraineeTask } from '../../../hooks';

export type TraineeGestorTab = 'inicio' | 'textos' | 'midia' | 'aprovar';

export interface TraineeGestorOverviewTabProps {
  tasks: TraineeTask[];
  completedCount: number;
  isAllDone: boolean;
  onSelectTab: (tab: TraineeGestorTab) => void;
  onLogout: () => void;
}

export function TraineeGestorOverviewTab({
  tasks,
  completedCount,
  isAllDone,
  onSelectTab,
  onLogout,
}: TraineeGestorOverviewTabProps) {
  return (
    <div className="space-y-6">
      {isAllDone && (
        <div className="p-6 sm:p-7 rounded-3xl bg-emerald-50 dark:bg-emerald-950/50 border-2 border-emerald-400 dark:border-emerald-600 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Check className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-emerald-950 dark:text-emerald-100 leading-tight">
                Parabéns! Seu curso inicial foi concluído.
              </h3>
              <p className="text-lg text-emerald-900 dark:text-emerald-200 font-medium mt-1">
                Todas as 4 tarefas foram concluídas. Aguarde o retorno da Associação Julieta Barros enquanto você continua praticando aqui se desejar.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="min-h-[56px] px-6 py-3 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-base inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer shrink-0 active:scale-95"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Sair do ambiente</span>
          </button>
        </div>
      )}

      <div
        data-tour="gestor-tasks-card"
        className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border-2 border-stone-200 dark:border-stone-800 shadow-sm space-y-5"
      >
        <div className="border-b border-stone-200 dark:border-stone-800 pb-4">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white">
            Seu treino
          </h2>
          <p className="text-[16px] sm:text-lg text-stone-700 dark:text-stone-300 font-bold mt-1">
            {completedCount} de 4 tarefas
          </p>
        </div>

        <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-4 overflow-hidden">
          <div
            className="bg-emerald-600 h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / 4) * 100}%` }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
          {tasks.map((task) => {
            let destinationTab: TraineeGestorTab = 'textos';
            if (task.id === 2 || task.id === 3) destinationTab = 'midia';
            if (task.id === 4) destinationTab = 'aprovar';

            return (
              <div
                key={task.id}
                className={`p-5 sm:p-6 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                  task.isDone
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700/80'
                    : 'bg-stone-50 dark:bg-stone-800/60 border-stone-200 dark:border-stone-700 hover:border-emerald-500'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-base shrink-0 ${
                      task.isDone
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-300 dark:bg-stone-700 text-stone-700 dark:text-stone-200'
                    }`}
                  >
                    {task.isDone ? <Check className="w-5 h-5" /> : task.id}
                  </div>

                  <div>
                    <h4 className="text-xl font-black text-stone-900 dark:text-white leading-tight">
                      {task.title}
                    </h4>
                    <p className="text-[16px] font-medium text-stone-600 dark:text-stone-400 mt-0.5">
                      {task.isDone ? `Concluída • ${task.doneDate}` : 'Pendente para praticar'}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onSelectTab(destinationTab)}
                  className={`min-h-[56px] px-6 py-3 rounded-2xl font-black text-lg inline-flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95 ${
                    task.isDone
                      ? 'bg-white dark:bg-stone-800 border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-700'
                      : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm'
                  }`}
                >
                  <span>{task.isDone ? 'Praticar novamente' : 'Fazer tarefa'}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
