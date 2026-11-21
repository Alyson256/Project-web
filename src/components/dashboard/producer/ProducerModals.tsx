import React from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Compass,
  Eye,
  LogOut,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import type { ProducerTab } from '../../../hooks';

interface ProducerModalsProps {
  isTraining: boolean;
  showDeleteContactConfirm: boolean;
  deleteContactModalRef: React.RefObject<HTMLDivElement | null>;
  onCloseDeleteContact: () => void;
  onConfirmDeleteContact: () => void;
  isMoreOpen: boolean;
  stdMoreModalRef: React.RefObject<HTMLDivElement | null>;
  onCloseMore: () => void;
  onOpenAccessibility: () => void;
  onOpenTour: () => void;
  onSelectTab: (tab: ProducerTab) => void;
  onOpenTutorial?: () => void;
  onRequestLogoutFromMore: () => void;
  showTrainingCompleteModal: boolean;
  trainingCompleteModalRef: React.RefObject<HTMLDivElement | null>;
  onCloseTrainingCompleteModal: () => void;
  onLogout: () => void;
}

export const ProducerModals: React.FC<ProducerModalsProps> = ({
  isTraining,
  showDeleteContactConfirm,
  deleteContactModalRef,
  onCloseDeleteContact,
  onConfirmDeleteContact,
  isMoreOpen,
  stdMoreModalRef,
  onCloseMore,
  onOpenAccessibility,
  onOpenTour,
  onSelectTab,
  onOpenTutorial,
  onRequestLogoutFromMore,
  showTrainingCompleteModal,
  trainingCompleteModalRef,
  onCloseTrainingCompleteModal,
  onLogout,
}) => {
  return (
    <>
      {!isTraining && showDeleteContactConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseDeleteContact();
          }}
        >
          <div
            ref={deleteContactModalRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="std-delete-contact-title"
            className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border-2 border-stone-200 dark:border-stone-800 space-y-6"
          >
            <div className="flex items-center gap-3 text-red-600 dark:text-red-400">
              <AlertTriangle className="w-7 h-7 shrink-0" />
              <h3 id="std-delete-contact-title" className="text-2xl font-black text-stone-900 dark:text-white">
                Apagar número de contato
              </h3>
            </div>
            <p className="text-stone-800 dark:text-stone-200 font-bold text-[18px] leading-relaxed">
              Tem certeza? Seu número será apagado e as pessoas não poderão mais te chamar.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onCloseDeleteContact}
                className="min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 text-stone-800 dark:text-stone-200 font-extrabold text-[18px] hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors w-full sm:w-1/2 cursor-pointer flex items-center justify-center gap-2"
              >
                <ArrowRight className="w-5 h-5 rotate-180 shrink-0" />
                <span>Não, voltar</span>
              </button>
              <button
                type="button"
                onClick={onConfirmDeleteContact}
                className="min-h-[56px] px-6 py-3.5 rounded-2xl bg-red-700 hover:bg-red-800 text-white font-black text-[18px] transition-all w-full sm:w-1/2 shadow-sm cursor-pointer flex items-center justify-center gap-2 active:scale-95"
              >
                <Trash2 className="w-5 h-5 shrink-0" />
                <span>Sim, apagar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isMoreOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200 motion-reduce:animate-none"
          onClick={(e) => {
            if (e.target === e.currentTarget) onCloseMore();
          }}
        >
          <div
            ref={stdMoreModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="std-more-modal-title"
            className="bg-white dark:bg-stone-900 border-t-2 sm:border-2 border-stone-300 dark:border-stone-700 rounded-t-3xl sm:rounded-3xl p-5 sm:p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-3.5 border-b border-stone-200 dark:border-stone-800 gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center justify-center font-black text-lg shrink-0">
                  {isTraining ? 'L' : 'M'}
                </div>
                <div className="min-w-0">
                  <h3 id="std-more-modal-title" className="text-lg font-black text-stone-900 dark:text-white leading-tight truncate">
                    {isTraining ? 'Dona Laura' : 'Maria Artesã'}
                  </h3>
                  <p className="text-xs font-bold text-emerald-800 dark:text-emerald-400">
                    {isTraining ? 'Treino (Aprendiz)' : 'Equipe de Produção'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onCloseMore}
                className="min-h-[56px] px-4 py-2.5 rounded-2xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-black text-base flex items-center gap-2 cursor-pointer border border-stone-300 dark:border-stone-700 shadow-xs active:scale-95 shrink-0"
                aria-label="Fechar opções"
              >
                <X className="w-5 h-5 shrink-0" />
                <span>Fechar</span>
              </button>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={() => {
                  onCloseMore();
                  onOpenAccessibility();
                }}
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/40 text-emerald-950 dark:text-emerald-100 border-2 border-emerald-300 dark:border-emerald-700 text-left font-black text-base flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-emerald-700 dark:text-emerald-400 shrink-0" />
                  <span>Acessibilidade</span>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
              </button>

              {isTraining && (
                <button
                  type="button"
                  onClick={() => {
                    onCloseMore();
                    onOpenTour();
                  }}
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/40 text-amber-950 dark:text-amber-100 border-2 border-amber-300 dark:border-amber-700 text-left font-black text-base flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Compass className="w-6 h-6 text-amber-700 dark:text-amber-400 shrink-0" aria-hidden="true" />
                    <span>Tour Guiado (Passo a passo)</span>
                  </div>
                  <ArrowRight className="w-5 h-5 text-amber-700 dark:text-amber-400" />
                </button>
              )}

              {!isTraining && (
                <button
                  type="button"
                  onClick={() => {
                    onSelectTab('catalog');
                    onCloseMore();
                  }}
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-200 dark:border-stone-700 text-left font-extrabold text-base flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>Vitrine Rosa Mística</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </button>
              )}

              {!isTraining && onOpenTutorial && (
                <button
                  type="button"
                  onClick={() => {
                    onCloseMore();
                    onOpenTutorial();
                  }}
                  className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-stone-50 hover:bg-stone-100 dark:bg-stone-800/60 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border-2 border-stone-200 dark:border-stone-700 text-left font-extrabold text-base flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                    <span>Guia da Tela (Passo a passo)</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-stone-400" />
                </button>
              )}
            </div>

            <div className="pt-3 border-t border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={onRequestLogoutFromMore}
                className="w-full min-h-[56px] px-4 py-3 rounded-2xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/40 text-red-700 dark:text-red-300 border-2 border-red-200 dark:border-red-800 text-left font-black text-base flex items-center justify-center gap-3 cursor-pointer shadow-xs active:scale-95"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>{isTraining ? 'Sair do ambiente' : 'Sair da Conta'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {isTraining && showTrainingCompleteModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-sm animate-in fade-in duration-200 motion-reduce:animate-none"
          role="presentation"
        >
          <div
            ref={trainingCompleteModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="aprendiz-complete-modal-title"
            className="bg-white dark:bg-stone-900 border-2 border-emerald-400 dark:border-emerald-700 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl space-y-6 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-2 border-emerald-300 dark:border-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-3">
              <h3 id="aprendiz-complete-modal-title" className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-white leading-tight">
                Parabéns! Curso inicial concluído
              </h3>
              <p className="text-[18px] text-stone-700 dark:text-stone-300 font-medium leading-relaxed">
                Você concluiu todas as etapas do seu espaço de treino. Agora aguarde o retorno da Associação Julieta Barros para a liberação do seu acesso oficial.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={onLogout}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl border-2 border-stone-300 dark:border-stone-700 bg-white hover:bg-stone-100 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-900 dark:text-stone-100 font-black text-[18px] flex items-center justify-center gap-2 cursor-pointer active:scale-95"
              >
                <LogOut className="w-5 h-5 shrink-0" />
                <span>Sair do ambiente</span>
              </button>
              <button
                type="button"
                onClick={onCloseTrainingCompleteModal}
                className="w-full sm:w-1/2 min-h-[56px] px-6 py-3.5 rounded-2xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-[18px] flex items-center justify-center gap-2 cursor-pointer shadow-sm active:scale-95"
              >
                <span>Continuar testando</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
