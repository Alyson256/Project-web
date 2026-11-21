import React from 'react';
import {
  Box,
  Check,
  CheckCircle2,
  Palette,
  Shield,
  Sparkles,
  UserCheck,
} from 'lucide-react';
import type { ProductItem, UserItem } from '../../../types';
import { ProductImage } from '../..';

interface TraineeProgressCardProps {
  trainee: UserItem;
  isCompleted: boolean;
  allProducts: ProductItem[];
  variant: 'training_tab' | 'users_tab';
  isSelf?: boolean;
  onPromoteClick: (user: UserItem) => void;
  onIncompleteActionClick: (user: UserItem) => void;
}

export const TraineeProgressCard: React.FC<TraineeProgressCardProps> = ({
  trainee,
  isCompleted,
  allProducts,
  variant,
  isSelf = false,
  onPromoteClick,
  onIncompleteActionClick,
}) => {
  const isTargetGestor = trainee.role === 'aprendiz_gestor' || trainee.trainingTarget === 'gestor';
  const roleTargetLabel = isTargetGestor ? 'Gestor' : 'Produtor';
  const stepsCount =
    trainee.completedStepsCount ??
    (isCompleted ? 3 : trainee.stepText?.includes('2 de 3') ? 2 : trainee.stepText?.includes('1 de 3') ? 1 : 0);
  const totalSteps = trainee.totalStepsCount || 3;
  const missingSteps = Math.max(1, totalSteps - stepsCount);
  const percent = Math.min(100, Math.round((stepsCount / totalSteps) * 100));

  const traineeEmail = trainee.email?.trim().toLowerCase();
  const traineePieces = allProducts.filter((p) => {
    if (!p.isTraining) return false;
    if (traineeEmail && p.ownerEmail && p.ownerEmail.toLowerCase() === traineeEmail) return true;
    return p.artist === trainee.name || p.artist.startsWith(`${trainee.name} (`);
  });

  return (
    <div
      className={`rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm ${
        isCompleted
          ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-emerald-400 dark:border-emerald-600'
          : 'bg-white dark:bg-stone-900 border-2 border-stone-200 dark:border-stone-800'
      }`}
    >
      {/* Top Header do Card */}
      <div
        className={`flex flex-col ${
          variant === 'users_tab' ? 'xl:flex-row xl:items-center' : 'lg:flex-row lg:items-center'
        } justify-between items-start gap-5 pb-6 border-b border-stone-200 dark:border-stone-800`}
      >
        <div className="flex items-start sm:items-center gap-4 flex-1 min-w-0">
          <div
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black shrink-0 border-2 ${
              isTargetGestor
                ? 'bg-teal-100 dark:bg-teal-900/60 border-teal-300 dark:border-teal-700 text-teal-900 dark:text-teal-200'
                : 'bg-emerald-100 dark:bg-emerald-900/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
            }`}
          >
            {trainee.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <h4 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight">
                {trainee.name}
              </h4>
              <span
                className={`px-4 py-1.5 rounded-full text-base font-black inline-flex items-center gap-2 border ${
                  isTargetGestor
                    ? 'bg-teal-100 text-teal-950 dark:bg-teal-950/60 dark:text-teal-200 border-teal-300 dark:border-teal-700'
                    : 'bg-emerald-100 text-emerald-950 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700'
                }`}
              >
                {isTargetGestor ? (
                  <>
                    <Shield className="w-4 h-4 text-teal-700 dark:text-teal-400 shrink-0" />
                    <span>Treinando para: Gestor</span>
                  </>
                ) : (
                  <>
                    <Palette className="w-4 h-4 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>Treinando para: Produtor</span>
                  </>
                )}
              </span>
            </div>

            <div className="space-y-2 max-w-xl">
              <div className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isCompleted ? 'bg-emerald-600' : isTargetGestor ? 'bg-teal-600' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              {isCompleted ? (
                <div className="flex flex-wrap items-center gap-2 text-base font-extrabold text-emerald-800 dark:text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Concluiu todas as etapas em {trainee.completedAt || '30/10/2026'}</span>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 text-base font-bold text-stone-700 dark:text-stone-300">
                  <span>
                    Progresso:{' '}
                    <strong className="text-emerald-700 dark:text-emerald-400">
                      {stepsCount} de {totalSteps} etapas
                    </strong>
                  </span>
                  <span>•</span>
                  <span>Última atividade: {trainee.lastActivityDate || 'Hoje'}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full lg:w-auto shrink-0 pt-2 lg:pt-0">
          {variant === 'users_tab' && isSelf ? (
            <span className="text-stone-400 dark:text-stone-500 font-bold text-base px-4 py-2 bg-stone-100 dark:bg-stone-800 rounded-xl inline-block">
              Seu próprio perfil
            </span>
          ) : isCompleted ? (
            <button
              type="button"
              onClick={() => onPromoteClick(trainee)}
              className="min-h-[56px] px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-2xl font-black text-lg inline-flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer w-full sm:w-auto active:scale-95"
            >
              <UserCheck className="w-5 h-5 shrink-0" />
              <span>Promover para {roleTargetLabel}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onIncompleteActionClick(trainee)}
              className="min-h-[56px] px-6 py-3.5 bg-transparent border-2 border-stone-300 dark:border-stone-700 hover:border-emerald-500 text-stone-800 dark:text-stone-200 rounded-2xl font-bold text-lg inline-flex items-center justify-center gap-2 transition-all cursor-pointer w-full sm:w-auto"
            >
              <span>{missingSteps === 1 ? 'Ainda falta 1 etapa.' : `Ainda faltam ${missingSteps} etapas.`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Conteúdo específico */}
      {isTargetGestor ? (
        <div className="space-y-3 pt-1">
          <h5 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-teal-700 dark:text-teal-400" />
            <span>O que já praticou</span>
          </h5>

          <div
            className={`grid grid-cols-1 sm:grid-cols-2 ${
              variant === 'users_tab' ? 'xl:grid-cols-3' : 'md:grid-cols-3'
            } gap-3`}
          >
            {(trainee.practicedItems && trainee.practicedItems.length > 0
              ? trainee.practicedItems
              : ['Editou um texto (rascunho)', 'Enviou uma foto (simulação)']
            ).map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-teal-50/50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex items-center gap-3"
              >
                <div className="w-7 h-7 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-sm shrink-0">
                  <Check className="w-4 h-4" />
                </div>
                <span className="text-base font-bold text-stone-800 dark:text-stone-200">{item}</span>
              </div>
            ))}

            {!isCompleted && (
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 flex items-center gap-3 opacity-75">
                <div className="w-7 h-7 rounded-full bg-stone-300 dark:bg-stone-600 text-stone-700 dark:text-stone-200 flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <span className="text-base font-bold text-stone-600 dark:text-stone-400">
                  Pendente: Conferir comunicados e agenda
                </span>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-4 pt-1">
          <div className="flex justify-between items-center">
            <h5 className="text-xl font-black text-stone-900 dark:text-white flex items-center gap-2.5">
              <Box className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              <span>Peças de treino criadas ({traineePieces.length})</span>
            </h5>
            <span className="text-base font-bold text-stone-500 dark:text-stone-400">Rascunhos de prática</span>
          </div>

          {traineePieces.length === 0 ? (
            <div className="p-6 rounded-2xl bg-stone-50 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-800 text-stone-700 dark:text-stone-300 font-medium text-base text-center">
              {variant === 'training_tab'
                ? 'Ainda não cadastrou peças de treino.'
                : 'Nenhuma peça criada no espaço seguro até o momento.'}
            </div>
          ) : variant === 'training_tab' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {traineePieces.map((piece) => (
                <div
                  key={piece.id}
                  className="p-5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border-2 border-stone-200 dark:border-stone-700/80 flex flex-col justify-between gap-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <h6 className="font-black text-lg text-stone-900 dark:text-white line-clamp-2 leading-snug">
                        {piece.title}
                      </h6>
                      <span className="px-2.5 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-950 dark:bg-emerald-900 dark:text-emerald-100 border border-emerald-300 dark:border-emerald-700 shrink-0 inline-flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-700 dark:text-emerald-300" />
                        Treino
                      </span>
                    </div>
                    <p className="text-base font-medium text-stone-700 dark:text-stone-300">
                      Técnica: {piece.technique}
                    </p>
                    <p className="text-base text-stone-600 dark:text-stone-400 line-clamp-2">{piece.description}</p>
                  </div>

                  <div className="pt-3 border-t border-stone-200 dark:border-stone-700 flex items-center justify-between">
                    <span className="text-base font-black text-stone-900 dark:text-white">
                      R$ {(piece.price || 0).toFixed(2)}
                    </span>
                    <span className="text-base font-bold text-stone-600 dark:text-stone-400">
                      Estoque: {piece.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {traineePieces.map((piece) => (
                <div
                  key={piece.id}
                  className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700 flex gap-4 items-start"
                >
                  <ProductImage
                    src={piece.image}
                    alt={piece.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0 border border-stone-200 dark:border-stone-700"
                  />
                  <div className="min-w-0 flex-1">
                    <h6 className="font-black text-lg text-stone-900 dark:text-white leading-tight line-clamp-2">
                      {piece.title}
                    </h6>
                    <p className="text-base font-medium text-stone-600 dark:text-stone-400 mt-1">{piece.technique}</p>
                    <p className="text-base font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(piece.price || 0)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
